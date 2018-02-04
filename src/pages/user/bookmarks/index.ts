import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { List, AlertController, LoadingController, NavController, InfiniteScroll, ToastController, Events } from 'ionic-angular';
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
    selector: 'bookmarks',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookmarksPage implements OnInit, AfterViewChecked {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;
    @ViewChild(List) bookmarkList: List;

    private bookmarks: any[] = [];
    private pageReady: boolean = false;
    private currentLocalLimit: number;
    private infiniteScrollNeedComplete: boolean = false;
    private bookmarkUpdatedHandler: () => void;
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
        private toast: ToastController,
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
            let bookmark = this.bookmarks.find((bookmark: any) => bookmark.markUserId == event.userId);

            if (bookmark) {
                if (event.type == 'like') {
                    bookmark.matchActions.type = 'like';
                }
                else {
                    bookmark.matchActions = {};
                }

                this.ref.markForCheck();
            }
        };

        // profile disliked
        this.profileDislikedHandler = (event: {userId: number}): void => {
            let bookmark = this.bookmarks.find((bookmark: any) => bookmark.markUserId == event.userId);

            if (bookmark) {
                bookmark.matchActions.type = 'dislike';
                this.ref.markForCheck();
            }
        };

        // bookmark updated
        this.bookmarkUpdatedHandler = (): void => {
            this.searchBookmarks();
        };
    }

    /**
     * Component init
     */
     ngOnInit(): void {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        this.events.subscribe('profileView:like', this.profileLikedHandler);
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.subscribe('profileView:bookmarkUpdated', this.bookmarkUpdatedHandler);

        this.searchBookmarks();
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.unsubscribe('profileView:bookmarkUpdated', this.bookmarkUpdatedHandler);
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
        return this.api.get('configs', 'bookmarksLocalLimit').value;
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Get bookmark list
     */
    getBookmarkList(): any[] {
        return this.bookmarks.slice(0, this.currentLocalLimit);
    }

    /**
     * Load more bookmarks
     */
    loadMoreBookmarks(): void {
        if (this.bookmarks.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;

            return;
        }

        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    }

    /**
     * Like user
     */
    likeUser(bookmark): void {
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', {name: bookmark.displayName ? bookmark.displayName : bookmark.userName}),
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
                            this.sendLikeRequest(bookmark);
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.sendLikeRequest(bookmark);
    }

    /**
     * Unmark
     */
     unmark(userId: number): void {
        let buttons: any[] = [{
            text: this.translate.instant('no'),
            handler: () => this.bookmarkList.closeSlidingItems()
        }, {
            text: this.translate.instant('yes'),
            handler: () => this.deleteBookmark(userId)
        }];

        let confirm = this.alert.create({
            message: this.translate.instant('delete_bookmark_confirmation'),
            buttons: buttons
        });

        confirm.present();
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
     * Delete bookmark
     */
    private async deleteBookmark(userId: number): Promise<any> {
        try {
            // refresh bookmarks array
            this.bookmarks = this.bookmarks.filter((bookmark: any) => bookmark.markUserId != userId);
            this.ref.markForCheck();

            let toast = this.toast.create({
                message: this.translate.instant('profile_removed_from_bookmarks'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            await this.http.delete(`${this.config.getApiUrl()}/bookmarks/${userId}/`)
                .map(res => res.json())
                .toPromise();
        }
        catch (e) {}
    }

    /**
     * Send like request
     */
    private async sendLikeRequest(bookmark: any): Promise<any> {
        try {
            this.bookmarkList.closeSlidingItems();

            let likeParam = {
                userId: bookmark.markUserId,
                type: 'like'
            };

            bookmark.matchActions = likeParam;
            this.ref.markForCheck();

            // create a new like
            await this.api.getMapper('matchActions').create(likeParam);
        }
        catch (e) {}
    }

    /**
     * Search bookmarks
     */
    private async searchBookmarks(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            this.pageReady = false;
            await loader.present();

            let urlParams: string = '?';

            urlParams += 'with[]=avatar&';
            urlParams += 'with[]=displayName&';
            urlParams += 'with[]=userName&';
            urlParams += 'with[]=matchActions';

            // load all bookmarks
            this.bookmarks = await this.http.get(this.config.getApiUrl() + '/bookmarks/' + urlParams)
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
