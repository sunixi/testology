import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LoadingController, AlertController, NavParams, Nav, ToastController } from 'ionic-angular';
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

@Component({
    selector: 'forgot-password-new-password',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class ForgotPasswordNewPasswordPage implements OnInit {
    @Input() questions = <any>[]; // list of questions

    private http: SecureHttpService;
    private form: FormGroup;
    private code: string;
    private email: string;

    /**
     * Constructor
     */
    constructor(
        private toast: ToastController,
        private navCtrl: Nav,
        private navParams: NavParams,
        private api: DataStore,
        private alert: AlertController,
        private config: ConfigService,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private loadingCtrl: LoadingController,
        private questionControl: QuestionControlService,
        private translate: TranslateService,
        private questionManager: QuestionManager)
    {
        this.http = http;
        this.code = this.navParams.get('code');
        this.email = this.navParams.get('email');
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
            this.questionManager.getQuestion(QuestionManager.TYPE_PASSWORD, {
                key: 'password',
                label: this.translate.instant('password_input'),
                validators: [
                    {name: 'require'},
                    {
                        name: 'minLength',
                        message: this.translate.instant('password_min_length_validator_error', {
                            length: this.api.get('configs', 'minPasswordLength').value
                        }),
                        params: {
                            length: this.api.get('configs', 'minPasswordLength').value
                        }
                    },
                    {
                        name: 'maxLength',
                        message: this.translate.instant('password_max_length_validator_error', {
                            length: this.api.get('configs', 'maxPasswordLength').value
                        }),
                        params: {
                            length: this.api.get('configs', 'maxPasswordLength').value
                        }
                    },
                ]
            }),
            this.questionManager.getQuestion(QuestionManager.TYPE_PASSWORD, {
                key: 'repeatPassword',
                label: this.translate.instant('password_repeat_input'),
                validators: [
                    {name: 'require'}
                ]
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions, (formGroup: FormGroup) => {
            if (formGroup.get('password').value === formGroup.get('repeatPassword').value) {
                return null;
            }

            return {
                message: this.translate.instant('password_repeat_validator_error'),
                question: 'repeatPassword'
            };
        });
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // try to update password
            let data = await this.http.put(this.config.getApiUrl() + '/forgot-password/' + this.code + '/', JSON.stringify({email: this.email, password: this.form.value['password']}))
                .map(res => res.json())
                .toPromise();

            loader.dismiss();

            if (data.success == true) {
                let toast = this.toast.create({
                    message: this.translate.instant('forgot_password_reset_successful'),
                    closeButtonText: this.translate.instant('ok'),
                    showCloseButton: true,
                    duration: this.toastDuration
                });

                toast.present();

                this.navCtrl.setRoot(LoginPage);

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
            loader.dismiss()
        }
    }
}
