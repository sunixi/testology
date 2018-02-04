import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LoadingController, AlertController, Nav, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionControlService } from '../../../../services/questions/control-service';

// pages
import { ForgotPasswordNewPasswordPage } from '../newPassword/index';

// services
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';

@Component({
    selector: 'forgot-password-check-code',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class ForgotPasswordCheckCodePage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private form: FormGroup;
    private email: string;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private navParams: NavParams,
        private navCtrl: Nav,
        private alert: AlertController,
        private config: ConfigService,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private loadingCtrl: LoadingController,
        private questionControl: QuestionControlService,
        private translate: TranslateService,
        private questionManager: QuestionManager)
    {
        this.http = http;
        this.email = this.navParams.get('email');
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(QuestionManager.TYPE_TEXT, {
                key: 'code',
                label: this.translate.instant('forgot_password_code_input'),
                validators: [
                    {name: 'require'}
                ]
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            let data = await this.http.post(this.config.getApiUrl() + '/validators/forgot-password-code/', JSON.stringify({code: this.form.value['code']}))
                .map(res => res.json())
                .toPromise();

            loader.dismiss();

            if (data.valid) {
                this.navCtrl.push(ForgotPasswordNewPasswordPage, {
                    code: this.form.value['code'],
                    email: this.email
                });

                return;
            }

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: this.translate.instant('forgot_password_code_invalid'),
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
        catch (e) {
            loader.dismiss();
        }
    }
}
