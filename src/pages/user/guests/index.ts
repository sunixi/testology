import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';
import { DataStore } from 'js-data';
import { ToastController, List, AlertController, InfiniteScroll, NavController, LoadingController, Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// services
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { ApplicationService } from '../../../services/application/index';

// pages
import { ProfileViewPage } from '../../profile/view/index';
import { MessagesPage } from '../../messages/index';

@Component({
    selector: 'guests',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GuestsPage implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;
    @ViewChild(List) guestList: List;

    private deletedGuests: number[] = [];
    private pageReady: boolean = false;
    private guests: any[] = [];
    private currentLocalLimit: number;
    private infiniteScrollNeedComplete: boolean = false;
    private guestsUpdatedHandler: () => void;
    private profileLikedHandler: (event: {userId: number, type: string}) => void;
    private profileDislikedHandler: (event: {userId: number}) => void;
    private configsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private toast: ToastController,
        private translate: TranslateService,
        private alert: AlertController,
        private application: ApplicationService,
        private events: Events,
        private config: ConfigService,
        private http: SecureHttpService,
        private nav: NavController,
        private ref: ChangeDetectorRef,
        private api: DataStore,
        private loadingCtrl: LoadingController)
    {
        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // guests updated handler
        this.guestsUpdatedHandler = (): void => {
            this.guests = this.api.filter('guests', {
                where: {
                    id: {
                        'notIn': this.deletedGuests
                    }
                },
                orderBy: [
                    ['visitTimestamp', 'DESC'],
                    ['id', 'ASC']
                ]
            });

            this.markGuestsAsViewed();
            this.ref.markForCheck();
        };

        // profile liked
        this.profileLikedHandler = (event: {userId: number, type: string}): void =>  {
            let guest = this.guests.find((guest: any) => guest.guestId == event.userId);

            if (guest) {
                if (event.type == 'like') {
                    guest.matchActions.type = 'like';
                }
                else {
                    guest.matchActions = {};
                }

                this.ref.markForCheck();
            }
        };

        // profile disliked
        this.profileDislikedHandler = (event: {userId: number}): void => {
            let guest = this.guests.find((guest: any) => guest.guestId == event.userId);

            if (guest) {
                guest.matchActions.type = 'dislike';
                this.ref.markForCheck();
            }
        };
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            this.events.subscribe('configs:updated', this.configsUpdatedHandler);
            this.events.subscribe('guests:updated', this.guestsUpdatedHandler);
            this.events.subscribe('profileView:like', this.profileLikedHandler);
            this.events.subscribe('profileView:dislike', this.profileDislikedHandler);

            await loader.present();
            this.guests = await this.api.findAll('guests');

            this.currentLocalLimit = this.defaultLocalLimit;
            this.pageReady = true;
            this.markGuestsAsViewed();

            this.ref.markForCheck();

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('guests:updated', this.guestsUpdatedHandler);
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
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Default local limit
     */
    get defaultLocalLimit(): number {
        return this.api.get('configs', 'guestsLocalLimit').value;
    }

    /**
     * Get guest list
     */
    getGuestList(): any[] {
        return this.guests.slice(0, this.currentLocalLimit);
    }

    /**
     * Load more guests
     */
    loadMoreGuests(): void {
        if (this.guests.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.markGuestsAsViewed();

            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;

            return;
        }

        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    }

    /**
     * Remove guest confirmation
     */
    removeGuestConfirmation(id: number): void {
        let buttons: any[] = [{
            text: this.translate.instant('no'),
            handler: () => this.guestList.closeSlidingItems()
        }, {
            text: this.translate.instant('yes'),
            handler: () => this.deleteGuest(id)
        }];

        let confirm = this.alert.create({
            message: this.translate.instant('delete_guest_confirmation'),
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
     * Like user
     */
    likeUser(guest): void {
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', {name: guest.displayName ? guest.displayName : guest.userName}),
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
                            this.sendLikeRequest(guest);
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.sendLikeRequest(guest);
    }

    /**
     * Delete guest
     */
    private async deleteGuest(id: number): Promise<any> {
        try {
            // refresh guests array
            this.deletedGuests.push(id);
            this.api.remove('guests', id);
            this.guests = this.api.filter('guests', {
                where: {
                    id: {
                        'notIn': this.deletedGuests
                    }
                },
                orderBy: [
                    ['visitTimestamp', 'DESC'],
                    ['id', 'ASC']
                ]
            });

            this.ref.markForCheck();

            let toast = this.toast.create({
                message: this.translate.instant('profile_removed_from_guests'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            await this.api.destroy('guests', id);
        }
        catch (e) {}
    }

    /**
     * Send like request
     */
    private async sendLikeRequest(guest: any): Promise<any> {
        try {
            this.guestList.closeSlidingItems();

            let likeParam = {
                userId: guest.guestId,
                type: 'like'
            };

            guest.matchActions = likeParam;
            this.ref.markForCheck();

            // create a new like
            await this.api.getMapper('matchActions').create(likeParam);
        }
        catch (e) {}
    }

    /**
     * Mark guests as viewed
     */
    private async markGuestsAsViewed(): Promise<any> {
        try {
            let guestsIds: number[] = [];

            this.getGuestList().forEach((guest:any) => {
                if (!guest.viewed) {
                    guest.viewed = true;
                    guestsIds.push(guest.guestId);
                }
            });

            if (guestsIds.length) {
                await this.http.put(`${this.config.getApiUrl()}/guests/`, guestsIds)
                    .map(res => res.json())
                    .toPromise();
            }
        }
        catch (e) {}
    }
}
