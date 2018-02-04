import { Component, Input, OnInit, forwardRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LoadingController, AlertController, Nav, ToastController, NavParams } from 'ionic-angular';
import { DataStore } from 'js-data';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionControlService } from '../../../../services/questions/control-service';

// services
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';
import { AuthService } from "../../../../services/auth/index";

//pages
import { LoginPage } from '../../login/index';
import { DashboardPage } from '../../../dashboard/index';
import { VerifyEmailCheckEmailPage } from "../checkEmail/index";

@Component({
    selector: 'verify-email-check-code',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class VerifyEmailCheckCodePage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private form: FormGroup;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private navParams: NavParams,
        private toast: ToastController,
        private api: DataStore,
        private navCtrl: Nav,
        private auth: AuthService,
        private alert: AlertController,
        private config: ConfigService,
        private loadingCtrl: LoadingController,
        private questionControl: QuestionControlService,
        private translate: TranslateService,
        private questionManager: QuestionManager,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService)
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
            this.questionManager.getQuestion(QuestionManager.TYPE_TEXT, {
                key: 'code',
                label: this.translate.instant('verify_email_code_input'),
                validators: [
                    {name: 'require'}
                ]
            }, {
                hideWarning: true
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    }

    /**
     * Open check code page
     */
    openCheckCodePage(): void {
        this.navCtrl.push(VerifyEmailCheckEmailPage);
    }

    /**
     * Open login page
     */
    openLoginPage(): void {
        this.auth.logout();
        this.navCtrl.setRoot(LoginPage);
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            let data = await this.http.post(this.config.getApiUrl() + '/validators/verify-email-code/', JSON.stringify({code: this.form.value['code']}))
                .map(res => res.json())
                .toPromise();

            loader.dismiss();

            if (data.valid) {
                let toast = this.toast.create({
                    message: this.translate.instant('verify_email_verification_successful'),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();

                this.navCtrl.setRoot(DashboardPage);

                return;
            }

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: this.translate.instant('verify_email_invalid_code'),
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
        catch (e) {
            loader.dismiss()
        }
    }
}
