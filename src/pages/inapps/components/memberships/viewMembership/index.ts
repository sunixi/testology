import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { Component } from '@angular/core';

import { SecureHttpService } from '../../../../../services/http/index';
import { ConfigService } from '../../../../../services/config/index';
import { InAppsService} from '../../../../../services/inapps/index';
import { ApiUtilsService } from '../../../../../services/api/utils';
import { AuthService } from '../../../../../services/auth/index';

import { DashboardPage } from '../../../../../pages/dashboard/index';

@Component({
    selector: 'membership',
    templateUrl: 'index.html',
})
export class ViewMembershipComponent {

    private membership: any = {};
    private membershipId: any = null;

    /**
     * Constructor
     */
    constructor(
        private api: DataStore,
        private apiUtils: ApiUtilsService,
        private auth: AuthService,
        private config: ConfigService,
        private http: SecureHttpService,
        private iaps: InAppsService,
        private loadingCtrl: LoadingController,
        private nav: NavController,
        private navParams: NavParams
    ){}

    get currency(): string {
        return this.api.get('configs', 'billingCurrency').value;
    }

    ngOnInit(): void {
        this.membershipId = this.navParams.get('mewmbershipId');
        this.loadMembership();
    }

    async loadMembership(): Promise<any> {
        let loader = this.loadingCtrl.create();
        await loader.present();

        try{
            let data = await this.http.get(this.config.getApiUrl() + '/memberships/' + this.membershipId + '/')
                .map(response => response.json())
                .toPromise();

            let products = await this.iaps.getProducts(data['plans']);

            data['plans'] = data['plans'].filter((el) => {
                for (let key in products) {
                    if (el['productId'].toLowerCase() == products[key]['productId']) {
                        return true;
                    }
                }
                return false;
            });
            this.membership = data;
        } catch (e){
            loader.dismiss();
        }

        loader.dismiss();
    }

    async buyProduct(productId: string): Promise<any> {
        let loader = this.loadingCtrl.create();
        await loader.present();
        try{
            let result = await this.iaps.buyProduct(productId);
            if (result.id != -1){
                this.apiUtils.clearUserData(this.auth.getUserId(), true);
                this.nav.push(DashboardPage)
            }
            loader.dismiss();
        } catch(e) {
            loader.dismiss();
        }
    }

}
