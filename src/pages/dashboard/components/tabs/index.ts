import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { DataStore } from 'js-data';

@Component({
    selector: 'dashboard-tabs',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardTabsComponent implements OnInit, OnDestroy {
    @Input() activeComponent: string;
    @Input() activeSubComponent: string;
    @Output() componentChanged = new EventEmitter();

    private conversationsUpdatedHandler: () => void;
    private matchedUsersUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private ref: ChangeDetectorRef,
        private events: Events,
        private api: DataStore)
    {
        // -- init callbacks --//

        // conversations updated handler
        this.conversationsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // matched users updated handler
        this.matchedUsersUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
     ngOnInit(): void {
        this.events.subscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
        this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
    }

    /**
     * Change component
     */
    changeComponent(componentName: string, subComponentName?: string): void {
        this.componentChanged.emit({
            componentName: componentName,
            subComponentName: subComponentName
        });
    }

    /**
     * Get unread conversations count
     */
    get getUnreadConversationsCount(): number {
        return this.api.filter('conversations', {
            where: {
                isRead: false
            }
        }).length;
    }

    /**
     * Get new matched users count
     */
    get getNewMatchedUsersCount(): number {
        return this.api.filter('matchedUsers', {
            where: {
                isNew: true
            }
        }).length;
    }
}
