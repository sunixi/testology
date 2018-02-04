import { Injectable } from '@angular/core';
import { GoogleMapLocationQuestion } from './googlemapLocation';
import { QuestionBaseOptions, QuestionBaseParams } from './base';

export class QuestionExtendedGoogleMapLocationParams extends QuestionBaseParams {
    questionClass: string;
    hideErrors: boolean;
    hideWarning: boolean;
    min: number;
    max: number;
    step: number;
    unit: string;
};

@Injectable()
export class ExtendedGoogleMapLocationQuestion extends GoogleMapLocationQuestion {
    public controlType: string = 'extended_googlemap_location';
    public value: {location: string, distance: number};
    public min: number = 5;
    public max: number = 100;
    public step: number = 10;
    public unit: string = 'miles';

    /**
     * Constructor
     */
    constructor(options: QuestionBaseOptions, params?: QuestionExtendedGoogleMapLocationParams) {

        super(options, params);

        // init extra prams
        if (params) {
            params.min
                ? this.min = params.min
                : null;

            params.max
                ? this.max = params.max
                : null;

            params.step
                ? this.step = params.step
                : null;

            params.unit
                ? this.unit = params.unit
                : null;
        }

        this.value = Object.assign({}, options.value);
    }

    /**
     * Get value
     */
    protected getValue(): any {
        return this.value.location;
    }

    /**
     * Set value
     */
    protected setValue(location: string): void {
        this.value.location = location;
        this.controlView.setValue(this.value);
    }
}
