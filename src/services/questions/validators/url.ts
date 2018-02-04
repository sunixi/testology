import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseValidator } from './baseValidator';
import { DataStore } from 'js-data';

@Injectable()
export class UrlValidator extends BaseValidator {
    protected baseRegexp: RegExp = /^(http(s)?:\/\/)?((\d+\.\d+\.\d+\.\d+)|(([\w-]+\.)+([a-z,A-Z][\w-]*)))(:[1-9][0-9]*)?(\/?([\w-.\,\/:%+@&*=~]+[\w- \,.\/?:%+@&=*|]*)?)?(#(.*))?$/i;

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
                url: {
                    valid: false
                }
            };
        };
    }

    /**
     * Get regexp
     */
    protected getRegexp(): RegExp {
        let apiRegexp: any = this.api.get('configs', 'urlRegexp');
        let urlRegexp: RegExp = apiRegexp
            ? new RegExp(apiRegexp.value, 'i')
            : this.baseRegexp;

        return urlRegexp;
    }
}
