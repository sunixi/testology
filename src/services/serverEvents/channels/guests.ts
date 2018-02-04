import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';

@Injectable()
export class GuestsChannelService implements ServerEventsChannel {
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
        return 'guests'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedGuests: number[] = [];

        // update guests
        data.forEach((guest: any) => {
            this.api.add('guests', guest);
            updatedGuests.push(guest.id);
        });

        // remove not updated guests
        this.api.removeAll('guests', {
            where: {
                id: {
                    'notIn': updatedGuests
                }
            }
        });

        this.events.publish('guests:updated');
    }
}
