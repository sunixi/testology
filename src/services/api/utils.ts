import { Injectable } from '@angular/core';
import { DataStore } from 'js-data';

@Injectable()
export class ApiUtilsService {
    /**
     * Constructor
     */
    constructor(private api:DataStore) {}

    /**
     * Clear user data
     */
    clearUserData(userId: number, force: boolean = false): void {
        let cacheLifeTime = parseInt(this.api.get('configs', 'userDataCacheTime').value);

        if (force || cacheLifeTime <= 0) {
            this.forceClearUserData(userId);
            this.setUserCacheData(userId, cacheLifeTime);

            return;
        }

        let userCache = this.api.get('usersCache', userId);

        if (userCache) {
            // check expiration time
            if (userCache.willExpire <= Math.floor(Date.now() / 1000)) {
                this.forceClearUserData(userId);
                this.setUserCacheData(userId, cacheLifeTime);
            }

            return;
        }

        this.setUserCacheData(userId, cacheLifeTime);
    }

    /**
     * Set user cache data
     */
    protected setUserCacheData(userId: number, cacheLifeTime: number): void {
        this.api.remove('usersCache', userId);
        this.api.add('usersCache', {
            id: userId,
            willExpire: Math.floor(Date.now() / 1000) + cacheLifeTime
        });
    }

    /**
     * Force clear user data
     */
    protected forceClearUserData(userId: number): void {
        this.api.removeAll('permissions', {userId: userId});
        this.api.removeAll('photos', {userId: userId});
        this.api.removeAll('viewQuestions', {userId: userId});
        this.api.removeAll('searchUsers', {userId: userId});
        this.api.removeAll('avatars', {userId: userId});
        this.api.removeAll('matchActions', {userId: userId});
        this.api.removeAll('compatibilities', {userId: userId});
        this.api.removeAll('blocks', {userId: userId});
        this.api.removeAll('memberships', {userId: userId});

        this.api.remove('users', userId);
    }
}
