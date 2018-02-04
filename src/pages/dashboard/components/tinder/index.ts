import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { StackConfig, Direction } from 'angular2-swing';
import { Events, NavController, AlertController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { trigger, state, style, transition, animate } from '@angular/animations'

// services
import { PermissionsService } from '../../../../services/permissions/index';
import { AuthService } from '../../../../services/auth/index';
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { ApplicationService } from '../../../../services/application/index';

// pages
import { InappsPage } from '../../../../pages/inapps/index';
import { ProfileViewPage } from '../../../profile/view/index';

@Component({
    selector: 'tinder',
    templateUrl: 'index.html',
    animations: [
        trigger('removed', [
            state('remove', style({ opacity: 0 })),
            transition('* => remove', animate('.5s linear')),
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TinderComponent implements OnInit, OnDestroy {
    @Input() public activeComponent: string;

    private removeCardDelay: number = 500;
    private inappsPage = InappsPage;
    private searchInProgress: boolean = false;
    private cards: any[] = [];
    private stackConfig: StackConfig;
    private throwOutDistance: number = 800;
    private permissionsUpdatedHandler: () => void;
    private avatarUpdatedHandler: () => void;
    private avatarDeletedHandler: () => void;
    private timeoutHandler: any;
    private profileUpdatedHandler: () => void;
    private configsUpdatedHandler: () => void;
    private profileLikedHandler: () => void;
    private profileDislikedHandler: () => void;
    private profileBlockedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private translate: TranslateService,
        private alert: AlertController,
        private nav: NavController,
        private sanitizer: DomSanitizer,
        private application: ApplicationService,
        private config: ConfigService,
        private http: SecureHttpService,
        private auth: AuthService,
        private api: DataStore,
        private events: Events,
        private permissions: PermissionsService,
        private ref: ChangeDetectorRef)
    {
        // full list of options: https://github.com/gajus/swing#configuration
        this.stackConfig = {
            // a value between 0 and 1 indicating the completeness of the throw out condition.
            throwOutConfidence: (offsetX, offsetY, element) => {
                return this.isCardThrowAllowed()
                    ? Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1)
                    : 0;
            },
            throwOutDistance: () => this.throwOutDistance
        };

        // -- init callbacks --//

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            // make users search
            if (this.isSearchAllowed) {
                this.searchUsers();
            }

            this.ref.markForCheck();
        };

        // avatar updated handler
        this.avatarUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // avatar deleted handler
        this.avatarDeletedHandler = (): void => {
            this.ref.markForCheck();
        };

        // profile updated handler
        this.profileUpdatedHandler = (): void => {
            if (this.isSearchAllowed) {
                this.searchUsers(true);
            }

            this.ref.markForCheck();
        };

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // profile liked
        this.profileLikedHandler = (): void =>  {
            this.likeUser(false, false);
        };

        // profile disliked
        this.profileDislikedHandler = (): void => {
            this.dislikeUser(false, false);
        };

        // profile blocked
        this.profileBlockedHandler = (): void => {
            this.dislikeUser(false, false);
        };
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        if (this.isSearchAllowed) {
            this.searchUsers();
        }

        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);

        // profile updated
        this.events.subscribe('user:updated', this.profileUpdatedHandler);

        // permissions updated
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

        // avatar updated
        this.events.subscribe('user:avatarUpdated', this.avatarUpdatedHandler);

        // avatar deleted
        this.events.subscribe('user:avatarDeleted', this.avatarDeletedHandler);

        // profile has been liked
        this.events.subscribe('profileView:like', this.profileLikedHandler);

        // profile has been disliked
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);

        // profile has been blocked
        this.events.subscribe('profileView:block', this.profileBlockedHandler);
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('user:updated', this.profileUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        this.events.unsubscribe('user:avatarDeleted', this.avatarDeletedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.unsubscribe('profileView:block', this.profileBlockedHandler);

        // clear timeout
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
    }

    /**
     * current user
     */
    get currentUser(): any {
        return this.api.get('users', this.auth.getUserId()); // get logged user data
    }

    /**
     * Is search allowed
     */
    get isSearchAllowed(): boolean {
        return this.permissions.isActionAllowed('base_search_users');
    }

    /**
     * Get users limit
     */
    get usersLimit(): number {
        return this.api.get('configs', 'tinderUsersLimit').value;
    }

    /**
     * Search timeout
     */
    get searchTimeout(): number {
        return this.api.get('configs', 'tinderSearchTimeout').value;
    }

    /**
     * Tinder card moving
     */
    tinderCardMoving(event: any): void {
        let card: any = this.cards[this.cards.length - 1];

        if (event.throwDirection == Direction.LEFT || event.throwDirection == Direction.RIGHT) {
            card.swipeDirection = event.throwDirection == Direction.LEFT ? 'left' : 'right';
            this.ref.markForCheck();

            return;
        }

        this.ref.markForCheck();
        card.swipeDirection = '';
    }

    /**
     * Tinder card stop moving
     */
    tinderCardStopMoving(): void {
        let card: any = this.cards[this.cards.length - 1];

        if (card && !this.isCardThrowAllowed()) {
            switch (card.swipeDirection) {
                case 'left' :
                    this.dislikeConfirmation(card, !Boolean(this.application.getAppSetting('user_dislike_pressed', false)));
                    break;

                case 'right' :
                    this.likeConfirmation(card, !Boolean(this.application.getAppSetting('user_like_pressed', false)));
                    break;

                default :
            }
        }

        if (card) {
            card.swipeDirection = '';
            this.ref.markForCheck();
        }
    }

    /**
     * Like user
     */
    likeUser(sendRequest: boolean = true, showAnimation: boolean = true): void {
        if (!showAnimation) {
            let card = this.cards.pop();
            this.ref.markForCheck();

            if (sendRequest) {
                this.sendLikeRequest(card);
            }

            this.searchUsers();

            return;
        }

        let card = this.cards[this.cards.length - 1];

        if (card.status != 'remove') {
            card.status = 'remove';
            this.ref.markForCheck();

            if (sendRequest) {
                this.sendLikeRequest(card);
            }

            // remove card
            setTimeout(() => {
                this.cards.pop();
                this.ref.markForCheck();
                this.searchUsers();
            }, this.removeCardDelay);
        }
    }

    /**
     * Dislike user
     */
    dislikeUser(sendRequest: boolean = true, showAnimation: boolean = true): void {
        if (!showAnimation) {
            let card = this.cards.pop();
            this.ref.markForCheck();

            if (sendRequest) {
                this.sendDislikeRequest(card);
            }

            this.searchUsers();

            return;
        }

        let card = this.cards[this.cards.length - 1];

        if (card.status != 'remove') {
            card.status = 'remove';
            this.ref.markForCheck();

            if (sendRequest) {
                this.sendDislikeRequest(card);
            }

            // remove card
            setTimeout(() => {
                this.cards.pop();
                this.ref.markForCheck();
                this.searchUsers();
            }, this.removeCardDelay);
        }
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
     * Get compatibility background
     */
    getCompatibilityBackground(match: number = 0): SafeStyle {
        let background = `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${match}%, #d8d8d8 ${match}%)`;

        return this.sanitizer.bypassSecurityTrustStyle(background);
    }

    /**
     * Like confirmation
     */
    likeConfirmation(card: any, showAnimation: boolean = true): void {
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', {name: card.displayName ? card.displayName : card.userName}),
                buttons: [{
                    text: this.translate.instant('cancel'),
                    handler: () => {
                        this.application.setAppSetting('user_like_pressed', true);
                    }
                }, {
                    text: this.translate.instant('like'),
                    handler: () => {
                        this.application.setAppSetting('user_like_pressed', true);
                        this.likeUser(true, showAnimation);
                    }
                }
                ]
            });

            confirm.present();

            return;
        }

        this.likeUser(true, showAnimation);
    }

    /**
     * Dislike confirmation
     */
    dislikeConfirmation(card: any, showAnimation: boolean = true): void {
        if (!Boolean(this.application.getAppSetting('user_dislike_pressed', false))) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('dislike_confirmation', {name: card.displayName ? card.displayName : card.userName}),
                buttons: [{
                    text: this.translate.instant('cancel'),
                    handler: () => {
                        this.application.setAppSetting('user_dislike_pressed', true);
                    }
                },
                    {
                        text: this.translate.instant('dislike'),
                        handler: () => {
                            this.application.setAppSetting('user_dislike_pressed', true);
                            this.dislikeUser(true, showAnimation);
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.dislikeUser(true, showAnimation);
    }

    /**
     * Search users
     */
    private async searchUsers(force: boolean = false): Promise<any> {
        if (!force && this.cards.length || this.searchInProgress) {
            return;
        }

        try {
            this.cards = [];
            this.searchInProgress = true;

            // clear timeout
            if (this.timeoutHandler) {
                clearTimeout(this.timeoutHandler);
            }

            let urlParams:string = '?';

            urlParams += 'with[]=avatar&';
            urlParams += 'with[]=compatibility&';
            urlParams += 'with[]=distance&';
            urlParams += 'with[]=matchActions&';
            urlParams += `limit=${this.usersLimit}`;

            if (this.application.getAppLocation()) {
                urlParams += `location=${this.application.getAppLocation()}&`;
            }

            // search users
            this.cards = await this.http.get(this.config.getApiUrl() + '/tinder-users/' + urlParams)
                .map(res => res.json())
                .toPromise();

            this.searchInProgress = false;
            this.ref.markForCheck();

            // try to load users later
            if (!this.cards.length) {
                this.timeoutHandler = setTimeout(() => {
                    if (this.isSearchAllowed) {
                        this.searchUsers();
                    }
                }, this.searchTimeout);
            }
        }
        catch (e) {
            this.searchInProgress = false;
            this.ref.markForCheck();
        }
    }

    /**
     * Send like request
     */
    private async sendLikeRequest(card: any): Promise<any> {
        try {
            await this.api.getMapper('matchActions').create({
                userId: card.id,
                type: 'like'
            });
        }
        catch (e) {}
    }

    /**
     * Send dislike request
     */
    private async sendDislikeRequest(card: any): Promise<any> {
        try {
            await this.api.getMapper('matchActions').create({
                userId: card.id,
                type: 'dislike'
            });
        }
        catch (e) {}
    }

    /**
     * Is card throw allowed
     */
    private isCardThrowAllowed(): boolean {
        return Boolean(this.application.getAppSetting('user_dislike_pressed', false))
                && Boolean(this.application.getAppSetting('user_like_pressed', false));
    }
}
