import { Injectable } from '@angular/core';
import configFile from '../../../application.config.json';

@Injectable()
export class ConfigService {
    protected baseUri: string;
    protected baseApiUri: string;

    /**
     * Constructor
     */
    constructor() {
        this.baseUri = '/skmobileapp/';
        this.baseApiUri = this.baseUri + 'api';
    }

    /**
     * Get config
     */
    public getConfig(configName: string): string {
        let value: string = configFile[configName];

        return value;
    }

    /**
     * Get generic api url
     */
    public getGenericApiUrl(): string {
        return localStorage.getItem('siteUrl');
    }

    /**
     * Set generic api url
     */
    public setGenericApiUrl(url: string): void {
        localStorage.setItem('siteUrl', url);
    }

    /**
     * Get api uri
     */
    public getApiUri(): string {
        return this.baseApiUri;
    }

    /**
     * Get api url
     */
    public getApiUrl(): string {
        let serverUrl: string = configFile['serverUrl'] // check custom server url
            ? configFile['serverUrl']
            : this.getGenericApiUrl();

        if (serverUrl) {
            return serverUrl + this.getApiUri();
        }
    }
}


