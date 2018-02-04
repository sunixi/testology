import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { DataStore } from 'js-data';

// pages
import { InappsPage } from '../../../../pages/inapps/index';
import { EditUserQuestionsPage } from '../../../../pages/user/edit/questions/index';
import { EditUserPhotosPage } from '../../../../pages/user/edit/photos/index';
import { ProfileViewPage } from '../../../../pages/profile/view/index';
import { AppSettingsPage } from '../../../appSettings/index';
import { BookmarksPage } from '../../../../pages/user/bookmarks/index';
import { GuestsPage } from '../../../../pages/user/guests/index';
import { CompatibleUsersPage } from '../../../../pages/user/compatibleUsers/index';

// services
import { AuthService } from '../../../../services/auth/index';

@Component({
    selector: 'profile',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnInit, OnDestroy {
    @Input() public activeComponent: string;

    private appSettingsPage = AppSettingsPage;
    private profileEditPage = EditUserQuestionsPage;
    private profileEditPhotosPage = EditUserPhotosPage;
    private bookmarksPage = BookmarksPage;
    private inappsPage = InappsPage;
    private guestsPage = GuestsPage;
    private compatibleUsersPage = CompatibleUsersPage;
    private guestsUpdatedHandler: () => void;

    /**
     * Constructor
     */
    constructor(
        private events: Events,
        private ref: ChangeDetectorRef,
        private auth: AuthService,
        private nav: NavController,
        private api: DataStore)
    {
        // -- init callbacks --//

        // guests updated handler
        this.guestsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        this.events.subscribe('guests:updated', this.guestsUpdatedHandler);
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('guests:updated', this.guestsUpdatedHandler);
    }

    /**
     * User data
     */
    get user(): any {
        return this.api.get('users', this.auth.getUserId());
    }

    /**
     * Get new guests count
     */
    getNewGuestsCount(): number {
        return this.api.filter('guests', {
            where: {
                viewed: false
            }
        }).length;
    }

    /**
     * Show profile
     */
    showProfile(): void {
        this.nav.push(ProfileViewPage, {
            userId: this.auth.getUserId()
        });
    }
}
