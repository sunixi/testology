import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';

@Component({
    selector: 'user-avatar',
    templateUrl: './index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit, OnDestroy {
    @Input() public isAvatarActive: boolean = true;
    @Input() public url: string;
    @Input() public useBigAvatar: boolean = false;

    private configsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private events: Events,
        private api: DataStore,
        private ref: ChangeDetectorRef)
    {
        // -- init callbacks --//

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
    }

    /**
     * Get default avatar
     */
    get defaultAvatar(): string {
        return this.api.get('configs', 'defaultAvatar').value;
    }

    /**
     * Get big default avatar
     */
    get bigDefaultAvatar(): string {
        return this.api.get('configs', 'bigDefaultAvatar').value;
    }
}
