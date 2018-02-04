import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataStore } from 'js-data';
import { Scroll, Events, LoadingController, ToastController, ActionSheetController, NavController, AlertController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { TranslateService } from 'ng2-translate';

// pages
import { MessagesPage } from '../../../messages/index';

@Component({
    selector: 'conversations',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConversationsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('conversationsScroll') scroll: Scroll;
    @Input() public activeComponent: string;

    private pageReady: boolean = false;
    private userNameFilter: string = '';
    private currentConversationsLimit: number;
    private configsUpdatedHandler: () => void;
    private conversationsUpdatedHandler: () => void;
    private matchedUsersUpdatedHandler: () => void;
    private clearScrollHandler: any;

    /**
     * Constructor
     */
    constructor(
        private events: Events,
        private ref: ChangeDetectorRef,
        private loadingCtrl: LoadingController,
        private toast: ToastController,
        private alert: AlertController,
        private translate: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        private keyboard: Keyboard,
        private api: DataStore,
        private navController: NavController)
    {
        this.currentConversationsLimit = this.conversationsLimit;

        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // conversations updated handler
        this.conversationsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // matched users updated handler
        this.matchedUsersUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Get scroll threshold
     */
    get scrollThreshold(): number {
        return this.api.get('configs', 'scrollThreshold').value;
    }

    /**
     * Conversations limit
     */
    get conversationsLimit(): number {
        return this.api.get('configs', 'conversationsLimit').value;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        try {
            this.events.subscribe('configs:updated', this.configsUpdatedHandler);
            this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);
            this.events.subscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);

            // load matches and conversations
            await Promise.all([
                this.api.findAll('matchedUsers'),
                this.api.findAll('conversations')
            ]);

            this.pageReady = true;
            this.ref.markForCheck();
        }
        catch (e) {}
    }

    /**
     * After view init
     */
    ngAfterViewInit() {
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(() => {
            let scrollTop: number = this.scroll._scrollContent.nativeElement.scrollTop;
            let clientHeight: number = this.scroll._scrollContent.nativeElement.clientHeight;
            let scrollHeight: number = this.scroll._scrollContent.nativeElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
                if (this.isCheckLoadMoreActive) {
                    this.loadMoreConversations();
                }
            }
        });
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);

        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    }

    /**
     * Username filter changed
     */
    userNameFilterChanged(): void {
        this.currentConversationsLimit = this.conversationsLimit;
    }

    /**
     * Get matches
     */
    getMatches(): any[] {
        return this.api.filter('matchedUsers', {
            where: {
                displayName: {
                    'likei': `%${this.userNameFilter}%`
                }
            },
            orderBy: [
                ['isNew', 'DESC'], // newest first
                ['createStamp', 'DESC']
            ]});
    }

    /**
     * Get conversations
     */
    getConversations(): any[] {
        return this.api.filter('conversations', {
            where: {
                opponentDisplayName: {
                    'likei': `%${this.userNameFilter}%`
                }
            },
            limit: this.currentConversationsLimit,
            orderBy: [
                ['isRead', 'ASC'], // not read first
                ['lastMessageTimestamp', 'DESC']
            ]});
    }

    /**
     * Show conversation actions
     */
    showConversationActions(conversation: any): void {
        let buttons: any[] = [];

        // block (unblock) opponent
        if (!conversation.opponentBlocked) {
            buttons.push({
                text: this.translate.instant('block_profile'),
                handler: () => {
                    let buttons: any[] = [{
                        text: this.translate.instant('no')
                    }, {
                        text: this.translate.instant('yes'),
                        handler: () => this.blockUser(conversation.opponentId)
                    }];

                    let confirm = this.alert.create({
                        message: this.translate.instant('block_profile_confirmation'),
                        buttons: buttons
                    });

                    confirm.present();
                }
            });
        }
        else {
            buttons.push({
                text: this.translate.instant('unblock_profile'),
                handler: () => this.unblockUser(conversation.opponentId)
            });
        }

        // delete conversation
        buttons.push({
            text: this.translate.instant('delete_conversation'),
            handler: () => {
                let buttons: any[] = [{
                    text: this.translate.instant('no')
                }, {
                    text: this.translate.instant('yes'),
                    handler: () => this.deleteConversation(conversation.id)
                }];

                let confirm = this.alert.create({
                    message: this.translate.instant('delete_conversation_confirmation'),
                    buttons: buttons
                });

                confirm.present();
            }
        });

        // mark read/unread conversation
        buttons.push({
            text: conversation.isRead
                ? this.translate.instant('mark_unread_conversation')
                : this.translate.instant('mark_read_conversation'),
            handler: () => this.markConversation(conversation.id, conversation.isRead)
        });

        let actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });

        actionSheet.present();
    }

    /**
     * Close keyboard
     */
    closeKeyboard(): void {
        this.keyboard.close();
    }

    /**
     * Show chat
     */
    showChat(userId: number, conversationId?: number): void {
        this.navController.push(MessagesPage, {
            userId: userId,
            conversationId: conversationId
        });
    }

    /**
     * Load more conversations
     */
    loadMoreConversations(): void {
        this.currentConversationsLimit += this.conversationsLimit;
        this.ref.markForCheck();
    }

    /**
     * Is check load more active
     */
    get isCheckLoadMoreActive(): boolean {
        if (this.activeComponent == 'conversations') {
            let conversations: any[] = this.api.filter('conversations', {
                where: {
                    opponentDisplayName: {
                        'likei': `%${this.userNameFilter}%`
                    }
                }});

            if (conversations.length > this.currentConversationsLimit) {
                return true;
            }
        }

        return false;
    }

    /**
     * Mark conversation
     */
    protected async markConversation(conversationId: number, isRead: boolean): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.update('conversations', conversationId, {
                isRead: !isRead
            });

            this.ref.markForCheck();

            let toast = this.toast.create({
                message: isRead
                    ? this.translate.instant('conversation_has_been_marked_as_unread')
                    : this.translate.instant('conversation_has_been_marked_as_read'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Delete conversation
     */
    protected async deleteConversation(conversationId: number): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.destroy('conversations', conversationId);

            // remove messages from storage
            this.api.removeAll('messages', {
                conversationId: conversationId
            });

            this.ref.markForCheck();

            let toast = this.toast.create({
                message: this.translate.instant('conversation_has_been_deleted'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Unblock user
     */
    protected async unblockUser(userId: number): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.getMapper('blocks').destroy(userId);

            this.ref.markForCheck();

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
        }
    }

    /**
     * Block user
     */
    protected async blockUser(userId: number): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();
            await this.api.getMapper('blocks').create({
                userId: userId
            });

            this.ref.markForCheck();

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
            loader.dismiss();
        }
    }
}
