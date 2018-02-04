import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController, Content, NavParams, Events, InfiniteScroll, ActionSheetController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// services
import { PermissionsService } from '../../services/permissions/index';
import { HttpErrorHandlerService } from '../../services/http/errorHandler';
import { SecureHttpService } from '../../services/http/index';
import { ConfigService } from '../../services/config/index';
import { PhotoUploaderService } from '../../services/photoUploader/index';

// pages
import { DashboardPage } from '../dashboard/index';
import { ProfileViewPage } from '../profile/view/index';

// types
import { PhotoUploaderSource } from '../../services/photoUploader/index';

@Component({
    selector: 'messages',
    templateUrl: 'index.html',
    providers: [
        PhotoUploaderService
    ]
})

export class MessagesPage implements AfterViewChecked {
    @ViewChild(Content) content: Content;
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll = null;

    private userId: number;
    private user: any;
    private conversationId: number = 0;
    private isConversationEmpty: boolean = true;
    private pageReady: boolean = false;
    private message: string = '';
    private needToScrollContent: boolean = false;
    private contentScrolled: boolean = false;
    private fetchHistory: boolean = true;
    private messages: any[] = [];
    private unreadMessageId: number = 0;
    private permissionsUpdatedHandler: () => Promise<any>;
    private conversationsUpdatedHandler: () => Promise<any>;
    private messagesUpdatedHandler: (updatedMessages: {newMessages: any[], updatedMessages: any[]}) => void;

    /**
     * Constructor
     */
    constructor(
        private nav: NavController,
        private toast: ToastController,
        private alert: AlertController,
        private photoUploader: PhotoUploaderService,
        private translate: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        private config: ConfigService,
        private http: SecureHttpService,
        private events: Events,
        private httpErrorHandler: HttpErrorHandlerService,
        private loadingCtrl: LoadingController,
        private permissions: PermissionsService,
        private navParams: NavParams,
        private api: DataStore)
    {
        this.userId = this.navParams.get('userId');
        this.conversationId = this.navParams.get('conversationId');

        // try to find user's conversation
        if (!this.conversationId) {
            let conversation: any = this.getConversation();

            if (conversation) {
                this.conversationId = conversation.id;
            }
        }

        // -- init callbacks --//

        // permissions updated handler
        this.permissionsUpdatedHandler = async (): Promise<any> => {
            if (this.permissions.isActionAllowed('mailbox_read_chat_message') && this.checkForEmptyMessages()) {
                await this.loadMessages(true);

                // mark conversation as read
                if (!this.checkForEmptyMessages()) {
                    this.markConversationAsRead();
                }

                // mark messages as read
                this.markMessagesAsRead();
            }
        };

        // conversations updated handler
        this.conversationsUpdatedHandler = async (): Promise<any> => {
            this.markAsReadOutcomigMessages();
            this.setMessages();

            if (!this.messages.length) {
                this.isConversationEmpty = true;
            }
        };

        // messages updated handler
        this.messagesUpdatedHandler = (updatedMessages: {newMessages: any[], updatedMessages: any[]}) => {
            if (this.conversationId) {
                let isThereNewMessages: boolean = false;
                let isThereUpdatedMessages: boolean = false;

                // check for new messages
                updatedMessages.newMessages.every((message: any) => {
                    if (message.conversationId == this.conversationId) {
                        isThereNewMessages = true;

                        return false;
                    }

                    return true;
                });

                // check for updated messages
                updatedMessages.updatedMessages.every((message: any) => {
                    if (message.conversationId == this.conversationId) {
                        isThereUpdatedMessages = true;

                        return false;
                    }

                    return true;
                });

                if (isThereNewMessages || isThereUpdatedMessages) {
                    this.setMessages();

                    if (isThereNewMessages) {
                        this.needToScrollContent = true;

                        // mark conversation as read
                        if (!this.checkForEmptyMessages()) {
                            this.markConversationAsRead();
                        }

                        // mark messages as read
                        this.markMessagesAsRead();
                    }
                }
            }
        }
    }

    /**
     * Page will be active
     */
     ionViewWillEnter(): void {
        // don't handle http errors
        this.httpErrorHandler.setHandleHttpErrors(false);

        // refresh messages list
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

        // change status of outcoming messages
        this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);

        // new messages
        this.events.subscribe('messages:updated', this.messagesUpdatedHandler);
    }

    /**
     * Page will leave
     */
    ionViewWillLeave(): void {
        this.httpErrorHandler.setHandleHttpErrors(true);

        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('messages:updated', this.messagesUpdatedHandler);

        this.fetchHistory = false;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        this.setMessages();

        this.permissions.isActionAllowed('mailbox_read_chat_message') && this.checkForEmptyMessages()
            ? await this.loadMessages(true) // force to load new messages
            : await this.loadMessages();

        // mark conversation as read
        if (this.messages.length && !this.checkForEmptyMessages()) {
            this.markConversationAsRead();
        }

        // mark user match as viewed
        if (this.user.matchActions.isMutual && this.user.matchActions.isNew) {
            this.markMatchedUser();
        }

        this.markMessagesAsRead();
    }

    /**
     * View rendered
     */
    async ngAfterViewChecked(): Promise<any> {
        // scroll content to bottom
        if (this.needToScrollContent) {
            this.needToScrollContent = false;

            await this.content.scrollToBottom();
            this.contentScrolled = true;
        }
    }

    /**
     * Set messages
     */
    setMessages(): void {
        this.messages = this.api.filter('messages', {
            where: {
                conversationId: this.conversationId
            }, orderBy: [
                ['timeStamp', 'ASC']
            ]});
    }

    /**
     * Message tracked
     */
    messageTrackedEvent(): void {
        this.setMessages();

        if (!this.checkForEmptyMessages()) {
            this.markConversationAsRead();
        }

        this.markMessagesAsRead();
    }

    /**
     * Message deleted
     */
    messageDeletedEvent(): void {
        this.setMessages();

        if (!this.messages.length) {
            this.isConversationEmpty = true;
        }
    }

    /**
     * Message delivered
     */
    messageDeliveredEvent(message: any): any {
        this.setMessages();

        if (!this.conversationId) {
            this.isConversationEmpty = false;
            this.conversationId = message.conversationId;
        }
    }

    /**
     * Load more messages
     */
    async loadMoreMessages(): Promise<any> {
        if (this.messages) {
            try {
                let url: string = this.config.getApiUrl()
                    + `/mailbox/messages/history/?beforeMessageId=${this.messages[0].id}&conversationId=${this.conversationId}&limit=${this.messagesLimit}`;

                let oldMessages: any[] = await this.http.get(url, true)
                    .map(res => res.json())
                    .toPromise();

                if (!oldMessages.length) {
                    this.fetchHistory = false;

                    if (this.infiniteScroll) {
                        this.infiniteScroll.complete();
                        this.infiniteScroll.enable(false);
                    }

                    return;
                }

                oldMessages.forEach((message) => this.api.add('messages', message));

                this.setMessages();
                this.findUnreadMessageId();
                this.markMessagesAsRead();
            }
            catch (e) {
            }
        }

        if (this.infiniteScroll) {
            this.infiniteScroll.complete();
        }
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Get messages limit
     */
    get messagesLimit(): number {
        return this.api.get('configs', 'messagesLimit').value;
    }

    /**
     * Attach max upload size
     */
     get attachMaxUploadSize(): number {
        return this.api.get('configs', 'attachMaxUploadSize').value;
     }

    /**
     * Is check load more active
     */
    get isCheckLoadMoreActive(): boolean {
        return this.contentScrolled && this.fetchHistory
            && this.conversationId && this.messages.length >= this.messagesLimit;
    }

    /**
     * Is send message area allowed
     */
    get isSendMessageAreaAllowed(): boolean {
        // continue the conversation
        if (this.conversationId && !this.isConversationEmpty) {
            return this.permissions.isActionAllowed('mailbox_reply_to_chat_message')
                    || this.permissions.isActionPromoted('mailbox_reply_to_chat_message');
        }

        // start a new conversation
        return this.permissions.isActionAllowed('mailbox_send_chat_message')
            || this.permissions.isActionPromoted('mailbox_send_chat_message');
    }

    /**
     * Is send message area promoted
     */
    get isSendMessageAreaPromoted(): boolean {
        // continue the conversation
        if (this.conversationId && !this.isConversationEmpty) {
            return this.permissions.isActionPromoted('mailbox_reply_to_chat_message');
        }

        // start a new conversation
        return this.permissions.isActionPromoted('mailbox_send_chat_message');
    }

    /**
     * Is message valid
     */
    get isMessageValid(): boolean {
        return this.message.trim() != '' || this.isSendMessageAreaPromoted;
    }

    /**
     * Show conversation actions
     */
    showConversationActions(): void {
        let buttons: any = [];

        buttons.push({
            text: this.user.blocks.isBlocked
                ? this.translate.instant('unblock_profile')
                : this.translate.instant('block_profile'),
            handler: () => {
                // unblock profile
                if (this.user.blocks.isBlocked) {
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
        });

        if (this.conversationId) {
            // delete conversation
            buttons.push({
                text: this.translate.instant('delete_conversation'),
                handler: () => {
                    let buttons: any[] = [{
                        text: this.translate.instant('no')
                    }, {
                        text: this.translate.instant('yes'),
                        handler: () => this.deleteConversation()
                    }];

                    let confirm = this.alert.create({
                        message: this.translate.instant('delete_conversation_confirmation'),
                        buttons: buttons
                    });

                    confirm.present();
                }
            });

            // mark as unread conversation
            buttons.push({
                text: this.translate.instant('mark_unread_conversation'),
                handler: () => this.markConversationAsUnread()
            });
        }

        let actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });

        actionSheet.present();
    }

    /**
     * Show upload image actions
     */
     showUploadImageActions(): void {
        // check send message permission
        if (this.isSendMessageAreaPromoted) {
            this.permissions.showAccessDeniedAlert();

            return;
        }

        let buttons: any = [];

        buttons.push({
            text: this.translate.instant('take_photo'),
            handler: () => this.sendImage('camera')
        });

        buttons.push({
            text: this.translate.instant('choose_photo_from_library'),
            handler: () => this.sendImage('library')
        });

        let actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });

        actionSheet.present();
     }

    /**
     * Send message
     */
    async sendMessage(): Promise<any> {
        // check send message permission
        if (this.isSendMessageAreaPromoted) {
            this.permissions.showAccessDeniedAlert();

            return;
        }

        let fakeMessage: any = this.getFakeMessage(this.message);

        try {
            this.unreadMessageId = 0;

            // create a fake message
            this.isConversationEmpty = false;
            this.api.add('messages', fakeMessage);

            this.setMessages();

            this.message = '';
            this.needToScrollContent = true;

            // create a real message
            let newMessage: any = await this.api.create('messages', Object.assign({}, fakeMessage));

            if (!this.conversationId) {
                this.conversationId = newMessage.conversationId;
            }

            newMessage.deliverInProcess = false;
            this.api.add('messages', newMessage);

            // remove previously created fake message
            this.api.remove('messages', fakeMessage.id);
            this.setMessages();

            this.needToScrollContent = true;
        }
        catch (e) {
            // mark message as not delivered
            fakeMessage.notDelivered = true;
            fakeMessage.deliverInProcess = false;

            if (e.response && e.response.data) {
                let errorDescription: string = e.response.data.shortDescription;

                if (errorDescription) {
                    fakeMessage.notDeliveredDesc = errorDescription;
                }
            }

            // update fake message
            this.api.add('messages', fakeMessage);
            this.setMessages();

            this.events.publish('message:sendFailed');
        }
    }

    /**
     * Get system message type
     */
    getSystemMessageType(text: string): any {
        let params: any = JSON.parse(text);

        if (params.entityType) {
            return params.entityType;
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
     * Send image
     */
    private async sendImage(source: PhotoUploaderSource): Promise<any> {
        let fakeMessage: any = this.getFakeMessage();

        try {
            this.unreadMessageId = 0;

            // init photo uploader
            this.photoUploader.maxFileSizeMb =  this.attachMaxUploadSize;
            this.photoUploader.url =  this.config.getApiUrl() + '/mailbox/photo-messages/?';
            this.photoUploader.url += `opponentId=${this.userId}&`;
            this.photoUploader.url += `conversationId=${this.conversationId}`;

            // photo successfully uploaded
            this.photoUploader.successUploadCallback = (newMessage: any) => {
                newMessage = JSON.parse(newMessage);

                if (!this.conversationId) {
                    this.conversationId = newMessage.conversationId;
                }

                this.api.add('messages', newMessage);

                // remove previously created fake message
                this.api.remove('messages', fakeMessage.id);
                this.setMessages();

                this.needToScrollContent = true;
            };

            // start uploading image
            this.photoUploader.photoCopiedCallback = (image: {name: string, path: string}) => {
                // create a fake message
                fakeMessage.attachments.push({
                    fileName: image.name,
                    downloadUrl: image.path,
                    type: 'image'
                });

                // create a fake message
                this.isConversationEmpty = false;
                this.api.add('messages', fakeMessage);

                this.setMessages();
                this.needToScrollContent = true;
            };

            // uploading failed
            this.photoUploader.errorUploadCallback = (error: {type: string, message: string}) => {
                // retry to send again
                if (PhotoUploaderService.ERROR_UPLOADING_FILE == error.type) {
                    // mark message as not delivered
                    fakeMessage.notDelivered = true;
                    fakeMessage.deliverInProcess = false;

                    if (error.message) {
                        let errorParams: any = JSON.parse(error.message);

                        if (errorParams.shortDescription) {
                            fakeMessage.notDeliveredDesc = errorParams.shortDescription;
                        }
                    }

                    // update fake message
                    this.api.add('messages', fakeMessage);
                    this.setMessages();
                    this.events.publish('message:sendFailed');
                }
            };

            this.photoUploader.takePicture(source);
        }
        catch(e) {}
    }

    /**
     * Check for empty messages
     */
    private checkForEmptyMessages(): boolean {
        let isThereEmptyMessage: boolean = false;

        this.messages.every((message) => {
            if (!message.text.trim() && !message.attachments.length && !message.newMessage) {
                isThereEmptyMessage = true;

                return false;
            }

            return true;
        });

        return isThereEmptyMessage;
    }

    /**
     * Load messages
     */
    private async loadMessages(forceToLoad: boolean = false): Promise<any> {
        let loader = this.loadingCtrl.create();
        this.pageReady = false;

        try {
            await loader.present();

            // load messages
            if (this.conversationId) {
                let limit: number = this.messages.length > this.messagesLimit
                    ? this.messages.length
                    : this.messagesLimit;

                // load user data and list of messages
                [this.user] = await Promise.all([
                    this.api.getMapper('users').find(this.userId, {
                        params: {
                            with: ['blocks', 'avatar', 'matchActions']
                        }
                    }),
                    this.api.findAll('messages', {
                        conversationId: this.conversationId,
                        limit: limit
                    }, {
                        force: forceToLoad,
                        forceHandleError: true
                    })
                ]);

                this.setMessages();
                this.findUnreadMessageId();
            }
            else {
                // load user data
                this.user = await this.api.getMapper('users').find(this.userId, {
                    params: {
                        with: ['blocks', 'avatar', 'matchActions']
                    }
                });
            }

            if (this.messages.length) {
                this.isConversationEmpty = false;
            }

            loader.dismiss();

            this.pageReady = true;
            this.needToScrollContent = true;
        }
        catch (e) {
            loader.dismiss();
        }
    }


    /**
     * mark conversation as read
     */
    private async markConversationAsRead(): Promise<any> {
        try {
            let conversation: any = this.getConversation();

            if (conversation && !conversation.isRead) {
                await this.api.update('conversations', conversation.id, {
                    isRead: true
                }, {
                    forceHandleError: true
                });
            }
        }
        catch (e) {}
    }

    /**
     * Get fake messge
     */
    private getFakeMessage(message: string = ''): Object {
        let timeStamp: number = Math.floor(Date.now() / 1000);

        return  {
            id: timeStamp,
            isAuthor: true,
            opponentId: this.userId,
            text: message,
            conversationId: this.conversationId,
            timeStamp: timeStamp,
            deliverInProcess: true,
            notDelivered: false,
            notDeliveredDesc: '',
            wasAuthorized: true,
            newMessage: true,
            attachments: []
        };
    }

    /**
     * Get conversation
     */
    private getConversation(): any {
        let conversation: any[] = this.api.filter('conversations', {
            where: {
                opponentId: this.userId
            }});

        if (conversation[0]) {
            return conversation[0];
        }
    }

    /**
     * Mark as read outcoming messages
     */
    private markAsReadOutcomigMessages(): void {
        // get current conversation
        let conversation: any = this.getConversation();

        if (conversation && conversation.opponentIsRead) {
            // get not read outcoming messages
            let messages: any[] = this.api.filter('messages', {
                where: {
                    conversationId: conversation.id,
                    isAuthor: true,
                    recipientRead: false,
                    newMessage: false
                }});

            let updateMessages: boolean = false;

            // mark messages as read by recipient
            messages.forEach((message: any) => {
                message.recipientRead = true;
                updateMessages = true;
            });

            if (updateMessages) {
                this.setMessages();
            }
        }
    }

    /**
     * Mark matched user
     */
    private async markMatchedUser(): Promise<any> {
        try {
            await this.api.update('matchedUsers', this.user.matchActions.id, {
                isNew: false
            });
        }
        catch(e) {}
    }

    /**
     * Mark messages as read
     */
    private async markMessagesAsRead(): Promise<any> {
        try {
            if (this.conversationId) {
                let messages:any[] = this.api.filter('messages', {
                    where: {
                        conversationId: this.conversationId,
                        isAuthor: false,
                        recipientRead: false,
                        text: {
                            '!=': ''
                        }
                    }
                });

                let needToUpdate:any[] = [];

                messages.forEach((message:any) => {
                    needToUpdate.push({
                        id: message.id
                    });
                });

                if (needToUpdate.length) {
                    await this.api.updateAll('messages', needToUpdate, {}, {
                        forceHandleError: true
                    });

                    this.setMessages();
                }
            }
        }
        catch(e) {}
    }

    /**
     * Find unread message id
     */
    private findUnreadMessageId(): void {
        if (this.conversationId) {
            let message: any[] = this.api.filter('messages', {
                where: {
                    conversationId: this.conversationId,
                    isAuthor: false,
                    recipientRead: false,
                    newMessage: false
                },
                limit: 1,
                orderBy: [
                    ['timeStamp', 'ASC']
                ]
            });

            if (message[0]) {
                this.unreadMessageId = message[0].id;
            }
        }
    }

    /**
     * Block user
     */
    private async blockUser(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            this.user.blocks.isBlocked = true;

            await loader.present();
            await this.api.getMapper('blocks').create({
                userId: this.userId
            }, {
                forceHandleError: true
            });

            let toast = this.toast.create({
                message: this.translate.instant('profile_blocked'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
            loader.dismiss();
        }
        catch (e) {
            this.user.blocks.isBlocked = false;
            loader.dismiss();
        }
    }

    /**
     * Unblock user
     */
    private async unblockUser(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            this.user.blocks.isBlocked = false;

            await loader.present();
            await this.api.getMapper('blocks').destroy(this.user.id, {
                forceHandleError: true
            });

            let toast = this.toast.create({
                message: this.translate.instant('profile_unblocked'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
            this.user.blocks.isBlocked = true;
        }
    }

    /**
     * Delete conversation
     */
    private async deleteConversation(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.destroy('conversations', this.conversationId, {
                forceHandleError: true
            });

            // remove messages from storage
            this.api.removeAll('messages', {
                conversationId: this.conversationId
            });

            loader.dismiss();

            let toast = this.toast.create({
                message: this.translate.instant('conversation_has_been_deleted'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            this.nav.setRoot(DashboardPage, {
                component: 'conversations'
            });
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Mark conversation as unread
     */
    private async markConversationAsUnread(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.update('conversations', this.conversationId, {
                isRead: false
            }, {
                forceHandleError: true
            });

            loader.dismiss();

            let toast = this.toast.create({
                message: this.translate.instant('conversation_has_been_marked_as_unread'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            this.nav.setRoot(DashboardPage, {
                component: 'conversations'
            });
        }
        catch (e) {
            loader.dismiss();
        }
    }
}
