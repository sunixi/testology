import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { FormGroup } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';

// questions
import { QuestionManager } from '../../../services/questions/manager';
import { QuestionControlService } from '../../../services/questions/control-service';
import { QuestionBase }  from '../../../services/questions/questions/base';

// services
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';

@Component({
    selector: 'flag',
    templateUrl: './index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})
export class FlagComponent implements OnInit {
    @Input() private questions = <any>[]; // list of questions

    private identityId: number;
    private entityType: string;
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private config: ConfigService,
        private http: SecureHttpService,
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private translate: TranslateService,
        private questionControl: QuestionControlService,
        private questionManager: QuestionManager)
    {
        this.identityId = this.navParams.get('identityId');
        this.entityType = this.navParams.get('entityType');
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        // questions list
        let questions = [
            {
                section: '',
                questions: [
                    {
                        type: QuestionManager.TYPE_SELECT,
                        key: 'reason',
                        label: this.translate.instant('flag_input'),
                        values: [{
                            value: 'spam',
                            title: this.translate.instant('flag_as_spam')
                        },
                        {
                            value: 'offence',
                            title: this.translate.instant('flag_as_offence')
                        },
                        {
                            value: 'illegal',
                            title: this.translate.instant('flag_as_illegal')
                        }],
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
        });
    }

    /**
     * Return back
     */
    returnBack(): void {
        this.viewCtrl.dismiss({
            reported: false
        });
    }

    /**
     * Submit form
     */
    submit(): void {
        try {
            let flagData = Object.assign({}, this.form.value, {
                identityId: this.identityId,
                entityType: this.entityType
            });

            this.http.post(this.config.getApiUrl() + '/flags/', JSON.stringify(flagData))
                .toPromise();

            this.viewCtrl.dismiss({
                reported: true
            });
        }
        catch (e) {
            this.viewCtrl.dismiss({
                reported: false
            });
        }
    }
}
