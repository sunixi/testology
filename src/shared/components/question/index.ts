import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { FormGroup, AbstractControl } from '@angular/forms';
import { QuestionBase }     from '../../../services/questions/questions/base';
import { sprintf } from 'sprintf-js';

import { TranslateService } from 'ng2-translate';

// validators
import { Validators } from '../../../services/questions/validators/index';
import { RequireValidator } from '../../../services/questions/validators/require';

@Component({
    selector: 'question',
    templateUrl: './index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit, OnDestroy {
    @Input() question: QuestionBase;
    @Input() form: FormGroup;

    private baseQuestionClass: string = 'sk-base-question-presentation';
    private baseQuestionWarningClass: string = 'sk-question-warning';
    private asyncValidatorFinishedHandler: () => void;

    constructor(
        private events: Events,
        private ref: ChangeDetectorRef,
        private validators: Validators,
        private requireValidator: RequireValidator,
        private alert: AlertController,
        private translate: TranslateService)
    {
        // -- init callbacks --//

        // async validator finished validation process handler
        this.asyncValidatorFinishedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
    ngOnInit() {
        // async validator finished
        this.events.subscribe('asyncValidator:finished', this.asyncValidatorFinishedHandler);

        this.form.valueChanges.subscribe(() => {
            this.ref.markForCheck();
        });
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('asyncValidator:finished', this.asyncValidatorFinishedHandler);
    }

    /**
     * Is question valid
     */
    get isValid(): boolean {
        let control: AbstractControl = this.form.controls[this.question.key];

        if ((!control.valid && control.dirty && !control.pending)
            || (this.hasGroupError() && control.dirty && !control.pending)) {

            return false;
        }

        return true;
    }

    /**
     * Get question class
     */
    get getQuestionClass(): string {
        let params: any = this.question.params;
        let control: AbstractControl = this.form.controls[this.question.key];
        let hideWarning: boolean = params && params.hideWarning && params.hideWarning == true;
        let appliedRequireValidators = [];

        if (this.question.validators && this.question.validators.length) {
            appliedRequireValidators = this.question.validators.filter((validator: any) => {
                return validator.name == 'require';
            });
        }

        let warning = !hideWarning && appliedRequireValidators.length && !this.requireValidator.isValid(control.value)
            ? this.baseQuestionWarningClass
            : '';

        if (params && params.questionClass) {
            return `${this.baseQuestionClass} ${warning} ${params.questionClass}`;
        }

        return `${this.baseQuestionClass} ${warning}`;
    }

    /**
     * Show errors
     */
    showErrors(event): void {
        event.stopPropagation();

        let errors: string = '';

        this.getErrors().forEach((error) => {
            errors += `${error}<br />`;
        });

        let alert = this.alert.create({
            subTitle: errors,
            buttons: [this.translate.instant('ok')]
        });

        alert.present();
    }

    /**
     * Has visible errors
     */
    get hasVisibleErrors(): boolean {
        let params: any = this.question.params;
        let hideErrors = params && params.hideErrors && params.hideErrors == true;

        return !hideErrors && !this.isValid;
    }

    /**
     * Get list of errors
     */
    protected getErrors(): Array<string> {
        let control: AbstractControl = this.form.controls[this.question.key];
        let errors: Array<string> = [];

        // check all assigned question's validators
        this.question.validators.forEach((validator) => {
            if (control.hasError(validator.name)) {
                let message = !validator.message
                    ? this.validators.getDefaultMessage(validator.name)
                    : validator.message;

                errors.push(sprintf(message, control.value));
            }
        });

        // check a group error
        if (this.hasGroupError()) {
            let groupError: any = control.parent.errors;

            errors.push(sprintf(groupError.message, control.value));
        }

        return errors;
    }

    /**
     * Has group error
     */
    protected hasGroupError(): boolean {
        let control: AbstractControl = this.form.controls[this.question.key];

        if (control.parent) {
            let groupError: any = control.parent.errors;

            if (groupError
                && groupError.question
                && groupError.message
                && groupError.question == this.question.key) {

                return true;
            }
        }

        return false;
    }
}
