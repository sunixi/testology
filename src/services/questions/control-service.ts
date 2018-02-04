import { Injectable }   from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionBase } from './questions/base';
import { QuestionManager } from './manager';

// import validators
import { Validators } from './validators/index';

@Injectable()
export class QuestionControlService {
    constructor(private validators: Validators) { }

    /**
     * Assign questions to a group
     */
    toFormGroup(questions: QuestionBase[], groupValidator?: any): FormGroup {
        let group: any = {};

        // process questions
        questions.forEach(question => {
            let validators = [];
            let asyncValidators = [];
            let hardCodedValidators: {name: string, message?: string, params?: {}}[] = [];

            switch (question.getType()) {
                case QuestionManager.TYPE_URL:
                    hardCodedValidators.push(
                        {name: 'url'}
                    );
                    break;

                case QuestionManager.TYPE_EMAIL:
                    hardCodedValidators.push(
                        {name: 'email'}
                    );
                    break;
            }

            // add hardcoded validators
            if (hardCodedValidators.length) {
                let allValidators: {name: string, message?: string, params?: {}}[] = question.validators
                    ? question.validators.concat(hardCodedValidators)
                    : hardCodedValidators;

                question.setValidators(allValidators);
            }

            // add validators
            if (question.validators) {
                question.validators.forEach((validatorData) => {
                    if (!this.validators.isValidatorExists(validatorData.name)) {
                        throw new TypeError(`Unsupported validator ${validatorData.name}`);
                    }

                    let validator = this.validators.getValidator(validatorData.name);

                    // add params inside validator
                    if (validatorData.params) {
                        validator.addParams(validatorData.params);
                    }

                    this.validators.isAsyncValidator(validatorData.name)
                        ? asyncValidators.push(validator.validate())
                        : validators.push(validator.validate());
                });
            }

            let control = new FormControl((question.value != null ? question.value : ''), validators, asyncValidators);
            question.setControl(control);

            group[question.key] = control;
        });

        return new FormGroup(group, groupValidator);
    }
}
