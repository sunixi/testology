import { ElementRef, HostListener, Directive, AfterViewInit, Optional, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { DataStore } from 'js-data';

@Directive({
    selector: '[autosize]'
})

export class AutosizeDirective implements OnInit, OnDestroy, AfterViewInit {
    private modelSub: Subscription;
    private textareaEl: HTMLTextAreaElement;
    private debounceTime: number = 100;

    /**
     * Constructor
     */
    constructor(
        private api: DataStore,
        private element: ElementRef,
        private ngZone: NgZone,
        @Optional() private model: NgModel
    ) {}

    @HostListener('input')
    onInput(): void {
        // this is run whenever the user changes the input.
        this.adjust();
    }

    /**
     * View in init
     */
    ngOnInit() {
        if(!this.model) {
            return;
        }

        // listen for changes to the underlying model
        // to adjust the textarea size.
        this.modelSub = this.model
            .valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(() => this.adjust());
    }

    /**
     * View destroy
     */
    ngOnDestroy() {
        if(this.modelSub) {
            this.modelSub.unsubscribe();
        }
    }

    /**
     * After view init
     */
    ngAfterViewInit() {
        if (this.isTextarea(this.element.nativeElement)) {
            this.setupTextarea(this.element.nativeElement);

            return;
        }

        const children: HTMLElement[] = Array.from(this.element.nativeElement.children) as HTMLElement[];
        const textareaEl = children.find(el => this.isTextarea(el));

        if (textareaEl) {
            this.setupTextarea(textareaEl as HTMLTextAreaElement);

            return;
        }

        throw new Error('The `autosize` attribute directive must be used on a `textarea` or an element that contains a `textarea`.');
    }

    /**
     * Max textarea height
     */
    get maxHeight(): number {
        return this.api.get('configs', 'maxTextareaHeight').value;
    }

    /**
     * Check if is it a textarea
     */
    private isTextarea(el: HTMLElement) {
        return el.tagName === 'TEXTAREA';
    }

    /**
     * Setup textarea
     */
    private setupTextarea(textareaEl: HTMLTextAreaElement) {
        this.textareaEl = textareaEl;

        // Set some necessary styles
        const style = this.textareaEl.style;
        style.overflow = 'hidden';
        style.resize = 'none';

        // Listen for window resize events
        this.ngZone.runOutsideAngular(() => {
            Observable.fromEvent(window, 'resize')
                .debounceTime(this.debounceTime)
                .subscribe(() => this.adjust());
        });

        // ensure we adjust the textarea if
        // content is already present
        this.adjust();
    }

    /**
     * Adjust textarea height
     */
    private adjust(): void {
        if (!this.textareaEl) {
            return;
        }

        if (this.textareaEl.scrollHeight <= this.maxHeight) {
            this.textareaEl.style.height = 'auto';
            this.textareaEl.style.height = this.textareaEl.scrollHeight + 'px';

            return;
        }

        this.textareaEl.style.overflow = 'auto';
    }
}
