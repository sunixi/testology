import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, MissingTranslationHandler } from 'ng2-translate/ng2-translate';
import { AdMob } from '@ionic-native/admob';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { SwingModule } from 'angular2-swing';
import { Events } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { DataStore } from 'js-data';
import { ModalController } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';

// pages
import { DashboardPage } from '../pages/dashboard/index';
import { LoginPage } from '../pages/user/login/index';
import { ForgotPasswordCheckEmailPage } from '../pages/user/forgotPassword/checkEmail/index';
import { ForgotPasswordCheckCodePage } from '../pages/user/forgotPassword/checkCode/index';
import { ForgotPasswordNewPasswordPage } from '../pages/user/forgotPassword/newPassword/index';
import { VerifyEmailCheckEmailPage } from '../pages/user/verifyEmail/checkEmail/index';
import { VerifyEmailCheckCodePage } from '../pages/user/verifyEmail/checkCode/index';
import { JoinInitialPage } from '../pages/user/join/initial/index';
import { JoinQuestionsPage } from '../pages/user/join/questions/index';
import { AppUrlPage } from '../pages/appUrl/index';
import { UserDisapprovedPage } from '../pages/user/disapproved/index';
import { AppMaintenancePage } from '../pages/appMaintenance/index';
import { EditUserQuestionsPage } from '../pages/user/edit/questions/index';
import { EditUserPhotosPage } from '../pages/user/edit/photos/index';
import { CompleteProfilePage } from '../pages/user/completeProfile/index';
import { CompleteAccountTypePage } from '../pages/user/completeAccountType/index';
import { AppConnectionErrorPage } from '../pages/appConnectionError/index';
import { AppErrorPage } from '../pages/appError/index';
import { ProfileViewPage } from '../pages/profile/view/index';
import { ProfilePhotosPage } from '../pages/profile/photos/index';
import { InappsPage } from '../pages/inapps/index';
import { MessagesPage } from '../pages/messages/index';
import { AppSettingsPage } from '../pages/appSettings/index';
import { BookmarksPage } from '../pages/user/bookmarks/index';
import { GuestsPage } from '../pages/user/guests/index';
import { CompatibleUsersPage } from '../pages/user/compatibleUsers/index';

// messages components
import { PlainMessageComponent } from '../pages/messages/components/plainMessage/index';
import { WinkMessageComponent } from '../pages/messages/components/winkMessage/index';

// tabs components
import { MatchedUserPageComponent } from '../pages/dashboard/components/matchedUser/index';
import { HotListComponent } from '../pages/dashboard/components/hotList/index';
import { TinderComponent } from '../pages/dashboard/components/tinder/index';
import { ProfileComponent } from '../pages/dashboard/components/profile/index';
import { ConversationsComponent } from '../pages/dashboard/components/conversations/index';
import { SearchComponent } from '../pages/dashboard/components/search/index';
import { DashboardTabsComponent } from '../pages/dashboard/components/tabs/index';
import { UserSearchFilterComponent } from '../pages/dashboard/components/search/components/searchFilter/index';

// inapps components
import { MembershipsComponent } from '../pages/inapps/components/memberships/index';
import { ViewMembershipComponent } from '../pages/inapps/components/memberships/viewMembership/index';
import { CreditsComponent } from '../pages/inapps/components/credits/index';

// shared components
import { QuestionComponent } from '../shared/components/question/index';
import { AvatarComponent } from '../shared/components/avatar/index';
import { LocationAutocompleteComponent } from '../shared/components/locationAutocomplete/index';
import { CustomPageComponent } from '../shared/components/customPage/index';
import { FlagComponent } from '../shared/components/flag/index';

// shared directives
import { AutosizeDirective } from '../shared/directives/autosize/index';
import { ChangeFocusByEnterDirective } from '../shared/directives/changeFocusByEnter/index';

// services
import { ApplicationService } from '../services/application/index';
import { CustomMissingTranslationHandler } from '../services/i18n/index';
import { AuthService } from '../services/auth/index';
import { ConfigService } from '../services/config/index';
import { SecureHttpService } from '../services/http/index';
import { apiFactory } from '../services/api/factory';
import { ApiUtilsService } from '../services/api/utils';
import { questionManagerFactory } from '../services/questions/factory';
import { QuestionManager } from '../services/questions/manager';
import { AdMobService } from '../services/admob/index';
import { PushNotificationsService } from '../services/push/index';
import { PermissionsService } from '../services/permissions/index';
import { InAppsService } from '../services/inapps/index';
import { HttpErrorHandlerService } from '../services/http/errorHandler';

// validators
import { Validators } from '../services/questions/validators/index';
import { UserEmailValidator } from '../services/questions/validators/userEmail';
import { UserNameValidator } from '../services/questions/validators/username';
import { RequireValidator } from '../services/questions/validators/require';
import { EmailValidator } from '../services/questions/validators/email';
import { UrlValidator } from '../services/questions/validators/url';
import { MinLengthValidator } from '../services/questions/validators/minLength';
import { MaxLengthValidator } from '../services/questions/validators/maxLength';

// server events
import { ServerEventsService } from '../services/serverEvents/index';
import { ConfigsChannelService } from '../services/serverEvents/channels/configs';
import { PermissionsChannelService } from '../services/serverEvents/channels/permissions';
import { ConversationsChannelService } from '../services/serverEvents/channels/conversations';
import { MatchedUsersChannelService } from '../services/serverEvents/channels/matchedUsers';
import { MessagesChannelService } from '../services/serverEvents/channels/messages';
import { GuestsChannelService } from '../services/serverEvents/channels/guests';
import { HotListChannelService } from '../services/serverEvents/channels/hotList';

// pipes
import { NlbrPipe } from '../shared/pipes/nlbr/index';

@NgModule({
    declarations: [ // register all components
        MyApp,
        CompleteProfilePage,
        CompleteAccountTypePage,
        AppConnectionErrorPage,
        AppErrorPage,
        AppSettingsPage,
        ProfileViewPage,
        ProfilePhotosPage,
        InappsPage,
        MessagesPage,
        BookmarksPage,
        GuestsPage,
        CompatibleUsersPage,
        DashboardPage,
        LoginPage,
        ForgotPasswordCheckEmailPage,
        ForgotPasswordCheckCodePage,
        ForgotPasswordNewPasswordPage,
        VerifyEmailCheckEmailPage,
        VerifyEmailCheckCodePage,
        JoinInitialPage,
        JoinQuestionsPage,
        AppUrlPage,
        UserDisapprovedPage,
        AppMaintenancePage,
        EditUserQuestionsPage,
        EditUserPhotosPage,
        QuestionComponent,
        AvatarComponent,
        LocationAutocompleteComponent,
        CustomPageComponent,
        FlagComponent,
        ProfileComponent,
        TinderComponent,
        HotListComponent,
        MatchedUserPageComponent,
        PlainMessageComponent,
        WinkMessageComponent,
        DashboardTabsComponent,
        ConversationsComponent,
        SearchComponent,
        UserSearchFilterComponent,
        MembershipsComponent,
        ViewMembershipComponent ,
        CreditsComponent,
        UserSearchFilterComponent,
        AutosizeDirective,
        ChangeFocusByEnterDirective,
        NlbrPipe
    ],
    imports: [
        MomentModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        SwingModule,
        IonicModule.forRoot(MyApp, {
            scrollAssist: false,
            autoFocusAssist: false
        }),
        TranslateModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [ //  components used in router configurations.
        MyApp,
        CompleteProfilePage,
        CompleteAccountTypePage,
        AppConnectionErrorPage,
        AppErrorPage,
        AppSettingsPage,
        ProfileViewPage,
        ProfilePhotosPage,
        InappsPage,
        ViewMembershipComponent,
        MessagesPage,
        BookmarksPage,
        GuestsPage,
        CompatibleUsersPage,
        DashboardPage,
        LoginPage,
        JoinInitialPage,
        JoinQuestionsPage,
        AppUrlPage,
        UserDisapprovedPage,
        AppMaintenancePage,
        EditUserQuestionsPage,
        EditUserPhotosPage,
        ForgotPasswordCheckEmailPage,
        ForgotPasswordCheckCodePage,
        ForgotPasswordNewPasswordPage,
        VerifyEmailCheckEmailPage,
        VerifyEmailCheckCodePage,
        JoinInitialPage,
        LocationAutocompleteComponent,
        CustomPageComponent,
        MatchedUserPageComponent,
        FlagComponent,
        UserSearchFilterComponent
    ],
    providers: [ // make globally registered
        Camera,
        Facebook,
        Keyboard,
        Transfer,
        File,
        FilePath,
        ConfigService,
        ApplicationService,
        AuthService,
        SecureHttpService,
        {
            provide: DataStore,
            useFactory: apiFactory,
            deps: [
                ConfigService,
                AuthService,
                TranslateService,
                Events,
                HttpErrorHandlerService
            ]
        },
        ApiUtilsService,
        SecureHttpService,
        {
            provide: QuestionManager,
            useFactory: questionManagerFactory,
            deps: [
                ModalController
            ]
        },
        Validators,
        UserEmailValidator,
        UserNameValidator,
        RequireValidator,
        EmailValidator,
        AdMob,
        AdMobService,
        Push,
        Device,
        PushNotificationsService,
        InAppPurchase,
        InAppsService,
        PhotoViewer,
        PermissionsService,
        HttpErrorHandlerService,
        ServerEventsService,
        ConfigsChannelService,
        PermissionsChannelService,
        ConversationsChannelService,
        MatchedUsersChannelService,
        MessagesChannelService,
        GuestsChannelService,
        HotListChannelService,
        MinLengthValidator,
        MaxLengthValidator,
        UrlValidator,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        {
            provide: MissingTranslationHandler,
            useClass: CustomMissingTranslationHandler
        }
    ]
})
export class AppModule {}
