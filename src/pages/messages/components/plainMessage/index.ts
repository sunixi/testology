import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, AlertController, NavController, Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { DataStore } from 'js-data';
import { PhotoViewer } from '@ionic-native/photo-viewer';

// services
import { PermissionsService } from '../../../../services/permissions/index';
import { PhotoUploaderService } from '../../../../services/photoUploader/index';
import { ConfigService } from '../../../../services/config/index';

// pages
import { InappsPage } from '../../../../pages/inapps/index';

@Component({
    selector: 'plain-message',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        PhotoUploaderService
    ]
})

export class PlainMessageComponent implements OnInit, OnDestroy {
    @Input() message: any;
    @Input() prevMessage: any;
    @Output() messageDeleted: EventEmitter<any> = new EventEmitter();
    @Output() messageDelivered: EventEmitter<any> = new EventEmitter();
    @Output() messageTracked: EventEmitter<any> = new EventEmitter();

    private isMessageOpening: boolean = false;
    private isSendingInProcess: boolean = false;
    private messageSendFailedHandler: () => void;
    private permissionsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private ref: ChangeDetectorRef,
        private events: Events,
        private photoViewer: PhotoViewer,
        private config: ConfigService,
        private photoUploader: PhotoUploaderService,
        private permissions: PermissionsService,
        private nav: NavController,
        private api: DataStore,
        private alert: AlertController,
        private actionSheetCtrl: ActionSheetController,
        private translate: TranslateService)
    {
        // -- init callbacks --//

        // send message failed handler
        this.messageSendFailedHandler = (): void => {
            this.ref.markForCheck();
        };

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
     ngOnInit(): void {
        this.events.subscribe('message:sendFailed', this.messageSendFailedHandler);
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('message:sendFailed', this.messageSendFailedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
    }

    /**
     * Show message
     */
    async showMessage(): Promise<any> {
        try {
            this.isMessageOpening = true;

            await this.api.find('messages', this.message.id, {
                force: true,
                forceHandleError: true
            });

            this.messageTracked.emit(this.message.id);
        }
        catch (e) {
        }
        finally {
            this.isMessageOpening = false;
        }
    }

    /**
     * Is read message allowed
     */
    get isReadMessageAllowed(): boolean {
        return this.message.wasAuthorized
            || this.permissions.isActionAllowed('mailbox_read_chat_message');
    }

    /**
     * Is read message allowed after tracking
     */
    get isReadMessageAllowedAfterTracking(): boolean {
        return this.permissions.isAllowedAfterTracking('mailbox_read_chat_message');
    }

    /**
     * Is read message promoted
     */
    get isReadMessagePromoted(): boolean {
        return this.permissions.isActionPromoted('mailbox_read_chat_message');
    }

    /**
     * Show purchases page
     */
    showPurchasesPage(): void {
        this.nav.push(InappsPage);
    }

    /**
     * View photo
     */
    viewPhoto(url: string): void {
        this.photoViewer.show(url);
    }

    /**
     * Show message action
     */
    showMessageActions(): void {
        let buttons: any[] = [];

        // delete message
        buttons.push({
            text: this.translate.instant('delete_message'),
            handler: () => {
                let buttons: any[] = [{
                    text: this.translate.instant('no')
                }, {
                    text: this.translate.instant('yes'),
                    handler: () => this.deleteMessage()
                }];

                let confirm = this.alert.create({
                    message: this.translate.instant('delete_message_confirmation'),
                    buttons: buttons
                });

                confirm.present();
            }
        });

        // resend message
        buttons.push({
            text: this.translate.instant('resend_message'),
            handler: () => this.resendMessage()
        });

        let actionSheet = this.actionSheetCtrl.create({
            subTitle: this.message.notDeliveredDesc ? this.message.notDeliveredDesc : '',
            buttons: buttons
        });

        actionSheet.present();
    }

    /**
     * Delete message
     */
    protected deleteMessage(): void {
        this.api.remove('messages', this.message.id);
        this.ref.markForCheck();

        this.messageDeleted.emit(this.message.id);
    }

    /**
     * Resend message
     */
    protected resendMessage(): void {
        if (!this.message.attachments.length) {
            this.resendTextMessage();

            return;
        }

        // get not delivered photo
        let photo: any = this.message.attachments[0];

        this.resendPhotoMessage(photo.fileName, photo.downloadUrl);
    }

    /**
     * Resend text message
     */
    protected async resendTextMessage(): Promise<any> {
        try {
            this.message.deliverInProcess = true;
            this.isSendingInProcess = true;
            this.ref.markForCheck();

            let newMessage: any = await this.api.create('messages', {
                opponentId: this.message.opponentId,
                text: this.message.text,
                conversationId: this.message.conversationId,
                timeStamp: this.message.timeStamp
            });

            this.deleteMessage();
            this.messageDelivered.emit(newMessage);
            this.isSendingInProcess = false;
            this.ref.markForCheck();
        }
        catch (e) {
            this.message.deliverInProcess = false;
            this.isSendingInProcess = false;
            this.ref.markForCheck();

            // update error description
            if (e.response && e.response.data) {
                let errorDescription: string = e.response.data.shortDescription;

                if (errorDescription) {
                    this.message.notDeliveredDesc = errorDescription;

                    return;
                }

                this.message.notDeliveredDesc = '';
            }

            this.ref.markForCheck();
        }
    }

    /**
     * Resend photo message
     */
    protected resendPhotoMessage(imageName: string, imagePath: string): void {
        this.message.deliverInProcess = true;
        this.isSendingInProcess = true;
        this.ref.markForCheck();

        // init photo uploader
        this.photoUploader.url =  this.config.getApiUrl() + '/mailbox/photo-messages/?';
        this.photoUploader.url += `opponentId=${this.message.opponentId}&`;
        this.photoUploader.url += `conversationId=${this.message.conversationId}&`;

        // photo successfully uploaded
        this.photoUploader.successUploadCallback = (newMessage: any) => {
            newMessage = JSON.parse(newMessage);

            this.deleteMessage();
            this.api.add('messages', newMessage);
            this.isSendingInProcess = false;
            this.ref.markForCheck();

            this.messageDelivered.emit(newMessage);
        };

        // uploading failed
        this.photoUploader.errorUploadCallback = (error: {type: string, message: string}) => {
            this.message.deliverInProcess = false;
            this.isSendingInProcess = false;
            this.ref.markForCheck();

            // update error description
            if (error.message) {
                let errorParams: any = JSON.parse(error.message);

                if (errorParams.shortDescription) {
                    this.message.notDeliveredDesc = errorParams.shortDescription;

                    return;
                }

                this.message.notDeliveredDesc = '';
            }

            this.ref.markForCheck();
        };

        // trying to upload photo
        this.photoUploader.uploadImage(imageName, imagePath);
    }
}
