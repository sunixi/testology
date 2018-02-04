import { Component, Input, OnInit, forwardRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LoadingController, AlertController, Nav, ToastController, ViewController } from 'ionic-angular';
import { DataStore } from 'js-data';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionControlService } from '../../../../services/questions/control-service';

// pages
import { LoginPage } from '../../login/index';

// services
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { AuthService } from '../../../../services/auth/index';

@Component({
    selector: 'verify-email-check-email',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class VerifyEmailCheckEmailPage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private form: FormGroup;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private navCtrl: Nav,
        private viewCtrl: ViewController,
        private alert: AlertController,
        private toast: ToastController,
        private config: ConfigService,
        private api: DataStore,
        private auth: AuthService,
        private loadingCtrl: LoadingController,
        private questionControl: QuestionControlService,
        private questionManager: QuestionManager,
        private translate: TranslateService,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService
    )
    {
        this.http = http;
    }

    /**
     * Get toast duration
     */
    get toastDuration(): number {
        return this.api.get('configs', 'toastDuration').value;
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(QuestionManager.TYPE_EMAIL, {
                key: 'email',
                value: this.auth.getUser().email,
                label: this.translate.instant('verify_email_email_input'),
                validators: [
                    {name: 'require'},
                    {name: 'userEmail'}
                ]
            }, {
                hideWarning: true
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    }

    /**
     * Open login page
     */
    openLoginPage(): void {
        this.auth.logout();
        this.navCtrl.setRoot(LoginPage);
    }

    /**
     * Resend mail
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            let currentEmail = this.auth.getUser().email;
            let newEmail = this.form.value['email'];
            let success: boolean = true;
            let message: string = "";

            await loader.present();

            if (currentEmail !== newEmail) {
                await this.updateUserEmail();
            }
            else {
                let data = await this.sendVerificationCode();

                success = data.success;
                message = data.message;
            }

            loader.dismiss();

            if (success) {
                let toast = this.toast.create({
                    message: this.translate.instant('verify_email_mail_sent', {
                        email: this.form.value['email']
                    }),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();

                this.navCtrl.pop();

                return;
            }

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: message,
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Update user email if it's changed
     */
    protected async updateUserEmail(): Promise<any> {
        try {
            // try to update user email
            let userData = await this.api.update('users', this.auth.getUserId(), {
                email: this.form.value['email']
            });

            this.auth.setAuthenticated(userData.token);
        }
        catch (e) {}
    }

    /**
     * Send verification code
     */
    protected async sendVerificationCode(): Promise<any> {
        // try to send verification email
        return await this.http.post(this.config.getApiUrl() + '/verify-email/', JSON.stringify({email: this.form.value['email']}))
            .map(res => res.json())
            .toPromise();
    }
}
