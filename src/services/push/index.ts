import { Device as NativeDevice } from '@ionic-native/device';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { PushObject, Push } from '@ionic-native/push';
import { DataStore } from 'js-data';

// services
import { AuthService } from '../auth/index'
import { ConfigService } from '../../services/config/index';
import { SecureHttpService} from '../http/index'

@Injectable()
export class PushNotificationsService {
    private pushObject: PushObject = null;
    private http: SecureHttpService;
    private language: string;

    /**
     * Constructor
     */
    constructor(
        private api: DataStore,
        private auth: AuthService,
        private config: ConfigService,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private nativeDevice: NativeDevice,
        private push: Push)
    {
        this.http = http;
    }

    /**
     * Init
     */
    init(language: string): void {
        // destroy previously created push object
        this.clearPushObject();

        this.language = language;
    }

    /**
     * Subscribe
     */
     subscribe(callback: (notification: any) => void, context: any): void {
        try {
            // create a push object
            if (!this.pushObject) {
                this.pushObject = this.createPushObject();
            }

            // notification
            this.pushObject.on('notification').subscribe((notification: any) => {
                if (this.pushConfig.enabled) {
                    let notificationCallback = callback.bind(context);

                    notificationCallback(notification);
                }
            });

            // push registration
            this.pushObject.on('registration').subscribe(async (registration: any): Promise<any> => {
                try {
                    let data = {
                        userId: this.auth.getUserId(),
                        uuid: this.nativeDevice.uuid,
                        token: registration['registrationId'],
                        platform: this.nativeDevice.platform,
                        properties: {
                            lang: this.language
                        }
                    };

                    await this.http.post(this.config.getApiUrl() + '/device/', data).subscribe();
                }
                catch (e) {}
            });
        }
        catch (e) {}
    }

    /**
     * Unsubscribe
     */
    unsubscribe(): void {
        this.clearPushObject();
    }

    /**
     * Clear push object
     */
    private async clearPushObject(): Promise<any> {
        if (this.pushObject) {
            await this.pushObject.unregister();

            this.pushObject = null;
        }
    }

    /**
     * Create push object
     */
    private createPushObject(): PushObject {
        return this.push.init({
            android: {
                senderID: this.pushConfig.senderID,
            },
            ios: {
                alert: "true",
                badge: "false",
                sound: "false"
            },
            windows: {}
        });
    }

    /**
     * Get push config
     */
    private get pushConfig(): {enabled: boolean, senderID: string} {
        return this.api.get('configs', 'pushNotificationsConfig').value;
    }
}
