import { Injectable } from '@angular/core';
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './base';

export class QuestionDateParams extends QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
    minDate: string;
    maxDate: string;
    displayFormat: string;
};

@Injectable()
export class DateQuestion extends QuestionBase {
    public controlType = 'date';
    public displayFormat: string = 'MMM DD, YYYY';
    public minDate: string;
    public maxDate: string;

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params?: QuestionDateParams) {

        super(options, params);

        // init default max and min date range
        let currentTime = new Date();
        this.maxDate = currentTime.getFullYear().toString();
        this.minDate = (currentTime.getFullYear() - 100).toString();

        // init extra prams
        if (params) {
            params.displayFormat
                ? this.displayFormat = params.displayFormat
                : null;

            params.minDate
                ? this.minDate = params.minDate
                : null;

            params.maxDate
                ? this.maxDate = params.maxDate
                : null;
        }
    }
}
