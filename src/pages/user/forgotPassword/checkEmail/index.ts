import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LoadingController, AlertController, Nav } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionControlService } from '../../../../services/questions/control-service';

// pages
import { ForgotPasswordCheckCodePage } from '../checkCode/index';

// services
import { SecureHttpService } from '../../../../services/http/index';
import { ConfigService } from '../../../../services/config/index';

@Component({
    selector: 'forgot-password-check-email',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class ForgotPasswordCheckEmailPage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private form: FormGroup;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
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
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(QuestionManager.TYPE_EMAIL, {
                key: 'email',
                label: this.translate.instant('forgot_password_email_input'),
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

            // try to send verification email
            let data = await this.http.post(this.config.getApiUrl() + '/forgot-password/', JSON.stringify({email: this.form.value['email']}))
                .map(res => res.json())
                .toPromise();

            loader.dismiss();

            if (data.success == true) {
                this.navCtrl.push(ForgotPasswordCheckCodePage, {
                    email: this.form.value['email']
                });

                return;
            }

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: data.message,
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
        catch (e) {
            loader.dismiss();
        }
    }
}
