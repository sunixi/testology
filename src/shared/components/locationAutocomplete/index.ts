import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { ViewController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';

// services
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'location-autocomplete',
    templateUrl: './index.html',
    providers: [
        forwardRef(() => SecureHttpService)
    ]
})
export class LocationAutocompleteComponent implements OnInit {
    private searchQuery: string;
    private autocompleteItems = [];
    private autocompleteLoading = false;
    private http: SecureHttpService;

    /**
     * Constructor
     */
    constructor(
        private viewCtrl: ViewController,
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        private config: ConfigService,
        private navParams: NavParams,
        private alert: AlertController,
        private translate: TranslateService)
    {
        this.searchQuery = this.navParams.get('q');
        this.http = http;
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        this.updateSearch();
    }

    /**
     * Dismiss
     */
    dismiss() {
        this.viewCtrl.dismiss('');
    }

    /**
     * Choose item
     */
    chooseItem(location: string) {
        this.viewCtrl.dismiss(location);
    }

    /**
     * Update search
     */
    updateSearch() {
        if (!this.searchQuery) {
            this.autocompleteItems = [];

            return;
        }

        this.autocompleteLoading = true;
        this.http.get(this.config.getApiUrl() + '/location-autocomplete/?q=' + this.searchQuery)
            .map(res => res.json())
            .subscribe(
                predictions => {
                    this.autocompleteLoading = false;
                    this.autocompleteItems = predictions;
                },
                () => {
                    this.autocompleteLoading = false;
                    this.viewCtrl.dismiss('');

                    let alert = this.alert.create({
                        title: this.translate.instant('error_occurred'),
                        subTitle: this.translate.instant('couldnt_complete_request'),
                        buttons: [this.translate.instant('ok')]
                    });

                    alert.present();
                }
            );
    }
}
