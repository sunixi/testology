import { Component, forwardRef, Inject } from '@angular/core';
import { Nav, ModalController, ActionSheetController, LoadingController } from 'ionic-angular';
import { TranslateService } from "ng2-translate";
import { DataStore } from "js-data";

// pages
import { LoginPage } from '../user/login/index';
import { CustomPageComponent } from "../../shared/components/customPage/index";

// services
import { SecureHttpService } from '../../services/http/index';
import { AuthService } from '../../services/auth/index';

@Component({
    selector: 'app-settings',
    templateUrl: 'index.html',
    providers: [
    ]
})

export class AppSettingsPage {
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private navCtrl: Nav,
        private api: DataStore,
        private auth: AuthService,
        private translate: TranslateService,
        private modalCtrl: ModalController,
        protected loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService)
    {
        this.http = http;
    }

    /**
     * User
     */
    get user(): any {
        return this.api.get('users', this.auth.getUserId());
    }

    /**
     * Show privacy policy modal
     */
    showPrivacyPolicyModal(): void {
        let modal = this.modalCtrl.create(CustomPageComponent, {
            title: this.translate.instant('privacy_policy_page_header'),
            pageName: 'privacy_policy_page_content'
        });

        modal.present();
    }

    /**
     * Show terms of use modal
     */
    showTermsOfUseModal(): void {
        let modal = this.modalCtrl.create(CustomPageComponent, {
            title: this.translate.instant('tos_page_header'),
            pageName: 'tos_page_content'
        });

        modal.present();
    }

    /**
     * Delete account confirmation
     */
    deleteAccountConfirmation(): void {
        let actionSheet = this.actionSheetCtrl.create({
            title: this.translate.instant('app_settings_delete_account_confirmation'),
            buttons: [
                {
                    text: this.translate.instant('app_settings_delete_account_button'),
                    handler: () => {
                        this.deleteAccount()
                    }
                },
                {
                    text: this.translate.instant('cancel')
                }
            ]
        });

        actionSheet.present();
    }

    /**
     * Logout user
     */
    logout(): void {
        this.auth.logout();
        this.navCtrl.setRoot(LoginPage);
    }

    /**
     * Delete user account
     */
    protected async deleteAccount(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            await this.api.destroy('users', this.auth.getUserId());

            loader.dismiss();

            this.navCtrl.setRoot(LoginPage);
        }
        catch(e)
        {
            loader.dismiss();
        }
    }
}
