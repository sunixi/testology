import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataStore } from 'js-data';
import { Scroll, NavController, Events, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// pages
import { ProfileViewPage } from '../../../profile/view/index';

// services
import { PermissionsService } from '../../../../services/permissions/index';
import { AuthService } from '../../../../services/auth/index';

@Component({
    selector: 'hot-list',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HotListComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() public activeComponent: string;
    @ViewChild('hotListScroll') scroll: Scroll;

    private userHotList: any;
    private currentLocalLimit: number;
    private searchInProgress: boolean = true;
    private isUserInList: boolean = false;
    private clearScrollHandler: any;
    private configsUpdatedHandler: () => void;
    private permissionsUpdatedHandler: () => void;
    private hotListUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private loadingCtrl: LoadingController,
        private toast: ToastController,
        private translate: TranslateService,
        private alert: AlertController,
        private permissions: PermissionsService,
        private events: Events,
        private nav: NavController,
        private auth: AuthService,
        private api: DataStore,
        private ref: ChangeDetectorRef)
    {
        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // hot list updated handler
        this.hotListUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        try {
            // config updated
            this.events.subscribe('configs:updated', this.configsUpdatedHandler);

            // permissions updated
            this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

            // hot list updated
            this.events.subscribe('hotList:updated', this.hotListUpdatedHandler);

            await this.api.findAll('hotListUsers');
            this.searchInProgress = false;
            this.currentLocalLimit = this.defaultLocalLimit;

            // check current user in hot list
            let currentUser = this.api.filter('hotListUsers', {
                where: {
                    userId: this.auth.getUserId()
                }
            });

            if (currentUser.length) {
                this.userHotList = currentUser[0];
                this.isUserInList = true;
            }

            this.ref.markForCheck();
        }
        catch (e) {}
    }

    /**
     * After view init
     */
    ngAfterViewInit() {
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(() => {
            let scrollTop: number = this.scroll._scrollContent.nativeElement.scrollTop;
            let clientHeight: number = this.scroll._scrollContent.nativeElement.clientHeight;
            let scrollHeight: number = this.scroll._scrollContent.nativeElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
                if (this.isCheckLoadMoreActive) {
                    this.loadMoreUsers();
                }
            }
        });
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('hotList:updated', this.hotListUpdatedHandler);

        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Is hot list join allowed
     */
    get isHotListJoinAllowed(): boolean {
        return this.permissions.isActionAllowed('hotlist_add_to_list');
    }

    /**
     * Is hot list join promoted
     */
    get isHotListJoinPromoted(): boolean {
        return this.permissions.isActionPromoted('hotlist_add_to_list');
    }

    /**
     * Current user
     */
    get currentUser(): any {
        return this.api.get('users', this.auth.getUserId()); // get logged user data
    }

    /**
     * Get scroll threshold
     */
    get scrollThreshold(): number {
        return this.api.get('configs', 'scrollThreshold').value;
    }

    /**
     * Get default local limit
     */
    get defaultLocalLimit(): number {
        return this.api.get('configs', 'hotListLocalLimit').value;
    }

    /**
     * Get users length
     */
    get usersLength(): number {
        return this.api.getAll('hotListUsers').length;
    }

    /**
     * Get user list
     */
    getUserList(): any[] {
        return this.api.filter('hotListUsers', {
            limit: this.currentLocalLimit,
            orderBy: [
                ['timestamp', 'DESC']
            ]});
    }

    /**
     * Join to hot list
     */
    joinToHotList(): void {
        if (this.isHotListJoinPromoted) {
            this.permissions.showAccessDeniedAlert();

            return;
        }

        let actionPrice: number = this.permissions.getActionPrice('hotlist_add_to_list');

        // show confirmation window
        if (actionPrice < 0) {
            let avatarButtons: any[] = [{
                text: this.translate.instant('no')
            }, {
                text: this.translate.instant('yes'),
                handler: () => this.sendJoinToHotListRequest()
            }];

            let confirm = this.alert.create({
                message: this.translate.instant('hot_list_join_confirmation', {
                    count: Math.abs(actionPrice)
                }),
                buttons: avatarButtons
            });

            confirm.present();

            return;
        }

        this.sendJoinToHotListRequest();
    }

    /**
     * Remove from hot list
     */
    async removeFromHotList(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.destroy('hotListUsers', this.userHotList.id);
            this.userHotList = {};

            this.isUserInList = false;
            this.ref.markForCheck();

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Load more users
     */
    async loadMoreUsers(): Promise<any> {
        // load from a local list
        this.currentLocalLimit += this.defaultLocalLimit;
        this.ref.markForCheck();
    }

    /**
     * View profile
     */
    viewProfile(user: any): void {
        this.nav.push(ProfileViewPage, {
            userId: user.userId
        });
    }

    /**
     * Send join to hot list request
     */
    private async sendJoinToHotListRequest(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            this.userHotList = await this.api.create('hotListUsers', {});

            this.isUserInList = true;
            this.ref.markForCheck();

            let actionPrice: number = this.permissions.getActionPrice('hotlist_add_to_list');

            if (actionPrice) {
                let toast = this.toast.create({
                    message: actionPrice > 0
                        ? this.translate.instant('increase_credits_notification', {count: actionPrice})
                        : this.translate.instant('decrease_credits_notification', {count: Math.abs(actionPrice)}),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();
            }

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Is check load more active
     */
    private get isCheckLoadMoreActive(): boolean {
        if (this.activeComponent == 'search'
            && this.usersLength >= this.currentLocalLimit && this.currentLocalLimit) {

            return true;
        }

        return false;
    }
}
