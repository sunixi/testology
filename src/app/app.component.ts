import { Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';
import { DataStore } from 'js-data';
import { Geolocation } from '@ionic-native/geolocation';

// import pages
import { DashboardPage } from '../pages/dashboard/index';
import { LoginPage } from '../pages/user/login/index';
import { AppUrlPage } from '../pages/appUrl/index';
import { AppMaintenancePage } from '../pages/appMaintenance/index';

// import services
import { ApplicationService } from '../services/application/index';
import { AuthService } from '../services/auth/index';
import { ConfigService } from '../services/config/index';

@Component({
    templateUrl: 'app.html',
    providers: [
        Globalization,
        StatusBar,
        SplashScreen,
        Geolocation
    ]
})

export class MyApp {
    @ViewChild(Nav) nav: Nav;

    /**
     * Constructor
     */
    constructor(
        private geolocation: Geolocation,
        private application: ApplicationService,
        private keyboard: Keyboard,
        private platform: Platform,
        private auth: AuthService,
        private api: DataStore,
        private config: ConfigService,
        private globalization: Globalization,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen)
    {
        this.initializeApp();
    }

    /**
     * Initialize app
     */
    async initializeApp(): Promise<any> {
        try {
            await this.platform.ready();

            // configure application
            this.statusBar.styleDefault();
            this.keyboard.disableScroll(false);
            this.keyboard.hideKeyboardAccessoryBar(true);

            // check token expiration time
            this.nav.viewWillEnter.subscribe(() => {
                if (this.auth.getUserId() && !this.auth.isAuthenticated()) {
                    this.auth.logout();
                    this.nav.setRoot(LoginPage);
                }
            });

            // in mobile
            if (this.platform.is('cordova')) {
                //  get preferred language
                let lang = await this.globalization.getPreferredLanguage();

                this.application.setAppLanguage(lang.value.split('-')[0]);

                // get current location
                this.geolocation.getCurrentPosition().then((location: any) => {
                    this.application.setAppLocation(location.coords.latitude, location.coords.longitude);
                }).catch(() => {
                });

                // application url is not defined yet
                if (!this.config.getApiUrl()) {
                    this.splashScreen.hide();
                    this.nav.setRoot(AppUrlPage);

                    return;
                }

                this.loadDependencies();

                return;
            }

            // application url is not defined yet
            if (!this.config.getApiUrl()) {
                this.splashScreen.hide();
                this.nav.setRoot(AppUrlPage);

                return;
            }

            this.loadDependencies();
        }
        catch (e) {}
    }

    /**
     * Load dependencies
     */
    async loadDependencies(): Promise<any> {
        try {
            await this.application.loadDependencies();
            this.splashScreen.hide();

            // redirect to the page
            if (this.api.get('configs', 'maintenanceMode').value) {
                this.nav.setRoot(AppMaintenancePage);

                return;
            }

            this.nav.setRoot(!this.auth.isAuthenticated() ? LoginPage : DashboardPage);

        }
        catch (e) {}
    }
}
