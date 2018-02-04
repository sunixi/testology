import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadingController, ActionSheetController, Nav } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';

// pages
import { JoinQuestionsPage } from '../questions/index';

// services
import { ConfigService } from '../../../../services/config/index';
import { PhotoUploaderService } from '../../../../services/photoUploader/index';

// questions
import { QuestionControlService } from '../../../../services/questions/control-service';
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionBase }  from '../../../../services/questions/questions/base';

@Component({
    selector: 'join-initial',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager,
        PhotoUploaderService
    ]
})
export class JoinInitialPage implements OnInit {
    @Input() private questions = <any>[]; // list of questions
    private sections: any = [];
    private form: FormGroup;
    private formReady: boolean = false;
    private avatarUrl: string = null;
    private avatarKey: string = null;
    private avatarUploaded: boolean = false;
    public avatarUploadInProgress: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private loadingCtrl: LoadingController,
        private api: DataStore,
        private questionControl: QuestionControlService,
        private actionSheetCtrl: ActionSheetController,
        private photoUploader: PhotoUploaderService,
        private config: ConfigService,
        private translate: TranslateService,
        private navCtrl: Nav,
        private questionManager: QuestionManager)
    {
        // init photo uploader
        this.photoUploader.url = this.config.getApiUrl() + '/avatars/';
        this.photoUploader.maxFileSizeMb = this.avatarMaxUploadSize;
        this.photoUploader.successUploadCallback = (response) => {
            response = JSON.parse(response);

            this.avatarUrl = response.url;
            this.avatarKey = response.key;
            this.avatarUploaded = true;
            this.avatarUploadInProgress = false;
        };

        this.photoUploader.startUploadingCallback = () => this.avatarUploadInProgress = true;
        this.photoUploader.errorUploadCallback = () => this.avatarUploadInProgress = false;
    }

    /**
     * Avatar max upload size
     */
    get avatarMaxUploadSize(): number {
        return this.api.get('configs', 'avatarMaxUploadSize').value;
    }

    /**
     * Is avatar hidden
     */
    get isAvatarHidden(): boolean {
        return this.api.get('configs', 'isAvatarHidden').value;
    }

    /**
     * Is avatar required
     */
    get isAvatarRequired(): boolean {
        return this.api.get('configs', 'isAvatarRequired').value;
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        // load genders
        try {
            await loader.present();
            let genders: any = await this.api.findAll('userGenders');

            // process genders
            let genderList = [];
            genders.forEach((gender) => genderList.push({
                value: gender.id,
                title: gender.name
            }));

            // questions list
            let questions = [
                {
                    section: '',
                    questions: [
                        {
                            type: QuestionManager.TYPE_TEXT,
                            key: 'userName',
                            label: this.translate.instant('username_input'),
                            validators: [
                                {name: 'require'},
                                {name: 'userName'}
                            ],
                            params: {
                                stacked: true
                            }
                        },
                        {
                            type: QuestionManager.TYPE_PASSWORD,
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
                            ],
                            params: {
                                stacked: true
                            }
                        },
                        {
                            type: QuestionManager.TYPE_PASSWORD,
                            key: 'repeatPassword',
                            label: this.translate.instant('password_repeat_input'),
                            validators: [
                                {name: 'require'}
                            ],
                            params: {
                                stacked: true
                            }
                        }
                    ]
                },
                {
                    section: this.translate.instant('base_input_section'),
                    questions: [
                        {
                            type: QuestionManager.TYPE_EMAIL,
                            key: 'email',
                            label: this.translate.instant('email_input'),
                            validators: [
                                {name: 'require'},
                                {name: 'userEmail'},
                            ],
                            params: {
                                stacked: true
                            }
                        },
                        {
                            type: QuestionManager.TYPE_SELECT,
                            key: 'sex',
                            label: this.translate.instant('gender_input'),
                            values: genderList,
                            validators: [
                                {name: 'require'}
                            ]
                        },
                        {
                            type: QuestionManager.TYPE_MULTICHECKBOX,
                            key: 'lookingFor',
                            label: this.translate.instant('looking_for_input'),
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
                    let params: any = question.params ? question.params : {};

                    let questionItem: QuestionBase = this.questionManager.getQuestion(question.type, {
                        key: question.key,
                        label: question.label,
                        values: question.values,
                        value: question.value
                    }, params);

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
            this.form = this.questionControl.toFormGroup(this.questions, (formGroup: FormGroup) => {
                if (formGroup.get('password').value === formGroup.get('repeatPassword').value) {
                    return null;
                }

                return {
                    message: this.translate.instant('password_repeat_validator_error'),
                    question: 'repeatPassword'
                };
            });

            this.formReady = true;
            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Is avatar valid
     */
    get isAvatarValid(): boolean {
        return this.isAvatarHidden || !this.isAvatarRequired || (this.avatarUploaded && !this.avatarUploadInProgress);
    }

    /**
     * Ask for image source
     */
    askForImageSource(): void {
        if (!this.avatarUploadInProgress) {
            let buttons: any = [
                {
                    text: this.translate.instant('take_avatar'),
                    handler: () => this.photoUploader.takePicture('camera')
                },
                {
                    text: this.translate.instant('choose_avatar_from_library'),
                    role: 'choose',
                    handler: () => this.photoUploader.takePicture('library')
                },
                {
                    text: this.translate.instant('cancel'),
                    role: 'cancel'
                }
            ];

            let actionSheet = this.actionSheetCtrl.create({
                title: this.translate.instant('upload_avatar'),
                buttons: buttons
            });

            actionSheet.present();
        }
    }

    /**
     * Submit form
     */
    submit(): void {
        let initialData = Object.assign({}, this.form.value, {
            avatarKey: this.avatarKey
        });

        this.navCtrl.push(JoinQuestionsPage, {
            initial: initialData
        });
    }
}
