import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Platform } from 'ionic-angular';

import { SecureHttpService } from '../../services/http/index';
import { ConfigService } from '../../services/config/index';

@Injectable()
export class InAppsService
{
    /**
     * Constructor
     */
    constructor(
        private iap: InAppPurchase,
        private http: SecureHttpService,
        private config: ConfigService,
        private platform: Platform
    ){}

    getProducts(data: any[]): any{
        let ids = [];
        for (let i in data){
            ids.push(data[i]['productId'].toLowerCase());
        }
        return this.iap.getProducts(ids);
    }

    async buyProduct(productId: string): Promise<any>{
        try {
            let data = await this.iap.buy(productId.toLowerCase());
            let validationResult = await this.validatePurchase(data);

            if ((validationResult.id != -1) && this.platform.is('android')) {
                await this.iap.consume(data['productType'], data['receipt'], data['signature'])
            }
            return validationResult;
        } catch (e){}
    }

    private validatePurchase(data: any): Promise<any>{
        let platform = 'unknown';
        if (this.platform.is('android')){
            platform = 'android';
        } else if (this.platform.is('ios')){
            platform = 'ios';
        }
        return this.http.post(this.config.getApiUrl() + '/inapps/', JSON.stringify({
            "platform": platform,
            "transactionData": data
        }))
            .map(res => res.json())
            .toPromise();
    }
}
