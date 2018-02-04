import { Injectable } from '@angular/core';
import { ServerEventsChannel } from '../index';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';

@Injectable()
export class PermissionsChannelService implements ServerEventsChannel {
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
        return 'permissions'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedUserPermissions: string[] = [];

        // update user permissions
        data.forEach((permission: any) => {
            this.api.add('permissions', permission);
            updatedUserPermissions.push(permission.id);
        });

        // remove not updated permissions
        this.api.removeAll('permissions', {
            where: {
                id: {
                    'notIn': updatedUserPermissions
                }
            }
        });

        this.events.publish('permissions:updated');
    }
}
