import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

// import questions
import { QuestionBase, QuestionBaseOptions, QuestionBaseParams } from './questions/base';
import { TextQuestion, QuestionTextOptions, QuestionTextParams } from './questions/text';
import { SelectQuestion, QuestionSelectOptions, QuestionSelectParams } from './questions/select';
import { TextareaQuestion } from './questions/textarea';
import { RangeQuestion, QuestionRangeParams } from './questions/range';
import { CheckboxQuestion } from './questions/checkbox';
import { DateQuestion, QuestionDateParams } from './questions/date';
import { DateRangeQuestion } from './questions/dateRange';
import { GoogleMapLocationQuestion } from './questions/googlemapLocation';
import { ExtendedGoogleMapLocationQuestion, QuestionExtendedGoogleMapLocationParams } from './questions/extendedGooglemapLocation';

@Injectable()
export class QuestionManager {
    // list of available questions
    public static TYPE_LOCATION: string = 'location';
    public static TYPE_URL: string = 'url';
    public static TYPE_TEXT: string = 'text';
    public static TYPE_EMAIL: string = 'email';
    public static TYPE_PASSWORD: string = 'password';
    public static TYPE_MULTISELECT: string = 'multiselect';
    public static TYPE_SELECT: string = 'select';
    public static TYPE_FSELECT: string = 'fselect';
    public static TYPE_RADIO: string = 'radio';
    public static TYPE_TEXTAREA: string = 'textarea';
    public static TYPE_RANGE: string = 'range';
    public static TYPE_CHECKBOX: string = 'checkbox';
    public static TYPE_DATE: string = 'date';
    public static TYPE_DATE_RANGE: string = 'date_range';
    public static TYPE_AGE: string = 'age';
    public static TYPE_BIRTHDATE: string = 'birthdate';
    public static TYPE_MULTICHECKBOX: string = 'multicheckbox';
    public static TYPE_GOOGLEMAP_LOCATION: string = 'googlemap_location';
    public static TYPE_EXTENDED_GOOGLEMAP_LOCATION: string = 'extended_googlemap_location';

    /**
     * Constructor
     */
    constructor(private modalController: ModalController) {}

    /**
     * Get config
     */
    public getQuestion(type: string, options: any = {}, params: any = {}): QuestionBase {
        switch (type) {
            case QuestionManager.TYPE_LOCATION:
            case QuestionManager.TYPE_URL:
            case QuestionManager.TYPE_TEXT:
            case QuestionManager.TYPE_EMAIL:
            case QuestionManager.TYPE_PASSWORD:
                let textOptions = new QuestionTextOptions();

                if (options) {
                    textOptions.value = options.value;
                    textOptions.values = options.values;
                    textOptions.key = options.key;
                    textOptions.label = options.label;
                    textOptions.type = type != QuestionManager.TYPE_LOCATION ? type : 'text';
                    textOptions.validators = options.validators;
                }

                let textParams = new QuestionTextParams();

                if (params) {
                    textParams.questionClass = params.questionClass;
                    textParams.hideErrors = params.hideErrors;
                    textParams.hideWarning = params.hideWarning;
                    textParams.stacked = params.stacked;
                }

                return new TextQuestion(textOptions, textParams);

            case QuestionManager.TYPE_RADIO:
            case QuestionManager.TYPE_SELECT:
            case QuestionManager.TYPE_FSELECT:
                let selectOptions = new QuestionSelectOptions();

                if (options) {
                    selectOptions.value = options.value;
                    selectOptions.values = options.values;
                    selectOptions.key = options.key;
                    selectOptions.label = options.label;
                    selectOptions.validators = options.validators;
                }

                let selectParams = new QuestionSelectParams();

                if (params) {
                    selectParams.questionClass = params.questionClass;
                    selectParams.hideErrors = params.hideErrors;
                    selectParams.hideWarning = params.hideWarning;
                    selectParams.hideEmptyValue = params.hideEmptyValue;
                }

                return new SelectQuestion(selectOptions, selectParams);

            case QuestionManager.TYPE_MULTISELECT:
            case QuestionManager.TYPE_MULTICHECKBOX:
                let multiSelectOptions = new QuestionSelectOptions();

                if (options) {
                    multiSelectOptions.value = options.value;
                    multiSelectOptions.values = options.values;
                    multiSelectOptions.key = options.key;
                    multiSelectOptions.label = options.label;
                    multiSelectOptions.multiple = true;
                    multiSelectOptions.validators = options.validators;
                }

                let multiSelectParams = new QuestionSelectParams();

                if (params) {
                    multiSelectParams.questionClass = params.questionClass;
                    multiSelectParams.hideErrors = params.hideErrors;
                    multiSelectParams.hideWarning = params.hideWarning;
                    multiSelectParams.hideEmptyValue = params.hideEmptyValue;
                }

                return new SelectQuestion(multiSelectOptions, multiSelectParams);

            case QuestionManager.TYPE_TEXTAREA:
                let textAreaOptions = new QuestionBaseOptions();

                if (options) {
                    textAreaOptions.value = options.value;
                    textAreaOptions.values = options.values;
                    textAreaOptions.key = options.key;
                    textAreaOptions.label = options.label;
                    textAreaOptions.validators = options.validators;
                }

                let textAreaParams = new QuestionBaseParams();

                if (params) {
                    textAreaParams.questionClass = params.questionClass;
                    textAreaParams.hideErrors = params.hideErrors;
                    textAreaParams.hideWarning = params.hideWarning;
                }

                return new TextareaQuestion(textAreaOptions, textAreaParams);

            case QuestionManager.TYPE_RANGE:
                let rangeOptions = new QuestionBaseOptions();

                if (options) {
                    rangeOptions.value = options.value;
                    rangeOptions.values = options.values;
                    rangeOptions.key = options.key;
                    rangeOptions.label = options.label;
                    rangeOptions.validators = options.validators;
                }

                let rangeParams = new QuestionRangeParams();

                if (params) {
                    rangeParams.questionClass = params.questionClass;
                    rangeParams.hideErrors = params.hideErrors;
                    rangeParams.hideWarning = params.hideWarning;
                    rangeParams.min = params.min;
                    rangeParams.max = params.max;
                }

                return new RangeQuestion(rangeOptions, rangeParams);

            case QuestionManager.TYPE_CHECKBOX:
                let checkboxOptions = new QuestionBaseOptions();

                if (options) {
                    checkboxOptions.value = options.value;
                    checkboxOptions.values = options.values;
                    checkboxOptions.key = options.key;
                    checkboxOptions.label = options.label;
                    checkboxOptions.validators = options.validators;
                }

                let checkboxParams = new QuestionBaseParams();

                if (params) {
                    checkboxParams.questionClass = params.questionClass;
                    checkboxParams.hideErrors = params.hideErrors;
                    checkboxParams.hideWarning = params.hideWarning;
                }

                return new CheckboxQuestion(checkboxOptions, checkboxParams);

            case QuestionManager.TYPE_GOOGLEMAP_LOCATION:
                let googleMapLocationOptions = new QuestionBaseOptions();

                if (options) {
                    googleMapLocationOptions.value = options.value;
                    googleMapLocationOptions.values = options.values;
                    googleMapLocationOptions.key = options.key;
                    googleMapLocationOptions.label = options.label;
                    googleMapLocationOptions.validators = options.validators;
                }

                let googleMapLocationParams = new QuestionRangeParams();

                if (params) {
                    googleMapLocationParams.questionClass = params.questionClass;
                    googleMapLocationParams.hideErrors = params.hideErrors;
                    googleMapLocationParams.hideWarning = params.hideWarning;
                }

                let locationQuestion:GoogleMapLocationQuestion = new GoogleMapLocationQuestion(googleMapLocationOptions, googleMapLocationParams);
                locationQuestion.setModal(this.modalController);

                return locationQuestion;

            case QuestionManager.TYPE_EXTENDED_GOOGLEMAP_LOCATION:
                let extendedGoogleMapLocationOptions = new QuestionBaseOptions();

                if (options) {
                    extendedGoogleMapLocationOptions.value = options.value;
                    extendedGoogleMapLocationOptions.values = options.values;
                    extendedGoogleMapLocationOptions.key = options.key;
                    extendedGoogleMapLocationOptions.label = options.label;
                    extendedGoogleMapLocationOptions.validators = options.validators;
                }

                let extendedGoogleMapLocationParams = new QuestionExtendedGoogleMapLocationParams();

                if (params) {
                    extendedGoogleMapLocationParams.questionClass = params.questionClass;
                    extendedGoogleMapLocationParams.hideErrors = params.hideErrors;
                    extendedGoogleMapLocationParams.hideWarning = params.hideWarning;
                    extendedGoogleMapLocationParams.min = params.min;
                    extendedGoogleMapLocationParams.max = params.max;
                    extendedGoogleMapLocationParams.step = params.step;
                    extendedGoogleMapLocationParams.unit = params.unit;
                }

                let extendedLocationQuestion:ExtendedGoogleMapLocationQuestion =
                    new ExtendedGoogleMapLocationQuestion(extendedGoogleMapLocationOptions, extendedGoogleMapLocationParams);

                extendedLocationQuestion.setModal(this.modalController);

                return extendedLocationQuestion;

            case QuestionManager.TYPE_DATE_RANGE:
                let dateRangeOptions = new QuestionBaseOptions();

                if (options) {
                    dateRangeOptions.value = options.value;
                    dateRangeOptions.values = options.values;
                    dateRangeOptions.key = options.key;
                    dateRangeOptions.label = options.label;
                    dateRangeOptions.validators = options.validators;
                }

                let dateRangeParams = new QuestionDateParams();

                if (params) {
                    dateRangeParams.questionClass = params.questionClass;
                    dateRangeParams.hideErrors = params.hideErrors;
                    dateRangeParams.hideWarning = params.hideWarning;
                    dateRangeParams.minDate = params.minDate;
                    dateRangeParams.maxDate = params.maxDate;
                    dateRangeParams.displayFormat = params.displayFormat;
                }

                return new DateRangeQuestion(dateRangeOptions, dateRangeParams);

            case QuestionManager.TYPE_DATE:
            case QuestionManager.TYPE_AGE:
            case QuestionManager.TYPE_BIRTHDATE:
                let dateOptions = new QuestionBaseOptions();

                if (options) {
                    dateOptions.value = options.value;
                    dateOptions.values = options.values;
                    dateOptions.key = options.key;
                    dateOptions.label = options.label;
                    dateOptions.validators = options.validators;
                }

                let dateParams = new QuestionDateParams();

                if (params) {
                    dateParams.questionClass = params.questionClass;
                    dateParams.hideErrors = params.hideErrors;
                    dateParams.hideWarning = params.hideWarning;
                    dateParams.minDate = params.minDate;
                    dateParams.maxDate = params.maxDate;
                    dateParams.displayFormat = params.displayFormat;
                }

                return new DateQuestion(dateOptions, dateParams);

            default:
                throw new TypeError(`Unsupported type ${type}`);
        }
    }
}
