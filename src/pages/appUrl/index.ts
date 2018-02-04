import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import { parse as urlParse } from 'url';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

// import pages
import { LoginPage } from '../../pages/user/login/index';
import { AppMaintenancePage } from '../../pages/appMaintenance/index';

// import services
import { ConfigService } from '../../services/config/index';
import { ApplicationService } from '../../services/application/index';
import { ServerEventsService } from '../../services/serverEvents/index';

// import questions
import { QuestionManager } from '../../services/questions/manager';
import { QuestionControlService } from '../../services/questions/control-service';

@Component({
    selector: 'app-url',
    templateUrl: 'index.html',
    providers: [
        QuestionControlService,
        QuestionManager
    ]
})

export class AppUrlPage implements OnInit {
    @Input() private questions = <any>[]; // list of questions

    private form: FormGroup;
    private isUrlConfigured: boolean = false;
    private application: ApplicationService;
    private options: string[] = ['https://', 'https://www.', 'http://', 'http://www.'];
    private timeout: number = 15000; // connection timeout

    /**
     * Constructor
     */
    constructor(
        private serverEvents: ServerEventsService,
        private nav: NavController,
        private api: DataStore,
        @Inject(forwardRef(() => ApplicationService)) application: ApplicationService,
        private questionControl: QuestionControlService,
        private http: Http,
        private config: ConfigService,
        private loadingCtrl: LoadingController,
        private alert: AlertController,
        private questionManager: QuestionManager,
        private translate: TranslateService)
    {
        this.application = application;

        if (this.config.getApiUrl()) {
            this.isUrlConfigured = true;
        }
    }

    /**
     * Component init
     */
    ngOnInit(): void {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(QuestionManager.TYPE_TEXT, {
                value: this.config.getGenericApiUrl(),
                key: 'url',
                label: !this.isUrlConfigured
                    ? '://Site URL'
                    : this.translate.instant('site_address_input'),
                validators: [{
                    name: 'require',
                    message: !this.isUrlConfigured
                        ? 'You have to enter your site address'
                        : this.translate.instant('site_address_input_require_error')
                }]
            }, {
                hideWarning: true
            })
        ];

        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    }

    /**
     * Submit
     */
    async onSubmit(): Promise<any> {
        let loader = this.loadingCtrl.create();

        try {
            await loader.present();

            let url: any = await this.validateApi();

            if (url) {
                this.serverEvents.stop();
                this.config.setGenericApiUrl(url);

                // update base path in api adapter
                let adapter = this.api.getAdapter(HttpAdapter);
                adapter.basePath = this.config.getApiUrl();

                // refresh application dependencies
                await this.application.loadDependencies();

                loader.dismiss();

                // redirect to the page
                if (this.api.get('configs', 'maintenanceMode').value) {
                    this.nav.setRoot(AppMaintenancePage);

                    return;
                }

                this.nav.setRoot(LoginPage);

                return;
            }

            loader.dismiss();
            this.showErrorPopup();
        }
        catch (e) {
            loader.dismiss();
            this.showErrorPopup();
        }
    }

    private async validateApi(): Promise<any> {
        let url: string = this.form.value.url;
        let data: any;
        if (url.indexOf('://') !== -1){
            // Convert scheme to lowercase
            let parts = url.split('://');
            url = parts[0].toLowerCase() + '://' + parts[1];
            // Check api
            try {
                data = await this.http.get(url + this.config.getApiUri() + '/check-api/')
                    .timeout(this.timeout)
                    .map(res => res.json())
                    .toPromise();
                if (data.status && data.status == 'ok') {
                    return url;
                }
            } catch (e){}
            // Api check failed. We will try to remove scheme and check api with another scheme options
            let parsedUrl = urlParse(url);
            url = parsedUrl.host + parsedUrl.path;
        } else {
            let slashPos = url.indexOf('/');
            if (slashPos !== -1){
                // Convert domain to lowercase
                let domain = url.substring(0, slashPos);
                url = domain.toLowerCase() + url.substring(slashPos);
            } else {
                // There is no path in url. So we may convert whole url to lowercase
                url = url.toLowerCase();
            }
        }

        if (url.indexOf('www.') === 0){
            // Remove www from url
            url = url.substr(4);
        }

        for (let i in this.options) {
            try{
                data = await this.http.get(this.options[i] + url + this.config.getApiUri() + '/check-api/')
                    .timeout(this.timeout)
                    .map(res => res.json())
                    .toPromise();
                if (data.status && data.status == 'ok') {
                    return this.options[i] + url;
                }
            } catch (e){}
        }
        return null;
    }

    /**
     * Show error popup
     */
    private showErrorPopup(): void {
        let alert = this.alert.create({
            title: !this.isUrlConfigured ? 'Error Occurred' : this.translate.instant('error_occurred'),
            subTitle: !this.isUrlConfigured  ? 'Invalid site url' : this.translate.instant('site_address_error'),
            buttons: [(this.isUrlConfigured ? 'OK' : this.translate.instant('ok'))]
        });

        alert.present();
    }
}
