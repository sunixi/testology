import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseValidator } from './baseValidator';
import { DataStore } from 'js-data';

@Injectable()
export class EmailValidator extends BaseValidator {
    protected baseRegexp: RegExp = /^([\w\-\.\+\%]*[\w])@((?:[A-Za-z0-9\-]+\.)+[A-Za-z]{2,})$/;

    /**
     * Constructor
     */
    constructor(private api: DataStore) {
        super();
    }

    /**
     * Validate
     */
    validate(): Function {
        return (control: FormControl): {[key: string]: any} => {
            return this.getRegexp().test(control.value) || !control.value.trim() ? null : {
                email: {
                    valid: false
                }
            };
        };
    }

    /**
     * Get regexp
     */
    protected getRegexp(): RegExp {
        let apiRegexp: any = this.api.get('configs', 'emailRegexp');
        let emailRegexp: RegExp = apiRegexp
            ? new RegExp(apiRegexp.value)
            : this.baseRegexp;

        return emailRegexp;
    }
}
