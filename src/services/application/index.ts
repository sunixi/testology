import { Injectable, Inject, forwardRef } from '@angular/core';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';
import { Platform, Config as AppConfig } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

// import services
import { SecureHttpService } from '../../services/http/index';
import { ConfigService } from '../../services/config/index';
import { AdMobService } from '../../services/admob/index';
import { PushNotificationsService } from '../../services/push/index';

@Injectable()
export class ApplicationService {
    private appLanguage = 'en';
    private appLocation: {latitude: number, longitude: number} = null;
    private http: SecureHttpService;
    private pushNotifications: PushNotificationsService;

    /**
     * Constructor
     */
    constructor(
        @Inject(forwardRef(() => PushNotificationsService)) pushNotifications: PushNotificationsService,
        private adMobService: AdMobService,
        private platform: Platform,
        private appConfig: AppConfig,
        private translate: TranslateService,
        private api: DataStore,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private config: ConfigService)
    {
        this.http = http;
        this.pushNotifications = pushNotifications;
    }

    /**
     * Set app location
     */
    setAppLocation(latitude: number, longitude: number): void {
        this.appLocation = {
            latitude: latitude,
            longitude: longitude,
        };
    }

    /**
     * Get app location
     */
    getAppLocation(): {latitude: number, longitude: number} {
        return this.appLocation;
    }

    /**
     * Set app language
     */
    setAppLanguage(language: string): void {
        this.appLanguage = language;
    }

    /**
     * Get app language
     */
    getAppLanguage(): string {
        return this.appLanguage;
    }

    /**
     * Get app setting
     */
    getAppSetting(name: string, defaultValue: any = null): any {
        let value: any = localStorage.getItem(`app_setting_${name}`);

        if (value === null && defaultValue !== null) {
            return defaultValue;
        }

        return value;
    }

    /**
     * Set app setting
     */
    setAppSetting(name: string, value: any): void {
        localStorage.setItem(`app_setting_${name}`, value);
    }

    /**
     * Load dependencies
     */
    loadDependencies(clearOldData: boolean = true): Promise<any> {
        // clear old data
        if (clearOldData) {
            this.api.removeAll('configs');
            this.translate.resetLang(this.appLanguage);
        }

        let promises = [];

        // load configs
        promises.push(this.api.findAll('configs', {}, {force: true}));

        // load translations
        promises.push(this.http.get(this.config.getApiUrl() + '/i18n/' + this.appLanguage + '/')
            .toPromise()
            .then(res => this.translate.setTranslation(this.appLanguage, res.json()))
        );

        return new Promise((resolve, reject) => {
            // load dependencies
            Promise.all(promises).then(() => {
                // init translations
                this.translate.use(this.appLanguage);

                // translate navigation items
                this.appConfig.set('backButtonText', this.translate.instant('back'));

                if (this.platform.is('cordova')) {
                    // init admob banners
                    this.adMobService.init();

                    // init push notifications
                    this.pushNotifications.init(this.appLanguage);
                }

                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}
