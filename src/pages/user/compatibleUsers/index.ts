import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { List, AlertController, LoadingController, NavController, InfiniteScroll, Events } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// services
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { ApplicationService } from '../../../services/application/index';

// pages
import { ProfileViewPage } from '../../profile/view/index';
import { MessagesPage } from '../../messages/index';

@Component({
    selector: 'compatible-users',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompatibleUsersPage implements OnInit, AfterViewChecked {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;
    @ViewChild(List) userList: List;

    private users: any[] = [];
    private pageReady: boolean = false;
    private currentLocalLimit: number;
    private infiniteScrollNeedComplete: boolean = false;
    private configsUpdatedHandler: () => void;
    private profileLikedHandler: (event: {userId: number, type: string}) => void;
    private profileDislikedHandler: (event: {userId: number}) => void;

    /**
     * Constructor
     */
    constructor(
        private application: ApplicationService,
        private events: Events,
        private config: ConfigService,
        private http: SecureHttpService,
        private alert: AlertController,
        private translate: TranslateService,
        private ref: ChangeDetectorRef,
        private nav: NavController,
        private loadingCtrl: LoadingController,
        private api: DataStore)
    {
        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // profile liked
        this.profileLikedHandler = (event: {userId: number, type: string}): void =>  {
            console.log('liked');
            let user = this.users.find((user: any) => user.id == event.userId);

            if (user) {
                if (event.type == 'like') {
                    user.matchActions.type = 'like';
                }
                else {
                    user.matchActions = {};
                }

                this.ref.markForCheck();
            }
        };

        // profile disliked
        this.profileDislikedHandler = (event: {userId: number}): void => {
            console.log('disliked');
            let user = this.users.find((user: any) => user.id == event.userId);

            if (user) {
                user.matchActions.type = 'dislike';
                this.ref.markForCheck();
            }
        };
    }

    /**
     * Component init
     */
     ngOnInit(): void {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        this.events.subscribe('profileView:like', this.profileLikedHandler);
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);

        this.searchUsers();
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
    }

    /**
     * View rendered
     */
    ngAfterViewChecked() {
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;

            setTimeout(() => {
                this.infiniteScroll.complete();
            });
        }
    }

    /**
     * Default local limit
     */
    get defaultLocalLimit(): number {
        return this.api.get('configs', 'compatibleUsersLocalLimit').value;
    }

    /**
     * Get user list
     */
    getUserList(): any[] {
        return this.users.slice(0, this.currentLocalLimit);
    }

    /**
     * Load more user
     */
    loadMoreUsers(): void {
        if (this.users.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;

            return;
        }

        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    }

    /**
     * View profile
     */
    viewProfile(userId: number): void {
        this.nav.push(ProfileViewPage, {
            userId: userId
        });
    }

    /**
     * Show chat
     */
    showChat(userId: number): void {
        this.nav.push(MessagesPage, {
            userId: userId
        });
    }

    /**
     * Like user
     */
    likeUser(user): void {
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', {name: user.displayName ? user.displayName : user.userName}),
                buttons: [{
                    text: this.translate.instant('cancel'),
                    handler: () => {
                        this.application.setAppSetting('user_like_pressed', true);
                    }
                },
                    {
                        text: this.translate.instant('like'),
                        handler: () => {
                            this.application.setAppSetting('user_like_pressed', true);
                            this.sendLikeRequest(user);
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.sendLikeRequest(user);
    }

    /**
     * Send like request
     */
    private async sendLikeRequest(user: any): Promise<any> {
        try {
            this.userList.closeSlidingItems();

            let likeParam = {
                userId: user.id,
                type: 'like'
            };

            user.matchActions = likeParam;
            this.ref.markForCheck();

            // create a new like
            await this.api.getMapper('matchActions').create(likeParam);
        }
        catch (e) {}
    }

    /**
     * Search users
     */
    private async searchUsers(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            this.pageReady = false;
            await loader.present();

            let urlParams: string = '?';

            urlParams += 'with[]=avatar&';
            urlParams += 'with[]=displayName&';
            urlParams += 'with[]=userName&';
            urlParams += 'with[]=matchActions';

            // load all users
            this.users = await this.http.get(this.config.getApiUrl() + '/compatible-users/' + urlParams)
                .map(res => res.json())
                .toPromise();

            this.currentLocalLimit = this.defaultLocalLimit;
            this.pageReady = true;
            this.ref.markForCheck();

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }
}
