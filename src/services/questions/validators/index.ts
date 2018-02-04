import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { RequireValidator } from './require';
import { EmailValidator } from './email';
import { UrlValidator } from './url';
import { UserEmailValidator } from './userEmail';
import { UserNameValidator } from './username';
import { MinLengthValidator } from './minLength';
import { MaxLengthValidator } from './maxLength';
import { IValidator } from './interface';

@Injectable()
export class Validators {
    constructor(
        private urlValidator: UrlValidator,
        private emailValidator: EmailValidator,
        private requireValidator: RequireValidator,
        private userEmailValidator: UserEmailValidator,
        private userNameValidator: UserNameValidator,
        private minLengthValidator: MinLengthValidator,
        private maxLengthValidator: MaxLengthValidator,
        private translate: TranslateService) {}

    /**
     * Get validator list
     */
    protected getValidatorList(): {} {
        return {
            minLength: {
                isAsyncValidator: false,
                validator: this.minLengthValidator,
                defaultMessage: this.translate.instant('min_length_validator_error')
            },
            maxLength: {
                isAsyncValidator: false,
                validator: this.maxLengthValidator,
                defaultMessage: this.translate.instant('max_length_validator_error')
            },
            email: {
                isAsyncValidator: false,
                validator: this.emailValidator,
                defaultMessage: this.translate.instant('email_validator_error')
            },
            url: {
                isAsyncValidator: false,
                validator: this.urlValidator,
                defaultMessage: this.translate.instant('url_validator_error')
            },
            require: {
                isAsyncValidator: false,
                validator: this.requireValidator,
                defaultMessage: this.translate.instant('require_validator_error')
            },
            userEmail: {
                isAsyncValidator: true,
                validator: this.userEmailValidator,
                defaultMessage: this.translate.instant('user_email_validator_error')
            },
            userName: {
                isAsyncValidator: true,
                validator: this.userNameValidator,
                defaultMessage: this.translate.instant('user_name_validator_error')
            }
        };
    }

    /**
     * Is validator exists
     */
    public isValidatorExists(name: string): boolean {
        return name in this.getValidatorList();
    }

    /**
     * Get validator
     */
    public getValidator(name: string): IValidator {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].validator;
        }

        throw new TypeError(`Unsupported validator ${name}`);
    }

    /**
     * Get default message
     */
    public getDefaultMessage(name: string): string {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].defaultMessage;
        }
    }

    /**
     * Is  async validator
     */
    public isAsyncValidator(name: string): boolean {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].isAsyncValidator;
        }

        return false;
    }
}
