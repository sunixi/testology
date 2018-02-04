import { NavController, LoadingController } from 'ionic-angular';

import { Component } from '@angular/core';
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { AuthService} from '../../../../services/auth/index';
import { InAppsService} from '../../../../services/inapps/index';
import { ApiUtilsService } from '../../../../services/api/utils';

import { DashboardPage } from '../../../../pages/dashboard/index';

@Component({
    selector: 'credits',
    templateUrl: 'index.html'
})

export class CreditsComponent {
    private creditPacks: any = [];
    private creditBalance: number = 0;

    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private apiUtils: ApiUtilsService,
        private config: ConfigService,
        private http: SecureHttpService,
        private iaps: InAppsService,
        private loadingCtrl: LoadingController,
        private nav: NavController
    ){
        this.loadCreditPacks()
    }

    async buyPack(productId: string): Promise<any>{
        let loader = this.loadingCtrl.create();
        await loader.present();
        try{
            let result = await this.iaps.buyProduct(productId);
            if (result){
                this.apiUtils.clearUserData(this.auth.getUserId(), true);
                this.nav.push(DashboardPage)
            }
            loader.dismiss();
        } catch(e) {
            loader.dismiss();
        }
    }

    async loadCreditPacks(): Promise<any> {
        let loader = this.loadingCtrl.create();
        await loader.present();
        try{
            let data = await this.http.get(this.config.getApiUrl() + '/credits/')
                .map(res => res.json())
                .toPromise();
            let products = await this.iaps.getProducts(data['packs']);
            data['packs'] = data['packs'].filter((el) => {
                for (let key in products) {
                    if (el['productId'].toLowerCase() == products[key]['productId']) {
                        return true;
                    }
                }
                return false;
            });

            this.creditPacks = data['packs'];
            this.creditBalance = data['balance'];
        } catch(e) {}
        loader.dismiss();
    }
}
