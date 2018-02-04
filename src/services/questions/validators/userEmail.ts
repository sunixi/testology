import { Injectable, Inject, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';

// import services
import { ConfigService } from '../../../services/config/index';
import { AuthService } from '../../../services/auth/index';
import { SecureHttpService } from '../../../services/http/index';

// import base async validator
import { BaseAsyncValidator } from './baseAsyncValidator';

@Injectable()
export class UserEmailValidator extends BaseAsyncValidator {
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
                        let email: string = control.value;
                        let options = this.auth.isAuthenticated()
                            ? {email: email, user: this.auth.getUser()['name']}
                            : {email: email};

                        this.http.post(this.config.getApiUrl() + '/validators/user-email/', JSON.stringify(options))
                            .map(res => res.json())
                            .subscribe(data => {
                                if (!data.valid || control.value != email) {
                                    this.fireEvent('userEmail', control.value, false);
                                    resolve({'userEmail': true});

                                    return;
                                }

                                this.fireEvent('userEmail', control.value, true);
                                resolve(null);
                            }, () => {
                                this.fireEvent('userEmail', control.value, false);
                                resolve({'userEmail': true});
                            });
                    }
                    else {
                        this.fireEvent('userEmail', control.value, false);
                        resolve({'userEmail': true}); // user email cannot be empty
                    }

                }, this.getValidationDelay());
            });

        };
    }
}

