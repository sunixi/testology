import { Component } from '@angular/core';
import { DataStore } from 'js-data';
import { Events, NavController } from 'ionic-angular';

// services
import { AuthService } from '../../services/auth/index';

// import pages
import { DashboardPage } from '../../pages/dashboard/index';
import { LoginPage } from '../../pages/user/login/index';

@Component({
    selector: 'app-maintenance',
    templateUrl: 'index.html',
    providers: [
    ]
})

export class AppMaintenancePage {
    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private api: DataStore,
        private events: Events,
        private nav: NavController) {}

    /**
     * Do refresh
     */
    async doRefresh(refresher): Promise<any> {
        try {
            // update all configs
            await this.api.findAll('configs', {}, {force: true});

            refresher.complete();

            // check maintenance mode
            if (!this.api.get('configs', 'maintenanceMode').value) {
                this.events.publish('maintenance:restore');

                this.nav.setRoot(!this.auth.isAuthenticated() ? LoginPage : DashboardPage);
            }
        }
        catch (e) {
            refresher.complete();
        }
    }
}
