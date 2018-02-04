import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthService {
    protected token: any = null;
    protected tokenName: string = 'token';
    protected user: {id: number, name: string, email: string} = null;
    protected jwtHelper: JwtHelper = new JwtHelper();

    /**
     * Constructor
     */
     constructor(private events: Events) {
        this.token = localStorage.getItem(this.tokenName);

        if (this.token) {
            this.user = this.jwtHelper.decodeToken(this.token);
        }
    }

    /**
     * Get user
     */
    public getUser(): {id: number, name: string, email: string} {
        return this.user;
    }

    /**
     * Get user id
     */
    public getUserId(): number {
        return this.user ? this.user['id'] : null;
    }

    /**
     * Get token
     */
    public getToken(): string {
        return this.token;
    }

    /**
     * Get auth header name
     */
    public getAuthHeaderName(): string {
        return 'jwt';
    }

    /**
     * Get auth header value
     */
    public getAuthHeaderValue(): string {
        return `Bearer ${this.getToken()}`;
    }

    /**
     * Set authenticated
     */
    public setAuthenticated(token: string):void {
        localStorage.setItem(this.tokenName, token);

        this.user = this.jwtHelper.decodeToken(token);
        this.token = token;
        this.events.publish('user:login');
    }

    /**
     * Logout
     */
    public logout(): void {
        localStorage.removeItem(this.tokenName);

        this.user = null;
        this.token = null;

        this.events.publish('user:logout');
    }

    /**
     * Is authenticated
     */
    public isAuthenticated(): boolean {
        if (this.token) {
            return tokenNotExpired(this.tokenName);
        }

        return false;
    }
}
