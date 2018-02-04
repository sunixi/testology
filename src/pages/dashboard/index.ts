import { NavController, Slides, NavParams, ModalController } from 'ionic-angular';
import { Component, OnInit, OnDestroy,  ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DataStore } from 'js-data';

// services
import { ApplicationService } from '../../services/application/index';
import { PushNotificationsService } from '../../services/push/index';
import { AuthService } from '../../services/auth/index';
import { ServerEventsService } from '../../services/serverEvents/index';

// pages
import { MessagesPage } from '../messages/index';

// components
import { MatchedUserPageComponent } from './components/matchedUser/index';

@Component({
    selector: 'dashboard',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements OnInit, OnDestroy {
    @ViewChild('componentsSlider') slider: Slides = null;

    private static PUSH_NOTIFICATION_MESSAGE: string = 'message';
    private static PUSH_NOTIFICATION_MATCHED_USER: string = 'matchedUser';

    private isDashboardActive: boolean = true;
    private pageReady: boolean = false;
    private activeComponent: string;
    private activeSubComponent: string;
    private newMatchedUsersHandler: any;

    private components: string[] = [
        'profile',
        'search',
        'conversations'
    ];

    /**
     * Constructor
     */
    constructor(
        private modalCtrl: ModalController,
        private ref: ChangeDetectorRef,
        private application: ApplicationService,
        private nav: NavController,
        private pushNotifications: PushNotificationsService,
        private navParams: NavParams,
        private serverEvents: ServerEventsService,
        private auth: AuthService,
        private api: DataStore) {}

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        try {
            // load all page dependencies
            await Promise.all([
                this.api.find('users', this.auth.getUserId(), { // get logged user data
                    params: {
                        with: ['avatar', 'permissions', 'photos', 'memberships']
                    }
                })
            ]);

            // init push notifications
            this.pushNotifications.subscribe(this.processPushNotification, this);

            // init server events
            this.serverEvents.restart();

            // new matched users
            this.newMatchedUsersHandler = setInterval(() => this.showNewMatchedUserPopup(), this.newMatchedUsersCheckDelay);

            this.pageReady = true;
            this.ref.markForCheck();
        }
        catch (e) {}
    }

    /**
     * New matched users check delay
     */
    get newMatchedUsersCheckDelay(): number {
        return this.api.get('configs', 'newMatchedUsersCheckDelay').value;
    }

    /**
     * Component did active
     */
    ionViewDidEnter(): void {
        // define active component
        if (this.navParams.get('component')) {
            this.activeComponent = this.navParams.get('component');
        }
        else {
            this.activeComponent = this.application.getAppSetting('active_component') !== null
                ? this.application.getAppSetting('active_component')
                : this.components[0];
        }

        // define sub component
        this.activeSubComponent = this.application.getAppSetting('active_sub_component');
        this.ref.markForCheck();

        this.changeComponent({
            componentName: this.activeComponent,
            subComponentName: this.activeSubComponent
        });
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.pushNotifications.unsubscribe();
        clearInterval(this.newMatchedUsersHandler);
    }

    /**
     * Component will active
     */
    ionViewWillEnter(): void {
        this.isDashboardActive = true;
        this.ref.markForCheck();
    }

    /**
     * Component will not active
     */
    ionViewWillLeave(): void {
        this.isDashboardActive = false;
        this.ref.markForCheck();
    }

    /**
     * Show new matched user popup
     */
    showNewMatchedUserPopup(): void {
        if (this.isDashboardActive) {
            // find a new match
            let matchedUser: any[] = this.api.filter('matchedUsers', {
                where: {
                    isNew: true,
                    isRead: false
                },
                orderBy: [
                    ['isNew', 'DESC'], // newest first
                    ['createStamp', 'DESC']
                ],
                limit: 1});

            if (matchedUser.length) {
                clearInterval(this.newMatchedUsersHandler);

                let modal = this.modalCtrl.create(MatchedUserPageComponent, {
                    user: matchedUser[0]
                });

                modal.onDidDismiss((result: any) => {
                    this.newMatchedUsersHandler = setInterval(() => this.showNewMatchedUserPopup(), this.newMatchedUsersCheckDelay);

                    if (result && result.showChat) {
                        this.nav.push(MessagesPage, {
                            userId: matchedUser[0].userId
                        });
                    }
                });

                modal.present();
            }
        }
    }

    /**
     * Change component
     */
    changeComponent(component: {componentName: string, subComponentName?: string}): void {
        let componentIndex = this.components.indexOf(component.componentName);

        if (componentIndex > -1) {
            // save the last user's choice
            this.application.setAppSetting('active_component', component.componentName);
            this.activeComponent = component.componentName;

            if (component.subComponentName) {
                this.application.setAppSetting('active_sub_component', component.subComponentName);
                this.activeSubComponent = component.subComponentName;
            }

            this.ref.markForCheck();
            this.slider.slideTo(componentIndex);

            return;
        }
    }

    /**
     * Slider did change
     */
    sliderDidChange(): void {
        this.activeComponent = this.components[this.slider.getActiveIndex()];

        // save the last user's choice
        this.application.setAppSetting('active_component', this.activeComponent);
        this.ref.markForCheck();
    }

    /**
     * Process notification
     */
    private async processPushNotification(notification: any): Promise<any> {
        if (notification.additionalData && notification.additionalData.uuid != this.application.getAppSetting('push_uuid') && !notification.additionalData.foreground) {
            this.application.setAppSetting('push_uuid', notification.additionalData.uuid);
            switch (notification.additionalData.type) {
                // redirect to chat page
                case DashboardPage.PUSH_NOTIFICATION_MESSAGE :
                    if (notification.additionalData.senderId && notification.additionalData.conversationId) {
                        this.nav.push(MessagesPage, {
                            userId: notification.additionalData.senderId,
                            conversationId: notification.additionalData.conversationId
                        });
                    }
                    break;

                case DashboardPage.PUSH_NOTIFICATION_MATCHED_USER :
                    try {
                        this.changeComponent({
                            componentName: 'conversations'
                        });

                        // mark matched user
                        await this.api.update('matchedUsers', notification.additionalData.id, {
                            isRead: true
                        });
                    }
                    catch (e) {}
                    break;

                default:
            }
        }
    }
}
