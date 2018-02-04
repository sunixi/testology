import { Injectable } from '@angular/core';
import { QuestionBase } from './base';

@Injectable()
export class CheckboxQuestion extends QuestionBase {
    public controlType = 'checkbox';
}
