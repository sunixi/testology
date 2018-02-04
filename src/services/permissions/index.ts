import { Injectable } from '@angular/core';
import { DataStore } from 'js-data';
import { AlertController, App } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// pages
import { InappsPage } from '../../pages/inapps/index';

// services
import { AuthService } from '../auth/index';
import { SecureHttpService } from '../../services/http/index';
import { ConfigService } from '../../services/config/index';

@Injectable()
export class PermissionsService {
    /**
     * Constructor
     */
    constructor(
        private config: ConfigService,
        private http: SecureHttpService,
        private app: App,
        private translate: TranslateService,
        private alert: AlertController,
        private api: DataStore,
        private auth: AuthService) {}

    /**
     * Is action allowed
     */
    isActionAllowed(action, userId?: number): boolean {
        let currentUser: number = !userId ? this.auth.getUserId() : userId;

        let permission: any[] = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isAllowed: true
            }
        });

        return permission.length > 0;
    }

    /**
     * Is action allowed after tracking
     */
    isAllowedAfterTracking(action, userId?: number): boolean {
        let currentUser: number = !userId ? this.auth.getUserId() : userId;

        let permission: any[] = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isAllowedAfterTracking: true
            }
        });

        return permission.length > 0;
    }

    /**
     * Is action promoted
     */
    isActionPromoted(action, userId?: number): boolean {
        let currentUser: number = !userId ? this.auth.getUserId() : userId;

        let permission: any[] = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isPromoted: true
            }
        });

        return permission.length > 0;
    }

    /**
     * Get action price
     */
    getActionPrice(action, userId?: number): number {
        let currentUser: number = !userId ? this.auth.getUserId() : userId;

        let permission: any[] = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                authorizedByCredits: true
            }
        });

        if (permission.length) {
            return permission[0].creditsCost;
        }
    }

    /**
     * Show access denied alert
     */
    showAccessDeniedAlert(): void {
        let confirm = this.alert.create({
            title: this.translate.instant('permission_denied_alert_title'),
            message: this.translate.instant('permission_denied_alert_message'),
            buttons: [
                {
                    text: this.translate.instant('cancel')
                },
                {
                    text: this.translate.instant('purchase'),
                    handler: () => {
                        this.app.getRootNav().push(InappsPage);
                    }
                }
            ]
        });

        confirm.present();
    }

    /**
     * Track action
     */
    async trackAction(groupName: string, actionName: string): Promise<any> {
        try {
            await this.http.post(`${this.config.getApiUrl()}/permissions/track-action/`, {
                    groupName: groupName,
                    actionName: actionName
                })
                .map(res => res.json())
                .toPromise();
        }
        catch (e){}
    }
}
