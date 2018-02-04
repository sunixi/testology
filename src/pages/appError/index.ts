import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { DashboardPage } from '../dashboard/index';
import { LoginPage } from '../user/login/index';

// services
import { AuthService } from '../../services/auth/index';

@Component({
    selector: 'app-error',
    templateUrl: 'index.html',
    providers: [
    ]
})

export class AppErrorPage {
    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private nav: NavController) {}

    /**
     * Refresh
     */
    refresh(): void {
        this.nav.setRoot(!this.auth.isAuthenticated() ? LoginPage : DashboardPage);
    }
}
