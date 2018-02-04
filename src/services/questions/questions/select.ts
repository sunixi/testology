import { Injectable } from '@angular/core';
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './base';

export class QuestionSelectOptions extends QuestionBaseOptions {
    value: any;
    values: {value: string | number, title: string}[];
    key: string;
    label: string;
    multiple: boolean;
    validators: {name: string, message?: string, params?: {}}[];
};

export class QuestionSelectParams extends QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
    hideEmptyValue: boolean;
};

@Injectable()
export class SelectQuestion extends QuestionBase {
    public controlType = 'select';
    public multiple: boolean;
    public hideEmptyValue: boolean = false;

    /**
     * Constructor
     */
    constructor(options: QuestionSelectOptions, params?: QuestionSelectParams) {

        super(options, params);

        this.multiple = options['multiple'] || false;

        // init extra params
        if (params) {
            params.hideEmptyValue
                ? this.hideEmptyValue = params.hideEmptyValue
                : false;
        }
    }
}
