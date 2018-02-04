import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export class QuestionBaseOptions {
    value: any;
    values: {value: string | number, title: string}[];
    key: string;
    label: string;
    controlType: string;
    validators: {name: string, message?: string, params?: {}}[];
};

export class QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
};

@Injectable()
export class QuestionBase {
    public controlView: AbstractControl;
    public value: any;
    public values: {value: string | number, title: string}[];
    public key: string;
    public label: string;
    public controlType: string;
    public validators: {name: string, message?: string, params?: {}}[];
    public params: {questionClass?: string, hideErrors?: boolean, hideWarning?: boolean};

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params: QuestionBaseParams) {

        this.value = options.value;
        this.values = options.values || null;
        this.key = options.key || '';
        this.label = options.label || '';
        this.controlType = options.controlType || '';
        this.validators = options.validators || null;
        this.params = params;
    }

    /**
     * Set control
     */
    setControl(controlView: AbstractControl): void {
        this.controlView = controlView;
    }

    /**
     * Set validators
     */
    setValidators(validators: {name: string, message?: string, params?: {}}[]) {
        this.validators = validators;
    }

    /**
     * Get type
     */
    getType(): string {
        return this.controlType;
    }
}
