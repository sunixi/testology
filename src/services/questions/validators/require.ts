import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseValidator } from './baseValidator';

@Injectable()
export class RequireValidator extends BaseValidator {
    /**
     * Validate
     */
    validate(): Function {
        return (control: FormControl): {[key: string]: any} => {
            let isValid = this.isValid(control.value);

            return isValid ? null : {
                require: {
                    valid: false
                }
            };
        };
    }

    /**
     * Is valid
     */
     isValid(value: any): boolean {
        let varType = typeof value;
        let isValid = false;

        switch (varType) {
            case 'string' :
            case 'number' :
                isValid = value.toString().trim() != '';
                break;

            case 'boolean' :
                isValid = value === true;
                break;

            case 'object' :
                if (Array.isArray(value)) {
                    isValid = value.length > 0;
                } else {
                    let emptyProperties = false;

                    // check all object's properties
                    Object.getOwnPropertyNames(value).forEach((propertyName) => {
                        if (!this.isValid(value[propertyName])) {
                            emptyProperties = true;
                        }
                    });

                    isValid = !emptyProperties;
                }
                break;

            default :
        }

        return isValid;
    }
}
