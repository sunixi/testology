import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'wink-message',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WinkMessageComponent {
    @Input() message: any;
    @Input() prevMessage: any;
}
