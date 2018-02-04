import { Injectable } from '@angular/core';
import { QuestionBaseOptions } from './base';
import { DateQuestion, QuestionDateParams } from './date';

@Injectable()
export class DateRangeQuestion extends DateQuestion {
    public controlType = 'date_range';
    protected questionChanged = false;

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params?: QuestionDateParams) {

        super(options, params);

        this.value = Object.assign({}, options.value);
    }

    /**
     * Update date
     */
    update(): void {
        if (!this.questionChanged) {
            this.controlView.markAsDirty();
            this.controlView.markAsTouched();
            this.questionChanged = true;
        }

        // trigger manually about update in the question
        this.controlView.updateValueAndValidity();
    }
}
