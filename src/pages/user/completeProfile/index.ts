import { Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionControlService } from '../../../services/questions/control-service';
import { QuestionManager } from '../../../services/questions/manager';
import { QuestionBase }  from '../../../services/questions/questions/base';

// pages
import { DashboardPage } from '../../dashboard/index';

// import services
import { AuthService } from '../../../services/auth/index';
import { ConfigService } from '../../../services/config/index';
import { SecureHttpService } from '../../../services/http/index';
import { ApiUtilsService } from '../../../services/api/utils';

@Component({
    selector: 'complete-profile',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager,
        ApiUtilsService
    ]
})
export class CompleteProfilePage implements OnInit  {
    @Input() private questions = <any>[]; // list of questions
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;
    private updatingUserProfile: boolean = false;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private auth:AuthService,
        private nav: NavController,
        private loadingCtrl: LoadingController,
        private config: ConfigService,
        private api:DataStore,
        private apiUtils:ApiUtilsService,
        private toast: ToastController,
        private translate: TranslateService,
        private questionControl: QuestionControlService,
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
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            let response = await this.http.get(this.config.getApiUrl() + '/complete-profile-questions/')
                .map(res => res.json())
                .toPromise();

            // process questions sections
            response.forEach((questionData: any) => {
                let data = {
                    section: '',
                    questions: []
                };

                data.section = questionData.section;

                // process questions
                questionData.items.forEach((question: any) => {
                    // create a question
                    let questionItem:QuestionBase = this.questionManager.getQuestion(question.type, {
                        key: question.key,
                        label: question.label,
                        values: question.values,
                        value: question.value
                    }, question.params);

                    questionItem.validators = [];

                    // add validators
                    if (question.validators) {
                        questionItem.validators = question.validators;
                    }

                    data.questions.push(questionItem);
                    this.questions.push(questionItem);
                });

                this.sections.push(data);
            });

            // register all questions inside a form group
            this.form = this.questionControl.toFormGroup(this.questions);
            this.formReady = true;

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // process questions
            let questions: any = [];
            this.questions.forEach((questionData: QuestionBase) => {
                questions.push({
                    name: questionData.key,
                    value: this.form.value[questionData.key],
                    type: questionData.controlType
                });
            });

            this.updatingUserProfile = true;

            // update questions
            let updatedQuestions: any = await this.api.updateAll('questionsData', questions, {}, {
                suffix: 'me',
                params: {
                    mode: 'completeRequiredQuestions'
                }
            });

            // refresh auth token if exist
            updatedQuestions.forEach((question: any) => {
                if (question.params && question.params.token) {
                    this.auth.setAuthenticated(question.params.token);
                }
            });

            // clear user cached data
            this.apiUtils.clearUserData(this.auth.getUserId(), true);

            // refresh current user's data
            await this.api.find('users', this.auth.getUserId(), {
                params: {
                    with: ['avatar', 'permissions', 'photos', 'memberships']
                }
            });

            loader.dismiss();

            // load dashboard
            this.nav.setRoot(DashboardPage);

            let toast = this.toast.create({
                message: this.translate.instant('profile_updated'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();
        }
        catch (e) {
            loader.dismiss();
            this.updatingUserProfile = false;
        }
    }
}
