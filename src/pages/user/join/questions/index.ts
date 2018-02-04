import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, LoadingController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// questions
import { QuestionControlService } from '../../../../services/questions/control-service';
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionBase }  from '../../../../services/questions/questions/base';

// pages
import { DashboardPage } from '../../../dashboard/index';

// services
import { AuthService } from '../../../../services/auth/index';

// shared components
import { CustomPageComponent } from '../../../../shared/components/customPage/index';

@Component({
    selector: 'join-questions',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class JoinQuestionsPage implements OnInit {
    @Input() private questions = <any>[]; // list of questions
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;
    private currentGender: number;
    private creatingUserProfile = false;
    private initialData: any;
    private tosValue: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private nav: NavController,
        private loadingCtrl: LoadingController,
        private api: DataStore,
        private questionControl: QuestionControlService,
        private navParams: NavParams,
        private questionManager: QuestionManager,
        private translate: TranslateService,
        private alert: AlertController,
        private auth: AuthService,
        private modalCtrl: ModalController)
    {
        this.initialData = this.navParams.get('initial');
        this.currentGender = this.initialData.sex;
    }

    /**
     * Is TOS active
     */
    get isTosActive(): boolean {
        return this.api.get('configs', 'isTosActive').value;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        // load questions
        try {
            await loader.present();
            let data: any = await this.api.getMapper('joinQuestions').find(this.currentGender); // don't cache items

            // process questions
            data.questions.forEach((questionData: any) => {
                let data = {
                    section: '',
                    questions: []
                };

                data.section = questionData.section;

                questionData.items.forEach((question: any) => {
                    let questionItem: QuestionBase = this.questionManager.getQuestion(question.type, {
                        key: question.key,
                        label: question.label,
                        values: question.values,
                        value: question.value
                    }, question.params);

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
     * Is tos valid
     */
    isTosValid(): boolean {
        return this.isTosActive && this.tosValue || !this.isTosActive;
    }

    /**
     * Show tos modal
     */
    showTosModal(): void {
        let modal = this.modalCtrl.create(CustomPageComponent, {
            title: this.translate.instant('tos_page_header'),
            pageName: 'tos_page_content'
        });

        modal.present();
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        // show loader
        this.creatingUserProfile = true;
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // create user profile
            let userData: any = await this.api.getMapper('users').create({
                userName: this.initialData.userName,
                email: this.initialData.email,
                password: this.initialData.password,
                sex: this.initialData.sex,
                avatarKey: this.initialData.avatarKey
            });

            // set user authenticated
            this.auth.setAuthenticated(userData.token);

            // create questions
            let processedQuestions = [];
            this.questions.forEach((questionData: QuestionBase) => {
                processedQuestions.push({
                    name: questionData.key,
                    value: this.form.value[questionData.key],
                    type: questionData.controlType
                });
            });

            // add match sex
            processedQuestions.push({
                name: 'match_sex',
                value: this.initialData.lookingFor,
                type: QuestionManager.TYPE_MULTICHECKBOX
            });

            // create questions
            await this.api.createMany('questionsData', processedQuestions);

            loader.dismiss();
            this.nav.setRoot(DashboardPage);
        }
        catch (e) {
            loader.dismiss();
            this.creatingUserProfile = false;

            let alert = this.alert.create({
                title: this.translate.instant('error_occurred'),
                subTitle: this.translate.instant('profile_create_error'),
                buttons: [this.translate.instant('ok')]
            });

            alert.present();
        }
    }
}
