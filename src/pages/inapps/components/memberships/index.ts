import { DataStore } from 'js-data';
import { NavController, LoadingController } from 'ionic-angular';

import { Component } from '@angular/core';
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { AuthService} from '../../../../services/auth/index';

import { ViewMembershipComponent } from './viewMembership/index'

@Component({
    selector: 'memberships',
    templateUrl: 'index.html'
})

export class MembershipsComponent {

    private memberships: any = [];
    private currentMembership: string = '';

    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private api: DataStore,
        private config: ConfigService,
        private http: SecureHttpService,
        private loadingCtrl: LoadingController,
        private nav: NavController
    ){
        this.loadMemberships()
    }

    public viewMembership(membershipId): void{
        this.nav.push(ViewMembershipComponent, {'mewmbershipId': membershipId})
    }

    async loadMemberships(): Promise<any> {
        let loader = this.loadingCtrl.create();
        await loader.present();
        try{
            this.memberships = await this.http.get(this.config.getApiUrl() + '/memberships/')
                .map(res => res.json())
                .toPromise();
            this.memberships.forEach((membership) => {
                if (membership.current == true) {
                    this.currentMembership = membership.title;
                }
            });
        } catch(e) {}
        loader.dismiss();
    }

}
