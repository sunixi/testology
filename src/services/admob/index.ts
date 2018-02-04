import { Injectable } from '@angular/core';
import { App, Events } from 'ionic-angular';
import { AdMob, AdMobOptions, AdSize } from '@ionic-native/admob';
import { DataStore } from 'js-data';

import { PermissionsService } from '../../services/permissions/index';

@Injectable()
export class AdMobService
{
    private bannerCreated: boolean = false;
    private eventSubscribed: boolean = false;
    private isBannerVisible: boolean = false;
    private lastViewName: string = '';
    private configsUpdatedHandler: () => void;
    private permissionsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private api: DataStore,
        private app: App,
        private adMob: AdMob,
        private events: Events,
        private permissions: PermissionsService
    ) {

        this.configsUpdatedHandler = (): void => {
            if (this.config.enabled){
                this.checkView(this.lastViewName);
            } else {
                this.hideBanner();
            }
        };

        this.permissionsUpdatedHandler = (): void => {
            if (this.permissions.isActionAllowed('ads_hide_ads'))
            {
                this.hideBanner();
            } else {
                this.checkView(this.lastViewName);
            }
        };

    }

    /**
     * Init
     */
    init(): void {
        if (this.bannerCreated) {
            this.hideBanner();
            this.adMob.removeBanner();
        }

        let nav = this.app.getRootNav();
        this.bannerCreated = false;

        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);

        if (!this.eventSubscribed) {
            nav.viewDidEnter.subscribe((view) => {
                this.checkView(view.instance.constructor.name);
            });

            this.eventSubscribed = true;
        }
    }

    /**
     * Check view
     */
    async checkView(viewName): Promise<any> {
        this.lastViewName = viewName;
        if (this.config.enabled && this.config.adId) {
            if (!this.bannerCreated) {
                await this.createBanner();

                this.bannerCreated = true;
                this.checkView(viewName);

                return;
            }

            if (this.config.availableViews.includes(viewName)) {
                this.showBanner();

                return;
            }

            this.hideBanner();

            return;
        }
    }

    /**
     * Create banner
     */
    private createBanner(): Promise<any> {
        let options: AdMobOptions = {
            adId: this.config.adId,
            overlap: false,
            position: this.adMob.AD_POSITION.BOTTOM_CENTER,
            adSize: <AdSize> 'SMART_BANNER',
            autoShow: false
        };

        return this.adMob.createBanner(options);
    }

    /**
     * Show banner
     */
    private showBanner(): void {
        if (!this.isBannerVisible) {
            this.adMob.showBanner(this.adMob.AD_POSITION.BOTTOM_CENTER);
            this.isBannerVisible = true;
        }
    }

    /**
     * Hide banner
     */
    private hideBanner(): void {
        if (this.isBannerVisible) {
            this.adMob.hideBanner();
            this.isBannerVisible = false;
        }
    }

    /**
     * Config
     */
    private get config(): any {
        return this.api.get('configs', 'adMobConfig').value;
    }
}
