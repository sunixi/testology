import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Transfer, FileUploadOptions } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { TranslateService } from 'ng2-translate';

// import services
import { AuthService } from '../auth/index';

declare var cordova: any;

export type PhotoUploaderSource = 'camera' | 'library';

@Injectable()
export class PhotoUploaderService {
    public maxFileSizeMb: number = 30;
    public url: string;
    public httpMethod: string = 'POST';
    public successUploadCallback: (any);
    public errorUploadCallback: (any);
    public startUploadingCallback: (any);
    public photoCopiedCallback: (any);

    private image: string;

    // error codes
    public static ERROR_SELECTING_IMAGE: string = 'error_selecting_image';
    public static ERROR_STORING_FILE: string = 'error_storing_file';
    public static ERROR_GETTING_FILE_INFO: string = 'error_getting_file_info';
    public static ERROR_MAX_SIZE_LIMIT_EXCEEDED: string = 'error_max_size_limit_exceeded';
    public static ERROR_UPLOADING_FILE: string = 'error_uploading_file';

    /**
     * Constructor
     */
    constructor(
        private transfer: Transfer,
        private file: File,
        private filePath: FilePath,
        private camera: Camera,
        private platform: Platform,
        private alert: AlertController,
        private auth: AuthService,
        private translate: TranslateService) {}

    /**
     * Take picture
     */
    async takePicture(fromSource: PhotoUploaderSource): Promise<any> {
        try {
            let sourceType: number = fromSource == 'camera'
                ? this.camera.PictureSourceType.CAMERA
                : this.camera.PictureSourceType.PHOTOLIBRARY;

            // create options for the Camera Dialog
            let options: CameraOptions = {
                quality: 100,
                allowEdit: true,
                encodingType: this.camera.EncodingType.JPEG,
                sourceType: sourceType,
                saveToPhotoAlbum: false,
                correctOrientation: true,
                mediaType: this.camera.MediaType.PICTURE
            };

            // get the data of an image
            let imagePath: string = await this.camera.getPicture(options);

            // special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                let filePath: string = await this.filePath.resolveNativePath(imagePath);

                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }
        catch (e) {
            if (this.errorUploadCallback) {
                this.errorUploadCallback.call(null, {
                    type: PhotoUploaderService.ERROR_SELECTING_IMAGE,
                    message: e.message
                });
            }

            if (e != 'no image selected') {
                this.showAlert('error_selecting_image');
            }
        }
    }


    /**
     * Upload image
     */
     uploadImage(imageName: string, imagePath: string): void {
        let language = this.translate.currentLang
            ? this.translate.currentLang
            : this.translate.getDefaultLang();

        let headers = {
            'api-language': language
        };

        // add auth header
        if (this.auth.getToken()) {
            headers[this.auth.getAuthHeaderName()] = this.auth.getAuthHeaderValue();
        }

        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: imageName,
            chunkedMode: false,
            httpMethod: this.httpMethod,
            mimeType: 'image/jpeg',
            params : {
                fileName: imageName
            },
            headers: headers
        };

        const fileTransfer = this.transfer.create();

        // use the FileTransfer to upload the image
        fileTransfer.upload(imagePath, this.url, options)
            .then((data) => {
                if (this.successUploadCallback) {
                    this.successUploadCallback.call(null, data.response);
                }
            }, (err: any) => {
                if (this.errorUploadCallback) {
                    this.errorUploadCallback.call(null, {
                        type: PhotoUploaderService.ERROR_UPLOADING_FILE,
                        message: err.body
                    });
                }

                this.showAlert('error_uploading_file');
            });
    }

    /**
     * Create file name
     */
    private createFileName(): string {
        let d = new Date();

        return  d.getTime() + ".jpg";
    }

    /**
     * Copy file to a local dir
     */
    private async copyFileToLocalDir(namePath, currentName, newFileName): Promise<any> {
        try {
            if (this.startUploadingCallback) {
                this.startUploadingCallback.call(null);
            }

            let directory: any = await this.file.resolveDirectoryUrl(namePath);
            let file: any = await this.file.getFile(directory, currentName, {
                create: false
            });

            file.getMetadata( async (data: any): Promise<any> => {
                try {
                    // check the file  size
                    if (data.size / 1024 / 1024 <= this.maxFileSizeMb) {
                        await this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName);

                        if (this.photoCopiedCallback) {
                            this.photoCopiedCallback.call(null, {
                                name: newFileName,
                                path: this.pathForImage(newFileName)
                            });
                        }

                        // upload file
                        this.image = newFileName;
                        this.uploadImage(this.image, this.pathForImage(this.image));
                    }
                    else {
                        this.errorUploadCallback.call(null, {
                            type: PhotoUploaderService.ERROR_MAX_SIZE_LIMIT_EXCEEDED,
                            message: 'The uploaded file exceeds the max upload filesize'
                        });

                        this.showAlert('error_file_exceeds_max_upload_size', {
                            size: this.maxFileSizeMb
                        });
                    }
                }
                catch (e) {
                    if (this.errorUploadCallback) {
                        this.errorUploadCallback.call(null, {
                            type: PhotoUploaderService.ERROR_STORING_FILE,
                            message: e.message
                        });
                    }

                    this.showAlert('error_storing_file');
                }
            }, (error: any) => {
                if (this.errorUploadCallback) {
                    this.errorUploadCallback.call(null, {
                        type: PhotoUploaderService.ERROR_GETTING_FILE_INFO,
                        message: error.code
                    });
                }

                this.showAlert('error_getting_file_info');
            });
        }
        catch (e) {
            if (this.errorUploadCallback) {
                this.errorUploadCallback.call(null, {
                    type: PhotoUploaderService.ERROR_GETTING_FILE_INFO,
                    message: e.message
                });
            }

            this.showAlert('error_getting_file_info');
        }
    }

    /**
     * Show alert
     */
    private showAlert(description: string, params?: Object): void {
        let alert = this.alert.create({
            title: this.translate.instant('error_occurred'),
            subTitle: this.translate.instant(description, params),
            buttons: [this.translate.instant('ok')]
        });

        alert.present();
    }

    /**
     * Path for image
     */
    private pathForImage(img): string {
        if (img === null) {
            return '';
        }

        return cordova.file.dataDirectory + img;
    }
}
