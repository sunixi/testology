import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { DataStore } from 'js-data';

// services
import { AuthService } from '../../../../services/auth/index';

@Component({
    selector: 'matched-user',
    templateUrl: './index.html'
})
export class MatchedUserPageComponent implements OnInit {
    private matchedUser: any;

    /**
     * Constructor
     */
    constructor(
        private auth: AuthService,
        private api: DataStore,
        private viewCtrl: ViewController,
        private navParams: NavParams)
    {
        this.matchedUser = this.navParams.get('user');
    }
 
    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        try {
            // mark matched user
            await this.api.update('matchedUsers', this.matchedUser.id, {
                isRead: true
            });
        }
        catch (e) {
            this.viewCtrl.dismiss();
        }
    }

    /**
     * Current user
     */
    get currentUser(): any {
        return this.api.get('users', this.auth.getUserId()); // get logged user data
    }

    /**
     * Close
     */
    close(): void {
        this.viewCtrl.dismiss();
    }

    /**
     * Show chat
     */
     showChat(): void {
        this.viewCtrl.dismiss({
            showChat: true
        });
    }
}
