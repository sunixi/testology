import { Injectable } from '@angular/core';
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './base';

export class QuestionRangeParams extends QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
    min: number;
    max: number;
};

@Injectable()
export class RangeQuestion extends QuestionBase {
    public controlType = 'range';
    public min = 0;
    public max = 100;

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params?: QuestionRangeParams) {

        super(options, params);

        // init extra prams
        if (params) {
            params.min
                ? this.min = params.min
                : null;

            params.max
                ? this.max = params.max
                : null;
        }

        this.value = Object.assign({}, options.value);
    }

    /**
     * On change range
     */
    onChangeRange(): void {
        this.value = this.controlView.value;
    }
}
