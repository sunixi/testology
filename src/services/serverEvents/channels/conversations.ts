import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { Events } from 'ionic-angular';
import { DataStore } from 'js-data';

@Injectable()
export class ConversationsChannelService implements ServerEventsChannel {
    /**
     * Constructor
     */
    constructor(
        private events: Events,
        private api: DataStore) {}

    /**
     * Get channel name
     */
    getChannelName(): string {
        return 'conversations'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedConversations: number[] = [];

        // update conversations
        data.forEach((conversation: any) => {
            this.api.add('conversations', conversation);
            updatedConversations.push(conversation.id);
        });

        // remove not updated conversations
        this.api.removeAll('conversations', {
            where: {
                id: {
                    'notIn': updatedConversations
                }
            }
        });

        // remove messages
        this.api.removeAll('messages', {
            where: {
                conversationId: {
                    'notIn': updatedConversations
                }
            }
        });

        this.events.publish('conversations:updated');
    }
}
