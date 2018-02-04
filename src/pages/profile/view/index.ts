import { Component, Input, ViewChild } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController, Events, ActionSheetController, ModalController, ToastController, Slides } from 'ionic-angular';
import { DataStore } from 'js-data';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { PhotoViewer } from '@ionic-native/photo-viewer';

// services
import { PermissionsService } from '../../../services/permissions/index';
import { AuthService } from '../../../services/auth/index';
import { ApplicationService } from '../../../services/application/index';
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { ApiUtilsService } from '../../../services/api/utils';

// pages
import { InappsPage } from '../../inapps/index';
import { ProfilePhotosPage } from '../../profile/photos/index';
import { EditUserQuestionsPage } from '../../../pages/user/edit/questions/index';
import { EditUserPhotosPage } from '../../../pages/user/edit/photos/index';
import { MessagesPage } from '../../../pages/messages/index';

// animations
import { like as likeAnimation, dislike as dislikeAnimation} from '../../../shared/animations/matchActions';

// import shared components
import { FlagComponent } from '../../../shared/components/flag/index';

@Component({
    selector: 'profile-view',
    templateUrl: 'index.html',
    animations: [
        likeAnimation,
        dislikeAnimation
    ]
})

export class ProfileViewPage {
    @ViewChild('photosSlider') slider: Slides = null;
    @Input() public activeComponent: string;

    private inappsPage = InappsPage;
    private profilePhotosPage = ProfilePhotosPage;
    private profilePhotosPageNavParams = {};
    private editUserPhotosPage = EditUserPhotosPage;
    private userId: number;
    private user: any;
    private trackedPhotos: number[] = [];
    private userPhotos: any[] = [];
    private userPhotosFetched: boolean = false;
    private userPhotosCount: number = 0;
    private isUserBlockStatusChanged: boolean = false;
    private isUserBlocked: boolean = false;
    private isUserBookmarked: boolean = false;
    private isUserBookmarkStatusChanged: boolean = false;
    private userLikeStatus: string = 'default';
    private pageIsReady: boolean;
    private editUserQuestionsPage = EditUserQuestionsPage;
    private likeDelayHandler: any = null;
    private likeDelay: number = 1000;
    private photosLimit: number;
    private pageWillLeave: boolean = false;
    private permissionsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private apiUtils: ApiUtilsService,
        private config: ConfigService,
        private http: SecureHttpService,
        private photoViewer: PhotoViewer,
        private toast: ToastController,
        private modalController: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private events: Events,
        private translate: TranslateService,
        private alert: AlertController,
        private application: ApplicationService,
        private nav: NavController,
        private sanitizer: DomSanitizer,
        private api: DataStore,
        private loading: LoadingController,
        private auth: AuthService,
        private navParams: NavParams,
        private permissions: PermissionsService)
    {
        this.photosLimit = this.api.get('configs', 'profilePhotosLimit').value;
        this.userId = this.navParams.get('userId');
        this.profilePhotosPageNavParams = {
            userId: this.userId
        };

        // -- init callbacks --//

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            // show permission denied slide
            if (this.isViewAllowed && this.user && !this.isViewPhotoAllowed) {
                this.slider.slideTo(1);
            }

            // user has not been loaded
            if ((this.isViewAllowed && !this.user) || (this.isViewPhotoAllowed && !this.userPhotosFetched)) {
                this.loadUserData();

                return;
            }

            // user has been already loaded
            if (this.isViewAllowed && this.user) {
                this.pageIsReady = true;

                return;
            }
        };
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Page will enter
     */
    ionViewWillEnter(): any {
        this.pageIsReady = false;
        this.pageWillLeave = false;
        this.userPhotosFetched = false;

        // load user data
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
    }

    /**
     * Page will leave
     */
    ionViewWillLeave(): void {
        this.pageWillLeave = true;

        if (this.isUserBlocked && this.isUserBlockStatusChanged) {
            this.events.publish('profileView:block', {
                userId: this.user.id
            });
        }

        if (this.isUserBookmarkStatusChanged) {
            this.events.publish('profileView:bookmarkUpdated', {
                userId: this.user.id
            });
        }

        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
    }

    /**
     * Page did enter
     */
    ionViewDidEnter(): void {
        this.loadUserData();
    }

    /**
     * View photo
     */
    viewPhoto(url: string): void {
        this.photoViewer.show(url);
    }

    /**
     * Photos slider did change
     */
    photosSliderDidChange(slider: any): void {
        // track action (photo view)
        if (!this.isProfileOwner) {
            if (slider.getActiveIndex()
                    && slider.getActiveIndex() <= this.userPhotos.length
                    && !this.trackedPhotos.includes(slider.getActiveIndex())) {

                // track action
                this.permissions.trackAction('photo', 'view');
                this.trackedPhotos.push(slider.getActiveIndex());
            }
        }
    }

    /**
     * Show photo actions
     */
    showPhotoActions(photoId: number) {
        if (!this.isProfileOwner) {
            let actionSheet = this.actionSheetCtrl.create({
                buttons: [{
                    text: this.translate.instant('flag_photo'),
                    handler: () => {
                        let modal = this.modalController.create(FlagComponent, {
                            identityId: photoId,
                            entityType: 'photo_comments'
                        });

                        modal.onDidDismiss((status: {reported: boolean}) => {
                            if (status.reported) {
                                let toast = this.toast.create({
                                    message: this.translate.instant('photo_reported'),
                                    closeButtonText: this.translate.instant('ok'),
                                    showCloseButton: true,
                                    duration: this.toastDuration
                                });

                                toast.present();
                            }
                        });

                        modal.present();
                    }
                }]
            });

            actionSheet.present();
        }
    }

    /**
     * Show profile actions
     */
    showProfileActions(): void {
        if (!this.isProfileOwner) {
            let actionSheet = this.actionSheetCtrl.create({
                buttons: [{
                    text: this.translate.instant('flag_profile'),
                    handler: () => {
                        let modal = this.modalController.create(FlagComponent, {
                            identityId: this.user.id,
                            entityType: 'user_join'
                        });

                        modal.onDidDismiss((status:{reported: boolean}) => {
                            if (status.reported) {
                                let toast = this.toast.create({
                                    message: this.translate.instant('profile_reported'),
                                    closeButtonText: this.translate.instant('ok'),
                                    showCloseButton: true,
                                    duration: this.toastDuration
                                });

                                toast.present();
                            }
                        });

                        modal.present();
                    }
                }, {
                    text: this.isUserBlocked ? this.translate.instant('unblock_profile') : this.translate.instant('block_profile'),
                    handler: () => {
                        // unblock profile
                        if (this.isUserBlocked) {
                            this.unblockUser();

                            return;
                        }

                        // block profile
                        let confirm = this.alert.create({
                            message: this.translate.instant('block_profile_confirmation'),
                            buttons: [
                                {
                                    text: this.translate.instant('cancel')
                                },
                                {
                                    text: this.translate.instant('block_profile'),
                                    handler: () => {
                                        this.blockUser()
                                    }
                                }
                            ]
                        });

                        confirm.present();
                    }
                }]
            });

            actionSheet.present();
        }
    }

    /**
     * Bookmark user
     */
    async bookmarkUser(): Promise<any> {
        try {
            // remove bookmark
            if (this.isUserBookmarked) {
                this.isUserBookmarked = false;
                this.isUserBookmarkStatusChanged = true;

                let toast = this.toast.create({
                    message: this.translate.instant('profile_removed_from_bookmarks'),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();

                // delete bookmark
                await this.http.delete(`${this.config.getApiUrl()}/bookmarks/${this.user.id}/`)
                    .map(res => res.json())
                    .toPromise();

                return;
            }

            // bookmark profile
            this.isUserBookmarked = true;
            this.isUserBookmarkStatusChanged = true;

            let toast = this.toast.create({
                message: this.translate.instant('profile_added_to_bookmarks'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            // create a new bookmark
            await this.http.post(`${this.config.getApiUrl()}/bookmarks/`, {
                userId: this.user.id
            }).map(res => res.json()).toPromise();
        }
        catch (e) {}
    }

    /**
     * Like user
     */
    likeUser(): void {
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', {name: this.user.realName}),
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
                            this.sendLikeRequest();
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.sendLikeRequest();
    }

    /**
     * Dislike user
     */
    dislikeUser(): void {
        if (this.userLikeStatus == 'like') {
            return;
        }

        // show a confirmation window
        if (!Boolean(this.application.getAppSetting('user_dislike_pressed', false))) {
            let confirm = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('dislike_confirmation', {name: this.user.realName}),
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
                            this.sendDislikeRequest();
                        }
                    }
                ]
            });

            confirm.present();

            return;
        }

        this.sendDislikeRequest();
    }

    /**
     * Get compatibility background
     */
    getCompatibilityBackground(match: number = 0): SafeStyle {
        let background = `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${match}%, #d8d8d8 ${match}%)`;

        return this.sanitizer.bypassSecurityTrustStyle(background);
    }

    /**
     * Return back
     */
    returnBack(): void {
        this.nav.pop();
    }

    /**
     * Show chat
     */
    showChat(): void {
        this.nav.push(MessagesPage, {
            userId: this.user.id
        });
    }

    /**
     * Is view allowed
     */
    get isViewAllowed(): boolean {
        return  this.isProfileOwner || this.permissions.isActionAllowed('base_view_profile');
    }

    /**
     * Is view photo allowed
     */
    get isViewPhotoAllowed(): boolean {
        return this.isProfileOwner || this.permissions.isActionAllowed('photo_view');
    }

    /**
     * Is profile owner
     */
    get isProfileOwner(): boolean {
        return this.auth.getUserId() == this.userId;
    }

    /**
     * Get user relations
     */
    protected getUserRelations(): string[] {
        if (this.isProfileOwner) {
            this.userPhotosFetched = true;

            return [
                'avatar',
                'photos',
                'viewQuestions',
                'permissions',
                'memberships'
            ];
        }

        let relations: string[] = [];

        relations.push('avatar');
        relations.push('compatibility');
        relations.push('distance');
        relations.push('matchActions');
        relations.push('viewQuestions');
        relations.push('blocks');
        relations.push('bookmarks');

        if (this.isViewPhotoAllowed) {
            relations.push('photos');
            this.userPhotosFetched = true;
        }

        return relations;
    }

    /**
     * Send dislike request
     */
    protected sendDislikeRequest(): void {
        this.events.publish('profileView:dislike', {
            userId: this.user.id
        });

        // create a new dislike
        setTimeout(async ():Promise<any> => {
            try {
                await this.api.getMapper('matchActions').create({
                    userId: this.user.id,
                    type: 'dislike'
                });
            }
            catch (e) {}
        }, this.likeDelay);

        this.returnBack();
    }

    /**
     * Send like request
     */
    protected sendLikeRequest(): void {
        this.userLikeStatus = this.userLikeStatus == 'like' ? 'default' : 'like';

        this.events.publish('profileView:like', {
            userId: this.user.id,
            type: this.userLikeStatus
        });

        if (this.likeDelayHandler) {
            clearTimeout(this.likeDelayHandler);
        }

        // delayed action
        this.likeDelayHandler = setTimeout(async ():Promise<any> => {
            try {
                this.likeDelayHandler = null;

                // delete match action
                if (this.userLikeStatus == 'default') {
                    await this.api.getMapper('matchActions').destroy(this.user.id);

                    return;
                }

                // create a new like
                await this.api.getMapper('matchActions').create({
                    userId: this.user.id,
                    type: 'like'
                });
            }
            catch (e){}
        }, this.likeDelay);
    }

    /**
     * Load user data
     */
    protected async loadUserData(): Promise<any> {
        let loader = this.loading.create();

        try {
            await loader.present();

            this.userPhotos = [];
            this.pageIsReady = false;

            if (this.isViewAllowed) {
                  // clear user's cache data
                if (this.isProfileOwner) {
                    this.apiUtils.clearUserData(this.userId, true);

                    this.user = await this.api.find('users', this.userId, { // get user info with relations
                        params: {
                            with: this.getUserRelations()
                        }
                    });
                }
                else {
                    this.user = await this.api.getMapper('users').find(this.userId, { // get user info with relations and don't cache data
                        params: {
                            with: this.getUserRelations()
                        }
                    });

                    this.userLikeStatus = this.user.matchActions.type;
                    this.isUserBlocked  = this.user.blocks.isBlocked;
                    this.isUserBookmarked = this.user.bookmarks.length > 0;
                }

                this.pageIsReady = true;

                if (this.user.photos) {
                    // process photos
                    this.user.photos.forEach((photo) => {
                        if (this.isProfileOwner || photo.approved) {
                            if (this.userPhotos.length < this.photosLimit) {
                                this.userPhotos.push(photo);
                            }

                            this.userPhotosCount++;
                        }
                    });
                }
            }

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Unblock user
     */
    protected async unblockUser(): Promise<any> {
        try {
            this.isUserBlocked = false;

            let toast = this.toast.create({
                message: this.translate.instant('profile_unblocked'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            this.isUserBlockStatusChanged = true;
            await this.api.getMapper('blocks').destroy(this.user.id);
        }
        catch (e) {}
    }

    /**
     * Block user
     */
    protected async blockUser(): Promise<any> {
        try {
            this.isUserBlocked = true;

            let toast = this.toast.create({
                message: this.translate.instant('profile_blocked'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            this.isUserBlockStatusChanged = true;
            await this.api.getMapper('blocks').create({
                userId: this.user.id
            });
        }
        catch (e) {}
    }
}
