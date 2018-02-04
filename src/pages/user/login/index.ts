import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// services
import { AuthService } from '../../../services/auth/index';
import { ConfigService } from '../../../services/config/index';
import { TranslateService } from 'ng2-translate';
import { SecureHttpService } from '../../../services/http/index';
import { ServerEventsService } from '../../../services/serverEvents/index';

// pages
import { AppUrlPage } from '../../appUrl/index';
import { DashboardPage } from '../../dashboard/index';
import { ForgotPasswordCheckEmailPage } from '../forgotPassword/checkEmail/index';
import { JoinInitialPage } from '../join/initial/index';

// questions
import { QuestionManager } from '../../../services/questions/manager';
import { QuestionControlService } from '../../../services/questions/control-service';

@Component({
    selector: 'login',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class LoginPage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private form: FormGroup;
    private appUrlPage = AppUrlPage;
    private joinPage = JoinInitialPage;
    private forgotPasswordPage = ForgotPasswordCheckEmailPage;
    private loginInProcessing: boolean = false;
    private isGenericSiteUrl: boolean = false;
    private showFacebookLoginButton: boolean = false;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private serverEvents: ServerEventsService,
        private config: ConfigService,
        private fb: Facebook,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private auth: AuthService,
        private loadingCtrl: LoadingController,
        private nav: NavController,
        private questionControl: QuestionControlService,
        private translate: TranslateService,
        private alert: AlertController,
        private questionManager: QuestionManager)
    {
        this.http = http;

        if (this.config.getGenericApiUrl()) {
            this.isGenericSiteUrl = true;
        }

        if (this.config.getConfig('facebookAppId')){
            this.showFacebookLoginButton = true;
        }
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        this.serverEvents.restart();

        // create form items
        this.questions = [
            this.questionManager.getQuestion(QuestionManager.TYPE_TEXT, {
                key: 'login',
                label: this.translate.instant('login_input'),
                validators: [
                    {name: 'require'}
                ]
            }, {
                questionClass: 'sk-name',
                hideErrors: true,
                hideWarning: true
            }),
            this.questionManager.getQuestion(QuestionManager.TYPE_PASSWORD, {
                key: 'password',
                label: this.translate.instant('password_input'),
                validators: [
                    {name: 'require'}
                ]
            }, {
                questionClass: 'sk-password',
                hideErrors: true,
                hideWarning: true
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    }

    /**
     * Login
     */
    async login(): Promise<any> {
        try {
            this.loginInProcessing = true;

            let data = await this.http.post(this.config.getApiUrl() + '/login/', JSON.stringify({
                    username: this.form.value.login,
                    password: this.form.value.password
                }))
                .map(res => res.json())
                .toPromise();

            this.loginInProcessing = false;

            if (data.success == true) {
                this.auth.setAuthenticated(data.token);
                this.nav.setRoot(DashboardPage);

                return;
            }

            this.loginFailed();
        }
        catch (e) {
            this.loginInProcessing = false;
            this.loginFailed();
        }
    }

    /**
     * Login failed
     */
    private loginFailed(): void {
        let alert = this.alert.create({
            title: this.translate.instant('error_occurred'),
            subTitle: this.translate.instant('login_failed'),
            buttons: [this.translate.instant('ok')]
        });

        alert.present();
    }

    async facebookLogin(): Promise<any> {
        let permissions = ['public_profile', 'email'];
        let loader = this.loadingCtrl.create();

        await loader.present();

        try {
            let facebookResponse: FacebookLoginResponse = await this.fb.login(permissions);
            let result = await this.http.post(
                    this.config.getApiUrl() + '/facebook-connect/',
                JSON.stringify(facebookResponse))
                .map(res => res.json())
                .toPromise();

            loader.dismiss();

            if (result.success == true) {
                this.auth.setAuthenticated(result.token);
                this.nav.setRoot(DashboardPage);
                return;
            }

            let alert = this.alert.create({
                message: result.error,
                buttons: [this.translate.instant('ok')]
            });
            alert.present();

        }
        catch(e) {
            loader.dismiss();
        }
    }
}
