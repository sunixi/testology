import { Injectable, Inject, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';

// import services
import { SecureHttpService } from '../../../services/http/index';
import { ConfigService } from '../../../services/config/index';
import { AuthService } from '../../../services/auth/index';

// import base async validator
import { BaseAsyncValidator } from './baseAsyncValidator';

@Injectable()
export class UserNameValidator extends BaseAsyncValidator {
    /**
     * Constructor
     */
    constructor(
        @Inject(forwardRef(() => SecureHttpService)) http: SecureHttpService,
        protected config: ConfigService,
        protected auth: AuthService,
        protected api: DataStore,
        protected events: Events)
    {
        super(api, http, events);
    }

    /**
     * Validate
     */
    validate(): Function {
        return (control: FormControl): {[key: string]: any} => {
            clearTimeout(this.timer);

            return new Promise((resolve) => {
                this.timer = setTimeout(() => {

                    if (control.value.trim()) {
                        let username: string = control.value;
                        let options = this.auth.isAuthenticated()
                            ? {userName: username, oldUserName: this.auth.getUser()['name']}
                            : {userName: username};

                        this.http.post(this.config.getApiUrl() + '/validators/user-name/', JSON.stringify(options))
                            .map(res => res.json())
                            .subscribe(data => {
                                if (!data.valid || control.value != username) {
                                    this.fireEvent('userName', control.value, false);
                                    resolve({'userName': true});

                                    return;
                                }

                                this.fireEvent('userName', control.value, true);
                                resolve(null);
                            }, () => {
                                this.fireEvent('userName', control.value, false);
                                resolve({'userName': true});
                            });
                    }
                    else {
                        this.fireEvent('userName', control.value, false);
                        resolve({'userName': true}); // username cannot be empty
                    }

                }, this.getValidationDelay());
            });

        };
    }
}
