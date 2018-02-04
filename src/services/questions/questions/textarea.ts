import { Injectable } from '@angular/core';
import { QuestionBase } from './base';

@Injectable()
export class TextareaQuestion extends QuestionBase {
    public controlType = 'textarea';
}
