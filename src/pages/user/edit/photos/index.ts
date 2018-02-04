import { Component, ViewChild, OnInit, OnDestroy, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DataStore } from 'js-data';
import { Events, Content, LoadingController, AlertController, ToastController, ActionSheetController, NavController, InfiniteScroll } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TranslateService } from 'ng2-translate';

import { BasePhotoEdit, PhotoRefreshType, PhotoUnit } from '../basePhotoEdit'

// services
import { AuthService } from '../../../../services/auth/index';
import { ApiUtilsService } from '../../../../services/api/utils';
import { PermissionsService } from '../../../../services/permissions/index';
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { PhotoUploaderService } from '../../../../services/photoUploader/index';

@Component({
    selector: 'edit-user-photos',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ApiUtilsService,
        PhotoUploaderService
    ]
})

export class EditUserPhotosPage extends BasePhotoEdit implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;
    @ViewChild(Content) content: Content;

    private photosLimit: number;
    private freeSlots: number = 0;
    private pageReady: boolean = false;
    private infiniteScrollNeedComplete: boolean = false;
    private configsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        protected ref: ChangeDetectorRef,
        protected events: Events,
        protected photoUploader: PhotoUploaderService,
        protected config: ConfigService,
        protected http: SecureHttpService,
        protected loadingCtrl: LoadingController,
        protected actionSheetCtrl: ActionSheetController,
        protected alert: AlertController,
        protected toast: ToastController,
        protected permissions: PermissionsService,
        protected nav: NavController,
        protected translate: TranslateService,
        protected photoViewer: PhotoViewer,
        protected api: DataStore,
        protected auth:AuthService,
        private apiUtils:ApiUtilsService)
    {
        super(
            ref,
            events,
            photoUploader,
            config,
            http,
            loadingCtrl,
            actionSheetCtrl,
            alert,
            toast,
            permissions,
            nav,
            translate,
            api,
            auth,
            photoViewer);

        this.photosLimit = this.api.get('configs', 'photosLimit').value;


        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Get min photos
     */
    get minPhotos(): number {
        return this.api.get('configs', 'minPhotos').value;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {

        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);

        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // clear user cached data
            this.apiUtils.clearUserData(this.auth.getUserId());

            // load all pages dependencies
            await Promise.all([
                this.api.find('users', this.auth.getUserId(), { // get logged user info with relations
                    params: {
                        with: ['avatar', 'permissions', 'photos', 'memberships']
                    }
                })
            ]);

            // init user avatar
            if (this.currentUser.avatar && this.currentUser.avatar.id) {
                this.initAvatar(this.currentUser.avatar);
            }

            // load photos
            this.loadPhotoList(this.photosLimit);

            loader.dismiss();

            this.pageReady = true;
            this.ref.markForCheck();
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
     * Load more photos
     */
    loadMorePhotos(): void {
        if (this.getPhotoCount() + 1 > this.photosLimit) { // include avatar
            this.photosLimit += this.photosPerRow;

            this.loadPhotoList(this.photosLimit);
            this.infiniteScrollNeedComplete = true;
            this.ref.markForCheck();

            return;
        }

        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
        this.ref.markForCheck();
    }

    /**
     * Approval text
     */
    get approvalText(): string {
        let notApprovedPhotos = this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId(),
                approved: false
            }
        });

        if (notApprovedPhotos.length && !BasePhotoEdit.isAvatarActive) {
            return this.translate.instant('avatar_and_photos_approval_text', {
                photos: notApprovedPhotos.length
            });
        }

        if (notApprovedPhotos.length) {
            return this.translate.instant('photos_approval_text', {
                photos: notApprovedPhotos.length
            });
        }

        if (!BasePhotoEdit.isAvatarActive) {
            return this.translate.instant('avatar_approval_text');
        }

        return;
    }

    /**
     * Refresh photo list
     */
    protected async refreshPhotoList(refreshType: PhotoRefreshType): Promise<any> {
        switch (refreshType) {
            case 'add' :
                // check free slots
                if (!this.freeSlots) {
                    this.photosLimit += 1;
                    this.ref.markForCheck();
                }

                await this.content.scrollToTop();
                break;

            case 'delete' :
                this.photosLimit -= 1;
                this.ref.markForCheck();
                break;

            default :
                await this.content.scrollToTop();
        }

        if (this.photosLimit % this.photosPerRow) {
            let extraFreeSlots = (this.photosPerRow - this.photosLimit % this.photosPerRow);
            this.freeSlots += extraFreeSlots;

            this.photosLimit = this.photosLimit + extraFreeSlots;
        }

        // remove unused free slots
        if  (this.freeSlots == this.photosPerRow && this.photosLimit > this.minPhotos ) {
            this.freeSlots -= this.photosPerRow;
            this.photosLimit -= this.photosPerRow;
        }

        this.ref.markForCheck();
        this.loadPhotoList(this.photosLimit);
    }

    /**
     * Get photo count
     */
    protected getPhotoCount(): number {
        return this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            }
        }).length;
    }

    /**
     * Load photo list
     */
    protected loadPhotoList(limit: number): void {
        this.photos = []; // clear current photo list
        let photos: PhotoUnit[] = [];
        this.freeSlots = 0;

        // add avatar to the photo list
        photos.push(new PhotoUnit(
            BasePhotoEdit.avatarId,
            BasePhotoEdit.avatarUrl ? BasePhotoEdit.avatarUrl : BasePhotoEdit.defaultAvatar,
            BasePhotoEdit.bigAvatarUrl ? BasePhotoEdit.bigAvatarUrl : BasePhotoEdit.defaultAvatar,
            'avatar',
            BasePhotoEdit.isAvatarActive
        ));

        // get user photos
        let apiPhotos = this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            },
            orderBy: [
                ['id', 'DESC']
            ],
            limit: limit - 1 // exclude avatar
        });

        // check count of photos
        let visiblePhotos = this.getPhotoCount() + 1 >= this.minPhotos // include avatar
            ? limit
            : this.minPhotos;

        // process photos
        for (let i = 1; i < visiblePhotos; i++) {
            let photoDetails = apiPhotos && apiPhotos[i - 1] ? apiPhotos[i - 1] : null;

            photos.push(new PhotoUnit(
                photoDetails ? photoDetails.id : null,
                photoDetails ? photoDetails.url : null,
                photoDetails ? photoDetails.bigUrl : null,
                'photo',
                photoDetails ? photoDetails.approved : true
            ));

            if (!photoDetails) {
                this.freeSlots++;
            }
        }

        // chunk photos
        for (let i = 0; i < photos.length; i += this.photosPerRow) {
            this.photos.push(photos.slice(i, i + this.photosPerRow));
        }

        this.ref.markForCheck();
    }
}
