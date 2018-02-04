import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Events, LoadingController, AlertController, ToastController, ActionSheetController, NavController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { TranslateService } from 'ng2-translate';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// questions
import { QuestionControlService } from '../../../../services/questions/control-service';
import { QuestionManager } from '../../../../services/questions/manager';
import { QuestionBase }  from '../../../../services/questions/questions/base';

// pages
import { EditUserPhotosPage } from '../photos/index';

// base classes
import { BasePhotoEdit, PhotoRefreshType, PhotoUnit } from '../basePhotoEdit'

// services
import { AuthService } from '../../../../services/auth/index';
import { PhotoUploaderService } from '../../../../services/photoUploader/index';
import { ConfigService } from '../../../../services/config/index';
import { PermissionsService } from '../../../../services/permissions/index';
import { SecureHttpService } from '../../../../services/http/index';
import { ApiUtilsService } from '../../../../services/api/utils';

@Component({
    selector: 'edit-user-questions',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager,
        PhotoUploaderService,
        ApiUtilsService
    ]
})

export class EditUserQuestionsPage extends BasePhotoEdit implements OnInit {
    @Input() private questions = <any>[]; // list of questions

    private sections: any = [];
    private form:FormGroup;
    private formReady: boolean = false;
    private updatingUserProfile:boolean = false;
    private questionsCount: number = 0;
    private visiblePhotos = 7;

    /**
     * Constructor
     */
    constructor(
        protected ref: ChangeDetectorRef,
        protected events: Events,
        protected photoUploader: PhotoUploaderService,
        protected config: ConfigService,
        protected http: SecureHttpService,
        protected loadingCtrl: LoadingController,
        protected actionSheetCtrl: ActionSheetController,
        protected alert: AlertController,
        protected toast: ToastController,
        protected permissions: PermissionsService,
        protected nav: NavController,
        protected translate: TranslateService,
        protected photoViewer: PhotoViewer,
        protected api: DataStore,
        protected auth:AuthService,
        private apiUtils:ApiUtilsService,
        private questionControl:QuestionControlService,
        private questionManager:QuestionManager)
    {
        super(
            ref,
            events,
            photoUploader,
            config,
            http,
            loadingCtrl,
            actionSheetCtrl,
            alert,
            toast,
            permissions,
            nav,
            translate,
            api,
            auth,
            photoViewer);
    }

    /**
     * Component init
     */
    async ngOnInit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            // clear user cached data
            this.apiUtils.clearUserData(this.auth.getUserId());

            // load all pages dependencies
            let [editQuestions] = await Promise.all([
                this.api.getMapper('editQuestions').findAll({}), // get all edit questions (don't cache items)
                this.api.findAll('questionsData'), // get all questions data (cache them)
                this.api.find('users', this.auth.getUserId(), { // get logged user info with relations
                    params: {
                        with: ['avatar', 'permissions', 'photos', 'memberships']
                    }
                })
            ]);

            // init user avatar
            if (this.currentUser.avatar && this.currentUser.avatar.id) {
                this.initAvatar(this.currentUser.avatar);
            }

            let questionsData: any = this.api.getAll('questionsData'); // list of questions data

            // process questions
            if (editQuestions && editQuestions.questions) {
                editQuestions.questions.forEach((questionData:any) => {
                    let data = {
                        section: '',
                        questions: []
                    };

                    data.section = questionData.section;

                    questionData.items.forEach((question:any) => {
                        // get value from question data
                        let questionValue: any = questionsData.filter((item) => {
                            return item.name == question.key;
                        });

                        // create a question
                        let questionItem:QuestionBase = this.questionManager.getQuestion(question.type, {
                            key: question.key,
                            label: question.label,
                            values: question.values,
                            value: (questionValue.length ? questionValue[0].value : null)
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
            }

            // load photos
            this.loadPhotoList();

            // register all questions inside a form group
            this.form = this.questionControl.toFormGroup(this.questions);
            this.formReady = true;
            this.questionsCount = this.questions.length;

            loader.dismiss();
        }
        catch (e) {
            loader.dismiss();
        }
    }

    /**
     * Is avatar valid
     */
    isAvatarValid(): boolean {
        return !BasePhotoEdit.isAvatarRequired || (BasePhotoEdit.isAvatarRequired && BasePhotoEdit.avatarUploaded);
    }

    ionViewWillEnter(): void {
        // refresh photo list
        this.loadPhotoList();
    }

    /**
     * Submit form
     */
    async submit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            let questions: any = [];

            // process questions
            this.questions.forEach((questionData: QuestionBase) => {
                questions.push({
                    name: questionData.key,
                    value: this.form.value[questionData.key],
                    type: questionData.controlType
                });
            });

            this.updatingUserProfile = true;

            // update questions
            let updatedQuestions: any = await this.api.updateAll('questionsData', questions, {}, {suffix: 'me'});

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

            this.updatingUserProfile = false;
            loader.dismiss();

            let toast = this.toast.create({
                message: this.translate.instant('profile_updated'),
                closeButtonText: this.translate.instant('ok'),
                showCloseButton: true,
                duration: this.toastDuration
            });

            toast.present();

            this.events.publish('user:updated');
        }
        catch (e) {
            loader.dismiss();
            this.updatingUserProfile = false;
        }
    }

    /**
     * Refresh photo list
     */
    protected refreshPhotoList(refreshType: PhotoRefreshType): void {
        this.loadPhotoList();
    }

    /**
     * Load photo list
     */
    protected loadPhotoList(): void {
        this.photos = []; // clear current photo list
        let photos: PhotoUnit[] = [];

        photos.push(new PhotoUnit(
            BasePhotoEdit.avatarId,
            BasePhotoEdit.avatarUrl ? BasePhotoEdit.avatarUrl : BasePhotoEdit.defaultAvatar,
            BasePhotoEdit.bigAvatarUrl ? BasePhotoEdit.bigAvatarUrl : BasePhotoEdit.bigDefaultAvatar,
            'avatar',
            BasePhotoEdit.isAvatarActive
        ));

        // get user photos
        let apiPhotos = this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            },
            orderBy: [
                ['id', 'DESC']
            ],
            limit: this.visiblePhotos
        });

        // process photos
        for (let i = 0; i < this.visiblePhotos; i++) {
            let photoDetails = apiPhotos && apiPhotos[i] ? apiPhotos[i] : null;

            photos.push(new PhotoUnit(
                photoDetails ? photoDetails.id : null,
                photoDetails ? photoDetails.url : null,
                photoDetails ? photoDetails.bigUrl : null,
                'photo',
                photoDetails ? photoDetails.approved : true
            ));
        }

        photos.push(new PhotoUnit(
            null,
            null,
            null,
            'more',
            true
        ));

        // chunk photos
        for (let i = 0; i < photos.length; i += this.photosPerRow) {
            this.photos.push(photos.slice(i, i + this.photosPerRow));
        }
    }

    /**
     * Get extra photo actions
     */
    protected getExtraPhotoActions(type: string, id?: number): [any] {
        let buttons = <any>[];

        switch (type) {
            case 'more' :
                buttons.push({
                    text: this.translate.instant('view_all_photos'),
                    handler: () => this.nav.push(EditUserPhotosPage)
                });

                if (this.permissions.isActionAllowed('photo_upload')
                        || this.permissions.isActionPromoted('photo_upload')) {

                    buttons.push({
                        text: this.translate.instant('take_photo'),
                        handler: () => this.permissions.isActionAllowed('photo_upload')
                            ? this.takePhoto('photo', 'camera')
                            : this.permissions.showAccessDeniedAlert()
                    });

                    buttons.push({
                        text: this.translate.instant('choose_photo_from_library'),
                        handler: () => this.permissions.isActionAllowed('photo_upload')
                            ? this.takePhoto('photo', 'library')
                            : this.permissions.showAccessDeniedAlert()
                    });
                }
                break;

            default :
        }

        return buttons;
    }
}
