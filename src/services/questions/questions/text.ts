import { Injectable } from '@angular/core';
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './base';

export class QuestionTextOptions extends QuestionBaseOptions {
    value: any;
    values: {value: string | number, title: string}[];
    key: string;
    label: string;
    type: string;
    validators: {name: string, message?: string, params?: {}}[];
};

export class QuestionTextParams extends QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
    stacked: boolean;
};

@Injectable()
export class TextQuestion extends QuestionBase {
    public controlType = 'text';
    public stackedInput: boolean = false;
    public type: string;

    /**
     * Constructor
     */
    constructor(options: QuestionTextOptions, params?: QuestionTextParams) {

        super(options, params);

        this.type = options['type'] || '';

        if (params && params.stacked) {
            this.stackedInput = true;
        }
    }

    /**
     * Get type
     */
    getType(): string {
        return this.type ? this.type : this.controlType;
    }
}
