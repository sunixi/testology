import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';

@Injectable()
export class HotListChannelService implements ServerEventsChannel {
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
        return 'hotList'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedUsers: number[] = [];

        // update users
        data.forEach((hotListUser: any) => {
            this.api.add('hotListUsers', hotListUser);
            updatedUsers.push(hotListUser.id);
        });

        // remove not updated users
        this.api.removeAll('hotListUsers', {
            where: {
                id: {
                    'notIn': updatedUsers
                }
            }
        });

        this.events.publish('hotList:updated');
    }
}
