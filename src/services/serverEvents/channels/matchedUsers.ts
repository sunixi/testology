import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { Events } from 'ionic-angular';
import { DataStore } from 'js-data';

@Injectable()
export class MatchedUsersChannelService implements ServerEventsChannel {
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
        return 'matchedUsers'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedMatches: number[] = [];

        // update matched users
        data.forEach((match: any) => {
            this.api.add('matchedUsers', match);
            updatedMatches.push(match.id);
        });

        // remove not updated matches
        this.api.removeAll('matchedUsers', {
            where: {
                id: {
                    'notIn': updatedMatches
                }
            }
        });

        this.events.publish('matchedUsers:updated');
    }
}
