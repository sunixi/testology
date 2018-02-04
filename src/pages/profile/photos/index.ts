import { Component, ViewChild, OnInit, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavParams, InfiniteScroll, LoadingController, Events } from 'ionic-angular';
import { DataStore } from 'js-data';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { PhotoUnit } from '../../user/edit/basePhotoEdit'

// services
import { PermissionsService } from '../../../services/permissions/index';

// pages
import { InappsPage } from '../../inapps/index';

@Component({
    selector: 'profile-photos',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfilePhotosPage implements OnInit, AfterViewChecked {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;

    private inappsPage = InappsPage;
    private user: any;
    private userId: number;
    private photosLimit: number;
    private freeSlots: number = 0;
    private pageReady: boolean = false;
    private infiniteScrollNeedComplete: boolean = false;
    private apiPhotos: any[] = [];
    private photos: any[] = [];
    private trackedPhotos: number[] = [];
    private permissionsUpdatedHandler: () => void;
    private configsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private ref: ChangeDetectorRef,
        private events: Events,
        private photoViewer: PhotoViewer,
        private permissions: PermissionsService,
        private api: DataStore,
        private loadingCtrl: LoadingController,
        private navParams: NavParams)
    {
        this.userId = this.navParams.get('userId');
        this.photosLimit = this.api.get('configs', 'photosLimit').value;

        // -- init callbacks --//

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            // user has not been loaded
            if (this.isViewPhotoAllowed && !this.user) {
                this.loadUserData();
                this.ref.markForCheck();

                return;
            }

            this.ref.markForCheck();
        };

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Get photos per row
     */
    get photosPerRow(): number {
        return this.api.get('configs', 'photosPerRow').value;
    }

    /**
     * Get min photos
     */
    get minPhotos(): number {
        return this.api.get('configs', 'minPhotos').value;
    }

    /**
     * Get big default avatar
     */
    get bigDefaultAvatar(): string {
        return this.api.get('configs', 'bigDefaultAvatar').value;
    }

    /**
     * Get default avatar
     */
    get defaultAvatar(): string {
        return this.api.get('configs', 'defaultAvatar').value;
    }

    /**
     * Is view photo allowed
     */
    get isViewPhotoAllowed(): boolean {
        return this.permissions.isActionAllowed('photo_view');
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
     * Component init
     */
    ngOnInit(): void {
        this.loadUserData();
    }


    /**
     * Page will enter
     */
    ionViewWillEnter(): any {
        // load user data
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
    }

    /**
     * Page will leave
     */
    ionViewWillLeave(): void {
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
    }

    /**
     * View photo
     */
    viewPhoto(row: number, col: number): void {
        let photo: PhotoUnit = this.photos[row][col];

        switch (photo.type) {
            default :
                // track action
                if (photo.type == 'photo' && !this.trackedPhotos.includes(photo.id)) {
                    this.permissions.trackAction('photo', 'view');
                    this.trackedPhotos.push(photo.id);
                }

                // show photo
                this.photoViewer.show(photo.bigUrl);
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
     * Load photo list
     */
    private loadPhotoList(limit: number): void {
        this.photos = []; // clear current photo list
        let photos: PhotoUnit[] = [];
        this.freeSlots = 0;

        // add avatar to the photo list
        photos.push(new PhotoUnit(
            null,
            this.user.avatar.url ? this.user.avatar.url : this.defaultAvatar,
            this.user.avatar.bigUrl ? this.user.avatar.bigUrl : this.bigDefaultAvatar,
            'avatar',
            true
        ));

        // get user photos
        let apiPhotos = this.apiPhotos.slice(0, limit - 1); // exclude avatar

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


    /**
     * Get photo count
     */
    private getPhotoCount(): number {
        return this.apiPhotos.length;
    }

    /**
     * Load user data
     */
    private async loadUserData(): Promise<any>  {
        let loader = this.loadingCtrl.create();

        try {
            this.pageReady = false;
            this.ref.markForCheck();

            await loader.present();

            if (this.isViewPhotoAllowed) {
                // load all pages dependencies
                this.user = await this.api.getMapper('users').find(this.userId, {
                    params: {
                        with: ['avatar', 'photos']
                    }
                });

                this.user.photos.forEach((photo) => {
                    if (photo.approved) {
                        this.apiPhotos.push(photo);
                    }
                });

                // load photos
                this.loadPhotoList(this.photosLimit);
                this.pageReady = true;
            }

            this.ref.markForCheck();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }
}
