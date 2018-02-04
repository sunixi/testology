import { Directive, HostListener } from '@angular/core';
import { TextInput } from 'ionic-angular';

@Directive({
    selector: '[changeFocusByEnter]'
})
export class ChangeFocusByEnterDirective {

    constructor(private inputRef: TextInput) { }

    @HostListener('keydown', ['$event'])
    onInputChange(e) {
        let code = e.keyCode || e.which;

        if (code === 13) {
            e.preventDefault();
            this.inputRef.focusNext();
        }
    }
}
