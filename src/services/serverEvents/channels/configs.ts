import { Injectable} from '@angular/core';
import { ServerEventsChannel } from '../index';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';

@Injectable()
export class ConfigsChannelService implements ServerEventsChannel {
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
        return 'configs'
    }

    /**
     * Apply changes
     */
    applyChanges(data: any[]): void {
        let updatedConfigs: string[] = [];

        // update configs
        data.forEach((config: any) => {
            this.api.add('configs', config);
            updatedConfigs.push(config.id);
        });

        // remove not updated configs
        this.api.removeAll('configs', {
            where: {
                id: {
                    'notIn': updatedConfigs
                }
            }
        });

        this.events.publish('configs:updated');
    }
}
