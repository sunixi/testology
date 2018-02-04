import { Component }  from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DataStore } from 'js-data';
import { Events, NavController } from 'ionic-angular';

// services
import { AuthService } from '../../../services/auth/index';

// import pages
import { DashboardPage } from '../../../pages/dashboard/index';
import { LoginPage } from '../../../pages/user/login/index';

@Component({
    selector: 'user-disaproved',
    templateUrl: 'index.html'
})
export class UserDisapprovedPage  {
    private status: string;
    private description: string;

    /**
     * Constructor
     */
    constructor(
        private navParams: NavParams,
        private auth: AuthService,
        private api: DataStore,
        private events: Events,
        private nav: NavController)
    {
        this.status = this.navParams.get('status');
        this.description = this.navParams.get('description');
    }

    /**
     * Is suspended
     */
    isSuspended(): boolean {
        return this.status == 'suspended';
    }

    /**
     * Logout user
     */
    logout(): void {
        this.auth.logout();
        this.nav.setRoot(LoginPage);
    }

    /**
     * Do refresh
     */
    async doRefresh(refresher): Promise<any> {
        // get user info
        try {
            await this.api.find('users', this.auth.getUserId(), {force: true});

            refresher.complete();

            this.events.publish('user:status_restore');
            this.nav.setRoot(!this.auth.isAuthenticated() ? LoginPage : DashboardPage);
        }
        catch (e) {
            refresher.complete();
        }
    }
}
