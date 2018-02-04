import { Injectable, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// services
import { ConfigService } from '../../services/config/index';
import { AuthService } from '../../services/auth/index';

// channels
import { ConfigsChannelService } from './channels/configs';
import { PermissionsChannelService } from './channels/permissions';
import { ConversationsChannelService } from './channels/conversations';
import { MatchedUsersChannelService } from './channels/matchedUsers';
import { MessagesChannelService } from './channels/messages';
import { GuestsChannelService } from './channels/guests';
import { HotListChannelService } from './channels/hotList';

declare var EventSource: any;

@Injectable()
export class ServerEventsService {
    private isEventsStarted: boolean = false;
    private channels: ServerEventsChannel[] = [];
    private eventSource: any;
    private httpErrorHandler: () => void;
    private reconnectTimeout: number = 10000;
    private reconnectHandler: any;

    /**
     * Constructor
     */
    constructor(
        private translate: TranslateService,
        private ngZone: NgZone,
        private auth: AuthService,
        private config: ConfigService,
        private events: Events,
        private configsChannel: ConfigsChannelService,
        private permissionsChannel: PermissionsChannelService,
        private conversationsChannel: ConversationsChannelService,
        private matchedUsersChannel: MatchedUsersChannelService,
        private messagesChannel: MessagesChannelService,
        private guestsChannel: GuestsChannelService,
        private hotListChannel: HotListChannelService)
    {
        // register channels
        this.channels.push(this.configsChannel);
        this.channels.push(this.permissionsChannel);
        this.channels.push(this.conversationsChannel);
        this.channels.push(this.matchedUsersChannel);
        this.channels.push(this.messagesChannel);
        this.channels.push(this.guestsChannel);
        this.channels.push(this.hotListChannel);

        // -- init callbacks --//

        // http error occurred handler
        this.httpErrorHandler = (): void => {
            this.stop();
        };
    }

    /**
     * Start
     */
    start(): void {
        if (!this.isEventsStarted) {
            this.isEventsStarted = true;

            if (this.reconnectHandler) {
                clearTimeout(this.reconnectHandler);
            }

            // subscribe to some system events
            this.events.subscribe('http:error', this.httpErrorHandler);

            let appLang = this.translate.currentLang
                ? this.translate.currentLang
                : this.translate.getDefaultLang();

            let url = this.auth.isAuthenticated()
                ? this.config.getApiUrl() + `/server-events/user/${this.auth.getToken()}/?api-language=${appLang}`
                : this.config.getApiUrl() + `/server-events/?api-language=${appLang}`;

            // init connection
            this.eventSource = new EventSource(url);
            this.eventSource.onmessage = (response: any) => {
                let data: {channel: string, data: any} = JSON.parse(response.data);

                if (data.channel) {
                    let channel: ServerEventsChannel = this.channels.find((channel: ServerEventsChannel) => {
                        return data.channel == channel.getChannelName()
                    });

                    // do we have a received channel?
                    if (channel) {
                        this.ngZone.run(() => channel.applyChanges(data.data));
                    }
                }
            };

            // connection error
            this.eventSource.onerror = (e) => {
                if (e.readyState != EventSource.CONNECTING) {
                    this.ngZone.runOutsideAngular(() => this.reconnectHandler = setTimeout(() => this.restart(), this.reconnectTimeout));
                }
            };

        }
    }

    /**
     * Restart
     */
    restart(): void {
        this.stop();
        this.start();
    }

    /**
     * Stop
     */
    stop(): void {
        if (this.isEventsStarted) {
            this.isEventsStarted = false;
            this.events.unsubscribe('http:error', this.httpErrorHandler);

            this.eventSource.close();
        }
    }
}

export interface ServerEventsChannel {
    /**
     * Get channel name
     */
    getChannelName(): string;

    /**
     * Apply changes
     */
    applyChanges(data: any): void;
}