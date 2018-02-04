import { ChangeDetectorRef } from '@angular/core';
import { DataStore } from 'js-data';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Events, LoadingController, AlertController, ToastController, ActionSheetController, NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// services
import { AuthService } from '../../../services/auth/index';
import { PermissionsService } from '../../../services/permissions/index';
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { PhotoUploaderService } from '../../../services/photoUploader/index';

// types
import { PhotoUploaderSource } from '../../../services/photoUploader/index';

// local types and classes
export type PhotoRefreshType = 'add' | 'delete' | 'refresh';
export type PhotoUploaderType = 'avatar' | 'photo';

export class PhotoUnit {
    id: number;
    url: string;
    bigUrl: string;
    type: string;
    active: boolean;

    /**
     * Constructor
     */
    constructor(id: number, url: string, bigUrl: string, type: string, active: boolean) {
        this.id = id;
        this.url = url;
        this.bigUrl = bigUrl;
        this.type = type;
        this.active = active;
    }
}

export abstract class BasePhotoEdit {
    protected static staticApi: DataStore;
    protected static avatarId: number = null;
    protected static avatarUrl: string = null;
    protected static bigAvatarUrl: string = null;
    protected static isAvatarActive: boolean = true;
    protected static avatarUploaded: boolean = false;

    protected photos = <any>[];

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
        protected api: DataStore,
        protected auth: AuthService,
        protected photoViewer: PhotoViewer)
    {
        // init configs
        BasePhotoEdit.staticApi = this.api;

        // init user avatar
        if (this.currentUser.avatar && this.currentUser.avatar.id) {
            this.initAvatar(this.currentUser.avatar);
        }
    }

    /**
     * Big default avatar
     */
    static get bigDefaultAvatar(): string {
        return BasePhotoEdit.staticApi.get('configs', 'bigDefaultAvatar').value;
    }

    /**
     * Default avatar
     */
    static get defaultAvatar(): string {
        return BasePhotoEdit.staticApi.get('configs', 'defaultAvatar').value;
    }

    /**
     * Is avatar required
     */
    static get isAvatarRequired(): boolean {
        return BasePhotoEdit.staticApi.get('configs', 'isAvatarRequired').value;
    }

    /**
     * Avatar max upload size
     */
    static get avatarMaxUploadSize(): number {
        return BasePhotoEdit.staticApi.get('configs', 'avatarMaxUploadSize').value;
    }

    /**
     * Photo max upload size
     */
    static get photoMaxUploadSize(): number {
        return BasePhotoEdit.staticApi.get('configs', 'photoMaxUploadSize').value;
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Get photos per row
     */
    get photosPerRow(): number {
        return this.api.get('configs', 'photosPerRow').value;
    }

    /**
     * Get current user
     */
    get currentUser(): any {
        return this.api.get('users', this.auth.getUserId());
    }

    /**
     * Tap photo
     */
    tapPhoto(row: number, col: number): void {
        let photo: PhotoUnit = this.photos[row][col];

        switch (photo.type) {
            case 'more' :
                this.showPhotoActions(photo);
                break;

            default :
                photo.bigUrl
                    ? this.photoViewer.show(photo.bigUrl) // view photo
                    : this.showPhotoActions(photo); // show actions
        }
    }

    /**
     * Press photo
     */
    pressPhoto(row: number, col: number): void {
        let photo: PhotoUnit = this.photos[row][col];

        if (photo.bigUrl) { // show actions
            this.showPhotoActions(photo);
        }
    }

    /**
     * Show all actions
     */
    showAllActions(): void {
        let buttons = <any>[];

        buttons = buttons.concat(this.getAvatarActions());
        buttons = buttons.concat(this.getPhotoActions());

        buttons.push({
            text: this.translate.instant('cancel'),
            role: 'cancel'
        });

        let actionSheet = this.actionSheetCtrl.create({
            buttons: buttons,
            enableBackdropDismiss: false
        });

        actionSheet.present();
    }

    /**
     * Show photo actions
     */
    protected showPhotoActions(photo: PhotoUnit): void {
        let buttons = <any>[];

        switch (photo.type) {
            case 'photo' :
                buttons = this.getPhotoActions(photo.id);
                break;

            case 'avatar' :
                buttons = this.getAvatarActions(photo.id);
                break;

            default :
                buttons = this.getExtraPhotoActions(photo.type, photo.id);
        }

        if (buttons.length) {
            buttons.push({
                text: this.translate.instant('cancel'),
                role: 'cancel'
            });

            let actionSheet = this.actionSheetCtrl.create({
                buttons: buttons,
                enableBackdropDismiss: false
            });

            actionSheet.present();
        }
    }

    /**
     * Get extra photo actions
     */
    protected getExtraPhotoActions(type: string, id?: number): [any] {
        let buttons: any = [];

        return buttons;
    }

    /**
     * Get avatar actions
     */
    protected getAvatarActions(id?: number): [any] {
        let buttons: any;

        buttons = [{
            text: this.translate.instant('take_avatar'),
            handler: () => this.takePhoto('avatar', 'camera')
        }, {
            text: this.translate.instant('choose_avatar_from_library'),
            handler: () => this.takePhoto('avatar', 'library')
        }];

        if (id && !BasePhotoEdit.isAvatarRequired) {
            buttons.push({
                text: this.translate.instant('delete_avatar'),
                handler: () => {
                    let avatarButtons: any[] = [];

                    avatarButtons = [{
                        text: this.translate.instant('no')
                    }, {
                        text: this.translate.instant('yes'),
                        handler: () => this.deleteAvatar()
                    }];

                    let confirm = this.alert.create({
                        message: this.translate.instant('delete_avatar_confirmation'),
                        buttons: avatarButtons
                    });

                    confirm.present();
                }
            });
        }

        return buttons;
    }

    /**
     * Get photo actions
     */
    protected getPhotoActions(id?: number): [any] {
        let buttons: any = [];

        if (this.permissions.isActionAllowed('photo_upload') || this.permissions.isActionPromoted('photo_upload')) {
            buttons.push({
                text: this.translate.instant('take_photo'),
                handler: () => this.permissions.isActionAllowed('photo_upload')
                    ? this.takePhoto('photo', 'camera')
                    : this.permissions.showAccessDeniedAlert()
            });

            buttons.push({
                text: this.translate.instant('choose_photo_from_library'),
                handler: () => this.permissions.isActionAllowed('photo_upload')
                    ? this.takePhoto('photo', 'library')
                    : this.permissions.showAccessDeniedAlert()
            });
        }

        if (id) {
            buttons.push({
                text: this.translate.instant('set_avatar'),
                handler: () => this.setPhotoAsAvatar(id)
            });

            buttons.push({
                text: this.translate.instant('delete_photo'),
                handler: () => {
                    let photoButtons: any[] = [];

                    photoButtons = [{
                        text: this.translate.instant('no')
                    }, {
                        text: this.translate.instant('yes'),
                        handler: () => this.deletePhoto(id)
                    }];

                    let confirm = this.alert.create({
                        message: this.translate.instant('delete_photo_confirmation'),
                        buttons: photoButtons
                    });

                    confirm.present();
                }
            });
        }

        return buttons;
    }

    /**
     * Refresh photo list
     */
    protected abstract refreshPhotoList(refreshType: PhotoRefreshType): void;

    /**
     * Delete avatar
     */
    protected async deleteAvatar(): Promise<any> {
        if (this.currentUser.avatar && this.currentUser.avatar.id) {
            let loader = this.loadingCtrl.create();

            try {
                await loader.present();
                await this.api.destroy('avatars', this.currentUser.avatar.id);

                BasePhotoEdit.avatarId = null;
                BasePhotoEdit.avatarUrl = null;
                BasePhotoEdit.bigAvatarUrl = null;
                BasePhotoEdit.avatarUploaded = false;
                BasePhotoEdit.isAvatarActive = true;

                this.ref.markForCheck();

                // process photos
                this.refreshPhotoList('delete');
                loader.dismiss();

                let toast = this.toast.create({
                    message: this.translate.instant('avatar_has_been_deleted'),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();

                this.events.publish('user:avatarDeleted');
            }
            catch (e) {
                loader.dismiss();

                let alert = this.alert.create({
                    title: this.translate.instant('error_occurred'),
                    subTitle: this.translate.instant('delete_avatar_error'),
                    buttons: [this.translate.instant('ok')]
                });

                alert.present();
            }
        }
    }

    /**
     * Delete photo
     */
    protected async deletePhoto(id: number): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.destroy('photos', id);

            this.ref.markForCheck();

            // process photos
            this.refreshPhotoList('delete');
            loader.dismiss();

            let toast = this.toast.create({
                message: this.translate.instant('photo_has_been_deleted'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
        }
        catch (e) {
            loader.dismiss();

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: this.translate.instant('delete_photo_error'),
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
    }

    /**
     * Set photo as avatar
     */
    protected async setPhotoAsAvatar(id: number): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            let data = await this.http.put(`${this.config.getApiUrl()}/photos/${id}/setAsAvatar/`, {})
                .map(res => res.json())
                .toPromise();

            this.ref.markForCheck();

            this.updateAvatar(data);
            this.refreshPhotoList('refresh');

            let toast = this.toast.create({
                message: this.translate.instant('photo_set_avatar'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            this.ref.markForCheck();

            toast.present();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Update avatar
     */
    protected updateAvatar(avatar: any): void {
        BasePhotoEdit.isAvatarActive = avatar.active;
        BasePhotoEdit.avatarUploaded = true;
        BasePhotoEdit.avatarId = avatar.id;

        BasePhotoEdit.avatarUrl = avatar.pendingUrl;
        BasePhotoEdit.bigAvatarUrl = avatar.pendingBigUrl;

        this.ref.markForCheck();

        // update avatars collection
        this.api.removeAll('avatars', {
            userId: this.auth.getUserId()
        });

        this.api.add('avatars', {
            id: avatar.id,
            userId: avatar.userId,
            url: avatar.url,
            pendingUrl: avatar.pendingUrl,
            bigUrl: avatar.bigUrl,
            pendingBigUrl: avatar.pendingBigUrl,
            active: avatar.active
        });

        this.ref.markForCheck();

        this.events.publish('user:avatarUpdated');
    }

    /**
     * Take photo
     */
    protected async takePhoto(type: PhotoUploaderType, source: PhotoUploaderSource): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // init photo uploader
            if (type == 'avatar') {
                this.photoUploader.url = this.config.getApiUrl() + '/avatars/me/';
                this.photoUploader.maxFileSizeMb = BasePhotoEdit.avatarMaxUploadSize;
            }
            else  {
                this.photoUploader.url = this.config.getApiUrl() + '/photos/';
                this.photoUploader.maxFileSizeMb = BasePhotoEdit.photoMaxUploadSize;
            }

            this.photoUploader.successUploadCallback = (response) => {
                response = JSON.parse(response);

                // refresh avatar collection
                if (type == 'avatar') {
                    this.updateAvatar(response);

                    let toast = this.toast.create({
                        message: this.translate.instant('avatar_has_been_uploaded'),
                        closeButtonText: this.translate.instant('ok'),
                        showCloseButton: true,
                        duration: this.toastDuration
                    });

                    toast.present();
                }
                else {
                    this.api.add('photos', response);

                    let toast = this.toast.create({
                        message: this.translate.instant('photo_has_been_uploaded'),
                        closeButtonText: this.translate.instant('ok'),
                        showCloseButton: true,
                        duration: this.toastDuration
                    });

                    toast.present();
                }

                this.refreshPhotoList('add');
                this.ref.markForCheck();

                loader.dismiss();
            };

            this.photoUploader.startUploadingCallback = () => loader.present();
            this.photoUploader.errorUploadCallback = () => loader.dismiss();

            this.photoUploader.takePicture(source);
        }
        catch (e) {
            loader.dismiss()
        }
    }

    /**
     * Init avatar
     */
    protected initAvatar(avatar: any): void {
        BasePhotoEdit.avatarUrl = avatar.pendingUrl;
        BasePhotoEdit.bigAvatarUrl = avatar.pendingBigUrl;
        BasePhotoEdit.isAvatarActive = avatar.active;
        BasePhotoEdit.avatarUploaded = true;
        BasePhotoEdit.avatarId = avatar.id;

        this.ref.markForCheck();
    }
}
