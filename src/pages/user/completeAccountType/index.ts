import { Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit} from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// services
import { AuthService } from '../../../services/auth/index';
import { ApiUtilsService } from '../../../services/api/utils';

// questions
import { QuestionControlService } from '../../../services/questions/control-service';
import { QuestionManager } from '../../../services/questions/manager';
import { QuestionBase }  from '../../../services/questions/questions/base';

// pages
import { DashboardPage } from '../../dashboard/index';

@Component({
    selector: 'complete-account-type',
    templateUrl: 'index.html',
    providers: [
        forwardRef(() => QuestionControlService),
        forwardRef(() => QuestionManager),
        ApiUtilsService
    ]
})
export class CompleteAccountTypePage implements OnInit  {
    @Input() private questions = <any>[]; // list of questions
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;
    private updatingUserProfile: boolean = false;
    private questionControl: QuestionControlService;
    private questionManager: QuestionManager;

    /**
     * Constructor
     */
    constructor(
        private loadingCtrl: LoadingController,
        private auth:AuthService,
        private api:DataStore,
        private apiUtils:ApiUtilsService,
        private nav: NavController,
        private toast: ToastController,
        private translate: TranslateService,
        @Inject(forwardRef(() => QuestionControlService)) questionControl: QuestionControlService,
        @Inject(forwardRef(() => QuestionManager)) questionManager: QuestionManager)
    {
        this.questionControl = questionControl;
        this.questionManager = questionManager;
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
            let genders: any = await this.api.findAll('userGenders');

            // process genders
            let genderList = [];
            genders.forEach((gender) => {
                genderList.push({
                    value: gender.id,
                    title: gender.name
                });
            });

            // questions list
            let questions = [
                {
                    section: '',
                    questions: [
                        {
                            type: QuestionManager.TYPE_SELECT,
                            key: 'accountType',
                            label: this.translate.instant('gender_input'),
                            values: genderList,
                            validators: [
                                {name: 'require'}
                            ]
                        }
                    ]
                }
            ];

            // process questions
            questions.forEach((questionData: any) => {
                let data = {
                    section: '',
                    questions: []
                };

                data.section = questionData.section;

                questionData.questions.forEach((question: any) => {
                    let questionItem: QuestionBase = this.questionManager.getQuestion(question.type, {
                        key: question.key,
                        label: question.label,
                        values: question.values
                    });

                    // add validators
                    if (question.validators) {
                        questionItem.validators = question.validators;
                    }

                    data.questions.push(questionItem);
                    this.questions.push(questionItem);
                });

                this.sections.push(data);

                // register all questions inside a form group
                this.form = this.questionControl.toFormGroup(this.questions);
                this.formReady = true;

                loader.dismiss();
            });
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

            this.updatingUserProfile = true;

            // update questions
            await this.api.update('users', this.auth.getUserId(), {
                accountType: this.form.value['accountType']
            }, {
                params: {
                    mode: 'completeAccountType'
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
