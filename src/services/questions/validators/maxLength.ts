import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseValidator } from './baseValidator';

@Injectable()
export class MaxLengthValidator extends BaseValidator {
    /**
     * Validate
     */
    validate(): Function {
        return (control: FormControl): {[key: string]: any} => {
            let params: any = this.params;

            return control.value.length <= params.length ? null : {
                maxLength: {
                    valid: false
                }
            };
        };
    }
}
