import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Scroll, Events, ModalController } from 'ionic-angular';
import { DataStore } from 'js-data';
import { NavController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

// import components
import { UserSearchFilterComponent } from './components/searchFilter/index';

// services
import { PermissionsService } from '../../../../services/permissions/index';
import { AuthService } from '../../../../services/auth/index';
import { ApplicationService } from '../../../../services/application/index';

// pages
import { InappsPage } from '../../../inapps/index';
import { ProfileViewPage } from '../../../profile/view/index';

// questions
import { QuestionManager } from '../../../../services/questions/manager';

@Component({
    selector: 'search',
    templateUrl: 'index.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() public activeComponent: string;
    @ViewChild('searchScroll') scroll: Scroll;

    private searchUserNameFilter: string = '';
    private searchFilter: {name: string, value: any, type: string}[] = [];
    private inappsPage = InappsPage;
    private userListLoading: boolean = false;
    private showUserListLoading: boolean = true;
    private currentGlobalLimit: number;
    private currentLocalLimit: number;
    private users: any[] = [];
    private isNewSearch: boolean = true;
    private searchStarted: boolean = false;
    private permissionsUpdatedHandler: () => void;
    private configsUpdatedHandler: () => void;
    private avatarUpdatedHandler: () => void;
    private avatarDeletedHandler: () => void;
    private clearScrollHandler: any;

    /**
     * Constructor
     */
    constructor(
        private keyboard: Keyboard,
        private modalCtrl: ModalController,
        private ref: ChangeDetectorRef,
        private events: Events,
        private nav: NavController,
        private application: ApplicationService,
        private auth: AuthService,
        private api: DataStore,
        private permissions: PermissionsService)
    {
        // -- init callbacks --//

        // permissions updated handler
        this.permissionsUpdatedHandler = (): void => {
            // make users search
            if (this.isSearchAllowed && !this.searchStarted) {
                this.searchUsers(true);
            }

            this.ref.markForCheck();
        };

        // configs updated handler
        this.configsUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // avatar updated handler
        this.avatarUpdatedHandler = (): void => {
            this.ref.markForCheck();
        };

        // avatar deleted handler
        this.avatarDeletedHandler = (): void => {
            this.ref.markForCheck();
        };
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        if (this.isSearchAllowed) {
            this.searchUsers(true);
        }

        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);

        // permissions updated
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);

        // avatar updated
        this.events.subscribe('user:avatarUpdated', this.avatarUpdatedHandler);

        // avatar deleted
        this.events.subscribe('user:avatarDeleted', this.avatarDeletedHandler);
    }

    /**
     * After view init
     */
    ngAfterViewInit() {
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(() => {
            let scrollTop: number = this.scroll._scrollContent.nativeElement.scrollTop;
            let clientHeight: number = this.scroll._scrollContent.nativeElement.clientHeight;
            let scrollHeight: number = this.scroll._scrollContent.nativeElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
                if (this.isCheckLoadMoreActive && !this.userListLoading) {
                    this.loadMoreUsers();
                }
            }
        });
    }

    /**
     * Component destroy
     */
    ngOnDestroy(): void {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        this.events.unsubscribe('user:avatarDeleted', this.avatarDeletedHandler);

        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    }

    /**
     * Show search filter modal
     */
    showSearchFilterModal(): void {
        let modal = this.modalCtrl.create(UserSearchFilterComponent, {
            filter: this.searchFilter // pass collected filter
        });

        // capture returned data
        modal.onDidDismiss((filter: {name: string, value: any, type: string}[]) => {
            if (filter.length) {
                this.searchFilter = filter;
                this.searchUsers(true);
                this.ref.markForCheck();
            }
        });

        modal.present();
    }

    /**
     * Current user
     */
    get currentUser(): any {
       return this.api.get('users', this.auth.getUserId()); // get logged user data
    }

    /**
     * Is search allowed
     */
    get isSearchAllowed(): boolean {
        return this.permissions.isActionAllowed('base_search_users');
    }

    /**
     * Get default global limit
     */
    get defaultGlobalLimit(): number {
        return this.api.get('configs', 'searchUserLimit').value;
    }

    /**
     * Get scroll threshold
     */
    get scrollThreshold(): number {
        return this.api.get('configs', 'scrollThreshold').value;
    }

    /**
     * Get default local limit
     */
    get defaultLocalLimit(): number {
        return this.api.get('configs', 'searchUserLocalLimit').value;
    }

    /**
     * View profile
     */
    viewProfile(user: any): void {
        this.nav.push(ProfileViewPage, {
            userId: user.id
        });
    }

    /**
     * Search users
     */
    async searchUsers(startNewSearch: boolean = false): Promise<any> {
        try {
            this.searchStarted = true;
            this.userListLoading = true;
            this.keyboard.close();

            let lastSearchId = 0;

            this.ref.markForCheck();

            if (startNewSearch) {
                this.isNewSearch = true;
                this.currentGlobalLimit = this.defaultGlobalLimit;
                this.currentLocalLimit = this.defaultLocalLimit;

                let filter: any = this.searchFilter;

                // process filters
                if (this.searchUserNameFilter.trim()) {
                    filter = filter.concat([{
                        name: 'username',
                        value: this.searchUserNameFilter,
                        type: QuestionManager.TYPE_TEXT
                    }]);
                }

                // create new search
                let newSearch = await this.api.create('searchUsers', {userId: this.auth.getUserId()}, {
                    params: {
                        filter: JSON.stringify(filter)
                    }
                });

                lastSearchId = newSearch.id;
            }
            else {
                // get latest users search id
                let search: any = this.api.filter('searchUsers', {
                    where: {
                        userId: this.auth.getUserId()
                    },
                    orderBy: [
                        ['id', 'DESC']
                    ],
                    limit: 1
                });

                lastSearchId = search[0].id;
                this.isNewSearch = false;
            }

            if (lastSearchId) {
                let foundUsers: any[] = await this.api.getMapper('users').findAll({
                    with: ['avatar', 'distance'],
                    limit: this.currentGlobalLimit,
                    searchId: lastSearchId,
                    location: this.application.getAppLocation()
                });

                this.users = foundUsers;
            }
            else {
                this.users = [];
            }

            this.userListLoading = false;
        }
        catch (e) {
            this.userListLoading = false;
        }

        this.ref.markForCheck();
    }

    /**
     * Get user list
     */
    getUserList(): any[] {
        return this.users.slice(0, this.currentLocalLimit);
    }

    /**
     * Load more users
     */
    async loadMoreUsers(): Promise<any> {
        // fetch data from api
        if (this.currentLocalLimit + this.defaultLocalLimit > this.users.length) {
            this.currentGlobalLimit += this.defaultGlobalLimit;
            this.showUserListLoading = false;
            this.ref.markForCheck();

            await this.searchUsers(false);

            this.showUserListLoading = true;
        }

        // load from a local list
        this.currentLocalLimit += this.defaultLocalLimit;
        this.ref.markForCheck();
    }

    /**
     * Is check load more active
     */
    protected get isCheckLoadMoreActive(): boolean {
        if (this.activeComponent == 'search'
            && this.users.length >= this.currentLocalLimit && this.currentLocalLimit && this.isSearchAllowed) {

            return true;
        }

        return false;
    }
}
