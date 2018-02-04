import { Component, Input, OnInit } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// questions
import { QuestionControlService } from '../../../../../../services/questions/control-service';
import { QuestionManager } from '../../../../../../services/questions/manager';
import { QuestionBase }  from '../../../../../../services/questions/questions/base';

@Component({
    selector: 'user-search-filter',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class UserSearchFilterComponent implements OnInit {
    @Input() private questions = <any>[]; // list of questions
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;
    private searchFilter: {} = {};
    private genderList: any[] = [];
    private allSearchQuestions: any [];

    /**
     * Constructor
     */
    constructor(
        private translate: TranslateService,
        private questionControl: QuestionControlService,
        private questionManager: QuestionManager,
        private api: DataStore,
        private loadingCtrl: LoadingController,
        private viewCtrl: ViewController,
        private navParams: NavParams)
    {
        let filter: {name: string, value: any, type: string}[] = this.navParams.get('filter');

        if (filter.length) {
            filter.forEach((question) => {
                this.searchFilter[question.name] = question.value;
            });
        }
    }

    /**
     * Is photo question active
     */
    get isPhotoQuestionActive(): boolean {
        return this.api.get('configs', 'showWithPhotoOnlyInSearch').value;
    }

    /**
     * Is online question active
     */
    get isOnlineQuestionActive(): boolean {
        return this.api.get('configs', 'showOnlineOnlyInSearch').value;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        // load questions
        try {
            await loader.present();

            // load all pages dependencies
            let [searchQuestions, genders, questionsData] = await Promise.all([
                this.api.getMapper('searchQuestions').findAll({}), // get all search questions (don't cache items),
                this.api.findAll('userGenders', {}, {force: true}), // force refresh genders
                this.api.findAll('questionsData'), // get all questions data (cache them)
            ]);

            this.allSearchQuestions = searchQuestions;

            // process genders
            genders.forEach((gender) => this.genderList.push({
                value: gender.id,
                title: gender.name
            }));

            // search default preferred account type
            if (!this.searchFilter['match_sex']) {
                let preferredAccountType = questionsData.filter((question) => {
                    return question.name == 'match_sex';
                });

                this.searchFilter['match_sex'] = preferredAccountType[0]
                    ? preferredAccountType[0].value[0]
                    : '';
            }

            this.initForm();
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
            this.viewCtrl.dismiss([]);
        }
    }

    /**
     * Dismiss
     */
    dismiss(): void {
        this.viewCtrl.dismiss([]);
    }

    /**
     * Close
     */
    close(): void {
        let processedQuestions = [];

        this.questions.forEach((questionData: QuestionBase) => {
            processedQuestions.push({
                name: questionData.key,
                value: this.form.value[questionData.key],
                type: questionData.controlType
            });
        });

        this.viewCtrl.dismiss(processedQuestions);
    }

    /**
     * Init form
     */
    protected initForm(): void {
        this.questions = [];
        this.sections  = [];

        let hardcodedQuestions = {
            section: this.translate.instant('advanced_search_input_section'),
            items: []
        };

        // hardcoded questions list
        hardcodedQuestions.items.push({
            type: QuestionManager.TYPE_SELECT,
            key: 'match_sex',
            label: this.translate.instant('looking_for_input'),
            values: this.genderList,
            validators: [
                {name: 'require'}
            ],
            params: {
                hideEmptyValue: true
            }
        });

        if (this.isOnlineQuestionActive) {
            hardcodedQuestions.items.push({
                type: QuestionManager.TYPE_CHECKBOX,
                key: 'online',
                label: this.translate.instant('online_input'),
                value: false
            });
        }

        if (this.isPhotoQuestionActive) {
            hardcodedQuestions.items.push({
                type: QuestionManager.TYPE_CHECKBOX,
                key: 'with_photo',
                label: this.translate.instant('with_photo_input'),
                value: false
            });
        }

        this.processQuestions([hardcodedQuestions]);

        // process search questions
        if (this.allSearchQuestions[this.searchFilter['match_sex']]
                && this.allSearchQuestions[this.searchFilter['match_sex']].length) {

            this.processQuestions(this.allSearchQuestions[this.searchFilter['match_sex']]);
        }

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
        this.formReady = true;

        // looking for "match_sex" changes
        this.form.valueChanges.subscribe((question: any) => {
            if (question.match_sex && question.match_sex != this.searchFilter['match_sex']) {
                this.searchFilter = Object.assign({}, this.searchFilter, question);
                this.initForm();

                return;
            }

            this.searchFilter = Object.assign({}, this.searchFilter, question);
        });
    }

    /**
     * Process questions
     */
    protected processQuestions(questions: any[]): void {
        questions.forEach((questionData: any) => {
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
                    value: this.searchFilter[question.key] ? this.searchFilter[question.key] : question.value
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
    }
}
