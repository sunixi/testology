import { Component, Inject, forwardRef } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { DataStore } from 'js-data';
import { NavController } from 'ionic-angular';

// import pages
import { LoginPage } from '../../pages/user/login/index';
import { AppMaintenancePage } from '../../pages/appMaintenance/index';
import { DashboardPage } from '../../pages/dashboard/index';

// import services
import { ApplicationService } from '../../services/application/index';
import { AuthService } from '../../services/auth/index';

@Component({
    selector: 'app-connection-error',
    templateUrl: 'index.html',
    providers: [
    ]
})

export class AppConnectionErrorPage {
    private pageHeader: string = 'No server connection';
    private application: ApplicationService;

    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private nav: NavController,
        private api: DataStore,
        @Inject(forwardRef(() => ApplicationService)) application: ApplicationService,
        private translate: TranslateService)
    {
        this.application = application;

        // do we have translations?
        if (this.translate.getDefaultLang()) {
            this.pageHeader = this.translate.instant('app_conection_error_page_header');
        }
    }

    /**
     * Do refresh
     */
    async doRefresh(refresher): Promise<any> {
        try {
            // refresh application dependencies
            await this.application.loadDependencies(false);
            refresher.complete();

            // redirect to the page
            if (this.api.get('configs', 'maintenanceMode').value) {
                this.nav.setRoot(AppMaintenancePage);

                return;
            }

            this.nav.setRoot(!this.auth.isAuthenticated() ? LoginPage : DashboardPage);
        }
        catch (e) {
            refresher.complete();
        }
    }
}
