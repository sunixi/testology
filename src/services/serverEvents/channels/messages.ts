import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { Events } from 'ionic-angular';
import { DataStore } from 'js-data';

@Injectable()
export class MessagesChannelService implements ServerEventsChannel {
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
        return 'messages'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        if (data.length) {
            let updatedMessages: any = {
                newMessages: [],
                updatedMessages: []
            };

            data.forEach((message: any) => {
                let oldMessage: any = this.api.filter('messages', {where: {
                    id: message.id
                }});

                let messageInfo: any = {
                    id: message.id,
                    conversationId: message.conversationId
                };

                oldMessage.length
                    ? updatedMessages.updatedMessages.push(messageInfo)
                    : updatedMessages.newMessages.push(messageInfo);

                this.api.add('messages', message);
            });

            this.events.publish('messages:updated', updatedMessages);
        }
    }
}
