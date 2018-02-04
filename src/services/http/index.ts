import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';

// services
import { ConfigService } from '../config/index';
import { AuthService } from '../auth/index';
import { HttpErrorHandlerService } from '../http/errorHandler';

@Injectable()
export class SecureHttpService {
    private timeout: number;

    /**
     * Constructor
     */
    constructor(
        private errorHandler: HttpErrorHandlerService,
        private http: Http,
        private config: ConfigService,
        private auth: AuthService,
        private translate: TranslateService)
    {
        this.timeout = parseInt(this.config.getConfig('connectionTimeout'));
    }

    /**
     * Create extra headers
     */
    protected createExtraHeaders(headers: Headers): void {
        if (this.auth.getToken()) {
            headers.append(this.auth.getAuthHeaderName(), this.auth.getAuthHeaderValue());
        }

        let language = this.translate.currentLang
            ? this.translate.currentLang
            : this.translate.getDefaultLang();

        // add current language
        headers.append('api-language', language);
    }

    /**
     * Get
     */
    get(url, forceHandleError: boolean = false) {
        let headers = new Headers();
        this.createExtraHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.get(url, options)
            .timeout(this.timeout)
            .catch((err) => {
                this.reactOnError(err, forceHandleError);

                return Observable.throw(err);
        });
    }

    /**
     * Put
     */
    put(url, data, forceHandleError: boolean = false) {
        let headers = new Headers();
        this.createExtraHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.put(url, data, options)
            .timeout(this.timeout)
            .catch((err) => {
                this.reactOnError(err, forceHandleError);

                return Observable.throw(err);
        });
    }

    /**
     * Delete
     */
    delete(url, forceHandleError: boolean = false) {
        let headers = new Headers();
        this.createExtraHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.delete(url, options)
            .timeout(this.timeout)
            .catch((err) => {
                this.reactOnError(err, forceHandleError);

                return Observable.throw(err);
        });
    }

    /**
     * Post
     */
    post(url, data, forceHandleError: boolean = false) {
        let headers = new Headers();
        this.createExtraHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.post(url, data, options)
            .timeout(this.timeout)
            .catch((err) => {
                this.reactOnError(err, forceHandleError);

                return Observable.throw(err);
        });
    }

    /**
     * React on error
     */
    protected reactOnError(err: any, forceHandleError: boolean = false): void {
        let errorCode = err.status || 0;
        let errorType: string = '';
        let errorDescription: string = '';
        let errorDetails: any = errorCode ? err.json() : '';

        if (errorDetails) {
            errorType = errorDetails.type ? errorDetails.type : '';
            errorDescription = errorDetails.description ? errorDetails.description : '';
        }

        this.errorHandler.handleError(errorCode, errorType, errorDescription, forceHandleError);
    }
}
