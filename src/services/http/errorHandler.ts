import { Injectable } from '@angular/core';
import { App, Events } from 'ionic-angular';

// services
import { AuthService } from '../auth/index';

// pages
import { LoginPage } from '../../pages/user/login/index'
import { UserDisapprovedPage } from '../../pages/user/disapproved/index'
import { VerifyEmailCheckCodePage } from "../../pages/user/verifyEmail/checkCode/index";
import { AppMaintenancePage } from '../../pages/appMaintenance/index'
import { CompleteProfilePage } from '../../pages/user/completeProfile/index'
import { CompleteAccountTypePage } from '../../pages/user/completeAccountType/index'
import { AppConnectionErrorPage } from '../../pages/appConnectionError/index'
import { AppErrorPage } from '../../pages/appError/index'

@Injectable()
export class HttpErrorHandlerService {
    private isHandleHttpErrors: boolean = true;

    public static HTTP_ERROR_NO_INTERNET_CONNECTION: number = 0;
    public static HTTP_ERROR_NOT_AUTHORIZED: number = 401;
    public static HTTP_ERROR_FORBIDDEN: number = 403;

    // forbidden types
    public static HTTP_ERROR_FORBIDDEN_DISAPPROVED: string = 'disapproved';
    public static HTTP_ERROR_FORBIDDEN_SUSPENDED: string = 'suspended';
    public static HTTP_ERROR_FORBIDDEN_EMAIL_NOT_VERIFIED: string = 'emailNotVerified';
    public static HTTP_ERROR_FORBIDDEN_MAINTENANCE: string = 'maintenance';
    public static HTTP_ERROR_FORBIDDEN_PROFILE_NOT_COMPLETED: string = 'profileNotCompleted';
    public static HTTP_ERROR_FORBIDDEN_ACCOUNT_TYPE_NOT_COMPLETED: string = 'accountTypeNotCompleted';

    /**
     * Constructor
     */
    constructor(
        private events: Events,
        private app: App,
        private auth: AuthService) {}

    /**
     * Set application handle http errors
     */
    setHandleHttpErrors(isHandleHttpErrors: boolean): void {
        this.isHandleHttpErrors = isHandleHttpErrors;
    }

    /**
     * Handle error
     */
    public handleError(errorCode: number, errorType?: string, errorDescription?: string, force: boolean = false): void {
        if (!this.isHandleHttpErrors && !force) {
            return;
        }

        this.events.publish('http:error', {
            errorCode: errorCode,
            errorType: errorType,
            errorDescription: errorDescription
        });

        switch (errorCode) {
            case HttpErrorHandlerService.HTTP_ERROR_NO_INTERNET_CONNECTION: // 0
                this.app.getRootNav().setRoot(AppConnectionErrorPage);

                break;

            case HttpErrorHandlerService.HTTP_ERROR_NOT_AUTHORIZED: // 401
                this.auth.logout();
                this.app.getRootNav().setRoot(LoginPage);

                break;

            case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN: // 403
                switch (errorType) {
                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_DISAPPROVED :
                        this.app.getRootNav().setRoot(UserDisapprovedPage, {
                            status: 'disapproved',
                        });

                        break;

                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_SUSPENDED :
                        this.app.getRootNav().setRoot(UserDisapprovedPage, {
                            status: 'suspended',
                            description: errorDescription
                        });

                        break;

                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_EMAIL_NOT_VERIFIED :
                        this.app.getRootNav().setRoot(VerifyEmailCheckCodePage);

                        break;

                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_PROFILE_NOT_COMPLETED :
                        this.app.getRootNav().setRoot(CompleteProfilePage);

                        break;

                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_ACCOUNT_TYPE_NOT_COMPLETED :
                        this.app.getRootNav().setRoot(CompleteAccountTypePage);

                        break;

                    case HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_MAINTENANCE :
                        this.app.getRootNav().setRoot(AppMaintenancePage);

                        break;

                    default :
                        this.app.getRootNav().setRoot(AppErrorPage);
                }

                break;

            default : // 404, 500, etc
                this.app.getRootNav().setRoot(AppErrorPage);
        }
    }
}

