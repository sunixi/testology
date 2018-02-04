import { Injectable } from '@angular/core';
import { HttpAdapter } from 'js-data-http';
import { DataStore } from 'js-data';
import { Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// import services
import { ConfigService } from '../config/index';
import { AuthService } from '../auth/index';
import { HttpErrorHandlerService } from '../http/errorHandler';

// import all registered resources
import { Distances } from './resources/distances';
import { Compatibilities } from './resources/compatibilities';
import { Avatars } from './resources/avatars';
import { Users, UsersProperties } from './resources/users';
import { UserMemberships } from './resources/userMemberships';
import { QuestionsData } from './resources/questionsData';
import { JoinQuestions } from './resources/joinQuestions';
import { EditQuestions } from './resources/editQuestions';
import { SearchQuestions } from './resources/searchQuestions';
import { SearchUsers } from './resources/searchUsers';
import { UserGenders } from './resources/userGenders';
import { Configs } from './resources/configs';
import { Permissions } from './resources/permissions';
import { Photos } from './resources/photos';
import { UsersCache } from './resources/usersCache';
import { MatchActions } from './resources/matchActions';
import { ViewQuestions } from './resources/viewQuestions';
import { Blocks } from './resources/blocks';
import { MatchedUsers } from './resources/matchedUsers';
import { Conversations } from './resources/conversations';
import { Messages } from './resources/messages';
import { Guests } from './resources/guests';
import { HotListUsers } from './resources/hotListUsers';

/**
 * Api factory
 */
export function apiFactory (
    config: ConfigService,
    auth: AuthService,
    translate: TranslateService,
    events: Events,
    errorHandler: HttpErrorHandlerService
): DataStore {
    // register all mappers
    let mappers = {
        users: Users,
        usersCache: UsersCache,
        questionsData: QuestionsData,
        avatars: Avatars,
        compatibilities: Compatibilities,
        distances: Distances,
        memberships: UserMemberships,
        permissions: Permissions,
        photos: Photos,
        joinQuestions: JoinQuestions,
        editQuestions: EditQuestions,
        searchQuestions: SearchQuestions,
        viewQuestions: ViewQuestions,
        searchUsers: SearchUsers,
        userGenders: UserGenders,
        matchActions: MatchActions,
        configs: Configs,
        blocks: Blocks,
        matchedUsers: MatchedUsers,
        conversations: Conversations,
        messages: Messages,
        guests: Guests,
        hotListUsers: HotListUsers
    };

    let properties = {
        users: UsersProperties
    };

    // common mappers
    let commonMappers = ['configs'];

    let api  = new DataStore();

    let httpAdapter = new HttpAdapter({
        basePath: config.getApiUrl(),
        forceTrailingSlash: true,
        httpConfig: {
            timeout: parseInt(config.getConfig('connectionTimeout'))
        },
        beforeHTTP: (config) => {
            // add auth header
            config.headers || (config.headers = {});

            if (auth.getToken()) {
                config.headers[auth.getAuthHeaderName()] = auth.getAuthHeaderValue();
            }

            // add current language
            config.headers['api-language'] = translate.currentLang
                ? translate.currentLang
                : translate.getDefaultLang();
        },
        error: (error: any, errorDesc: any) => {
            let errorCode: number = 500; // default error code
            let errorType: string = '';
            let errorDescription: string = '';

            if (errorDesc.message && errorDesc.message.match(/^timeout|network error/i)) {
                errorCode = 0;
            }
            else {
                // try to extract error code and error desc
                errorCode = errorDesc.response.status;
                let errorDetails: any = errorDesc.response.data;

                errorType = errorDetails && errorDetails.type ? errorDetails.type : '';
                errorDescription = errorDetails && errorDetails.description ? errorDetails.description : '';
            }

            let forceHandleError: boolean = errorDesc.config.forceHandleError
                ? errorDesc.config.forceHandleError
                : false;

            errorHandler.handleError(errorCode, errorType, errorDescription, forceHandleError);
        }
    });

    api.registerAdapter('http', httpAdapter, {
        default: true
    });

    // init mappers
    for (var mapperName in mappers) {
        api.defineMapper(mapperName, mappers[mapperName]);
    }

    // init properties
    for (var property in properties) {
        Object.defineProperties(api.getMapper(property).recordClass.prototype, properties[property]);
    }

    // system events
    let systemEvents = [
        'user:logout',
        'user:status_restore',
        'maintenance:restore'
    ];

    // clear mappers
    systemEvents.forEach((event) => {
        events.subscribe(event, () => {
            // clear all mappers
            for (var mapperName in mappers) {
                if (!commonMappers.includes(mapperName)) {
                    api.removeAll(mapperName);
                }
            }
        });
    });

    return api;
}
