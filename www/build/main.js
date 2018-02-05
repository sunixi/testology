webpackJsonp([0],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerEventsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__channels_configs__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__channels_permissions__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__channels_conversations__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__channels_matchedUsers__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__channels_messages__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__channels_guests__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__channels_hotList__ = __webpack_require__(295);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// services


// channels







var ServerEventsService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ServerEventsService(translate, ngZone, auth, config, events, configsChannel, permissionsChannel, conversationsChannel, matchedUsersChannel, messagesChannel, guestsChannel, hotListChannel) {
        var _this = this;
        this.translate = translate;
        this.ngZone = ngZone;
        this.auth = auth;
        this.config = config;
        this.events = events;
        this.configsChannel = configsChannel;
        this.permissionsChannel = permissionsChannel;
        this.conversationsChannel = conversationsChannel;
        this.matchedUsersChannel = matchedUsersChannel;
        this.messagesChannel = messagesChannel;
        this.guestsChannel = guestsChannel;
        this.hotListChannel = hotListChannel;
        this.isEventsStarted = false;
        this.channels = [];
        this.reconnectTimeout = 10000;
        // register channels
        this.channels.push(this.configsChannel);
        this.channels.push(this.permissionsChannel);
        this.channels.push(this.conversationsChannel);
        this.channels.push(this.matchedUsersChannel);
        this.channels.push(this.messagesChannel);
        this.channels.push(this.guestsChannel);
        this.channels.push(this.hotListChannel);
        // -- init callbacks --//
        // http error occurred handler
        this.httpErrorHandler = function () {
            _this.stop();
        };
    }
    /**
     * Start
     */
    ServerEventsService.prototype.start = function () {
        var _this = this;
        if (!this.isEventsStarted) {
            this.isEventsStarted = true;
            if (this.reconnectHandler) {
                clearTimeout(this.reconnectHandler);
            }
            // subscribe to some system events
            this.events.subscribe('http:error', this.httpErrorHandler);
            var appLang = this.translate.currentLang
                ? this.translate.currentLang
                : this.translate.getDefaultLang();
            var url = this.auth.isAuthenticated()
                ? this.config.getApiUrl() + ("/server-events/user/" + this.auth.getToken() + "/?api-language=" + appLang)
                : this.config.getApiUrl() + ("/server-events/?api-language=" + appLang);
            // init connection
            this.eventSource = new EventSource(url);
            this.eventSource.onmessage = function (response) {
                var data = JSON.parse(response.data);
                if (data.channel) {
                    var channel_1 = _this.channels.find(function (channel) {
                        return data.channel == channel.getChannelName();
                    });
                    // do we have a received channel?
                    if (channel_1) {
                        _this.ngZone.run(function () { return channel_1.applyChanges(data.data); });
                    }
                }
            };
            // connection error
            this.eventSource.onerror = function (e) {
                if (e.readyState != EventSource.CONNECTING) {
                    _this.ngZone.runOutsideAngular(function () { return _this.reconnectHandler = setTimeout(function () { return _this.restart(); }, _this.reconnectTimeout); });
                }
            };
        }
    };
    /**
     * Restart
     */
    ServerEventsService.prototype.restart = function () {
        this.stop();
        this.start();
    };
    /**
     * Stop
     */
    ServerEventsService.prototype.stop = function () {
        if (this.isEventsStarted) {
            this.isEventsStarted = false;
            this.events.unsubscribe('http:error', this.httpErrorHandler);
            this.eventSource.close();
        }
    };
    ServerEventsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            __WEBPACK_IMPORTED_MODULE_4__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_3__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_5__channels_configs__["a" /* ConfigsChannelService */],
            __WEBPACK_IMPORTED_MODULE_6__channels_permissions__["a" /* PermissionsChannelService */],
            __WEBPACK_IMPORTED_MODULE_7__channels_conversations__["a" /* ConversationsChannelService */],
            __WEBPACK_IMPORTED_MODULE_8__channels_matchedUsers__["a" /* MatchedUsersChannelService */],
            __WEBPACK_IMPORTED_MODULE_9__channels_messages__["a" /* MessagesChannelService */],
            __WEBPACK_IMPORTED_MODULE_10__channels_guests__["a" /* GuestsChannelService */],
            __WEBPACK_IMPORTED_MODULE_11__channels_hotList__["a" /* HotListChannelService */]])
    ], ServerEventsService);
    return ServerEventsService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditUserPhotosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_photoUploader_index__ = __webpack_require__(79);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// services






var EditUserPhotosPage = /** @class */ (function (_super) {
    __extends(EditUserPhotosPage, _super);
    /**
     * Constructor
     */
    function EditUserPhotosPage(ref, events, photoUploader, config, http, loadingCtrl, actionSheetCtrl, alert, toast, permissions, nav, translate, photoViewer, api, auth, apiUtils) {
        var _this = _super.call(this, ref, events, photoUploader, config, http, loadingCtrl, actionSheetCtrl, alert, toast, permissions, nav, translate, api, auth, photoViewer) || this;
        _this.ref = ref;
        _this.events = events;
        _this.photoUploader = photoUploader;
        _this.config = config;
        _this.http = http;
        _this.loadingCtrl = loadingCtrl;
        _this.actionSheetCtrl = actionSheetCtrl;
        _this.alert = alert;
        _this.toast = toast;
        _this.permissions = permissions;
        _this.nav = nav;
        _this.translate = translate;
        _this.photoViewer = photoViewer;
        _this.api = api;
        _this.auth = auth;
        _this.apiUtils = apiUtils;
        _this.infiniteScroll = null;
        _this.freeSlots = 0;
        _this.pageReady = false;
        _this.infiniteScrollNeedComplete = false;
        _this.photosLimit = _this.api.get('configs', 'photosLimit').value;
        // -- init callbacks --//
        // configs updated handler
        _this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        return _this;
    }
    Object.defineProperty(EditUserPhotosPage.prototype, "minPhotos", {
        /**
         * Get min photos
         */
        get: function () {
            return this.api.get('configs', 'minPhotos').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    EditUserPhotosPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // config updated
                        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        // clear user cached data
                        this.apiUtils.clearUserData(this.auth.getUserId());
                        // load all pages dependencies
                        return [4 /*yield*/, Promise.all([
                                this.api.find('users', this.auth.getUserId(), {
                                    params: {
                                        with: ['avatar', 'permissions', 'photos', 'memberships']
                                    }
                                })
                            ])];
                    case 3:
                        // load all pages dependencies
                        _a.sent();
                        // init user avatar
                        if (this.currentUser.avatar && this.currentUser.avatar.id) {
                            this.initAvatar(this.currentUser.avatar);
                        }
                        // load photos
                        this.loadPhotoList(this.photosLimit);
                        loader.dismiss();
                        this.pageReady = true;
                        this.ref.markForCheck();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Component destroy
     */
    EditUserPhotosPage.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
    };
    /**
     * View rendered
     */
    EditUserPhotosPage.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;
            setTimeout(function () {
                _this.infiniteScroll.complete();
            });
        }
    };
    /**
     * Load more photos
     */
    EditUserPhotosPage.prototype.loadMorePhotos = function () {
        if (this.getPhotoCount() + 1 > this.photosLimit) {
            this.photosLimit += this.photosPerRow;
            this.loadPhotoList(this.photosLimit);
            this.infiniteScrollNeedComplete = true;
            this.ref.markForCheck();
            return;
        }
        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
        this.ref.markForCheck();
    };
    Object.defineProperty(EditUserPhotosPage.prototype, "approvalText", {
        /**
         * Approval text
         */
        get: function () {
            var notApprovedPhotos = this.api.filter('photos', {
                where: {
                    userId: this.auth.getUserId(),
                    approved: false
                }
            });
            if (notApprovedPhotos.length && !__WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarActive) {
                return this.translate.instant('avatar_and_photos_approval_text', {
                    photos: notApprovedPhotos.length
                });
            }
            if (notApprovedPhotos.length) {
                return this.translate.instant('photos_approval_text', {
                    photos: notApprovedPhotos.length
                });
            }
            if (!__WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarActive) {
                return this.translate.instant('avatar_approval_text');
            }
            return;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Refresh photo list
     */
    EditUserPhotosPage.prototype.refreshPhotoList = function (refreshType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, extraFreeSlots;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = refreshType;
                        switch (_a) {
                            case 'add': return [3 /*break*/, 1];
                            case 'delete': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 1:
                        // check free slots
                        if (!this.freeSlots) {
                            this.photosLimit += 1;
                            this.ref.markForCheck();
                        }
                        return [4 /*yield*/, this.content.scrollToTop()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        this.photosLimit -= 1;
                        this.ref.markForCheck();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.content.scrollToTop()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (this.photosLimit % this.photosPerRow) {
                            extraFreeSlots = (this.photosPerRow - this.photosLimit % this.photosPerRow);
                            this.freeSlots += extraFreeSlots;
                            this.photosLimit = this.photosLimit + extraFreeSlots;
                        }
                        // remove unused free slots
                        if (this.freeSlots == this.photosPerRow && this.photosLimit > this.minPhotos) {
                            this.freeSlots -= this.photosPerRow;
                            this.photosLimit -= this.photosPerRow;
                        }
                        this.ref.markForCheck();
                        this.loadPhotoList(this.photosLimit);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get photo count
     */
    EditUserPhotosPage.prototype.getPhotoCount = function () {
        return this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            }
        }).length;
    };
    /**
     * Load photo list
     */
    EditUserPhotosPage.prototype.loadPhotoList = function (limit) {
        this.photos = []; // clear current photo list
        var photos = [];
        this.freeSlots = 0;
        // add avatar to the photo list
        photos.push(new __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["b" /* PhotoUnit */](__WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].avatarId, __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].avatarUrl ? __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].avatarUrl : __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].defaultAvatar, __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].bigAvatarUrl ? __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].bigAvatarUrl : __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].defaultAvatar, 'avatar', __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarActive));
        // get user photos
        var apiPhotos = this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            },
            orderBy: [
                ['id', 'DESC']
            ],
            limit: limit - 1 // exclude avatar
        });
        // check count of photos
        var visiblePhotos = this.getPhotoCount() + 1 >= this.minPhotos // include avatar
            ? limit
            : this.minPhotos;
        // process photos
        for (var i = 1; i < visiblePhotos; i++) {
            var photoDetails = apiPhotos && apiPhotos[i - 1] ? apiPhotos[i - 1] : null;
            photos.push(new __WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["b" /* PhotoUnit */](photoDetails ? photoDetails.id : null, photoDetails ? photoDetails.url : null, photoDetails ? photoDetails.bigUrl : null, 'photo', photoDetails ? photoDetails.approved : true));
            if (!photoDetails) {
                this.freeSlots++;
            }
        }
        // chunk photos
        for (var i = 0; i < photos.length; i += this.photosPerRow) {
            this.photos.push(photos.slice(i, i + this.photosPerRow));
        }
        this.ref.markForCheck();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* InfiniteScroll */])
    ], EditUserPhotosPage.prototype, "infiniteScroll", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* Content */])
    ], EditUserPhotosPage.prototype, "content", void 0);
    EditUserPhotosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-user-photos',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\edit\photos\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'edit_user_photos_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button icon-only (click)="showAllActions()" *ngIf="pageReady">\n                <ion-icon name="md-more"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-user-edit-base sk-user-photos-edit-page">\n\n    <div *ngIf="pageReady">\n        <div class="sk-photos-approval" *ngIf="approvalText"><img src="./assets/img/ic_pending_grey.svg" alt="">{{approvalText}}</div>\n        <ion-grid>\n            <ion-row *ngFor="let photoSections of photos; let row = index">\n                <ion-col *ngFor="let photoData of photoSections; let col = index" class="sk-photo-grid-item" (tap)="tapPhoto(row, col)" (press)="pressPhoto(row, col)" [style.background-image]="photoData.url ? \'url(\' + photoData.url + \')\' : \'none\'">\n                    <div *ngIf="!photoData.active" class="sk-photo-pending"><img src="./assets/img/ic_pending.svg" alt=""></div>\n                    <div *ngIf="photoData.type == \'avatar\'" class="sk-avatar-mask"></div>\n                </ion-col>\n            </ion-row>\n        </ion-grid>\n\n        <ion-infinite-scroll (ionInfinite)="loadMorePhotos()">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\edit\photos\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_api_utils__["a" /* ApiUtilsService */],
                __WEBPACK_IMPORTED_MODULE_11__services_photoUploader_index__["a" /* PhotoUploaderService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_11__services_photoUploader_index__["a" /* PhotoUploaderService */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_8__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_photo_viewer__["a" /* PhotoViewer */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_6__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_7__services_api_utils__["a" /* ApiUtilsService */]])
    ], EditUserPhotosPage);
    return EditUserPhotosPage;
}(__WEBPACK_IMPORTED_MODULE_5__basePhotoEdit__["a" /* BasePhotoEdit */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application_config_json__ = __webpack_require__(554);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application_config_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__application_config_json__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfigService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ConfigService() {
        this.baseUri = '/skmobileapp/';
        this.baseApiUri = this.baseUri + 'api';
    }
    /**
     * Get config
     */
    ConfigService.prototype.getConfig = function (configName) {
        var value = __WEBPACK_IMPORTED_MODULE_1__application_config_json___default.a[configName];
        return value;
    };
    /**
     * Get generic api url
     */
    ConfigService.prototype.getGenericApiUrl = function () {
        return localStorage.getItem('siteUrl');
    };
    /**
     * Set generic api url
     */
    ConfigService.prototype.setGenericApiUrl = function (url) {
        localStorage.setItem('siteUrl', url);
    };
    /**
     * Get api uri
     */
    ConfigService.prototype.getApiUri = function () {
        return this.baseApiUri;
    };
    /**
     * Get api url
     */
    ConfigService.prototype.getApiUrl = function () {
        var serverUrl = __WEBPACK_IMPORTED_MODULE_1__application_config_json___default.a['serverUrl'] // check custom server url
            ? __WEBPACK_IMPORTED_MODULE_1__application_config_json___default.a['serverUrl']
            : this.getGenericApiUrl();
        if (serverUrl) {
            return serverUrl + this.getApiUri();
        }
    };
    ConfigService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], ConfigService);
    return ConfigService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_jwt__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = /** @class */ (function () {
    /**
     * Constructor
     */
    function AuthService(events) {
        this.events = events;
        this.token = null;
        this.tokenName = 'token';
        this.user = null;
        this.jwtHelper = new __WEBPACK_IMPORTED_MODULE_1_angular2_jwt__["JwtHelper"]();
        this.token = localStorage.getItem(this.tokenName);
        if (this.token) {
            this.user = this.jwtHelper.decodeToken(this.token);
        }
    }
    /**
     * Get user
     */
    AuthService.prototype.getUser = function () {
        return this.user;
    };
    /**
     * Get user id
     */
    AuthService.prototype.getUserId = function () {
        return this.user ? this.user['id'] : null;
    };
    /**
     * Get token
     */
    AuthService.prototype.getToken = function () {
        return this.token;
    };
    /**
     * Get auth header name
     */
    AuthService.prototype.getAuthHeaderName = function () {
        return 'jwt';
    };
    /**
     * Get auth header value
     */
    AuthService.prototype.getAuthHeaderValue = function () {
        return "Bearer " + this.getToken();
    };
    /**
     * Set authenticated
     */
    AuthService.prototype.setAuthenticated = function (token) {
        localStorage.setItem(this.tokenName, token);
        this.user = this.jwtHelper.decodeToken(token);
        this.token = token;
        this.events.publish('user:login');
    };
    /**
     * Logout
     */
    AuthService.prototype.logout = function () {
        localStorage.removeItem(this.tokenName);
        this.user = null;
        this.token = null;
        this.events.publish('user:logout');
    };
    /**
     * Is authenticated
     */
    AuthService.prototype.isAuthenticated = function () {
        if (this.token) {
            return Object(__WEBPACK_IMPORTED_MODULE_1_angular2_jwt__["tokenNotExpired"])(this.tokenName);
        }
        return false;
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* Events */]])
    ], AuthService);
    return AuthService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpErrorHandlerService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_user_disapproved_index__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_user_verifyEmail_checkCode_index__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_appMaintenance_index__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_user_completeProfile_index__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_user_completeAccountType_index__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_appConnectionError_index__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_appError_index__ = __webpack_require__(318);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// services

// pages








var HttpErrorHandlerService = /** @class */ (function () {
    /**
     * Constructor
     */
    function HttpErrorHandlerService(events, app, auth) {
        this.events = events;
        this.app = app;
        this.auth = auth;
        this.isHandleHttpErrors = true;
    }
    HttpErrorHandlerService_1 = HttpErrorHandlerService;
    /**
     * Set application handle http errors
     */
    HttpErrorHandlerService.prototype.setHandleHttpErrors = function (isHandleHttpErrors) {
        this.isHandleHttpErrors = isHandleHttpErrors;
    };
    /**
     * Handle error
     */
    HttpErrorHandlerService.prototype.handleError = function (errorCode, errorType, errorDescription, force) {
        if (force === void 0) { force = false; }
        if (!this.isHandleHttpErrors && !force) {
            return;
        }
        this.events.publish('http:error', {
            errorCode: errorCode,
            errorType: errorType,
            errorDescription: errorDescription
        });
        switch (errorCode) {
            case HttpErrorHandlerService_1.HTTP_ERROR_NO_INTERNET_CONNECTION:// 0
                this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_9__pages_appConnectionError_index__["a" /* AppConnectionErrorPage */]);
                break;
            case HttpErrorHandlerService_1.HTTP_ERROR_NOT_AUTHORIZED:// 401
                this.auth.logout();
                this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_user_login_index__["a" /* LoginPage */]);
                break;
            case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN:// 403
                switch (errorType) {
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_DISAPPROVED:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_user_disapproved_index__["a" /* UserDisapprovedPage */], {
                            status: 'disapproved',
                        });
                        break;
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_SUSPENDED:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_user_disapproved_index__["a" /* UserDisapprovedPage */], {
                            status: 'suspended',
                            description: errorDescription
                        });
                        break;
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_EMAIL_NOT_VERIFIED:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_user_verifyEmail_checkCode_index__["a" /* VerifyEmailCheckCodePage */]);
                        break;
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_PROFILE_NOT_COMPLETED:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_user_completeProfile_index__["a" /* CompleteProfilePage */]);
                        break;
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_ACCOUNT_TYPE_NOT_COMPLETED:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_user_completeAccountType_index__["a" /* CompleteAccountTypePage */]);
                        break;
                    case HttpErrorHandlerService_1.HTTP_ERROR_FORBIDDEN_MAINTENANCE:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_appMaintenance_index__["a" /* AppMaintenancePage */]);
                        break;
                    default:
                        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_appError_index__["a" /* AppErrorPage */]);
                }
                break;
            default:// 404, 500, etc
                this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_appError_index__["a" /* AppErrorPage */]);
        }
    };
    HttpErrorHandlerService.HTTP_ERROR_NO_INTERNET_CONNECTION = 0;
    HttpErrorHandlerService.HTTP_ERROR_NOT_AUTHORIZED = 401;
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN = 403;
    // forbidden types
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_DISAPPROVED = 'disapproved';
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_SUSPENDED = 'suspended';
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_EMAIL_NOT_VERIFIED = 'emailNotVerified';
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_MAINTENANCE = 'maintenance';
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_PROFILE_NOT_COMPLETED = 'profileNotCompleted';
    HttpErrorHandlerService.HTTP_ERROR_FORBIDDEN_ACCOUNT_TYPE_NOT_COMPLETED = 'accountTypeNotCompleted';
    HttpErrorHandlerService = HttpErrorHandlerService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_2__auth_index__["a" /* AuthService */]])
    ], HttpErrorHandlerService);
    return HttpErrorHandlerService;
    var HttpErrorHandlerService_1;
}());

//# sourceMappingURL=errorHandler.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppUrlPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_js_data_http__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_js_data_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_js_data_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_url__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_url___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_url__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_timeout__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_timeout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_timeout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_appMaintenance_index__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_serverEvents_index__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_questions_control_service__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};










// import pages


// import services



// import questions


var AppUrlPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppUrlPage(serverEvents, nav, api, application, questionControl, http, config, loadingCtrl, alert, questionManager, translate) {
        this.serverEvents = serverEvents;
        this.nav = nav;
        this.api = api;
        this.questionControl = questionControl;
        this.http = http;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.alert = alert;
        this.questionManager = questionManager;
        this.translate = translate;
        this.questions = []; // list of questions
        this.isUrlConfigured = false;
        this.options = ['https://', 'https://www.', 'http://', 'http://www.'];
        this.timeout = 15000; // connection timeout
        this.application = application;
        if (this.config.getApiUrl()) {
            this.isUrlConfigured = true;
        }
    }
    /**
     * Component init
     */
    AppUrlPage.prototype.ngOnInit = function () {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_15__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT, {
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
    };
    /**
     * Submit
     */
    AppUrlPage.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, url, adapter, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.validateApi()];
                    case 3:
                        url = _a.sent();
                        if (!url) return [3 /*break*/, 5];
                        this.serverEvents.stop();
                        this.config.setGenericApiUrl(url);
                        adapter = this.api.getAdapter(__WEBPACK_IMPORTED_MODULE_5_js_data_http__["HttpAdapter"]);
                        adapter.basePath = this.config.getApiUrl();
                        // refresh application dependencies
                        return [4 /*yield*/, this.application.loadDependencies()];
                    case 4:
                        // refresh application dependencies
                        _a.sent();
                        loader.dismiss();
                        // redirect to the page
                        if (this.api.get('configs', 'maintenanceMode').value) {
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__pages_appMaintenance_index__["a" /* AppMaintenancePage */]);
                            return [2 /*return*/];
                        }
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_user_login_index__["a" /* LoginPage */]);
                        return [2 /*return*/];
                    case 5:
                        loader.dismiss();
                        this.showErrorPopup();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        loader.dismiss();
                        this.showErrorPopup();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AppUrlPage.prototype.validateApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, parts, e_2, parsedUrl, slashPos, domain, _a, _b, _i, i, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.form.value.url;
                        if (!(url.indexOf('://') !== -1)) return [3 /*break*/, 5];
                        parts = url.split('://');
                        url = parts[0].toLowerCase() + '://' + parts[1];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.http.get(url + this.config.getApiUri() + '/check-api/')
                                .timeout(this.timeout)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 2:
                        data = _c.sent();
                        if (data.status && data.status == 'ok') {
                            return [2 /*return*/, url];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        parsedUrl = Object(__WEBPACK_IMPORTED_MODULE_6_url__["parse"])(url);
                        url = parsedUrl.host + parsedUrl.path;
                        return [3 /*break*/, 6];
                    case 5:
                        slashPos = url.indexOf('/');
                        if (slashPos !== -1) {
                            domain = url.substring(0, slashPos);
                            url = domain.toLowerCase() + url.substring(slashPos);
                        }
                        else {
                            // There is no path in url. So we may convert whole url to lowercase
                            url = url.toLowerCase();
                        }
                        _c.label = 6;
                    case 6:
                        if (url.indexOf('www.') === 0) {
                            // Remove www from url
                            url = url.substr(4);
                        }
                        _a = [];
                        for (_b in this.options)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 7;
                    case 7:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        i = _a[_i];
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.http.get(this.options[i] + url + this.config.getApiUri() + '/check-api/')
                                .timeout(this.timeout)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 9:
                        data = _c.sent();
                        if (data.status && data.status == 'ok') {
                            return [2 /*return*/, this.options[i] + url];
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        e_3 = _c.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        _i++;
                        return [3 /*break*/, 7];
                    case 12: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Show error popup
     */
    AppUrlPage.prototype.showErrorPopup = function () {
        var alert = this.alert.create({
            title: !this.isUrlConfigured ? 'Error Occurred' : this.translate.instant('error_occurred'),
            subTitle: !this.isUrlConfigured ? 'Invalid site url' : this.translate.instant('site_address_error'),
            buttons: [(this.isUrlConfigured ? 'OK' : this.translate.instant('ok'))]
        });
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], AppUrlPage.prototype, "questions", void 0);
    AppUrlPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-url',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\appUrl\index.html"*/'<ion-header *ngIf="isUrlConfigured">\n    <ion-navbar>\n        <ion-title>{{ \'change_site_url_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-site-url-page" padding>\n    <div class="wrap">\n        <img class="sk-success-icon" src="./assets/img/logo.svg" alt="" />\n\n        <form [formGroup]="form" (ngSubmit)="onSubmit()">\n            <ion-list class="sk-inputs">\n                <ion-icon name="ios-link"></ion-icon>\n                <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n            </ion-list>\n        </form>\n\n        <div class="sk-buttons">\n            <button ion-button block round class="sk-login" *ngIf="!isUrlConfigured" [disabled]="!form.valid" (click)="onSubmit()">Next</button>\n            <button ion-button block round class="sk-login" *ngIf="isUrlConfigured"  [disabled]="!form.valid" (click)="onSubmit()">{{ \'next\' | translate }}</button>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\appUrl\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_16__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_15__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_13__services_application_index__["a" /* ApplicationService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_14__services_serverEvents_index__["a" /* ServerEventsService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_13__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_16__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"],
            __WEBPACK_IMPORTED_MODULE_12__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_15__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */]])
    ], AppUrlPage);
    return AppUrlPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Validators; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__require__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__email__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__url__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__userEmail__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__username__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__minLength__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__maxLength__ = __webpack_require__(306);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var Validators = /** @class */ (function () {
    function Validators(urlValidator, emailValidator, requireValidator, userEmailValidator, userNameValidator, minLengthValidator, maxLengthValidator, translate) {
        this.urlValidator = urlValidator;
        this.emailValidator = emailValidator;
        this.requireValidator = requireValidator;
        this.userEmailValidator = userEmailValidator;
        this.userNameValidator = userNameValidator;
        this.minLengthValidator = minLengthValidator;
        this.maxLengthValidator = maxLengthValidator;
        this.translate = translate;
    }
    /**
     * Get validator list
     */
    Validators.prototype.getValidatorList = function () {
        return {
            minLength: {
                isAsyncValidator: false,
                validator: this.minLengthValidator,
                defaultMessage: this.translate.instant('min_length_validator_error')
            },
            maxLength: {
                isAsyncValidator: false,
                validator: this.maxLengthValidator,
                defaultMessage: this.translate.instant('max_length_validator_error')
            },
            email: {
                isAsyncValidator: false,
                validator: this.emailValidator,
                defaultMessage: this.translate.instant('email_validator_error')
            },
            url: {
                isAsyncValidator: false,
                validator: this.urlValidator,
                defaultMessage: this.translate.instant('url_validator_error')
            },
            require: {
                isAsyncValidator: false,
                validator: this.requireValidator,
                defaultMessage: this.translate.instant('require_validator_error')
            },
            userEmail: {
                isAsyncValidator: true,
                validator: this.userEmailValidator,
                defaultMessage: this.translate.instant('user_email_validator_error')
            },
            userName: {
                isAsyncValidator: true,
                validator: this.userNameValidator,
                defaultMessage: this.translate.instant('user_name_validator_error')
            }
        };
    };
    /**
     * Is validator exists
     */
    Validators.prototype.isValidatorExists = function (name) {
        return name in this.getValidatorList();
    };
    /**
     * Get validator
     */
    Validators.prototype.getValidator = function (name) {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].validator;
        }
        throw new TypeError("Unsupported validator " + name);
    };
    /**
     * Get default message
     */
    Validators.prototype.getDefaultMessage = function (name) {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].defaultMessage;
        }
    };
    /**
     * Is  async validator
     */
    Validators.prototype.isAsyncValidator = function (name) {
        if (this.isValidatorExists(name)) {
            return this.getValidatorList()[name].isAsyncValidator;
        }
        return false;
    };
    Validators = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__url__["a" /* UrlValidator */],
            __WEBPACK_IMPORTED_MODULE_3__email__["a" /* EmailValidator */],
            __WEBPACK_IMPORTED_MODULE_2__require__["a" /* RequireValidator */],
            __WEBPACK_IMPORTED_MODULE_5__userEmail__["a" /* UserEmailValidator */],
            __WEBPACK_IMPORTED_MODULE_6__username__["a" /* UserNameValidator */],
            __WEBPACK_IMPORTED_MODULE_7__minLength__["a" /* MinLengthValidator */],
            __WEBPACK_IMPORTED_MODULE_8__maxLength__["a" /* MaxLengthValidator */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */]])
    ], Validators);
    return Validators;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SecureHttpService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__http_errorHandler__ = __webpack_require__(156);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// services



var SecureHttpService = /** @class */ (function () {
    /**
     * Constructor
     */
    function SecureHttpService(errorHandler, http, config, auth, translate) {
        this.errorHandler = errorHandler;
        this.http = http;
        this.config = config;
        this.auth = auth;
        this.translate = translate;
        this.timeout = parseInt(this.config.getConfig('connectionTimeout'));
    }
    /**
     * Create extra headers
     */
    SecureHttpService.prototype.createExtraHeaders = function (headers) {
        if (this.auth.getToken()) {
            headers.append(this.auth.getAuthHeaderName(), this.auth.getAuthHeaderValue());
        }
        var language = this.translate.currentLang
            ? this.translate.currentLang
            : this.translate.getDefaultLang();
        // add current language
        headers.append('api-language', language);
    };
    /**
     * Get
     */
    SecureHttpService.prototype.get = function (url, forceHandleError) {
        var _this = this;
        if (forceHandleError === void 0) { forceHandleError = false; }
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]();
        this.createExtraHeaders(headers);
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({
            headers: headers
        });
        return this.http.get(url, options)
            .timeout(this.timeout)
            .catch(function (err) {
            _this.reactOnError(err, forceHandleError);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
    };
    /**
     * Put
     */
    SecureHttpService.prototype.put = function (url, data, forceHandleError) {
        var _this = this;
        if (forceHandleError === void 0) { forceHandleError = false; }
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]();
        this.createExtraHeaders(headers);
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({
            headers: headers
        });
        return this.http.put(url, data, options)
            .timeout(this.timeout)
            .catch(function (err) {
            _this.reactOnError(err, forceHandleError);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
    };
    /**
     * Delete
     */
    SecureHttpService.prototype.delete = function (url, forceHandleError) {
        var _this = this;
        if (forceHandleError === void 0) { forceHandleError = false; }
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]();
        this.createExtraHeaders(headers);
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({
            headers: headers
        });
        return this.http.delete(url, options)
            .timeout(this.timeout)
            .catch(function (err) {
            _this.reactOnError(err, forceHandleError);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
    };
    /**
     * Post
     */
    SecureHttpService.prototype.post = function (url, data, forceHandleError) {
        var _this = this;
        if (forceHandleError === void 0) { forceHandleError = false; }
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]();
        this.createExtraHeaders(headers);
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({
            headers: headers
        });
        return this.http.post(url, data, options)
            .timeout(this.timeout)
            .catch(function (err) {
            _this.reactOnError(err, forceHandleError);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(err);
        });
    };
    /**
     * React on error
     */
    SecureHttpService.prototype.reactOnError = function (err, forceHandleError) {
        if (forceHandleError === void 0) { forceHandleError = false; }
        var errorCode = err.status || 0;
        var errorType = '';
        var errorDescription = '';
        var errorDetails = errorCode ? err.json() : '';
        if (errorDetails) {
            errorType = errorDetails.type ? errorDetails.type : '';
            errorDescription = errorDetails.description ? errorDetails.description : '';
        }
        this.errorHandler.handleError(errorCode, errorType, errorDescription, forceHandleError);
    };
    SecureHttpService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__http_errorHandler__["a" /* HttpErrorHandlerService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"],
            __WEBPACK_IMPORTED_MODULE_7__config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_8__auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_ng2_translate__["c" /* TranslateService */]])
    ], SecureHttpService);
    return SecureHttpService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequireValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseValidator__ = __webpack_require__(64);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var RequireValidator = /** @class */ (function (_super) {
    __extends(RequireValidator, _super);
    function RequireValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate
     */
    RequireValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            var isValid = _this.isValid(control.value);
            return isValid ? null : {
                require: {
                    valid: false
                }
            };
        };
    };
    /**
     * Is valid
     */
    RequireValidator.prototype.isValid = function (value) {
        var _this = this;
        var varType = typeof value;
        var isValid = false;
        switch (varType) {
            case 'string':
            case 'number':
                isValid = value.toString().trim() != '';
                break;
            case 'boolean':
                isValid = value === true;
                break;
            case 'object':
                if (Array.isArray(value)) {
                    isValid = value.length > 0;
                }
                else {
                    var emptyProperties_1 = false;
                    // check all object's properties
                    Object.getOwnPropertyNames(value).forEach(function (propertyName) {
                        if (!_this.isValid(value[propertyName])) {
                            emptyProperties_1 = true;
                        }
                    });
                    isValid = !emptyProperties_1;
                }
                break;
            default:
        }
        return isValid;
    };
    RequireValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], RequireValidator);
    return RequireValidator;
}(__WEBPACK_IMPORTED_MODULE_1__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=require.js.map

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CustomPageComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function CustomPageComponent(viewCtrl, navParams) {
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.title = this.navParams.get('title');
        this.pageName = this.navParams.get('pageName');
    }
    /**
     * Close
     */
    CustomPageComponent.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    CustomPageComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'custom-page',template:/*ion-inline-start:"G:\attheclubb\application\src\shared\components\customPage\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{title}}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear (click)="close()">{{ \'close\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <div [innerHTML]="pageName | translate"></div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\shared\components\customPage\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */]])
    ], CustomPageComponent);
    return CustomPageComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PushNotificationsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_device__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_push__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__http_index__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services



var PushNotificationsService = /** @class */ (function () {
    /**
     * Constructor
     */
    function PushNotificationsService(api, auth, config, http, nativeDevice, push) {
        this.api = api;
        this.auth = auth;
        this.config = config;
        this.nativeDevice = nativeDevice;
        this.push = push;
        this.pushObject = null;
        this.http = http;
    }
    /**
     * Init
     */
    PushNotificationsService.prototype.init = function (language) {
        // destroy previously created push object
        this.clearPushObject();
        this.language = language;
    };
    /**
     * Subscribe
     */
    PushNotificationsService.prototype.subscribe = function (callback, context) {
        var _this = this;
        try {
            // create a push object
            if (!this.pushObject) {
                this.pushObject = this.createPushObject();
            }
            // notification
            this.pushObject.on('notification').subscribe(function (notification) {
                if (_this.pushConfig.enabled) {
                    var notificationCallback = callback.bind(context);
                    notificationCallback(notification);
                }
            });
            // push registration
            this.pushObject.on('registration').subscribe(function (registration) { return __awaiter(_this, void 0, void 0, function () {
                var data, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            data = {
                                userId: this.auth.getUserId(),
                                uuid: this.nativeDevice.uuid,
                                token: registration['registrationId'],
                                platform: this.nativeDevice.platform,
                                properties: {
                                    lang: this.language
                                }
                            };
                            return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/device/', data).subscribe()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (e) { }
    };
    /**
     * Unsubscribe
     */
    PushNotificationsService.prototype.unsubscribe = function () {
        this.clearPushObject();
    };
    /**
     * Clear push object
     */
    PushNotificationsService.prototype.clearPushObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pushObject) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.pushObject.unregister()];
                    case 1:
                        _a.sent();
                        this.pushObject = null;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create push object
     */
    PushNotificationsService.prototype.createPushObject = function () {
        return this.push.init({
            android: {
                senderID: this.pushConfig.senderID,
            },
            ios: {
                alert: "true",
                badge: "false",
                sound: "false"
            },
            windows: {}
        });
    };
    Object.defineProperty(PushNotificationsService.prototype, "pushConfig", {
        /**
         * Get push config
         */
        get: function () {
            return this.api.get('configs', 'pushNotificationsConfig').value;
        },
        enumerable: true,
        configurable: true
    });
    PushNotificationsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_6__http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_4__auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_6__http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_0__ionic_native_device__["a" /* Device */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_push__["a" /* Push */]])
    ], PushNotificationsService);
    return PushNotificationsService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PhotoUnit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BasePhotoEdit; });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PhotoUnit = /** @class */ (function () {
    /**
     * Constructor
     */
    function PhotoUnit(id, url, bigUrl, type, active) {
        this.id = id;
        this.url = url;
        this.bigUrl = bigUrl;
        this.type = type;
        this.active = active;
    }
    return PhotoUnit;
}());

var BasePhotoEdit = /** @class */ (function () {
    /**
     * Constructor
     */
    function BasePhotoEdit(ref, events, photoUploader, config, http, loadingCtrl, actionSheetCtrl, alert, toast, permissions, nav, translate, api, auth, photoViewer) {
        this.ref = ref;
        this.events = events;
        this.photoUploader = photoUploader;
        this.config = config;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alert = alert;
        this.toast = toast;
        this.permissions = permissions;
        this.nav = nav;
        this.translate = translate;
        this.api = api;
        this.auth = auth;
        this.photoViewer = photoViewer;
        this.photos = [];
        // init configs
        BasePhotoEdit.staticApi = this.api;
        // init user avatar
        if (this.currentUser.avatar && this.currentUser.avatar.id) {
            this.initAvatar(this.currentUser.avatar);
        }
    }
    Object.defineProperty(BasePhotoEdit, "bigDefaultAvatar", {
        /**
         * Big default avatar
         */
        get: function () {
            return BasePhotoEdit.staticApi.get('configs', 'bigDefaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit, "defaultAvatar", {
        /**
         * Default avatar
         */
        get: function () {
            return BasePhotoEdit.staticApi.get('configs', 'defaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit, "isAvatarRequired", {
        /**
         * Is avatar required
         */
        get: function () {
            return BasePhotoEdit.staticApi.get('configs', 'isAvatarRequired').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit, "avatarMaxUploadSize", {
        /**
         * Avatar max upload size
         */
        get: function () {
            return BasePhotoEdit.staticApi.get('configs', 'avatarMaxUploadSize').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit, "photoMaxUploadSize", {
        /**
         * Photo max upload size
         */
        get: function () {
            return BasePhotoEdit.staticApi.get('configs', 'photoMaxUploadSize').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit.prototype, "photosPerRow", {
        /**
         * Get photos per row
         */
        get: function () {
            return this.api.get('configs', 'photosPerRow').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePhotoEdit.prototype, "currentUser", {
        /**
         * Get current user
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Tap photo
     */
    BasePhotoEdit.prototype.tapPhoto = function (row, col) {
        var photo = this.photos[row][col];
        switch (photo.type) {
            case 'more':
                this.showPhotoActions(photo);
                break;
            default:
                photo.bigUrl
                    ? this.photoViewer.show(photo.bigUrl) // view photo
                    : this.showPhotoActions(photo); // show actions
        }
    };
    /**
     * Press photo
     */
    BasePhotoEdit.prototype.pressPhoto = function (row, col) {
        var photo = this.photos[row][col];
        if (photo.bigUrl) {
            this.showPhotoActions(photo);
        }
    };
    /**
     * Show all actions
     */
    BasePhotoEdit.prototype.showAllActions = function () {
        var buttons = [];
        buttons = buttons.concat(this.getAvatarActions());
        buttons = buttons.concat(this.getPhotoActions());
        buttons.push({
            text: this.translate.instant('cancel'),
            role: 'cancel'
        });
        var actionSheet = this.actionSheetCtrl.create({
            buttons: buttons,
            enableBackdropDismiss: false
        });
        actionSheet.present();
    };
    /**
     * Show photo actions
     */
    BasePhotoEdit.prototype.showPhotoActions = function (photo) {
        var buttons = [];
        switch (photo.type) {
            case 'photo':
                buttons = this.getPhotoActions(photo.id);
                break;
            case 'avatar':
                buttons = this.getAvatarActions(photo.id);
                break;
            default:
                buttons = this.getExtraPhotoActions(photo.type, photo.id);
        }
        if (buttons.length) {
            buttons.push({
                text: this.translate.instant('cancel'),
                role: 'cancel'
            });
            var actionSheet = this.actionSheetCtrl.create({
                buttons: buttons,
                enableBackdropDismiss: false
            });
            actionSheet.present();
        }
    };
    /**
     * Get extra photo actions
     */
    BasePhotoEdit.prototype.getExtraPhotoActions = function (type, id) {
        var buttons = [];
        return buttons;
    };
    /**
     * Get avatar actions
     */
    BasePhotoEdit.prototype.getAvatarActions = function (id) {
        var _this = this;
        var buttons;
        buttons = [{
                text: this.translate.instant('take_avatar'),
                handler: function () { return _this.takePhoto('avatar', 'camera'); }
            }, {
                text: this.translate.instant('choose_avatar_from_library'),
                handler: function () { return _this.takePhoto('avatar', 'library'); }
            }];
        if (id && !BasePhotoEdit.isAvatarRequired) {
            buttons.push({
                text: this.translate.instant('delete_avatar'),
                handler: function () {
                    var avatarButtons = [];
                    avatarButtons = [{
                            text: _this.translate.instant('no')
                        }, {
                            text: _this.translate.instant('yes'),
                            handler: function () { return _this.deleteAvatar(); }
                        }];
                    var confirm = _this.alert.create({
                        message: _this.translate.instant('delete_avatar_confirmation'),
                        buttons: avatarButtons
                    });
                    confirm.present();
                }
            });
        }
        return buttons;
    };
    /**
     * Get photo actions
     */
    BasePhotoEdit.prototype.getPhotoActions = function (id) {
        var _this = this;
        var buttons = [];
        if (this.permissions.isActionAllowed('photo_upload') || this.permissions.isActionPromoted('photo_upload')) {
            buttons.push({
                text: this.translate.instant('take_photo'),
                handler: function () { return _this.permissions.isActionAllowed('photo_upload')
                    ? _this.takePhoto('photo', 'camera')
                    : _this.permissions.showAccessDeniedAlert(); }
            });
            buttons.push({
                text: this.translate.instant('choose_photo_from_library'),
                handler: function () { return _this.permissions.isActionAllowed('photo_upload')
                    ? _this.takePhoto('photo', 'library')
                    : _this.permissions.showAccessDeniedAlert(); }
            });
        }
        if (id) {
            buttons.push({
                text: this.translate.instant('set_avatar'),
                handler: function () { return _this.setPhotoAsAvatar(id); }
            });
            buttons.push({
                text: this.translate.instant('delete_photo'),
                handler: function () {
                    var photoButtons = [];
                    photoButtons = [{
                            text: _this.translate.instant('no')
                        }, {
                            text: _this.translate.instant('yes'),
                            handler: function () { return _this.deletePhoto(id); }
                        }];
                    var confirm = _this.alert.create({
                        message: _this.translate.instant('delete_photo_confirmation'),
                        buttons: photoButtons
                    });
                    confirm.present();
                }
            });
        }
        return buttons;
    };
    /**
     * Delete avatar
     */
    BasePhotoEdit.prototype.deleteAvatar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_1, alert_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.currentUser.avatar && this.currentUser.avatar.id)) return [3 /*break*/, 5];
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('avatars', this.currentUser.avatar.id)];
                    case 3:
                        _a.sent();
                        BasePhotoEdit.avatarId = null;
                        BasePhotoEdit.avatarUrl = null;
                        BasePhotoEdit.bigAvatarUrl = null;
                        BasePhotoEdit.avatarUploaded = false;
                        BasePhotoEdit.isAvatarActive = true;
                        this.ref.markForCheck();
                        // process photos
                        this.refreshPhotoList('delete');
                        loader.dismiss();
                        toast = this.toast.create({
                            message: this.translate.instant('avatar_has_been_deleted'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.events.publish('user:avatarDeleted');
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: this.translate.instant('delete_avatar_error'),
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete photo
     */
    BasePhotoEdit.prototype.deletePhoto = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_2, alert_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('photos', id)];
                    case 3:
                        _a.sent();
                        this.ref.markForCheck();
                        // process photos
                        this.refreshPhotoList('delete');
                        loader.dismiss();
                        toast = this.toast.create({
                            message: this.translate.instant('photo_has_been_deleted'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        loader.dismiss();
                        alert_2 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: this.translate.instant('delete_photo_error'),
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_2.present();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set photo as avatar
     */
    BasePhotoEdit.prototype.setPhotoAsAvatar = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, toast, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.put(this.config.getApiUrl() + "/photos/" + id + "/setAsAvatar/", {})
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        this.ref.markForCheck();
                        this.updateAvatar(data);
                        this.refreshPhotoList('refresh');
                        toast = this.toast.create({
                            message: this.translate.instant('photo_set_avatar'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        this.ref.markForCheck();
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update avatar
     */
    BasePhotoEdit.prototype.updateAvatar = function (avatar) {
        BasePhotoEdit.isAvatarActive = avatar.active;
        BasePhotoEdit.avatarUploaded = true;
        BasePhotoEdit.avatarId = avatar.id;
        BasePhotoEdit.avatarUrl = avatar.pendingUrl;
        BasePhotoEdit.bigAvatarUrl = avatar.pendingBigUrl;
        this.ref.markForCheck();
        // update avatars collection
        this.api.removeAll('avatars', {
            userId: this.auth.getUserId()
        });
        this.api.add('avatars', {
            id: avatar.id,
            userId: avatar.userId,
            url: avatar.url,
            pendingUrl: avatar.pendingUrl,
            bigUrl: avatar.bigUrl,
            pendingBigUrl: avatar.pendingBigUrl,
            active: avatar.active
        });
        this.ref.markForCheck();
        this.events.publish('user:avatarUpdated');
    };
    /**
     * Take photo
     */
    BasePhotoEdit.prototype.takePhoto = function (type, source) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        // init photo uploader
                        if (type == 'avatar') {
                            this.photoUploader.url = this.config.getApiUrl() + '/avatars/me/';
                            this.photoUploader.maxFileSizeMb = BasePhotoEdit.avatarMaxUploadSize;
                        }
                        else {
                            this.photoUploader.url = this.config.getApiUrl() + '/photos/';
                            this.photoUploader.maxFileSizeMb = BasePhotoEdit.photoMaxUploadSize;
                        }
                        this.photoUploader.successUploadCallback = function (response) {
                            response = JSON.parse(response);
                            // refresh avatar collection
                            if (type == 'avatar') {
                                _this.updateAvatar(response);
                                var toast = _this.toast.create({
                                    message: _this.translate.instant('avatar_has_been_uploaded'),
                                    closeButtonText: _this.translate.instant('ok'),
                                    showCloseButton: true,
                                    duration: _this.toastDuration
                                });
                                toast.present();
                            }
                            else {
                                _this.api.add('photos', response);
                                var toast = _this.toast.create({
                                    message: _this.translate.instant('photo_has_been_uploaded'),
                                    closeButtonText: _this.translate.instant('ok'),
                                    showCloseButton: true,
                                    duration: _this.toastDuration
                                });
                                toast.present();
                            }
                            _this.refreshPhotoList('add');
                            _this.ref.markForCheck();
                            loader.dismiss();
                        };
                        this.photoUploader.startUploadingCallback = function () { return loader.present(); };
                        this.photoUploader.errorUploadCallback = function () { return loader.dismiss(); };
                        this.photoUploader.takePicture(source);
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Init avatar
     */
    BasePhotoEdit.prototype.initAvatar = function (avatar) {
        BasePhotoEdit.avatarUrl = avatar.pendingUrl;
        BasePhotoEdit.bigAvatarUrl = avatar.pendingBigUrl;
        BasePhotoEdit.isAvatarActive = avatar.active;
        BasePhotoEdit.avatarUploaded = true;
        BasePhotoEdit.avatarId = avatar.id;
        this.ref.markForCheck();
    };
    BasePhotoEdit.avatarId = null;
    BasePhotoEdit.avatarUrl = null;
    BasePhotoEdit.bigAvatarUrl = null;
    BasePhotoEdit.isAvatarActive = true;
    BasePhotoEdit.avatarUploaded = false;
    return BasePhotoEdit;
}());

//# sourceMappingURL=basePhotoEdit.js.map

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditUserQuestionsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__photos_index__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_photoUploader_index__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_api_utils__ = __webpack_require__(57);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







// questions


// pages

// base classes

// services






var EditUserQuestionsPage = /** @class */ (function (_super) {
    __extends(EditUserQuestionsPage, _super);
    /**
     * Constructor
     */
    function EditUserQuestionsPage(ref, events, photoUploader, config, http, loadingCtrl, actionSheetCtrl, alert, toast, permissions, nav, translate, photoViewer, api, auth, apiUtils, questionControl, questionManager) {
        var _this = _super.call(this, ref, events, photoUploader, config, http, loadingCtrl, actionSheetCtrl, alert, toast, permissions, nav, translate, api, auth, photoViewer) || this;
        _this.ref = ref;
        _this.events = events;
        _this.photoUploader = photoUploader;
        _this.config = config;
        _this.http = http;
        _this.loadingCtrl = loadingCtrl;
        _this.actionSheetCtrl = actionSheetCtrl;
        _this.alert = alert;
        _this.toast = toast;
        _this.permissions = permissions;
        _this.nav = nav;
        _this.translate = translate;
        _this.photoViewer = photoViewer;
        _this.api = api;
        _this.auth = auth;
        _this.apiUtils = apiUtils;
        _this.questionControl = questionControl;
        _this.questionManager = questionManager;
        _this.questions = []; // list of questions
        _this.sections = [];
        _this.formReady = false;
        _this.updatingUserProfile = false;
        _this.questionsCount = 0;
        _this.visiblePhotos = 7;
        return _this;
    }
    /**
     * Component init
     */
    EditUserQuestionsPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, editQuestions, questionsData_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        // clear user cached data
                        this.apiUtils.clearUserData(this.auth.getUserId());
                        return [4 /*yield*/, Promise.all([
                                this.api.getMapper('editQuestions').findAll({}),
                                this.api.findAll('questionsData'),
                                this.api.find('users', this.auth.getUserId(), {
                                    params: {
                                        with: ['avatar', 'permissions', 'photos', 'memberships']
                                    }
                                })
                            ])];
                    case 3:
                        editQuestions = (_a.sent())[0];
                        // init user avatar
                        if (this.currentUser.avatar && this.currentUser.avatar.id) {
                            this.initAvatar(this.currentUser.avatar);
                        }
                        questionsData_1 = this.api.getAll('questionsData');
                        // process questions
                        if (editQuestions && editQuestions.questions) {
                            editQuestions.questions.forEach(function (questionData) {
                                var data = {
                                    section: '',
                                    questions: []
                                };
                                data.section = questionData.section;
                                questionData.items.forEach(function (question) {
                                    // get value from question data
                                    var questionValue = questionsData_1.filter(function (item) {
                                        return item.name == question.key;
                                    });
                                    // create a question
                                    var questionItem = _this.questionManager.getQuestion(question.type, {
                                        key: question.key,
                                        label: question.label,
                                        values: question.values,
                                        value: (questionValue.length ? questionValue[0].value : null)
                                    }, question.params);
                                    questionItem.validators = [];
                                    // add validators
                                    if (question.validators) {
                                        questionItem.validators = question.validators;
                                    }
                                    data.questions.push(questionItem);
                                    _this.questions.push(questionItem);
                                });
                                _this.sections.push(data);
                            });
                        }
                        // load photos
                        this.loadPhotoList();
                        // register all questions inside a form group
                        this.form = this.questionControl.toFormGroup(this.questions);
                        this.formReady = true;
                        this.questionsCount = this.questions.length;
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Is avatar valid
     */
    EditUserQuestionsPage.prototype.isAvatarValid = function () {
        return !__WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarRequired || (__WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarRequired && __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].avatarUploaded);
    };
    EditUserQuestionsPage.prototype.ionViewWillEnter = function () {
        // refresh photo list
        this.loadPhotoList();
    };
    /**
     * Submit form
     */
    EditUserQuestionsPage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, questions_1, updatedQuestions, toast, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        questions_1 = [];
                        // process questions
                        this.questions.forEach(function (questionData) {
                            questions_1.push({
                                name: questionData.key,
                                value: _this.form.value[questionData.key],
                                type: questionData.controlType
                            });
                        });
                        this.updatingUserProfile = true;
                        return [4 /*yield*/, this.api.updateAll('questionsData', questions_1, {}, { suffix: 'me' })];
                    case 3:
                        updatedQuestions = _a.sent();
                        // refresh auth token if exist
                        updatedQuestions.forEach(function (question) {
                            if (question.params && question.params.token) {
                                _this.auth.setAuthenticated(question.params.token);
                            }
                        });
                        // clear user cached data
                        this.apiUtils.clearUserData(this.auth.getUserId(), true);
                        // refresh current user's data
                        return [4 /*yield*/, this.api.find('users', this.auth.getUserId(), {
                                params: {
                                    with: ['avatar', 'permissions', 'photos', 'memberships']
                                }
                            })];
                    case 4:
                        // refresh current user's data
                        _a.sent();
                        this.updatingUserProfile = false;
                        loader.dismiss();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_updated'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.events.publish('user:updated');
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        loader.dismiss();
                        this.updatingUserProfile = false;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Refresh photo list
     */
    EditUserQuestionsPage.prototype.refreshPhotoList = function (refreshType) {
        this.loadPhotoList();
    };
    /**
     * Load photo list
     */
    EditUserQuestionsPage.prototype.loadPhotoList = function () {
        this.photos = []; // clear current photo list
        var photos = [];
        photos.push(new __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["b" /* PhotoUnit */](__WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].avatarId, __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].avatarUrl ? __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].avatarUrl : __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].defaultAvatar, __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].bigAvatarUrl ? __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].bigAvatarUrl : __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].bigDefaultAvatar, 'avatar', __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */].isAvatarActive));
        // get user photos
        var apiPhotos = this.api.filter('photos', {
            where: {
                userId: this.auth.getUserId()
            },
            orderBy: [
                ['id', 'DESC']
            ],
            limit: this.visiblePhotos
        });
        // process photos
        for (var i = 0; i < this.visiblePhotos; i++) {
            var photoDetails = apiPhotos && apiPhotos[i] ? apiPhotos[i] : null;
            photos.push(new __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["b" /* PhotoUnit */](photoDetails ? photoDetails.id : null, photoDetails ? photoDetails.url : null, photoDetails ? photoDetails.bigUrl : null, 'photo', photoDetails ? photoDetails.approved : true));
        }
        photos.push(new __WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["b" /* PhotoUnit */](null, null, null, 'more', true));
        // chunk photos
        for (var i = 0; i < photos.length; i += this.photosPerRow) {
            this.photos.push(photos.slice(i, i + this.photosPerRow));
        }
    };
    /**
     * Get extra photo actions
     */
    EditUserQuestionsPage.prototype.getExtraPhotoActions = function (type, id) {
        var _this = this;
        var buttons = [];
        switch (type) {
            case 'more':
                buttons.push({
                    text: this.translate.instant('view_all_photos'),
                    handler: function () { return _this.nav.push(__WEBPACK_IMPORTED_MODULE_9__photos_index__["a" /* EditUserPhotosPage */]); }
                });
                if (this.permissions.isActionAllowed('photo_upload')
                    || this.permissions.isActionPromoted('photo_upload')) {
                    buttons.push({
                        text: this.translate.instant('take_photo'),
                        handler: function () { return _this.permissions.isActionAllowed('photo_upload')
                            ? _this.takePhoto('photo', 'camera')
                            : _this.permissions.showAccessDeniedAlert(); }
                    });
                    buttons.push({
                        text: this.translate.instant('choose_photo_from_library'),
                        handler: function () { return _this.permissions.isActionAllowed('photo_upload')
                            ? _this.takePhoto('photo', 'library')
                            : _this.permissions.showAccessDeniedAlert(); }
                    });
                }
                break;
            default:
        }
        return buttons;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditUserQuestionsPage.prototype, "questions", void 0);
    EditUserQuestionsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-user-questions',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\edit\questions\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'edit_user_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!isAvatarValid() || !form.valid || updatingUserProfile || !questionsCount" (click)="submit()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-user-edit-base sk-user-edit-page">\n    <!-- photos -->\n    <ion-grid *ngIf="formReady">\n        <ion-row *ngFor="let photoSections of photos; let row = index">\n            <ion-col *ngFor="let photoData of photoSections; let col = index" class="sk-photo-grid-item" (tap)="tapPhoto(row, col)" (press)="pressPhoto(row, col)" [style.background-image]="photoData.url ? \'url(\' + photoData.url + \')\' : \'none\'">\n                <div *ngIf="!photoData.active" class="sk-photo-pending"><img src="./assets/img/ic_pending.svg" alt=""></div>\n                <div *ngIf="photoData.type == \'avatar\'" class="sk-avatar-mask"></div>\n                <ion-icon *ngIf="photoData.type == \'more\'" name="ios-more"></ion-icon>\n            </ion-col>\n        </ion-row>\n    </ion-grid>\n    <!-- questions -->\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list class="sk-edit-fields">\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\edit\questions\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */],
                __WEBPACK_IMPORTED_MODULE_12__services_photoUploader_index__["a" /* PhotoUploaderService */],
                __WEBPACK_IMPORTED_MODULE_16__services_api_utils__["a" /* ApiUtilsService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_12__services_photoUploader_index__["a" /* PhotoUploaderService */],
            __WEBPACK_IMPORTED_MODULE_13__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_15__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_14__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_photo_viewer__["a" /* PhotoViewer */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_11__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_16__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */]])
    ], EditUserQuestionsPage);
    return EditUserQuestionsPage;
}(__WEBPACK_IMPORTED_MODULE_10__basePhotoEdit__["a" /* BasePhotoEdit */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InAppsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_purchase__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var InAppsService = /** @class */ (function () {
    /**
     * Constructor
     */
    function InAppsService(iap, http, config, platform) {
        this.iap = iap;
        this.http = http;
        this.config = config;
        this.platform = platform;
    }
    InAppsService.prototype.getProducts = function (data) {
        var ids = [];
        for (var i in data) {
            ids.push(data[i]['productId'].toLowerCase());
        }
        return this.iap.getProducts(ids);
    };
    InAppsService.prototype.buyProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, validationResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.iap.buy(productId.toLowerCase())];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.validatePurchase(data)];
                    case 2:
                        validationResult = _a.sent();
                        if (!((validationResult.id != -1) && this.platform.is('android'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.iap.consume(data['productType'], data['receipt'], data['signature'])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, validationResult];
                    case 5:
                        e_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InAppsService.prototype.validatePurchase = function (data) {
        var platform = 'unknown';
        if (this.platform.is('android')) {
            platform = 'android';
        }
        else if (this.platform.is('ios')) {
            platform = 'ios';
        }
        return this.http.post(this.config.getApiUrl() + '/inapps/', JSON.stringify({
            "platform": platform,
            "transactionData": data
        }))
            .map(function (res) { return res.json(); })
            .toPromise();
    };
    InAppsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_in_app_purchase__["a" /* InAppPurchase */],
            __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_4__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["q" /* Platform */]])
    ], InAppsService);
    return InAppsService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 184:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 184;

/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__questions_base__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questions_text__ = __webpack_require__(564);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__questions_select__ = __webpack_require__(565);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__questions_textarea__ = __webpack_require__(566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__questions_range__ = __webpack_require__(567);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__questions_checkbox__ = __webpack_require__(568);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__questions_date__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__questions_dateRange__ = __webpack_require__(569);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__questions_googlemapLocation__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__questions_extendedGooglemapLocation__ = __webpack_require__(570);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import questions










var QuestionManager = /** @class */ (function () {
    /**
     * Constructor
     */
    function QuestionManager(modalController) {
        this.modalController = modalController;
    }
    QuestionManager_1 = QuestionManager;
    /**
     * Get config
     */
    QuestionManager.prototype.getQuestion = function (type, options, params) {
        if (options === void 0) { options = {}; }
        if (params === void 0) { params = {}; }
        switch (type) {
            case QuestionManager_1.TYPE_LOCATION:
            case QuestionManager_1.TYPE_URL:
            case QuestionManager_1.TYPE_TEXT:
            case QuestionManager_1.TYPE_EMAIL:
            case QuestionManager_1.TYPE_PASSWORD:
                var textOptions = new __WEBPACK_IMPORTED_MODULE_3__questions_text__["a" /* QuestionTextOptions */]();
                if (options) {
                    textOptions.value = options.value;
                    textOptions.values = options.values;
                    textOptions.key = options.key;
                    textOptions.label = options.label;
                    textOptions.type = type != QuestionManager_1.TYPE_LOCATION ? type : 'text';
                    textOptions.validators = options.validators;
                }
                var textParams = new __WEBPACK_IMPORTED_MODULE_3__questions_text__["b" /* QuestionTextParams */]();
                if (params) {
                    textParams.questionClass = params.questionClass;
                    textParams.hideErrors = params.hideErrors;
                    textParams.hideWarning = params.hideWarning;
                    textParams.stacked = params.stacked;
                }
                return new __WEBPACK_IMPORTED_MODULE_3__questions_text__["c" /* TextQuestion */](textOptions, textParams);
            case QuestionManager_1.TYPE_RADIO:
            case QuestionManager_1.TYPE_SELECT:
            case QuestionManager_1.TYPE_FSELECT:
                var selectOptions = new __WEBPACK_IMPORTED_MODULE_4__questions_select__["a" /* QuestionSelectOptions */]();
                if (options) {
                    selectOptions.value = options.value;
                    selectOptions.values = options.values;
                    selectOptions.key = options.key;
                    selectOptions.label = options.label;
                    selectOptions.validators = options.validators;
                }
                var selectParams = new __WEBPACK_IMPORTED_MODULE_4__questions_select__["b" /* QuestionSelectParams */]();
                if (params) {
                    selectParams.questionClass = params.questionClass;
                    selectParams.hideErrors = params.hideErrors;
                    selectParams.hideWarning = params.hideWarning;
                    selectParams.hideEmptyValue = params.hideEmptyValue;
                }
                return new __WEBPACK_IMPORTED_MODULE_4__questions_select__["c" /* SelectQuestion */](selectOptions, selectParams);
            case QuestionManager_1.TYPE_MULTISELECT:
            case QuestionManager_1.TYPE_MULTICHECKBOX:
                var multiSelectOptions = new __WEBPACK_IMPORTED_MODULE_4__questions_select__["a" /* QuestionSelectOptions */]();
                if (options) {
                    multiSelectOptions.value = options.value;
                    multiSelectOptions.values = options.values;
                    multiSelectOptions.key = options.key;
                    multiSelectOptions.label = options.label;
                    multiSelectOptions.multiple = true;
                    multiSelectOptions.validators = options.validators;
                }
                var multiSelectParams = new __WEBPACK_IMPORTED_MODULE_4__questions_select__["b" /* QuestionSelectParams */]();
                if (params) {
                    multiSelectParams.questionClass = params.questionClass;
                    multiSelectParams.hideErrors = params.hideErrors;
                    multiSelectParams.hideWarning = params.hideWarning;
                    multiSelectParams.hideEmptyValue = params.hideEmptyValue;
                }
                return new __WEBPACK_IMPORTED_MODULE_4__questions_select__["c" /* SelectQuestion */](multiSelectOptions, multiSelectParams);
            case QuestionManager_1.TYPE_TEXTAREA:
                var textAreaOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    textAreaOptions.value = options.value;
                    textAreaOptions.values = options.values;
                    textAreaOptions.key = options.key;
                    textAreaOptions.label = options.label;
                    textAreaOptions.validators = options.validators;
                }
                var textAreaParams = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["c" /* QuestionBaseParams */]();
                if (params) {
                    textAreaParams.questionClass = params.questionClass;
                    textAreaParams.hideErrors = params.hideErrors;
                    textAreaParams.hideWarning = params.hideWarning;
                }
                return new __WEBPACK_IMPORTED_MODULE_5__questions_textarea__["a" /* TextareaQuestion */](textAreaOptions, textAreaParams);
            case QuestionManager_1.TYPE_RANGE:
                var rangeOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    rangeOptions.value = options.value;
                    rangeOptions.values = options.values;
                    rangeOptions.key = options.key;
                    rangeOptions.label = options.label;
                    rangeOptions.validators = options.validators;
                }
                var rangeParams = new __WEBPACK_IMPORTED_MODULE_6__questions_range__["a" /* QuestionRangeParams */]();
                if (params) {
                    rangeParams.questionClass = params.questionClass;
                    rangeParams.hideErrors = params.hideErrors;
                    rangeParams.hideWarning = params.hideWarning;
                    rangeParams.min = params.min;
                    rangeParams.max = params.max;
                }
                return new __WEBPACK_IMPORTED_MODULE_6__questions_range__["b" /* RangeQuestion */](rangeOptions, rangeParams);
            case QuestionManager_1.TYPE_CHECKBOX:
                var checkboxOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    checkboxOptions.value = options.value;
                    checkboxOptions.values = options.values;
                    checkboxOptions.key = options.key;
                    checkboxOptions.label = options.label;
                    checkboxOptions.validators = options.validators;
                }
                var checkboxParams = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["c" /* QuestionBaseParams */]();
                if (params) {
                    checkboxParams.questionClass = params.questionClass;
                    checkboxParams.hideErrors = params.hideErrors;
                    checkboxParams.hideWarning = params.hideWarning;
                }
                return new __WEBPACK_IMPORTED_MODULE_7__questions_checkbox__["a" /* CheckboxQuestion */](checkboxOptions, checkboxParams);
            case QuestionManager_1.TYPE_GOOGLEMAP_LOCATION:
                var googleMapLocationOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    googleMapLocationOptions.value = options.value;
                    googleMapLocationOptions.values = options.values;
                    googleMapLocationOptions.key = options.key;
                    googleMapLocationOptions.label = options.label;
                    googleMapLocationOptions.validators = options.validators;
                }
                var googleMapLocationParams = new __WEBPACK_IMPORTED_MODULE_6__questions_range__["a" /* QuestionRangeParams */]();
                if (params) {
                    googleMapLocationParams.questionClass = params.questionClass;
                    googleMapLocationParams.hideErrors = params.hideErrors;
                    googleMapLocationParams.hideWarning = params.hideWarning;
                }
                var locationQuestion = new __WEBPACK_IMPORTED_MODULE_10__questions_googlemapLocation__["a" /* GoogleMapLocationQuestion */](googleMapLocationOptions, googleMapLocationParams);
                locationQuestion.setModal(this.modalController);
                return locationQuestion;
            case QuestionManager_1.TYPE_EXTENDED_GOOGLEMAP_LOCATION:
                var extendedGoogleMapLocationOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    extendedGoogleMapLocationOptions.value = options.value;
                    extendedGoogleMapLocationOptions.values = options.values;
                    extendedGoogleMapLocationOptions.key = options.key;
                    extendedGoogleMapLocationOptions.label = options.label;
                    extendedGoogleMapLocationOptions.validators = options.validators;
                }
                var extendedGoogleMapLocationParams = new __WEBPACK_IMPORTED_MODULE_11__questions_extendedGooglemapLocation__["b" /* QuestionExtendedGoogleMapLocationParams */]();
                if (params) {
                    extendedGoogleMapLocationParams.questionClass = params.questionClass;
                    extendedGoogleMapLocationParams.hideErrors = params.hideErrors;
                    extendedGoogleMapLocationParams.hideWarning = params.hideWarning;
                    extendedGoogleMapLocationParams.min = params.min;
                    extendedGoogleMapLocationParams.max = params.max;
                    extendedGoogleMapLocationParams.step = params.step;
                    extendedGoogleMapLocationParams.unit = params.unit;
                }
                var extendedLocationQuestion = new __WEBPACK_IMPORTED_MODULE_11__questions_extendedGooglemapLocation__["a" /* ExtendedGoogleMapLocationQuestion */](extendedGoogleMapLocationOptions, extendedGoogleMapLocationParams);
                extendedLocationQuestion.setModal(this.modalController);
                return extendedLocationQuestion;
            case QuestionManager_1.TYPE_DATE_RANGE:
                var dateRangeOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    dateRangeOptions.value = options.value;
                    dateRangeOptions.values = options.values;
                    dateRangeOptions.key = options.key;
                    dateRangeOptions.label = options.label;
                    dateRangeOptions.validators = options.validators;
                }
                var dateRangeParams = new __WEBPACK_IMPORTED_MODULE_8__questions_date__["b" /* QuestionDateParams */]();
                if (params) {
                    dateRangeParams.questionClass = params.questionClass;
                    dateRangeParams.hideErrors = params.hideErrors;
                    dateRangeParams.hideWarning = params.hideWarning;
                    dateRangeParams.minDate = params.minDate;
                    dateRangeParams.maxDate = params.maxDate;
                    dateRangeParams.displayFormat = params.displayFormat;
                }
                return new __WEBPACK_IMPORTED_MODULE_9__questions_dateRange__["a" /* DateRangeQuestion */](dateRangeOptions, dateRangeParams);
            case QuestionManager_1.TYPE_DATE:
            case QuestionManager_1.TYPE_AGE:
            case QuestionManager_1.TYPE_BIRTHDATE:
                var dateOptions = new __WEBPACK_IMPORTED_MODULE_2__questions_base__["b" /* QuestionBaseOptions */]();
                if (options) {
                    dateOptions.value = options.value;
                    dateOptions.values = options.values;
                    dateOptions.key = options.key;
                    dateOptions.label = options.label;
                    dateOptions.validators = options.validators;
                }
                var dateParams = new __WEBPACK_IMPORTED_MODULE_8__questions_date__["b" /* QuestionDateParams */]();
                if (params) {
                    dateParams.questionClass = params.questionClass;
                    dateParams.hideErrors = params.hideErrors;
                    dateParams.hideWarning = params.hideWarning;
                    dateParams.minDate = params.minDate;
                    dateParams.maxDate = params.maxDate;
                    dateParams.displayFormat = params.displayFormat;
                }
                return new __WEBPACK_IMPORTED_MODULE_8__questions_date__["a" /* DateQuestion */](dateOptions, dateParams);
            default:
                throw new TypeError("Unsupported type " + type);
        }
    };
    // list of available questions
    QuestionManager.TYPE_LOCATION = 'location';
    QuestionManager.TYPE_URL = 'url';
    QuestionManager.TYPE_TEXT = 'text';
    QuestionManager.TYPE_EMAIL = 'email';
    QuestionManager.TYPE_PASSWORD = 'password';
    QuestionManager.TYPE_MULTISELECT = 'multiselect';
    QuestionManager.TYPE_SELECT = 'select';
    QuestionManager.TYPE_FSELECT = 'fselect';
    QuestionManager.TYPE_RADIO = 'radio';
    QuestionManager.TYPE_TEXTAREA = 'textarea';
    QuestionManager.TYPE_RANGE = 'range';
    QuestionManager.TYPE_CHECKBOX = 'checkbox';
    QuestionManager.TYPE_DATE = 'date';
    QuestionManager.TYPE_DATE_RANGE = 'date_range';
    QuestionManager.TYPE_AGE = 'age';
    QuestionManager.TYPE_BIRTHDATE = 'birthdate';
    QuestionManager.TYPE_MULTICHECKBOX = 'multicheckbox';
    QuestionManager.TYPE_GOOGLEMAP_LOCATION = 'googlemap_location';
    QuestionManager.TYPE_EXTENDED_GOOGLEMAP_LOCATION = 'extended_googlemap_location';
    QuestionManager = QuestionManager_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */]])
    ], QuestionManager);
    return QuestionManager;
    var QuestionManager_1;
}());

//# sourceMappingURL=manager.js.map

/***/ }),

/***/ 235:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 235;

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigsChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConfigsChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ConfigsChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    ConfigsChannelService.prototype.getChannelName = function () {
        return 'configs';
    };
    /**
     * Apply changes
     */
    ConfigsChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedConfigs = [];
        // update configs
        data.forEach(function (config) {
            _this.api.add('configs', config);
            updatedConfigs.push(config.id);
        });
        // remove not updated configs
        this.api.removeAll('configs', {
            where: {
                id: {
                    'notIn': updatedConfigs
                }
            }
        });
        this.events.publish('configs:updated');
    };
    ConfigsChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]])
    ], ConfigsChannelService);
    return ConfigsChannelService;
}());

//# sourceMappingURL=configs.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PermissionsChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PermissionsChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function PermissionsChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    PermissionsChannelService.prototype.getChannelName = function () {
        return 'permissions';
    };
    /**
     * Apply changes
     */
    PermissionsChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedUserPermissions = [];
        // update user permissions
        data.forEach(function (permission) {
            _this.api.add('permissions', permission);
            updatedUserPermissions.push(permission.id);
        });
        // remove not updated permissions
        this.api.removeAll('permissions', {
            where: {
                id: {
                    'notIn': updatedUserPermissions
                }
            }
        });
        this.events.publish('permissions:updated');
    };
    PermissionsChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]])
    ], PermissionsChannelService);
    return PermissionsChannelService;
}());

//# sourceMappingURL=permissions.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConversationsChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConversationsChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ConversationsChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    ConversationsChannelService.prototype.getChannelName = function () {
        return 'conversations';
    };
    /**
     * Apply changes
     */
    ConversationsChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedConversations = [];
        // update conversations
        data.forEach(function (conversation) {
            _this.api.add('conversations', conversation);
            updatedConversations.push(conversation.id);
        });
        // remove not updated conversations
        this.api.removeAll('conversations', {
            where: {
                id: {
                    'notIn': updatedConversations
                }
            }
        });
        // remove messages
        this.api.removeAll('messages', {
            where: {
                conversationId: {
                    'notIn': updatedConversations
                }
            }
        });
        this.events.publish('conversations:updated');
    };
    ConversationsChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], ConversationsChannelService);
    return ConversationsChannelService;
}());

//# sourceMappingURL=conversations.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchedUsersChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MatchedUsersChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function MatchedUsersChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    MatchedUsersChannelService.prototype.getChannelName = function () {
        return 'matchedUsers';
    };
    /**
     * Apply changes
     */
    MatchedUsersChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedMatches = [];
        // update matched users
        data.forEach(function (match) {
            _this.api.add('matchedUsers', match);
            updatedMatches.push(match.id);
        });
        // remove not updated matches
        this.api.removeAll('matchedUsers', {
            where: {
                id: {
                    'notIn': updatedMatches
                }
            }
        });
        this.events.publish('matchedUsers:updated');
    };
    MatchedUsersChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], MatchedUsersChannelService);
    return MatchedUsersChannelService;
}());

//# sourceMappingURL=matchedUsers.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessagesChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MessagesChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function MessagesChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    MessagesChannelService.prototype.getChannelName = function () {
        return 'messages';
    };
    /**
     * Apply changes
     */
    MessagesChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        if (data.length) {
            var updatedMessages_1 = {
                newMessages: [],
                updatedMessages: []
            };
            data.forEach(function (message) {
                var oldMessage = _this.api.filter('messages', { where: {
                        id: message.id
                    } });
                var messageInfo = {
                    id: message.id,
                    conversationId: message.conversationId
                };
                oldMessage.length
                    ? updatedMessages_1.updatedMessages.push(messageInfo)
                    : updatedMessages_1.newMessages.push(messageInfo);
                _this.api.add('messages', message);
            });
            this.events.publish('messages:updated', updatedMessages_1);
        }
    };
    MessagesChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], MessagesChannelService);
    return MessagesChannelService;
}());

//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuestsChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var GuestsChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function GuestsChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    GuestsChannelService.prototype.getChannelName = function () {
        return 'guests';
    };
    /**
     * Apply changes
     */
    GuestsChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedGuests = [];
        // update guests
        data.forEach(function (guest) {
            _this.api.add('guests', guest);
            updatedGuests.push(guest.id);
        });
        // remove not updated guests
        this.api.removeAll('guests', {
            where: {
                id: {
                    'notIn': updatedGuests
                }
            }
        });
        this.events.publish('guests:updated');
    };
    GuestsChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]])
    ], GuestsChannelService);
    return GuestsChannelService;
}());

//# sourceMappingURL=guests.js.map

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HotListChannelService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HotListChannelService = /** @class */ (function () {
    /**
     * Constructor
     */
    function HotListChannelService(events, api) {
        this.events = events;
        this.api = api;
    }
    /**
     * Get channel name
     */
    HotListChannelService.prototype.getChannelName = function () {
        return 'hotList';
    };
    /**
     * Apply changes
     */
    HotListChannelService.prototype.applyChanges = function (data) {
        var _this = this;
        var updatedUsers = [];
        // update users
        data.forEach(function (hotListUser) {
            _this.api.add('hotListUsers', hotListUser);
            updatedUsers.push(hotListUser.id);
        });
        // remove not updated users
        this.api.removeAll('hotListUsers', {
            where: {
                id: {
                    'notIn': updatedUsers
                }
            }
        });
        this.events.publish('hotList:updated');
    };
    HotListChannelService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]])
    ], HotListChannelService);
    return HotListChannelService;
}());

//# sourceMappingURL=hotList.js.map

/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuestionDateParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuestionDateParams = /** @class */ (function (_super) {
    __extends(QuestionDateParams, _super);
    function QuestionDateParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionDateParams;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* QuestionBaseParams */]));

;
var DateQuestion = /** @class */ (function (_super) {
    __extends(DateQuestion, _super);
    /**
     * Constructor
     */
    function DateQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'date';
        _this.displayFormat = 'MMM DD, YYYY';
        // init default max and min date range
        var currentTime = new Date();
        _this.maxDate = currentTime.getFullYear().toString();
        _this.minDate = (currentTime.getFullYear() - 100).toString();
        // init extra prams
        if (params) {
            params.displayFormat
                ? _this.displayFormat = params.displayFormat
                : null;
            params.minDate
                ? _this.minDate = params.minDate
                : null;
            params.maxDate
                ? _this.maxDate = params.maxDate
                : null;
        }
        return _this;
    }
    DateQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */], QuestionDateParams])
    ], DateQuestion);
    return DateQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=date.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMapLocationQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_components_locationAutocomplete_index__ = __webpack_require__(299);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import shared components

var GoogleMapLocationQuestion = /** @class */ (function (_super) {
    __extends(GoogleMapLocationQuestion, _super);
    /**
     * Constructor
     */
    function GoogleMapLocationQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'googlemap_location';
        _this.questionChanged = false;
        if (!_this.value) {
            _this.value = '';
        }
        return _this;
    }
    /**
     * Set modal
     */
    GoogleMapLocationQuestion.prototype.setModal = function (modalController) {
        this.modalController = modalController;
    };
    /**
     * Show address modal
     */
    GoogleMapLocationQuestion.prototype.showAddressModal = function () {
        var _this = this;
        var modal = this.modalController.create(__WEBPACK_IMPORTED_MODULE_2__shared_components_locationAutocomplete_index__["a" /* LocationAutocompleteComponent */], {
            q: this.getValue()
        });
        modal.onDidDismiss(function (location) {
            _this.setValue(location);
            if (!_this.questionChanged) {
                _this.controlView.markAsDirty();
                _this.controlView.markAsTouched();
                _this.questionChanged = true;
            }
            // trigger manually about update in the question
            _this.controlView.updateValueAndValidity();
        });
        modal.present();
    };
    /**
     * Get value
     */
    GoogleMapLocationQuestion.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Set value
     */
    GoogleMapLocationQuestion.prototype.setValue = function (location) {
        this.value = location;
        this.controlView.setValue(location);
    };
    GoogleMapLocationQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */], __WEBPACK_IMPORTED_MODULE_1__base__["c" /* QuestionBaseParams */]])
    ], GoogleMapLocationQuestion);
    return GoogleMapLocationQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=googlemapLocation.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationAutocompleteComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_translate__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



// services



var LocationAutocompleteComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function LocationAutocompleteComponent(viewCtrl, http, config, navParams, alert, translate) {
        this.viewCtrl = viewCtrl;
        this.config = config;
        this.navParams = navParams;
        this.alert = alert;
        this.translate = translate;
        this.autocompleteItems = [];
        this.autocompleteLoading = false;
        this.searchQuery = this.navParams.get('q');
        this.http = http;
    }
    /**
     * Component init
     */
    LocationAutocompleteComponent.prototype.ngOnInit = function () {
        this.updateSearch();
    };
    /**
     * Dismiss
     */
    LocationAutocompleteComponent.prototype.dismiss = function () {
        this.viewCtrl.dismiss('');
    };
    /**
     * Choose item
     */
    LocationAutocompleteComponent.prototype.chooseItem = function (location) {
        this.viewCtrl.dismiss(location);
    };
    /**
     * Update search
     */
    LocationAutocompleteComponent.prototype.updateSearch = function () {
        var _this = this;
        if (!this.searchQuery) {
            this.autocompleteItems = [];
            return;
        }
        this.autocompleteLoading = true;
        this.http.get(this.config.getApiUrl() + '/location-autocomplete/?q=' + this.searchQuery)
            .map(function (res) { return res.json(); })
            .subscribe(function (predictions) {
            _this.autocompleteLoading = false;
            _this.autocompleteItems = predictions;
        }, function () {
            _this.autocompleteLoading = false;
            _this.viewCtrl.dismiss('');
            var alert = _this.alert.create({
                title: _this.translate.instant('error_occurred'),
                subTitle: _this.translate.instant('couldnt_complete_request'),
                buttons: [_this.translate.instant('ok')]
            });
            alert.present();
        });
    };
    LocationAutocompleteComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'location-autocomplete',template:/*ion-inline-start:"G:\attheclubb\application\src\shared\components\locationAutocomplete\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-buttons start>\n            <button ion-button clear (click)="dismiss()">{{ \'cancel\' | translate }}</button>\n        </ion-buttons>\n\n        <ion-title>{{ \'choose_location_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <ion-searchbar\n            [(ngModel)]="searchQuery"\n            [showCancelButton]="true"\n            (ionInput)="updateSearch()"\n            (ionCancel)="dismiss()"\n            debounce="500"\n            cancelButtonText="{{ \'cancel\' | translate }}">\n            placeholder="{{ \'search\' | translate }}">\n    </ion-searchbar>\n    <ion-list>\n        <ion-item *ngIf="autocompleteLoading">\n            <ion-spinner></ion-spinner>\n        </ion-item>\n\n        <ion-item *ngFor="let location of autocompleteItems" tappable (click)="chooseItem(location)">\n            {{ location }}\n        </ion-item>\n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\shared\components\locationAutocomplete\index.html"*/,
            providers: [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */]; })
            ]
        }),
        __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_4__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5_ng2_translate__["c" /* TranslateService */]])
    ], LocationAutocompleteComponent);
    return LocationAutocompleteComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_push_index__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_serverEvents_index__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__messages_index__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_matchedUser_index__ = __webpack_require__(325);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// services




// pages

// components

var DashboardPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function DashboardPage(modalCtrl, ref, application, nav, pushNotifications, navParams, serverEvents, auth, api) {
        this.modalCtrl = modalCtrl;
        this.ref = ref;
        this.application = application;
        this.nav = nav;
        this.pushNotifications = pushNotifications;
        this.navParams = navParams;
        this.serverEvents = serverEvents;
        this.auth = auth;
        this.api = api;
        this.slider = null;
        this.isDashboardActive = true;
        this.pageReady = false;
        this.components = [
            'profile',
            'search',
            'conversations'
        ];
    }
    DashboardPage_1 = DashboardPage;
    /**
     * Component init
     */
    DashboardPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // load all page dependencies
                        return [4 /*yield*/, Promise.all([
                                this.api.find('users', this.auth.getUserId(), {
                                    params: {
                                        with: ['avatar', 'permissions', 'photos', 'memberships']
                                    }
                                })
                            ])];
                    case 1:
                        // load all page dependencies
                        _a.sent();
                        // init push notifications
                        this.pushNotifications.subscribe(this.processPushNotification, this);
                        // init server events
                        this.serverEvents.restart();
                        // new matched users
                        this.newMatchedUsersHandler = setInterval(function () { return _this.showNewMatchedUserPopup(); }, this.newMatchedUsersCheckDelay);
                        this.pageReady = true;
                        this.ref.markForCheck();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DashboardPage.prototype, "newMatchedUsersCheckDelay", {
        /**
         * New matched users check delay
         */
        get: function () {
            return this.api.get('configs', 'newMatchedUsersCheckDelay').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component did active
     */
    DashboardPage.prototype.ionViewDidEnter = function () {
        // define active component
        if (this.navParams.get('component')) {
            this.activeComponent = this.navParams.get('component');
        }
        else {
            this.activeComponent = this.application.getAppSetting('active_component') !== null
                ? this.application.getAppSetting('active_component')
                : this.components[0];
        }
        // define sub component
        this.activeSubComponent = this.application.getAppSetting('active_sub_component');
        this.ref.markForCheck();
        this.changeComponent({
            componentName: this.activeComponent,
            subComponentName: this.activeSubComponent
        });
    };
    /**
     * Component destroy
     */
    DashboardPage.prototype.ngOnDestroy = function () {
        this.pushNotifications.unsubscribe();
        clearInterval(this.newMatchedUsersHandler);
    };
    /**
     * Component will active
     */
    DashboardPage.prototype.ionViewWillEnter = function () {
        this.isDashboardActive = true;
        this.ref.markForCheck();
    };
    /**
     * Component will not active
     */
    DashboardPage.prototype.ionViewWillLeave = function () {
        this.isDashboardActive = false;
        this.ref.markForCheck();
    };
    /**
     * Show new matched user popup
     */
    DashboardPage.prototype.showNewMatchedUserPopup = function () {
        var _this = this;
        if (this.isDashboardActive) {
            // find a new match
            var matchedUser_1 = this.api.filter('matchedUsers', {
                where: {
                    isNew: true,
                    isRead: false
                },
                orderBy: [
                    ['isNew', 'DESC'],
                    ['createStamp', 'DESC']
                ],
                limit: 1
            });
            if (matchedUser_1.length) {
                clearInterval(this.newMatchedUsersHandler);
                var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_8__components_matchedUser_index__["a" /* MatchedUserPageComponent */], {
                    user: matchedUser_1[0]
                });
                modal.onDidDismiss(function (result) {
                    _this.newMatchedUsersHandler = setInterval(function () { return _this.showNewMatchedUserPopup(); }, _this.newMatchedUsersCheckDelay);
                    if (result && result.showChat) {
                        _this.nav.push(__WEBPACK_IMPORTED_MODULE_7__messages_index__["a" /* MessagesPage */], {
                            userId: matchedUser_1[0].userId
                        });
                    }
                });
                modal.present();
            }
        }
    };
    /**
     * Change component
     */
    DashboardPage.prototype.changeComponent = function (component) {
        var componentIndex = this.components.indexOf(component.componentName);
        if (componentIndex > -1) {
            // save the last user's choice
            this.application.setAppSetting('active_component', component.componentName);
            this.activeComponent = component.componentName;
            if (component.subComponentName) {
                this.application.setAppSetting('active_sub_component', component.subComponentName);
                this.activeSubComponent = component.subComponentName;
            }
            this.ref.markForCheck();
            this.slider.slideTo(componentIndex);
            return;
        }
    };
    /**
     * Slider did change
     */
    DashboardPage.prototype.sliderDidChange = function () {
        this.activeComponent = this.components[this.slider.getActiveIndex()];
        // save the last user's choice
        this.application.setAppSetting('active_component', this.activeComponent);
        this.ref.markForCheck();
    };
    /**
     * Process notification
     */
    DashboardPage.prototype.processPushNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(notification.additionalData && notification.additionalData.uuid != this.application.getAppSetting('push_uuid') && !notification.additionalData.foreground)) return [3 /*break*/, 6];
                        this.application.setAppSetting('push_uuid', notification.additionalData.uuid);
                        _a = notification.additionalData.type;
                        switch (_a) {
                            case DashboardPage_1.PUSH_NOTIFICATION_MESSAGE: return [3 /*break*/, 1];
                            case DashboardPage_1.PUSH_NOTIFICATION_MATCHED_USER: return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        if (notification.additionalData.senderId && notification.additionalData.conversationId) {
                            this.nav.push(__WEBPACK_IMPORTED_MODULE_7__messages_index__["a" /* MessagesPage */], {
                                userId: notification.additionalData.senderId,
                                conversationId: notification.additionalData.conversationId
                            });
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        this.changeComponent({
                            componentName: 'conversations'
                        });
                        // mark matched user
                        return [4 /*yield*/, this.api.update('matchedUsers', notification.additionalData.id, {
                                isRead: true
                            })];
                    case 3:
                        // mark matched user
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DashboardPage.PUSH_NOTIFICATION_MESSAGE = 'message';
    DashboardPage.PUSH_NOTIFICATION_MATCHED_USER = 'matchedUser';
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"])('componentsSlider'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["s" /* Slides */])
    ], DashboardPage.prototype, "slider", void 0);
    DashboardPage = DashboardPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'dashboard',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\index.html"*/'<ion-header>\n    <ion-toolbar class="sk-dashboard-toolbar">\n        <dashboard-tabs *ngIf="pageReady && isDashboardActive" (componentChanged)="changeComponent($event)" [activeComponent]="activeComponent" [activeSubComponent]="activeSubComponent"></dashboard-tabs>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content no-bounce class="sk-dashboard-page">\n\n    <!-- component slider -->\n    <div class="sk-components-slider-wrapper" ion-fixed>\n        <ion-slides #componentsSlider (ionSlideDidChange)="sliderDidChange()">\n            <ion-slide>\n                <profile *ngIf="pageReady && isDashboardActive" [activeComponent]="activeComponent"></profile>\n            </ion-slide>\n            <ion-slide>\n                <hot-list *ngIf="pageReady && isDashboardActive && (activeSubComponent == \'hot-list\' || !activeSubComponent)" [activeComponent]="activeComponent"></hot-list>\n                <tinder *ngIf="pageReady && activeSubComponent == \'tinder\'" [activeComponent]="activeComponent"></tinder>\n                <search *ngIf="pageReady && activeSubComponent == \'search\'" [activeComponent]="activeComponent"></search>\n            </ion-slide>\n            <ion-slide>\n                <conversations *ngIf="pageReady && isDashboardActive" [activeComponent]="activeComponent"></conversations>\n            </ion-slide>\n        </ion-slides>\n    </div>\n\n    <!-- preloader -->\n    <div *ngIf="!pageReady" class="sk-main-preloader">\n        <img src="./assets/img/preloader.svg" alt="">\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["m" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_3__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__services_push_index__["a" /* PushNotificationsService */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_6__services_serverEvents_index__["a" /* ServerEventsService */],
            __WEBPACK_IMPORTED_MODULE_5__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], DashboardPage);
    return DashboardPage;
    var DashboardPage_1;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmailValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseValidator__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EmailValidator = /** @class */ (function (_super) {
    __extends(EmailValidator, _super);
    /**
     * Constructor
     */
    function EmailValidator(api) {
        var _this = _super.call(this) || this;
        _this.api = api;
        _this.baseRegexp = /^([\w\-\.\+\%]*[\w])@((?:[A-Za-z0-9\-]+\.)+[A-Za-z]{2,})$/;
        return _this;
    }
    /**
     * Validate
     */
    EmailValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            return _this.getRegexp().test(control.value) || !control.value.trim() ? null : {
                email: {
                    valid: false
                }
            };
        };
    };
    /**
     * Get regexp
     */
    EmailValidator.prototype.getRegexp = function () {
        var apiRegexp = this.api.get('configs', 'emailRegexp');
        var emailRegexp = apiRegexp
            ? new RegExp(apiRegexp.value)
            : this.baseRegexp;
        return emailRegexp;
    };
    EmailValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], EmailValidator);
    return EmailValidator;
}(__WEBPACK_IMPORTED_MODULE_1__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=email.js.map

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UrlValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseValidator__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UrlValidator = /** @class */ (function (_super) {
    __extends(UrlValidator, _super);
    /**
     * Constructor
     */
    function UrlValidator(api) {
        var _this = _super.call(this) || this;
        _this.api = api;
        _this.baseRegexp = /^(http(s)?:\/\/)?((\d+\.\d+\.\d+\.\d+)|(([\w-]+\.)+([a-z,A-Z][\w-]*)))(:[1-9][0-9]*)?(\/?([\w-.\,\/:%+@&*=~]+[\w- \,.\/?:%+@&=*|]*)?)?(#(.*))?$/i;
        return _this;
    }
    /**
     * Validate
     */
    UrlValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            return _this.getRegexp().test(control.value) || !control.value.trim() ? null : {
                url: {
                    valid: false
                }
            };
        };
    };
    /**
     * Get regexp
     */
    UrlValidator.prototype.getRegexp = function () {
        var apiRegexp = this.api.get('configs', 'urlRegexp');
        var urlRegexp = apiRegexp
            ? new RegExp(apiRegexp.value, 'i')
            : this.baseRegexp;
        return urlRegexp;
    };
    UrlValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], UrlValidator);
    return UrlValidator;
}(__WEBPACK_IMPORTED_MODULE_1__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=url.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserEmailValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__baseAsyncValidator__ = __webpack_require__(303);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




// import services



// import base async validator

var UserEmailValidator = /** @class */ (function (_super) {
    __extends(UserEmailValidator, _super);
    /**
     * Constructor
     */
    function UserEmailValidator(http, config, auth, api, events) {
        var _this = _super.call(this, api, http, events) || this;
        _this.config = config;
        _this.auth = auth;
        _this.api = api;
        _this.events = events;
        return _this;
    }
    /**
     * Validate
     */
    UserEmailValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            clearTimeout(_this.timer);
            return new Promise(function (resolve) {
                _this.timer = setTimeout(function () {
                    if (control.value.trim()) {
                        var email_1 = control.value;
                        var options = _this.auth.isAuthenticated()
                            ? { email: email_1, user: _this.auth.getUser()['name'] }
                            : { email: email_1 };
                        _this.http.post(_this.config.getApiUrl() + '/validators/user-email/', JSON.stringify(options))
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            if (!data.valid || control.value != email_1) {
                                _this.fireEvent('userEmail', control.value, false);
                                resolve({ 'userEmail': true });
                                return;
                            }
                            _this.fireEvent('userEmail', control.value, true);
                            resolve(null);
                        }, function () {
                            _this.fireEvent('userEmail', control.value, false);
                            resolve({ 'userEmail': true });
                        });
                    }
                    else {
                        _this.fireEvent('userEmail', control.value, false);
                        resolve({ 'userEmail': true }); // user email cannot be empty
                    }
                }, _this.getValidationDelay());
            });
        };
    };
    UserEmailValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_4__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_5__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */]])
    ], UserEmailValidator);
    return UserEmailValidator;
}(__WEBPACK_IMPORTED_MODULE_7__baseAsyncValidator__["a" /* BaseAsyncValidator */]));

//# sourceMappingURL=userEmail.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseAsyncValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseValidator__ = __webpack_require__(64);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BaseAsyncValidator = /** @class */ (function (_super) {
    __extends(BaseAsyncValidator, _super);
    /**
     * Constructor
     */
    function BaseAsyncValidator(api, http, events) {
        var _this = _super.call(this) || this;
        _this.api = api;
        _this.http = http;
        _this.events = events;
        _this.baseValidationDelay = 1000;
        return _this;
    }
    /**
     * Fire event
     */
    BaseAsyncValidator.prototype.fireEvent = function (validatorName, value, isValid) {
        this.events.publish('asyncValidator:finished', {
            name: validatorName,
            value: value,
            isValid: isValid
        });
    };
    /**
     * Get validation delay
     */
    BaseAsyncValidator.prototype.getValidationDelay = function () {
        var apiValidationDelay = this.api.get('configs', 'validationDelay');
        var validationDelay = apiValidationDelay
            ? parseInt(apiValidationDelay.value)
            : this.baseValidationDelay;
        return validationDelay;
    };
    return BaseAsyncValidator;
}(__WEBPACK_IMPORTED_MODULE_0__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=baseAsyncValidator.js.map

/***/ }),

/***/ 304:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserNameValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__baseAsyncValidator__ = __webpack_require__(303);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




// import services



// import base async validator

var UserNameValidator = /** @class */ (function (_super) {
    __extends(UserNameValidator, _super);
    /**
     * Constructor
     */
    function UserNameValidator(http, config, auth, api, events) {
        var _this = _super.call(this, api, http, events) || this;
        _this.config = config;
        _this.auth = auth;
        _this.api = api;
        _this.events = events;
        return _this;
    }
    /**
     * Validate
     */
    UserNameValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            clearTimeout(_this.timer);
            return new Promise(function (resolve) {
                _this.timer = setTimeout(function () {
                    if (control.value.trim()) {
                        var username_1 = control.value;
                        var options = _this.auth.isAuthenticated()
                            ? { userName: username_1, oldUserName: _this.auth.getUser()['name'] }
                            : { userName: username_1 };
                        _this.http.post(_this.config.getApiUrl() + '/validators/user-name/', JSON.stringify(options))
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            if (!data.valid || control.value != username_1) {
                                _this.fireEvent('userName', control.value, false);
                                resolve({ 'userName': true });
                                return;
                            }
                            _this.fireEvent('userName', control.value, true);
                            resolve(null);
                        }, function () {
                            _this.fireEvent('userName', control.value, false);
                            resolve({ 'userName': true });
                        });
                    }
                    else {
                        _this.fireEvent('userName', control.value, false);
                        resolve({ 'userName': true }); // username cannot be empty
                    }
                }, _this.getValidationDelay());
            });
        };
    };
    UserNameValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_4__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_6__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */]])
    ], UserNameValidator);
    return UserNameValidator;
}(__WEBPACK_IMPORTED_MODULE_7__baseAsyncValidator__["a" /* BaseAsyncValidator */]));

//# sourceMappingURL=username.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MinLengthValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseValidator__ = __webpack_require__(64);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MinLengthValidator = /** @class */ (function (_super) {
    __extends(MinLengthValidator, _super);
    function MinLengthValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate
     */
    MinLengthValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            var params = _this.params;
            return control.value.length >= params.length ? null : {
                minLength: {
                    valid: false
                }
            };
        };
    };
    MinLengthValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], MinLengthValidator);
    return MinLengthValidator;
}(__WEBPACK_IMPORTED_MODULE_1__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=minLength.js.map

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaxLengthValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseValidator__ = __webpack_require__(64);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MaxLengthValidator = /** @class */ (function (_super) {
    __extends(MaxLengthValidator, _super);
    function MaxLengthValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate
     */
    MaxLengthValidator.prototype.validate = function () {
        var _this = this;
        return function (control) {
            var params = _this.params;
            return control.value.length <= params.length ? null : {
                maxLength: {
                    valid: false
                }
            };
        };
    };
    MaxLengthValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], MaxLengthValidator);
    return MaxLengthValidator;
}(__WEBPACK_IMPORTED_MODULE_1__baseValidator__["a" /* BaseValidator */]));

//# sourceMappingURL=maxLength.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotPasswordCheckEmailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__checkCode_index__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// questions


// pages

// services


var ForgotPasswordCheckEmailPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function ForgotPasswordCheckEmailPage(navCtrl, alert, config, http, loadingCtrl, questionControl, translate, questionManager) {
        this.navCtrl = navCtrl;
        this.alert = alert;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.questionControl = questionControl;
        this.translate = translate;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.http = http;
    }
    /**
     * Component init
     */
    ForgotPasswordCheckEmailPage.prototype.ngOnInit = function () {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_EMAIL, {
                key: 'email',
                label: this.translate.instant('forgot_password_email_input'),
                validators: [
                    { name: 'require' }
                ]
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    };
    /**
     * Submit form
     */
    ForgotPasswordCheckEmailPage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, alert_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/forgot-password/', JSON.stringify({ email: this.form.value['email'] }))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        loader.dismiss();
                        if (data.success == true) {
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__checkCode_index__["a" /* ForgotPasswordCheckCodePage */], {
                                email: this.form.value['email']
                            });
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: data.message,
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], ForgotPasswordCheckEmailPage.prototype, "questions", void 0);
    ForgotPasswordCheckEmailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'forgot-password-check-email',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\forgotPassword\checkEmail\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'forgot_password_check_email_page_title\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear [disabled]="!form.valid" (click)="submit()">{{ \'next\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-forgot-pass-check-email-page sk-forgot-pass-page">\n  <ion-item text-wrap class="sk-description">\n    <p>{{ \'forgot_password_email_check_desc\' | translate }}</p>\n  </ion-item>\n  <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\forgotPassword\checkEmail\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]])
    ], ForgotPasswordCheckEmailPage);
    return ForgotPasswordCheckEmailPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotPasswordCheckCodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__newPassword_index__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// questions


// pages

// services


var ForgotPasswordCheckCodePage = /** @class */ (function () {
    /**
     * Constructor
     */
    function ForgotPasswordCheckCodePage(navParams, navCtrl, alert, config, http, loadingCtrl, questionControl, translate, questionManager) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.alert = alert;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.questionControl = questionControl;
        this.translate = translate;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.http = http;
        this.email = this.navParams.get('email');
    }
    /**
     * Component init
     */
    ForgotPasswordCheckCodePage.prototype.ngOnInit = function () {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT, {
                key: 'code',
                label: this.translate.instant('forgot_password_code_input'),
                validators: [
                    { name: 'require' }
                ]
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    };
    /**
     * Submit form
     */
    ForgotPasswordCheckCodePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, alert_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/validators/forgot-password-code/', JSON.stringify({ code: this.form.value['code'] }))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        loader.dismiss();
                        if (data.valid) {
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__newPassword_index__["a" /* ForgotPasswordNewPasswordPage */], {
                                code: this.form.value['code'],
                                email: this.email
                            });
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: this.translate.instant('forgot_password_code_invalid'),
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], ForgotPasswordCheckCodePage.prototype, "questions", void 0);
    ForgotPasswordCheckCodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'forgot-password-check-code',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\forgotPassword\checkCode\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'forgot_password_check_code_page_title\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear [disabled]="!form.valid" (click)="submit()">{{ \'next\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-forgot-pass-check-code-page sk-forgot-pass-page">\n  <ion-item text-wrap class="sk-description">\n    <p>{{ \'forgot_password_code_check_desc\' | translate }}</p>\n  </ion-item>\n  <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\forgotPassword\checkCode\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]])
    ], ForgotPasswordCheckCodePage);
    return ForgotPasswordCheckCodePage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotPasswordNewPasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// questions


// pages

// services


var ForgotPasswordNewPasswordPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function ForgotPasswordNewPasswordPage(toast, navCtrl, navParams, api, alert, config, http, loadingCtrl, questionControl, translate, questionManager) {
        this.toast = toast;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.alert = alert;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.questionControl = questionControl;
        this.translate = translate;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.http = http;
        this.code = this.navParams.get('code');
        this.email = this.navParams.get('email');
    }
    Object.defineProperty(ForgotPasswordNewPasswordPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    ForgotPasswordNewPasswordPage.prototype.ngOnInit = function () {
        var _this = this;
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */].TYPE_PASSWORD, {
                key: 'password',
                label: this.translate.instant('password_input'),
                validators: [
                    { name: 'require' },
                    {
                        name: 'minLength',
                        message: this.translate.instant('password_min_length_validator_error', {
                            length: this.api.get('configs', 'minPasswordLength').value
                        }),
                        params: {
                            length: this.api.get('configs', 'minPasswordLength').value
                        }
                    },
                    {
                        name: 'maxLength',
                        message: this.translate.instant('password_max_length_validator_error', {
                            length: this.api.get('configs', 'maxPasswordLength').value
                        }),
                        params: {
                            length: this.api.get('configs', 'maxPasswordLength').value
                        }
                    },
                ]
            }),
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */].TYPE_PASSWORD, {
                key: 'repeatPassword',
                label: this.translate.instant('password_repeat_input'),
                validators: [
                    { name: 'require' }
                ]
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions, function (formGroup) {
            if (formGroup.get('password').value === formGroup.get('repeatPassword').value) {
                return null;
            }
            return {
                message: _this.translate.instant('password_repeat_validator_error'),
                question: 'repeatPassword'
            };
        });
    };
    /**
     * Submit form
     */
    ForgotPasswordNewPasswordPage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, toast, alert_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.put(this.config.getApiUrl() + '/forgot-password/' + this.code + '/', JSON.stringify({ email: this.email, password: this.form.value['password'] }))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        loader.dismiss();
                        if (data.success == true) {
                            toast = this.toast.create({
                                message: this.translate.instant('forgot_password_reset_successful'),
                                closeButtonText: this.translate.instant('ok'),
                                showCloseButton: true,
                                duration: this.toastDuration
                            });
                            toast.present();
                            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__login_index__["a" /* LoginPage */]);
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: data.message,
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], ForgotPasswordNewPasswordPage.prototype, "questions", void 0);
    ForgotPasswordNewPasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'forgot-password-new-password',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\forgotPassword\newPassword\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'forgot_password_new_password_page_title\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear [disabled]="!form.valid" (click)="submit()">{{ \'next\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-forgot-pass-new-password-page sk-forgot-pass-page">\n  <ion-item text-wrap class="sk-description">\n    <p>{{ \'forgot_password_new_password_desc\' | translate }}</p>\n  </ion-item>\n  <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\forgotPassword\newPassword\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */]])
    ], ForgotPasswordNewPasswordPage);
    return ForgotPasswordNewPasswordPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinInitialPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__questions_index__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// pages

// services


// questions


var JoinInitialPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function JoinInitialPage(loadingCtrl, api, questionControl, actionSheetCtrl, photoUploader, config, translate, navCtrl, questionManager) {
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.api = api;
        this.questionControl = questionControl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.photoUploader = photoUploader;
        this.config = config;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.avatarUrl = null;
        this.avatarKey = null;
        this.avatarUploaded = false;
        this.avatarUploadInProgress = false;
        // init photo uploader
        this.photoUploader.url = this.config.getApiUrl() + '/avatars/';
        this.photoUploader.maxFileSizeMb = this.avatarMaxUploadSize;
        this.photoUploader.successUploadCallback = function (response) {
            response = JSON.parse(response);
            _this.avatarUrl = response.url;
            _this.avatarKey = response.key;
            _this.avatarUploaded = true;
            _this.avatarUploadInProgress = false;
        };
        this.photoUploader.startUploadingCallback = function () { return _this.avatarUploadInProgress = true; };
        this.photoUploader.errorUploadCallback = function () { return _this.avatarUploadInProgress = false; };
    }
    Object.defineProperty(JoinInitialPage.prototype, "avatarMaxUploadSize", {
        /**
         * Avatar max upload size
         */
        get: function () {
            return this.api.get('configs', 'avatarMaxUploadSize').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinInitialPage.prototype, "isAvatarHidden", {
        /**
         * Is avatar hidden
         */
        get: function () {
            return this.api.get('configs', 'isAvatarHidden').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinInitialPage.prototype, "isAvatarRequired", {
        /**
         * Is avatar required
         */
        get: function () {
            return this.api.get('configs', 'isAvatarRequired').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    JoinInitialPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, genders, genderList_1, questions, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.findAll('userGenders')];
                    case 3:
                        genders = _a.sent();
                        genderList_1 = [];
                        genders.forEach(function (gender) { return genderList_1.push({
                            value: gender.id,
                            title: gender.name
                        }); });
                        questions = [
                            {
                                section: '',
                                questions: [
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT,
                                        key: 'userName',
                                        label: this.translate.instant('username_input'),
                                        validators: [
                                            { name: 'require' },
                                            { name: 'userName' }
                                        ],
                                        params: {
                                            stacked: true
                                        }
                                    },
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_PASSWORD,
                                        key: 'password',
                                        label: this.translate.instant('password_input'),
                                        validators: [
                                            { name: 'require' },
                                            {
                                                name: 'minLength',
                                                message: this.translate.instant('password_min_length_validator_error', {
                                                    length: this.api.get('configs', 'minPasswordLength').value
                                                }),
                                                params: {
                                                    length: this.api.get('configs', 'minPasswordLength').value
                                                }
                                            },
                                            {
                                                name: 'maxLength',
                                                message: this.translate.instant('password_max_length_validator_error', {
                                                    length: this.api.get('configs', 'maxPasswordLength').value
                                                }),
                                                params: {
                                                    length: this.api.get('configs', 'maxPasswordLength').value
                                                }
                                            },
                                        ],
                                        params: {
                                            stacked: true
                                        }
                                    },
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_PASSWORD,
                                        key: 'repeatPassword',
                                        label: this.translate.instant('password_repeat_input'),
                                        validators: [
                                            { name: 'require' }
                                        ],
                                        params: {
                                            stacked: true
                                        }
                                    }
                                ]
                            },
                            {
                                section: this.translate.instant('base_input_section'),
                                questions: [
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_EMAIL,
                                        key: 'email',
                                        label: this.translate.instant('email_input'),
                                        validators: [
                                            { name: 'require' },
                                            { name: 'userEmail' },
                                        ],
                                        params: {
                                            stacked: true
                                        }
                                    },
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_SELECT,
                                        key: 'sex',
                                        label: this.translate.instant('gender_input'),
                                        values: genderList_1,
                                        validators: [
                                            { name: 'require' }
                                        ]
                                    },
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */].TYPE_MULTICHECKBOX,
                                        key: 'lookingFor',
                                        label: this.translate.instant('looking_for_input'),
                                        values: genderList_1,
                                        validators: [
                                            { name: 'require' }
                                        ]
                                    }
                                ]
                            }
                        ];
                        // process questions
                        questions.forEach(function (questionData) {
                            var data = {
                                section: '',
                                questions: []
                            };
                            data.section = questionData.section;
                            questionData.questions.forEach(function (question) {
                                var params = question.params ? question.params : {};
                                var questionItem = _this.questionManager.getQuestion(question.type, {
                                    key: question.key,
                                    label: question.label,
                                    values: question.values,
                                    value: question.value
                                }, params);
                                // add validators
                                if (question.validators) {
                                    questionItem.validators = question.validators;
                                }
                                data.questions.push(questionItem);
                                _this.questions.push(questionItem);
                            });
                            _this.sections.push(data);
                        });
                        // register all questions inside a form group
                        this.form = this.questionControl.toFormGroup(this.questions, function (formGroup) {
                            if (formGroup.get('password').value === formGroup.get('repeatPassword').value) {
                                return null;
                            }
                            return {
                                message: _this.translate.instant('password_repeat_validator_error'),
                                question: 'repeatPassword'
                            };
                        });
                        this.formReady = true;
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(JoinInitialPage.prototype, "isAvatarValid", {
        /**
         * Is avatar valid
         */
        get: function () {
            return this.isAvatarHidden || !this.isAvatarRequired || (this.avatarUploaded && !this.avatarUploadInProgress);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Ask for image source
     */
    JoinInitialPage.prototype.askForImageSource = function () {
        var _this = this;
        if (!this.avatarUploadInProgress) {
            var buttons = [
                {
                    text: this.translate.instant('take_avatar'),
                    handler: function () { return _this.photoUploader.takePicture('camera'); }
                },
                {
                    text: this.translate.instant('choose_avatar_from_library'),
                    role: 'choose',
                    handler: function () { return _this.photoUploader.takePicture('library'); }
                },
                {
                    text: this.translate.instant('cancel'),
                    role: 'cancel'
                }
            ];
            var actionSheet = this.actionSheetCtrl.create({
                title: this.translate.instant('upload_avatar'),
                buttons: buttons
            });
            actionSheet.present();
        }
    };
    /**
     * Submit form
     */
    JoinInitialPage.prototype.submit = function () {
        var initialData = Object.assign({}, this.form.value, {
            avatarKey: this.avatarKey
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__questions_index__["a" /* JoinQuestionsPage */], {
            initial: initialData
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], JoinInitialPage.prototype, "questions", void 0);
    JoinInitialPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'join-initial',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\join\initial\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'join_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid || !isAvatarValid" (click)="submit()">{{ \'next\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-join-initial-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list class="sk-join-fields">\n            <div class="wrap">\n                <!-- avatar -->\n                <div class="sk-avatar-wrapper" *ngIf="!isAvatarHidden" (click)="askForImageSource()">\n                    <div class="{{ isAvatarValid || avatarUploadInProgress ? \'sk-add-avatar\' : \'sk-add-avatar sk-avatar-warning\' }}" *ngIf="avatarUrl" [style.background-image]="\'url(\' + avatarUrl + \')\'">\n                        <ion-spinner *ngIf="avatarUploadInProgress"></ion-spinner>\n                    </div>\n                    <div class="{{ isAvatarValid || avatarUploadInProgress ? \'sk-add-avatar\' : \'sk-add-avatar sk-avatar-warning\' }}" *ngIf="!avatarUrl">\n                        <ion-icon *ngIf="!avatarUploadInProgress" name="md-add"></ion-icon>\n                        <span *ngIf="!avatarUploadInProgress">{{ \'choose_avatar\' | translate }}</span>\n                        <ion-spinner *ngIf="avatarUploadInProgress"></ion-spinner>\n                    </div>\n                </div>\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\join\initial\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */],
                __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__["a" /* PhotoUploaderService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__["a" /* PhotoUploaderService */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_8__services_questions_manager__["a" /* QuestionManager */]])
    ], JoinInitialPage);
    return JoinInitialPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinQuestionsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shared_components_customPage_index__ = __webpack_require__(161);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// questions


// pages

// services

// shared components

var JoinQuestionsPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function JoinQuestionsPage(nav, loadingCtrl, api, questionControl, navParams, questionManager, translate, alert, auth, modalCtrl) {
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.api = api;
        this.questionControl = questionControl;
        this.navParams = navParams;
        this.questionManager = questionManager;
        this.translate = translate;
        this.alert = alert;
        this.auth = auth;
        this.modalCtrl = modalCtrl;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.creatingUserProfile = false;
        this.tosValue = false;
        this.initialData = this.navParams.get('initial');
        this.currentGender = this.initialData.sex;
    }
    Object.defineProperty(JoinQuestionsPage.prototype, "isTosActive", {
        /**
         * Is TOS active
         */
        get: function () {
            return this.api.get('configs', 'isTosActive').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    JoinQuestionsPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('joinQuestions').find(this.currentGender)];
                    case 3:
                        data = _a.sent();
                        // process questions
                        data.questions.forEach(function (questionData) {
                            var data = {
                                section: '',
                                questions: []
                            };
                            data.section = questionData.section;
                            questionData.items.forEach(function (question) {
                                var questionItem = _this.questionManager.getQuestion(question.type, {
                                    key: question.key,
                                    label: question.label,
                                    values: question.values,
                                    value: question.value
                                }, question.params);
                                // add validators
                                if (question.validators) {
                                    questionItem.validators = question.validators;
                                }
                                data.questions.push(questionItem);
                                _this.questions.push(questionItem);
                            });
                            _this.sections.push(data);
                        });
                        // register all questions inside a form group
                        this.form = this.questionControl.toFormGroup(this.questions);
                        this.formReady = true;
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Is tos valid
     */
    JoinQuestionsPage.prototype.isTosValid = function () {
        return this.isTosActive && this.tosValue || !this.isTosActive;
    };
    /**
     * Show tos modal
     */
    JoinQuestionsPage.prototype.showTosModal = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_8__shared_components_customPage_index__["a" /* CustomPageComponent */], {
            title: this.translate.instant('tos_page_header'),
            pageName: 'tos_page_content'
        });
        modal.present();
    };
    /**
     * Submit form
     */
    JoinQuestionsPage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, userData, processedQuestions_1, e_2, alert_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // show loader
                        this.creatingUserProfile = true;
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('users').create({
                                userName: this.initialData.userName,
                                email: this.initialData.email,
                                password: this.initialData.password,
                                sex: this.initialData.sex,
                                avatarKey: this.initialData.avatarKey
                            })];
                    case 3:
                        userData = _a.sent();
                        // set user authenticated
                        this.auth.setAuthenticated(userData.token);
                        processedQuestions_1 = [];
                        this.questions.forEach(function (questionData) {
                            processedQuestions_1.push({
                                name: questionData.key,
                                value: _this.form.value[questionData.key],
                                type: questionData.controlType
                            });
                        });
                        // add match sex
                        processedQuestions_1.push({
                            name: 'match_sex',
                            value: this.initialData.lookingFor,
                            type: __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_MULTICHECKBOX
                        });
                        // create questions
                        return [4 /*yield*/, this.api.createMany('questionsData', processedQuestions_1)];
                    case 4:
                        // create questions
                        _a.sent();
                        loader.dismiss();
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__dashboard_index__["a" /* DashboardPage */]);
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        loader.dismiss();
                        this.creatingUserProfile = false;
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: this.translate.instant('profile_create_error'),
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], JoinQuestionsPage.prototype, "questions", void 0);
    JoinQuestionsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'join-questions',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\join\questions\index.html"*/'\n<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'join_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid || creatingUserProfile || !isTosValid()" (click)="submit()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-join-questions-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list class="sk-join-fields">\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n                <div *ngIf="isTosActive">\n                    <ion-item-divider color="light">{{ \'tos_section\' | translate }}</ion-item-divider>\n                    <ion-item class="sk-tos">\n                        <ion-label>\n                            <button ion-button clear (click)="showTosModal()">{{ \'tos_agree_button\' | translate }}</button>\n                        </ion-label>\n                        <ion-toggle [(ngModel)]="tosValue" [ngModelOptions]="{standalone: true}"></ion-toggle>\n                    </ion-item>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\join\questions\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_7__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */]])
    ], JoinQuestionsPage);
    return JoinQuestionsPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserDisapprovedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_user_login_index__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services

// import pages


var UserDisapprovedPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function UserDisapprovedPage(navParams, auth, api, events, nav) {
        this.navParams = navParams;
        this.auth = auth;
        this.api = api;
        this.events = events;
        this.nav = nav;
        this.status = this.navParams.get('status');
        this.description = this.navParams.get('description');
    }
    /**
     * Is suspended
     */
    UserDisapprovedPage.prototype.isSuspended = function () {
        return this.status == 'suspended';
    };
    /**
     * Logout user
     */
    UserDisapprovedPage.prototype.logout = function () {
        this.auth.logout();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_user_login_index__["a" /* LoginPage */]);
    };
    /**
     * Do refresh
     */
    UserDisapprovedPage.prototype.doRefresh = function (refresher) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.find('users', this.auth.getUserId(), { force: true })];
                    case 1:
                        _a.sent();
                        refresher.complete();
                        this.events.publish('user:status_restore');
                        this.nav.setRoot(!this.auth.isAuthenticated() ? __WEBPACK_IMPORTED_MODULE_5__pages_user_login_index__["a" /* LoginPage */] : __WEBPACK_IMPORTED_MODULE_4__pages_dashboard_index__["a" /* DashboardPage */]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        refresher.complete();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserDisapprovedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'user-disaproved',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\disapproved\index.html"*/'<ion-content class="sk-reg-pending" padding>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <div class="wrap">\n        <img class="sk-success-icon" src="./assets/img/ic_alert.png" alt="" />\n\n        <div class="sk-section" *ngIf="isSuspended()">\n            <h2>{{ \'profile_suspended\' | translate }}</h2>\n            <p>{{ \'reason\' | translate }}: {{description}}</p>\n        </div>\n\n        <div class="sk-section" *ngIf="!isSuspended()">\n            <h2>{{ \'profile_is_pending_approval\' | translate }}</h2>\n        </div>\n    </div>\n</ion-content>\n<ion-footer class="sk-back-footer">\n    <ion-toolbar>\n        <button type="button" ion-button block clear icon-left (click)="logout()">\n            <ion-icon name="ios-arrow-back"></ion-icon>\n            {{ \'disapproved_back_button\' | translate }}\n        </button>\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\disapproved\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */]])
    ], UserDisapprovedPage);
    return UserDisapprovedPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VerifyEmailCheckCodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__checkEmail_index__ = __webpack_require__(314);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// questions


// services



//pages



var VerifyEmailCheckCodePage = /** @class */ (function () {
    /**
     * Constructor
     */
    function VerifyEmailCheckCodePage(navParams, toast, api, navCtrl, auth, alert, config, loadingCtrl, questionControl, translate, questionManager, http) {
        this.navParams = navParams;
        this.toast = toast;
        this.api = api;
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.alert = alert;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.questionControl = questionControl;
        this.translate = translate;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.http = http;
    }
    Object.defineProperty(VerifyEmailCheckCodePage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    VerifyEmailCheckCodePage.prototype.ngOnInit = function () {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT, {
                key: 'code',
                label: this.translate.instant('verify_email_code_input'),
                validators: [
                    { name: 'require' }
                ]
            }, {
                hideWarning: true
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    };
    /**
     * Open check code page
     */
    VerifyEmailCheckCodePage.prototype.openCheckCodePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__checkEmail_index__["a" /* VerifyEmailCheckEmailPage */]);
    };
    /**
     * Open login page
     */
    VerifyEmailCheckCodePage.prototype.openLoginPage = function () {
        this.auth.logout();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_11__login_index__["a" /* LoginPage */]);
    };
    /**
     * Submit form
     */
    VerifyEmailCheckCodePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, toast, alert_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/validators/verify-email-code/', JSON.stringify({ code: this.form.value['code'] }))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        loader.dismiss();
                        if (data.valid) {
                            toast = this.toast.create({
                                message: this.translate.instant('verify_email_verification_successful'),
                                closeButtonText: this.translate.instant('ok'),
                                showCloseButton: true,
                                duration: this.toastDuration
                            });
                            toast.present();
                            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_12__dashboard_index__["a" /* DashboardPage */]);
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: this.translate.instant('verify_email_invalid_code'),
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], VerifyEmailCheckCodePage.prototype, "questions", void 0);
    VerifyEmailCheckCodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'verify-email-check-code',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\verifyEmail\checkCode\index.html"*/'<ion-header>\n</ion-header>\n<ion-content class="sk-regSuccess" padding>\n    <div class="wrap">\n        <img class="sk-success-icon" src="./assets/img/ic_check.png" alt="">\n        <div class="sk-section">\n            <h2>{{ \'verify_email_registration_successful\' | translate }}</h2>\n            <p>{{ \'verify_email_check_code_page_desc\' | translate }}</p>\n        </div>\n        <ion-list class="sk-inputs">\n            <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n        </ion-list>\n        <div class="sk-buttons">\n            <button ion-button block round class="sk-login" [disabled]="!form.valid" (click)="submit()">\n                {{ \'verify_email_done_button\' | translate }}\n            </button>\n            <h4 (click)="openCheckCodePage()">{{ \'verify_email_open_check_email_page\' | translate }}</h4>\n        </div>\n    </div>\n</ion-content>\n<ion-footer class="sk-back-footer">\n    <ion-toolbar>\n        <button type="button" ion-button block clear icon-left (click)="openLoginPage()">\n            <ion-icon name="ios-arrow-back"></ion-icon>\n            {{ \'verify_email_back_button\' | translate }}\n        </button>\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\verifyEmail\checkCode\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(11, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_10__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */]])
    ], VerifyEmailCheckCodePage);
    return VerifyEmailCheckCodePage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VerifyEmailCheckEmailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// questions


// pages

// services



var VerifyEmailCheckEmailPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function VerifyEmailCheckEmailPage(navCtrl, viewCtrl, alert, toast, config, api, auth, loadingCtrl, questionControl, questionManager, translate, http) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.alert = alert;
        this.toast = toast;
        this.config = config;
        this.api = api;
        this.auth = auth;
        this.loadingCtrl = loadingCtrl;
        this.questionControl = questionControl;
        this.questionManager = questionManager;
        this.translate = translate;
        this.questions = []; // list of questions
        this.http = http;
    }
    Object.defineProperty(VerifyEmailCheckEmailPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    VerifyEmailCheckEmailPage.prototype.ngOnInit = function () {
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */].TYPE_EMAIL, {
                key: 'email',
                value: this.auth.getUser().email,
                label: this.translate.instant('verify_email_email_input'),
                validators: [
                    { name: 'require' },
                    { name: 'userEmail' }
                ]
            }, {
                hideWarning: true
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    };
    /**
     * Open login page
     */
    VerifyEmailCheckEmailPage.prototype.openLoginPage = function () {
        this.auth.logout();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__login_index__["a" /* LoginPage */]);
    };
    /**
     * Resend mail
     */
    VerifyEmailCheckEmailPage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, currentEmail, newEmail, success, message, data, toast, alert_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        currentEmail = this.auth.getUser().email;
                        newEmail = this.form.value['email'];
                        success = true;
                        message = "";
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        if (!(currentEmail !== newEmail)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateUserEmail()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.sendVerificationCode()];
                    case 5:
                        data = _a.sent();
                        success = data.success;
                        message = data.message;
                        _a.label = 6;
                    case 6:
                        loader.dismiss();
                        if (success) {
                            toast = this.toast.create({
                                message: this.translate.instant('verify_email_mail_sent', {
                                    email: this.form.value['email']
                                }),
                                closeButtonText: this.translate.instant('ok'),
                                showCloseButton: true,
                                duration: this.toastDuration
                            });
                            toast.present();
                            this.navCtrl.pop();
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            title: this.translate.instant('error_occurred'),
                            subTitle: message,
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update user email if it's changed
     */
    VerifyEmailCheckEmailPage.prototype.updateUserEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userData, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.update('users', this.auth.getUserId(), {
                                email: this.form.value['email']
                            })];
                    case 1:
                        userData = _a.sent();
                        this.auth.setAuthenticated(userData.token);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send verification code
     */
    VerifyEmailCheckEmailPage.prototype.sendVerificationCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/verify-email/', JSON.stringify({ email: this.form.value['email'] }))
                            .map(function (res) { return res.json(); })
                            .toPromise()];
                    case 1: 
                    // try to send verification email
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], VerifyEmailCheckEmailPage.prototype, "questions", void 0);
    VerifyEmailCheckEmailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'verify-email-check-email',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\verifyEmail\checkEmail\index.html"*/'<ion-header>\n</ion-header>\n<ion-content class="sk-regSuccess" padding>\n  <div class="wrap">\n    <img class="sk-success-icon" src="./assets/img/ic_check.png" alt="">\n    <div class="sk-section">\n      <h2>{{ \'verify_email_registration_successful\' | translate }}</h2>\n      <p>{{ \'verify_email_check_email_page_desc\' | translate }}</p>\n    </div>\n    <ion-list class="sk-inputs">\n      <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n    </ion-list>\n    <div class="sk-buttons">\n      <button ion-button block outline round class="sk-login" [disabled]="!form.valid" (click)="submit()">\n        {{ \'verify_email_resend_button\' | translate }}\n      </button>\n    </div>\n  </div>\n</ion-content>\n<ion-footer class="sk-back-footer">\n  <ion-toolbar>\n    <button type="button" ion-button block clear icon-left (click)="openLoginPage()">\n      <ion-icon name="ios-arrow-back"></ion-icon>\n      {{ \'verify_email_back_button\' | translate }}\n    </button>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\verifyEmail\checkEmail\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(11, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_11__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */]])
    ], VerifyEmailCheckEmailPage);
    return VerifyEmailCheckEmailPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompleteProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_api_utils__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







// questions


// pages

// import services




var CompleteProfilePage = /** @class */ (function () {
    /**
     * Constructor
     */
    function CompleteProfilePage(auth, nav, loadingCtrl, config, api, apiUtils, toast, translate, questionControl, questionManager, http) {
        this.auth = auth;
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
        this.api = api;
        this.apiUtils = apiUtils;
        this.toast = toast;
        this.translate = translate;
        this.questionControl = questionControl;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.updatingUserProfile = false;
        this.http = http;
    }
    Object.defineProperty(CompleteProfilePage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    CompleteProfilePage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/complete-profile-questions/')
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        response = _a.sent();
                        // process questions sections
                        response.forEach(function (questionData) {
                            var data = {
                                section: '',
                                questions: []
                            };
                            data.section = questionData.section;
                            // process questions
                            questionData.items.forEach(function (question) {
                                // create a question
                                var questionItem = _this.questionManager.getQuestion(question.type, {
                                    key: question.key,
                                    label: question.label,
                                    values: question.values,
                                    value: question.value
                                }, question.params);
                                questionItem.validators = [];
                                // add validators
                                if (question.validators) {
                                    questionItem.validators = question.validators;
                                }
                                data.questions.push(questionItem);
                                _this.questions.push(questionItem);
                            });
                            _this.sections.push(data);
                        });
                        // register all questions inside a form group
                        this.form = this.questionControl.toFormGroup(this.questions);
                        this.formReady = true;
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submit form
     */
    CompleteProfilePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, questions_1, updatedQuestions, toast, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        questions_1 = [];
                        this.questions.forEach(function (questionData) {
                            questions_1.push({
                                name: questionData.key,
                                value: _this.form.value[questionData.key],
                                type: questionData.controlType
                            });
                        });
                        this.updatingUserProfile = true;
                        return [4 /*yield*/, this.api.updateAll('questionsData', questions_1, {}, {
                                suffix: 'me',
                                params: {
                                    mode: 'completeRequiredQuestions'
                                }
                            })];
                    case 3:
                        updatedQuestions = _a.sent();
                        // refresh auth token if exist
                        updatedQuestions.forEach(function (question) {
                            if (question.params && question.params.token) {
                                _this.auth.setAuthenticated(question.params.token);
                            }
                        });
                        // clear user cached data
                        this.apiUtils.clearUserData(this.auth.getUserId(), true);
                        // refresh current user's data
                        return [4 /*yield*/, this.api.find('users', this.auth.getUserId(), {
                                params: {
                                    with: ['avatar', 'permissions', 'photos', 'memberships']
                                }
                            })];
                    case 4:
                        // refresh current user's data
                        _a.sent();
                        loader.dismiss();
                        // load dashboard
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__dashboard_index__["a" /* DashboardPage */]);
                        toast = this.toast.create({
                            message: this.translate.instant('profile_updated'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        loader.dismiss();
                        this.updatingUserProfile = false;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CompleteProfilePage.prototype, "questions", void 0);
    CompleteProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'complete-profile',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\completeProfile\index.html"*/'\n<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'complete_profile_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid || updatingUserProfile" (click)="submit()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-complete-profile-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list>\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\completeProfile\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */],
                __WEBPACK_IMPORTED_MODULE_12__services_api_utils__["a" /* ApiUtilsService */]
            ]
        }),
        __param(10, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_11__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_12__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_11__services_http_index__["a" /* SecureHttpService */]])
    ], CompleteProfilePage);
    return CompleteProfilePage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompleteAccountTypePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dashboard_index__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// services


// questions


// pages

var CompleteAccountTypePage = /** @class */ (function () {
    /**
     * Constructor
     */
    function CompleteAccountTypePage(loadingCtrl, auth, api, apiUtils, nav, toast, translate, questionControl, questionManager) {
        this.loadingCtrl = loadingCtrl;
        this.auth = auth;
        this.api = api;
        this.apiUtils = apiUtils;
        this.nav = nav;
        this.toast = toast;
        this.translate = translate;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.updatingUserProfile = false;
        this.questionControl = questionControl;
        this.questionManager = questionManager;
    }
    Object.defineProperty(CompleteAccountTypePage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    CompleteAccountTypePage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, genders, genderList_1, questions, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.findAll('userGenders')];
                    case 3:
                        genders = _a.sent();
                        genderList_1 = [];
                        genders.forEach(function (gender) {
                            genderList_1.push({
                                value: gender.id,
                                title: gender.name
                            });
                        });
                        questions = [
                            {
                                section: '',
                                questions: [
                                    {
                                        type: __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */].TYPE_SELECT,
                                        key: 'accountType',
                                        label: this.translate.instant('gender_input'),
                                        values: genderList_1,
                                        validators: [
                                            { name: 'require' }
                                        ]
                                    }
                                ]
                            }
                        ];
                        // process questions
                        questions.forEach(function (questionData) {
                            var data = {
                                section: '',
                                questions: []
                            };
                            data.section = questionData.section;
                            questionData.questions.forEach(function (question) {
                                var questionItem = _this.questionManager.getQuestion(question.type, {
                                    key: question.key,
                                    label: question.label,
                                    values: question.values
                                });
                                // add validators
                                if (question.validators) {
                                    questionItem.validators = question.validators;
                                }
                                data.questions.push(questionItem);
                                _this.questions.push(questionItem);
                            });
                            _this.sections.push(data);
                            // register all questions inside a form group
                            _this.form = _this.questionControl.toFormGroup(_this.questions);
                            _this.formReady = true;
                            loader.dismiss();
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submit form
     */
    CompleteAccountTypePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        this.updatingUserProfile = true;
                        // update questions
                        return [4 /*yield*/, this.api.update('users', this.auth.getUserId(), {
                                accountType: this.form.value['accountType']
                            }, {
                                params: {
                                    mode: 'completeAccountType'
                                }
                            })];
                    case 3:
                        // update questions
                        _a.sent();
                        // clear user cached data
                        this.apiUtils.clearUserData(this.auth.getUserId(), true);
                        // refresh current user's data
                        return [4 /*yield*/, this.api.find('users', this.auth.getUserId(), {
                                params: {
                                    with: ['avatar', 'permissions', 'photos', 'memberships']
                                }
                            })];
                    case 4:
                        // refresh current user's data
                        _a.sent();
                        loader.dismiss();
                        // load dashboard
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__dashboard_index__["a" /* DashboardPage */]);
                        toast = this.toast.create({
                            message: this.translate.instant('profile_updated'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        loader.dismiss();
                        this.updatingUserProfile = false;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CompleteAccountTypePage.prototype, "questions", void 0);
    CompleteAccountTypePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'complete-account-type',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\completeAccountType\index.html"*/'\n<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'complete_account_type_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid || updatingUserProfile" (click)="submit()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-complete-account-type-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list>\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\completeAccountType\index.html"*/,
            providers: [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */]; }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */]; }),
                __WEBPACK_IMPORTED_MODULE_5__services_api_utils__["a" /* ApiUtilsService */]
            ]
        }),
        __param(7, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */]; }))),
        __param(8, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_5__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_manager__["a" /* QuestionManager */]])
    ], CompleteAccountTypePage);
    return CompleteAccountTypePage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 317:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppConnectionErrorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_appMaintenance_index__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// import pages



// import services


var AppConnectionErrorPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppConnectionErrorPage(auth, nav, api, application, translate) {
        this.auth = auth;
        this.nav = nav;
        this.api = api;
        this.translate = translate;
        this.pageHeader = 'No server connection';
        this.application = application;
        // do we have translations?
        if (this.translate.getDefaultLang()) {
            this.pageHeader = this.translate.instant('app_conection_error_page_header');
        }
    }
    /**
     * Do refresh
     */
    AppConnectionErrorPage.prototype.doRefresh = function (refresher) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // refresh application dependencies
                        return [4 /*yield*/, this.application.loadDependencies(false)];
                    case 1:
                        // refresh application dependencies
                        _a.sent();
                        refresher.complete();
                        // redirect to the page
                        if (this.api.get('configs', 'maintenanceMode').value) {
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_appMaintenance_index__["a" /* AppMaintenancePage */]);
                            return [2 /*return*/];
                        }
                        this.nav.setRoot(!this.auth.isAuthenticated() ? __WEBPACK_IMPORTED_MODULE_4__pages_user_login_index__["a" /* LoginPage */] : __WEBPACK_IMPORTED_MODULE_6__pages_dashboard_index__["a" /* DashboardPage */]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        refresher.complete();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AppConnectionErrorPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-connection-error',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\appConnectionError\index.html"*/'<ion-content class="sk-app-conection-error-page">\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n\n    <div class="wrap">\n        <p class="sk-text">{{pageHeader}}</p>\n        <div class="sk-zero-lash">\n            <div class="sk-zero-eye">\n                <div class="sk-zero-iris">\n                    <div class="sk-zero-pupil">\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\appConnectionError\index.html"*/,
            providers: []
        }),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_7__services_application_index__["a" /* ApplicationService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_7__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */]])
    ], AppConnectionErrorPage);
    return AppConnectionErrorPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppErrorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// pages


// services

var AppErrorPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppErrorPage(auth, nav) {
        this.auth = auth;
        this.nav = nav;
    }
    /**
     * Refresh
     */
    AppErrorPage.prototype.refresh = function () {
        this.nav.setRoot(!this.auth.isAuthenticated() ? __WEBPACK_IMPORTED_MODULE_3__user_login_index__["a" /* LoginPage */] : __WEBPACK_IMPORTED_MODULE_2__dashboard_index__["a" /* DashboardPage */]);
    };
    AppErrorPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-error',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\appError\index.html"*/'<ion-content class="sk-app-error-page" padding>\n    <div class="wrap">\n        <img class="sk-error-icon" src="./assets/img/ic_robo.png" alt="">\n        <div class="sk-section">\n            <h2>{{ \'app_error_page_header\' | translate }}</h2>\n            <p>{{ \'app_error_page_description\' | translate }}</p>\n        </div>\n        <div class="sk-buttons">\n            <button ion-button outline round (click)="refresh()">{{ \'ok\' | translate }}</button>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\appError\index.html"*/,
            providers: []
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */]])
    ], AppErrorPage);
    return AppErrorPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdMobService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_admob__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_permissions_index__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var AdMobService = /** @class */ (function () {
    /**
     * Constructor
     */
    function AdMobService(api, app, adMob, events, permissions) {
        var _this = this;
        this.api = api;
        this.app = app;
        this.adMob = adMob;
        this.events = events;
        this.permissions = permissions;
        this.bannerCreated = false;
        this.eventSubscribed = false;
        this.isBannerVisible = false;
        this.lastViewName = '';
        this.configsUpdatedHandler = function () {
            if (_this.config.enabled) {
                _this.checkView(_this.lastViewName);
            }
            else {
                _this.hideBanner();
            }
        };
        this.permissionsUpdatedHandler = function () {
            if (_this.permissions.isActionAllowed('ads_hide_ads')) {
                _this.hideBanner();
            }
            else {
                _this.checkView(_this.lastViewName);
            }
        };
    }
    /**
     * Init
     */
    AdMobService.prototype.init = function () {
        var _this = this;
        if (this.bannerCreated) {
            this.hideBanner();
            this.adMob.removeBanner();
        }
        var nav = this.app.getRootNav();
        this.bannerCreated = false;
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        if (!this.eventSubscribed) {
            nav.viewDidEnter.subscribe(function (view) {
                _this.checkView(view.instance.constructor.name);
            });
            this.eventSubscribed = true;
        }
    };
    /**
     * Check view
     */
    AdMobService.prototype.checkView = function (viewName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lastViewName = viewName;
                        if (!(this.config.enabled && this.config.adId)) return [3 /*break*/, 3];
                        if (!!this.bannerCreated) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createBanner()];
                    case 1:
                        _a.sent();
                        this.bannerCreated = true;
                        this.checkView(viewName);
                        return [2 /*return*/];
                    case 2:
                        if (this.config.availableViews.includes(viewName)) {
                            this.showBanner();
                            return [2 /*return*/];
                        }
                        this.hideBanner();
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create banner
     */
    AdMobService.prototype.createBanner = function () {
        var options = {
            adId: this.config.adId,
            overlap: false,
            position: this.adMob.AD_POSITION.BOTTOM_CENTER,
            adSize: 'SMART_BANNER',
            autoShow: false
        };
        return this.adMob.createBanner(options);
    };
    /**
     * Show banner
     */
    AdMobService.prototype.showBanner = function () {
        if (!this.isBannerVisible) {
            this.adMob.showBanner(this.adMob.AD_POSITION.BOTTOM_CENTER);
            this.isBannerVisible = true;
        }
    };
    /**
     * Hide banner
     */
    AdMobService.prototype.hideBanner = function () {
        if (this.isBannerVisible) {
            this.adMob.hideBanner();
            this.isBannerVisible = false;
        }
    };
    Object.defineProperty(AdMobService.prototype, "config", {
        /**
         * Config
         */
        get: function () {
            return this.api.get('configs', 'adMobConfig').value;
        },
        enumerable: true,
        configurable: true
    });
    AdMobService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_admob__["a" /* AdMob */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_4__services_permissions_index__["a" /* PermissionsService */]])
    ], AdMobService);
    return AdMobService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionControlService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__validators_index__ = __webpack_require__(159);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// import validators

var QuestionControlService = /** @class */ (function () {
    function QuestionControlService(validators) {
        this.validators = validators;
    }
    /**
     * Assign questions to a group
     */
    QuestionControlService.prototype.toFormGroup = function (questions, groupValidator) {
        var _this = this;
        var group = {};
        // process questions
        questions.forEach(function (question) {
            var validators = [];
            var asyncValidators = [];
            var hardCodedValidators = [];
            switch (question.getType()) {
                case __WEBPACK_IMPORTED_MODULE_2__manager__["a" /* QuestionManager */].TYPE_URL:
                    hardCodedValidators.push({ name: 'url' });
                    break;
                case __WEBPACK_IMPORTED_MODULE_2__manager__["a" /* QuestionManager */].TYPE_EMAIL:
                    hardCodedValidators.push({ name: 'email' });
                    break;
            }
            // add hardcoded validators
            if (hardCodedValidators.length) {
                var allValidators = question.validators
                    ? question.validators.concat(hardCodedValidators)
                    : hardCodedValidators;
                question.setValidators(allValidators);
            }
            // add validators
            if (question.validators) {
                question.validators.forEach(function (validatorData) {
                    if (!_this.validators.isValidatorExists(validatorData.name)) {
                        throw new TypeError("Unsupported validator " + validatorData.name);
                    }
                    var validator = _this.validators.getValidator(validatorData.name);
                    // add params inside validator
                    if (validatorData.params) {
                        validator.addParams(validatorData.params);
                    }
                    _this.validators.isAsyncValidator(validatorData.name)
                        ? asyncValidators.push(validator.validate())
                        : validators.push(validator.validate());
                });
            }
            var control = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormControl */]((question.value != null ? question.value : ''), validators, asyncValidators);
            question.setControl(control);
            group[question.key] = control;
        });
        return new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormGroup */](group, groupValidator);
    };
    QuestionControlService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__validators_index__["a" /* Validators */]])
    ], QuestionControlService);
    return QuestionControlService;
}());

//# sourceMappingURL=control-service.js.map

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePhotosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_edit_basePhotoEdit__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__inapps_index__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// services

// pages

var ProfilePhotosPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function ProfilePhotosPage(ref, events, photoViewer, permissions, api, loadingCtrl, navParams) {
        var _this = this;
        this.ref = ref;
        this.events = events;
        this.photoViewer = photoViewer;
        this.permissions = permissions;
        this.api = api;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.infiniteScroll = null;
        this.inappsPage = __WEBPACK_IMPORTED_MODULE_6__inapps_index__["a" /* InappsPage */];
        this.freeSlots = 0;
        this.pageReady = false;
        this.infiniteScrollNeedComplete = false;
        this.apiPhotos = [];
        this.photos = [];
        this.trackedPhotos = [];
        this.userId = this.navParams.get('userId');
        this.photosLimit = this.api.get('configs', 'photosLimit').value;
        // -- init callbacks --//
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            // user has not been loaded
            if (_this.isViewPhotoAllowed && !_this.user) {
                _this.loadUserData();
                _this.ref.markForCheck();
                return;
            }
            _this.ref.markForCheck();
        };
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    Object.defineProperty(ProfilePhotosPage.prototype, "photosPerRow", {
        /**
         * Get photos per row
         */
        get: function () {
            return this.api.get('configs', 'photosPerRow').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePhotosPage.prototype, "minPhotos", {
        /**
         * Get min photos
         */
        get: function () {
            return this.api.get('configs', 'minPhotos').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePhotosPage.prototype, "bigDefaultAvatar", {
        /**
         * Get big default avatar
         */
        get: function () {
            return this.api.get('configs', 'bigDefaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePhotosPage.prototype, "defaultAvatar", {
        /**
         * Get default avatar
         */
        get: function () {
            return this.api.get('configs', 'defaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfilePhotosPage.prototype, "isViewPhotoAllowed", {
        /**
         * Is view photo allowed
         */
        get: function () {
            return this.permissions.isActionAllowed('photo_view');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * View rendered
     */
    ProfilePhotosPage.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;
            setTimeout(function () {
                _this.infiniteScroll.complete();
            });
        }
    };
    /**
     * Component init
     */
    ProfilePhotosPage.prototype.ngOnInit = function () {
        this.loadUserData();
    };
    /**
     * Page will enter
     */
    ProfilePhotosPage.prototype.ionViewWillEnter = function () {
        // load user data
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
    };
    /**
     * Page will leave
     */
    ProfilePhotosPage.prototype.ionViewWillLeave = function () {
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
    };
    /**
     * View photo
     */
    ProfilePhotosPage.prototype.viewPhoto = function (row, col) {
        var photo = this.photos[row][col];
        switch (photo.type) {
            default:
                // track action
                if (photo.type == 'photo' && !this.trackedPhotos.includes(photo.id)) {
                    this.permissions.trackAction('photo', 'view');
                    this.trackedPhotos.push(photo.id);
                }
                // show photo
                this.photoViewer.show(photo.bigUrl);
        }
    };
    /**
     * Load more photos
     */
    ProfilePhotosPage.prototype.loadMorePhotos = function () {
        if (this.getPhotoCount() + 1 > this.photosLimit) {
            this.photosLimit += this.photosPerRow;
            this.loadPhotoList(this.photosLimit);
            this.infiniteScrollNeedComplete = true;
            this.ref.markForCheck();
            return;
        }
        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
        this.ref.markForCheck();
    };
    /**
     * Load photo list
     */
    ProfilePhotosPage.prototype.loadPhotoList = function (limit) {
        this.photos = []; // clear current photo list
        var photos = [];
        this.freeSlots = 0;
        // add avatar to the photo list
        photos.push(new __WEBPACK_IMPORTED_MODULE_4__user_edit_basePhotoEdit__["b" /* PhotoUnit */](null, this.user.avatar.url ? this.user.avatar.url : this.defaultAvatar, this.user.avatar.bigUrl ? this.user.avatar.bigUrl : this.bigDefaultAvatar, 'avatar', true));
        // get user photos
        var apiPhotos = this.apiPhotos.slice(0, limit - 1); // exclude avatar
        // check count of photos
        var visiblePhotos = this.getPhotoCount() + 1 >= this.minPhotos // include avatar
            ? limit
            : this.minPhotos;
        // process photos
        for (var i = 1; i < visiblePhotos; i++) {
            var photoDetails = apiPhotos && apiPhotos[i - 1] ? apiPhotos[i - 1] : null;
            photos.push(new __WEBPACK_IMPORTED_MODULE_4__user_edit_basePhotoEdit__["b" /* PhotoUnit */](photoDetails ? photoDetails.id : null, photoDetails ? photoDetails.url : null, photoDetails ? photoDetails.bigUrl : null, 'photo', photoDetails ? photoDetails.approved : true));
            if (!photoDetails) {
                this.freeSlots++;
            }
        }
        // chunk photos
        for (var i = 0; i < photos.length; i += this.photosPerRow) {
            this.photos.push(photos.slice(i, i + this.photosPerRow));
        }
        this.ref.markForCheck();
    };
    /**
     * Get photo count
     */
    ProfilePhotosPage.prototype.getPhotoCount = function () {
        return this.apiPhotos.length;
    };
    /**
     * Load user data
     */
    ProfilePhotosPage.prototype.loadUserData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        this.pageReady = false;
                        this.ref.markForCheck();
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        if (!this.isViewPhotoAllowed) return [3 /*break*/, 4];
                        // load all pages dependencies
                        _a = this;
                        return [4 /*yield*/, this.api.getMapper('users').find(this.userId, {
                                params: {
                                    with: ['avatar', 'photos']
                                }
                            })];
                    case 3:
                        // load all pages dependencies
                        _a.user = _b.sent();
                        this.user.photos.forEach(function (photo) {
                            if (photo.approved) {
                                _this.apiPhotos.push(photo);
                            }
                        });
                        // load photos
                        this.loadPhotoList(this.photosLimit);
                        this.pageReady = true;
                        _b.label = 4;
                    case 4:
                        this.ref.markForCheck();
                        loader.dismiss();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        loader.dismiss();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */])
    ], ProfilePhotosPage.prototype, "infiniteScroll", void 0);
    ProfilePhotosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'profile-photos',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\profile\photos\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'view_all_photos_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-user-edit-base sk-profile-photos-page">\n\n    <!-- photo view is not allowed   -->\n    <div class="sk-permission-denied" *ngIf="!isViewPhotoAllowed">\n        <img src="./assets/img/no_permission.svg" alt="">\n        <h2>{{ \'permission_denied_header\' | translate }}</h2>\n        <span>{{ \'permission_denied_alert_message\' | translate }}</span>\n        <button ion-button outline round [navPush]="inappsPage">{{ \'upgrade\' | translate }}</button>\n    </div>\n\n    <div *ngIf="isViewPhotoAllowed && pageReady">\n        <ion-grid>\n            <ion-row *ngFor="let photoSections of photos; let row = index">\n                <ion-col *ngFor="let photoData of photoSections; let col = index" class="sk-photo-grid-item" (tap)="viewPhoto(row, col)" [style.background-image]="photoData.url ? \'url(\' + photoData.url + \')\' : \'none\'">\n                    <div *ngIf="photoData.type == \'avatar\'" class="sk-avatar-mask"></div>\n                </ion-col>\n            </ion-row>\n        </ion-grid>\n\n        <ion-infinite-scroll (ionInfinite)="loadMorePhotos()">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\profile\photos\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_photo_viewer__["a" /* PhotoViewer */],
            __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */]])
    ], ProfilePhotosPage);
    return ProfilePhotosPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 324:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlagComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// questions


// services


var FlagComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function FlagComponent(config, http, viewCtrl, navParams, translate, questionControl, questionManager) {
        this.config = config;
        this.http = http;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.translate = translate;
        this.questionControl = questionControl;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.identityId = this.navParams.get('identityId');
        this.entityType = this.navParams.get('entityType');
    }
    /**
     * Component init
     */
    FlagComponent.prototype.ngOnInit = function () {
        var _this = this;
        // questions list
        var questions = [
            {
                section: '',
                questions: [
                    {
                        type: __WEBPACK_IMPORTED_MODULE_3__services_questions_manager__["a" /* QuestionManager */].TYPE_SELECT,
                        key: 'reason',
                        label: this.translate.instant('flag_input'),
                        values: [{
                                value: 'spam',
                                title: this.translate.instant('flag_as_spam')
                            },
                            {
                                value: 'offence',
                                title: this.translate.instant('flag_as_offence')
                            },
                            {
                                value: 'illegal',
                                title: this.translate.instant('flag_as_illegal')
                            }],
                        validators: [
                            { name: 'require' }
                        ]
                    }
                ]
            }
        ];
        // process questions
        questions.forEach(function (questionData) {
            var data = {
                section: '',
                questions: []
            };
            data.section = questionData.section;
            questionData.questions.forEach(function (question) {
                var questionItem = _this.questionManager.getQuestion(question.type, {
                    key: question.key,
                    label: question.label,
                    values: question.values
                });
                // add validators
                if (question.validators) {
                    questionItem.validators = question.validators;
                }
                data.questions.push(questionItem);
                _this.questions.push(questionItem);
            });
            _this.sections.push(data);
            // register all questions inside a form group
            _this.form = _this.questionControl.toFormGroup(_this.questions);
            _this.formReady = true;
        });
    };
    /**
     * Return back
     */
    FlagComponent.prototype.returnBack = function () {
        this.viewCtrl.dismiss({
            reported: false
        });
    };
    /**
     * Submit form
     */
    FlagComponent.prototype.submit = function () {
        try {
            var flagData = Object.assign({}, this.form.value, {
                identityId: this.identityId,
                entityType: this.entityType
            });
            this.http.post(this.config.getApiUrl() + '/flags/', JSON.stringify(flagData))
                .toPromise();
            this.viewCtrl.dismiss({
                reported: true
            });
        }
        catch (e) {
            this.viewCtrl.dismiss({
                reported: false
            });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], FlagComponent.prototype, "questions", void 0);
    FlagComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'flag',template:/*ion-inline-start:"G:\attheclubb\application\src\shared\components\flag\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-buttons start>\n            <button ion-button clear (click)="returnBack()">{{ \'cancel\' | translate }}</button>\n        </ion-buttons>\n\n        <ion-title>{{ \'flag_page_header\' | translate }}</ion-title>\n\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid" (click)="submit()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-complete-account-type-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list>\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\shared\components\flag\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_3__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_5__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_3__services_questions_manager__["a" /* QuestionManager */]])
    ], FlagComponent);
    return FlagComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchedUserPageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// services

var MatchedUserPageComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function MatchedUserPageComponent(auth, api, viewCtrl, navParams) {
        this.auth = auth;
        this.api = api;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.matchedUser = this.navParams.get('user');
    }
    /**
     * Component init
     */
    MatchedUserPageComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // mark matched user
                        return [4 /*yield*/, this.api.update('matchedUsers', this.matchedUser.id, {
                                isRead: true
                            })];
                    case 1:
                        // mark matched user
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.viewCtrl.dismiss();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MatchedUserPageComponent.prototype, "currentUser", {
        /**
         * Current user
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId()); // get logged user data
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Close
     */
    MatchedUserPageComponent.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    /**
     * Show chat
     */
    MatchedUserPageComponent.prototype.showChat = function () {
        this.viewCtrl.dismiss({
            showChat: true
        });
    };
    MatchedUserPageComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'matched-user',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\matchedUser\index.html"*/'<ion-content class="sk-match-modal">\n    <div class="sk-match-modal-wrap">\n        <div class="sk-match-modal-top">\n            <div class="sk-match-modal-text">\n                <h2>{{ \'matched_user_page_header\' | translate }}</h2>\n                <span>{{ \'matched_user_desc\' | translate:{userName: matchedUser.displayName} }}</span>\n            </div>\n            <div class="sk-match-modal-users">\n                <div class="sk-match-modal-avatar">\n                    <user-avatar [url]="currentUser?.avatar?.pendingUrl"></user-avatar>\n                    <div *ngIf="currentUser?.avatar?.id && !currentUser?.avatar?.active" class="sk-photo-pending">\n                        <img src="./assets/img/ic_pending.svg" alt="">\n                    </div>\n                </div>\n                <div class="sk-match-modal-avatar">\n                    <user-avatar [url]="matchedUser?.avatar?.url" [isAvatarActive]="matchedUser?.avatar?.active"></user-avatar>\n                </div>\n            </div>\n        </div>\n        <div class="sk-match-modal-bottom">\n            <button ion-button outline round (click)="showChat()">\n                <img src="./assets/img/ic_send_message.svg" alt="">{{ \'send_message\' | translate }}\n            </button>\n            <button ion-button outline round (click)="close()">\n                <img src="./assets/img/ic_keep_play.svg" alt="">{{ \'keep_playing\' | translate }}\n            </button>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\matchedUser\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */]])
    ], MatchedUserPageComponent);
    return MatchedUserPageComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_facebook__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_serverEvents_index__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__appUrl_index__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__forgotPassword_checkEmail_index__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__join_initial_index__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_questions_control_service__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// services





// pages




// questions


var LoginPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function LoginPage(serverEvents, config, fb, http, auth, loadingCtrl, nav, questionControl, translate, alert, questionManager) {
        this.serverEvents = serverEvents;
        this.config = config;
        this.fb = fb;
        this.auth = auth;
        this.loadingCtrl = loadingCtrl;
        this.nav = nav;
        this.questionControl = questionControl;
        this.translate = translate;
        this.alert = alert;
        this.questionManager = questionManager;
        this.questions = []; // list of questions
        this.appUrlPage = __WEBPACK_IMPORTED_MODULE_10__appUrl_index__["a" /* AppUrlPage */];
        this.joinPage = __WEBPACK_IMPORTED_MODULE_13__join_initial_index__["a" /* JoinInitialPage */];
        this.forgotPasswordPage = __WEBPACK_IMPORTED_MODULE_12__forgotPassword_checkEmail_index__["a" /* ForgotPasswordCheckEmailPage */];
        this.loginInProcessing = false;
        this.isGenericSiteUrl = false;
        this.showFacebookLoginButton = false;
        this.http = http;
        if (this.config.getGenericApiUrl()) {
            this.isGenericSiteUrl = true;
        }
        if (this.config.getConfig('facebookAppId')) {
            this.showFacebookLoginButton = true;
        }
    }
    /**
     * Component init
     */
    LoginPage.prototype.ngOnInit = function () {
        this.serverEvents.restart();
        // create form items
        this.questions = [
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_14__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT, {
                key: 'login',
                label: this.translate.instant('login_input'),
                validators: [
                    { name: 'require' }
                ]
            }, {
                questionClass: 'sk-name',
                hideErrors: true,
                hideWarning: true
            }),
            this.questionManager.getQuestion(__WEBPACK_IMPORTED_MODULE_14__services_questions_manager__["a" /* QuestionManager */].TYPE_PASSWORD, {
                key: 'password',
                label: this.translate.instant('password_input'),
                validators: [
                    { name: 'require' }
                ]
            }, {
                questionClass: 'sk-password',
                hideErrors: true,
                hideWarning: true
            })
        ];
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
    };
    /**
     * Login
     */
    LoginPage.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.loginInProcessing = true;
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/login/', JSON.stringify({
                                username: this.form.value.login,
                                password: this.form.value.password
                            }))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 1:
                        data = _a.sent();
                        this.loginInProcessing = false;
                        if (data.success == true) {
                            this.auth.setAuthenticated(data.token);
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__dashboard_index__["a" /* DashboardPage */]);
                            return [2 /*return*/];
                        }
                        this.loginFailed();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.loginInProcessing = false;
                        this.loginFailed();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Login failed
     */
    LoginPage.prototype.loginFailed = function () {
        var alert = this.alert.create({
            title: this.translate.instant('error_occurred'),
            subTitle: this.translate.instant('login_failed'),
            buttons: [this.translate.instant('ok')]
        });
        alert.present();
    };
    LoginPage.prototype.facebookLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permissions, loader, facebookResponse, result, alert_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        permissions = ['public_profile', 'email'];
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.fb.login(permissions)];
                    case 3:
                        facebookResponse = _a.sent();
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + '/facebook-connect/', JSON.stringify(facebookResponse))
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 4:
                        result = _a.sent();
                        loader.dismiss();
                        if (result.success == true) {
                            this.auth.setAuthenticated(result.token);
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__dashboard_index__["a" /* DashboardPage */]);
                            return [2 /*return*/];
                        }
                        alert_1 = this.alert.create({
                            message: result.error,
                            buttons: [this.translate.instant('ok')]
                        });
                        alert_1.present();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], LoginPage.prototype, "questions", void 0);
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'login',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\login\index.html"*/'<ion-content class="sk-login-page {{ isGenericSiteUrl ? \'sk-login-url\' : \'\'}} " padding>\n    <div class="wrap">\n        <img src="./assets/img/logo.svg" alt="" class="sk-logo">\n        <form [formGroup]="form">\n            <ion-list class="sk-inputs">\n                <question *ngFor="let question of questions" [question]="question" [form]="form"></question>\n                <button type="button" ion-button color="light" clear [navPush]="forgotPasswordPage" class="sk-fpass">{{ \'forgot_password\' | translate }}</button>\n            </ion-list>\n            <div class="sk-buttons">\n                <button type="submit" ion-button block round [disabled]="!form.valid || loginInProcessing" class="sk-login" (click)="login()">{{ \'login\' | translate }}</button>\n                <div class="sk-line"></div>\n                <button type="button" ion-button block round outline [navPush]="joinPage" class="sk-signup">{{ \'sign_up\' | translate }}</button>\n                <button *ngIf="showFacebookLoginButton" ion-button block round outline class="sk-fbconnect" (click)="facebookLogin()">{{ \'facebook_connect\' | translate}}</button>\n                <button type="button" ion-button block outline icon-left class="sk-site-url" [navPush]="appUrlPage" *ngIf="isGenericSiteUrl"><ion-icon name="ios-arrow-back"></ion-icon>{{ \'change_site_url\' | translate }}</button>\n            </div>\n        </form>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\login\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_15__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_14__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__services_serverEvents_index__["a" /* ServerEventsService */],
            __WEBPACK_IMPORTED_MODULE_6__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_8__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_5__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_15__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_7_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_14__services_questions_manager__["a" /* QuestionManager */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 38:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_admob_index__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_push_index__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





// import services




var ApplicationService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ApplicationService(pushNotifications, adMobService, platform, appConfig, translate, api, http, config) {
        this.adMobService = adMobService;
        this.platform = platform;
        this.appConfig = appConfig;
        this.translate = translate;
        this.api = api;
        this.config = config;
        this.appLanguage = 'en';
        this.appLocation = null;
        this.http = http;
        this.pushNotifications = pushNotifications;
    }
    /**
     * Set app location
     */
    ApplicationService.prototype.setAppLocation = function (latitude, longitude) {
        this.appLocation = {
            latitude: latitude,
            longitude: longitude,
        };
    };
    /**
     * Get app location
     */
    ApplicationService.prototype.getAppLocation = function () {
        return this.appLocation;
    };
    /**
     * Set app language
     */
    ApplicationService.prototype.setAppLanguage = function (language) {
        this.appLanguage = language;
    };
    /**
     * Get app language
     */
    ApplicationService.prototype.getAppLanguage = function () {
        return this.appLanguage;
    };
    /**
     * Get app setting
     */
    ApplicationService.prototype.getAppSetting = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var value = localStorage.getItem("app_setting_" + name);
        if (value === null && defaultValue !== null) {
            return defaultValue;
        }
        return value;
    };
    /**
     * Set app setting
     */
    ApplicationService.prototype.setAppSetting = function (name, value) {
        localStorage.setItem("app_setting_" + name, value);
    };
    /**
     * Load dependencies
     */
    ApplicationService.prototype.loadDependencies = function (clearOldData) {
        var _this = this;
        if (clearOldData === void 0) { clearOldData = true; }
        // clear old data
        if (clearOldData) {
            this.api.removeAll('configs');
            this.translate.resetLang(this.appLanguage);
        }
        var promises = [];
        // load configs
        promises.push(this.api.findAll('configs', {}, { force: true }));
        // load translations
        promises.push(this.http.get(this.config.getApiUrl() + '/i18n/' + this.appLanguage + '/')
            .toPromise()
            .then(function (res) { return _this.translate.setTranslation(_this.appLanguage, res.json()); }));
        return new Promise(function (resolve, reject) {
            // load dependencies
            Promise.all(promises).then(function () {
                // init translations
                _this.translate.use(_this.appLanguage);
                // translate navigation items
                _this.appConfig.set('backButtonText', _this.translate.instant('back'));
                if (_this.platform.is('cordova')) {
                    // init admob banners
                    _this.adMobService.init();
                    // init push notifications
                    _this.pushNotifications.init(_this.appLanguage);
                }
                resolve();
            }).catch(function () {
                reject();
            });
        });
    };
    ApplicationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_8__services_push_index__["a" /* PushNotificationsService */]; }))),
        __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_5__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__services_push_index__["a" /* PushNotificationsService */],
            __WEBPACK_IMPORTED_MODULE_7__services_admob_index__["a" /* AdMobService */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["q" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* Config */],
            __WEBPACK_IMPORTED_MODULE_2_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_5__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_6__services_config_index__["a" /* ConfigService */]])
    ], ApplicationService);
    return ApplicationService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuestionBaseOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return QuestionBaseParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionBase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QuestionBaseOptions = /** @class */ (function () {
    function QuestionBaseOptions() {
    }
    return QuestionBaseOptions;
}());

;
var QuestionBaseParams = /** @class */ (function () {
    function QuestionBaseParams() {
    }
    return QuestionBaseParams;
}());

;
var QuestionBase = /** @class */ (function () {
    /**
     * Constructor
     */
    function QuestionBase(options, params) {
        this.value = options.value;
        this.values = options.values || null;
        this.key = options.key || '';
        this.label = options.label || '';
        this.controlType = options.controlType || '';
        this.validators = options.validators || null;
        this.params = params;
    }
    /**
     * Set control
     */
    QuestionBase.prototype.setControl = function (controlView) {
        this.controlView = controlView;
    };
    /**
     * Set validators
     */
    QuestionBase.prototype.setValidators = function (validators) {
        this.validators = validators;
    };
    /**
     * Get type
     */
    QuestionBase.prototype.getType = function () {
        return this.controlType;
    };
    QuestionBase = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [QuestionBaseOptions, QuestionBaseParams])
    ], QuestionBase);
    return QuestionBase;
}());

//# sourceMappingURL=base.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PermissionsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// pages

// services



var PermissionsService = /** @class */ (function () {
    /**
     * Constructor
     */
    function PermissionsService(config, http, app, translate, alert, api, auth) {
        this.config = config;
        this.http = http;
        this.app = app;
        this.translate = translate;
        this.alert = alert;
        this.api = api;
        this.auth = auth;
    }
    /**
     * Is action allowed
     */
    PermissionsService.prototype.isActionAllowed = function (action, userId) {
        var currentUser = !userId ? this.auth.getUserId() : userId;
        var permission = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isAllowed: true
            }
        });
        return permission.length > 0;
    };
    /**
     * Is action allowed after tracking
     */
    PermissionsService.prototype.isAllowedAfterTracking = function (action, userId) {
        var currentUser = !userId ? this.auth.getUserId() : userId;
        var permission = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isAllowedAfterTracking: true
            }
        });
        return permission.length > 0;
    };
    /**
     * Is action promoted
     */
    PermissionsService.prototype.isActionPromoted = function (action, userId) {
        var currentUser = !userId ? this.auth.getUserId() : userId;
        var permission = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                isPromoted: true
            }
        });
        return permission.length > 0;
    };
    /**
     * Get action price
     */
    PermissionsService.prototype.getActionPrice = function (action, userId) {
        var currentUser = !userId ? this.auth.getUserId() : userId;
        var permission = this.api.filter('permissions', {
            where: {
                userId: currentUser,
                permission: action,
                authorizedByCredits: true
            }
        });
        if (permission.length) {
            return permission[0].creditsCost;
        }
    };
    /**
     * Show access denied alert
     */
    PermissionsService.prototype.showAccessDeniedAlert = function () {
        var _this = this;
        var confirm = this.alert.create({
            title: this.translate.instant('permission_denied_alert_title'),
            message: this.translate.instant('permission_denied_alert_message'),
            buttons: [
                {
                    text: this.translate.instant('cancel')
                },
                {
                    text: this.translate.instant('purchase'),
                    handler: function () {
                        _this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_4__pages_inapps_index__["a" /* InappsPage */]);
                    }
                }
            ]
        });
        confirm.present();
    };
    /**
     * Track action
     */
    PermissionsService.prototype.trackAction = function (groupName, actionName) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + "/permissions/track-action/", {
                                groupName: groupName,
                                actionName: actionName
                            })
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PermissionsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_5__auth_index__["a" /* AuthService */]])
    ], PermissionsService);
    return PermissionsService;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppSettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_components_customPage_index__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// pages


// services


var AppSettingsPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppSettingsPage(navCtrl, api, auth, translate, modalCtrl, loadingCtrl, actionSheetCtrl, http) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.auth = auth;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.http = http;
    }
    Object.defineProperty(AppSettingsPage.prototype, "user", {
        /**
         * User
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show privacy policy modal
     */
    AppSettingsPage.prototype.showPrivacyPolicyModal = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__shared_components_customPage_index__["a" /* CustomPageComponent */], {
            title: this.translate.instant('privacy_policy_page_header'),
            pageName: 'privacy_policy_page_content'
        });
        modal.present();
    };
    /**
     * Show terms of use modal
     */
    AppSettingsPage.prototype.showTermsOfUseModal = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__shared_components_customPage_index__["a" /* CustomPageComponent */], {
            title: this.translate.instant('tos_page_header'),
            pageName: 'tos_page_content'
        });
        modal.present();
    };
    /**
     * Delete account confirmation
     */
    AppSettingsPage.prototype.deleteAccountConfirmation = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: this.translate.instant('app_settings_delete_account_confirmation'),
            buttons: [
                {
                    text: this.translate.instant('app_settings_delete_account_button'),
                    handler: function () {
                        _this.deleteAccount();
                    }
                },
                {
                    text: this.translate.instant('cancel')
                }
            ]
        });
        actionSheet.present();
    };
    /**
     * Logout user
     */
    AppSettingsPage.prototype.logout = function () {
        this.auth.logout();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__user_login_index__["a" /* LoginPage */]);
    };
    /**
     * Delete user account
     */
    AppSettingsPage.prototype.deleteAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('users', this.auth.getUserId())];
                    case 3:
                        _a.sent();
                        loader.dismiss();
                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__user_login_index__["a" /* LoginPage */]);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AppSettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-settings',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\appSettings\index.html"*/'<ion-header>\n    <ion-navbar hideBackButton>\n        <ion-buttons end>\n            <button ion-button navPop>\n                {{ \'done\' | translate }}\n            </button>\n        </ion-buttons>\n        <ion-title>{{ \'profile_app_settings\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content class="sk-app-settings-page">\n    <div class="sk-join-fields">\n        <div class="wrap">\n            <ion-item text-wrap class="sk-section">\n                <span>{{ \'app_settings_basic_information_label\' | translate }}</span>\n            </ion-item>\n            <ion-item class="sk-join-select sk-join-button" (tap)="showPrivacyPolicyModal()">\n                <ion-label>{{ \'app_settings_privacy_policy_label\' | translate }}</ion-label>\n            </ion-item>\n            <ion-item class="sk-join-select sk-join-button" (tap)="showTermsOfUseModal()">\n                <ion-label>{{ \'app_settings_terms_of_use_label\' | translate }}</ion-label>\n            </ion-item>\n        </div>\n        <div class="sk-delimiter"></div>\n        <div class="wrap">\n            <button class="sk-logout-button" ion-button clear full (click)="logout()">{{ \'logout\' | translate }}</button>\n            <button class="sk-delete-button" ion-button clear full (click)="deleteAccountConfirmation()" *ngIf="!user?.isAdmin">\n                {{ \'app_settings_delete_account_button\' | translate }}\n            </button>\n        </div>\n    </div>\n</ion-content>'/*ion-inline-end:"G:\attheclubb\application\src\pages\appSettings\index.html"*/,
            providers: []
        }),
        __param(7, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"])(Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return __WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */]; }))),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Nav */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_7__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */]])
    ], AppSettingsPage);
    return AppSettingsPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookmarksPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__messages_index__ = __webpack_require__(62);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services



// pages


var BookmarksPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function BookmarksPage(application, events, config, http, alert, translate, toast, ref, nav, loadingCtrl, api) {
        // -- init callbacks --//
        var _this = this;
        this.application = application;
        this.events = events;
        this.config = config;
        this.http = http;
        this.alert = alert;
        this.translate = translate;
        this.toast = toast;
        this.ref = ref;
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.api = api;
        this.infiniteScroll = null;
        this.bookmarks = [];
        this.pageReady = false;
        this.infiniteScrollNeedComplete = false;
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // profile liked
        this.profileLikedHandler = function (event) {
            var bookmark = _this.bookmarks.find(function (bookmark) { return bookmark.markUserId == event.userId; });
            if (bookmark) {
                if (event.type == 'like') {
                    bookmark.matchActions.type = 'like';
                }
                else {
                    bookmark.matchActions = {};
                }
                _this.ref.markForCheck();
            }
        };
        // profile disliked
        this.profileDislikedHandler = function (event) {
            var bookmark = _this.bookmarks.find(function (bookmark) { return bookmark.markUserId == event.userId; });
            if (bookmark) {
                bookmark.matchActions.type = 'dislike';
                _this.ref.markForCheck();
            }
        };
        // bookmark updated
        this.bookmarkUpdatedHandler = function () {
            _this.searchBookmarks();
        };
    }
    /**
     * Component init
     */
    BookmarksPage.prototype.ngOnInit = function () {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        this.events.subscribe('profileView:like', this.profileLikedHandler);
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.subscribe('profileView:bookmarkUpdated', this.bookmarkUpdatedHandler);
        this.searchBookmarks();
    };
    /**
     * Component destroy
     */
    BookmarksPage.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.unsubscribe('profileView:bookmarkUpdated', this.bookmarkUpdatedHandler);
    };
    /**
     * View rendered
     */
    BookmarksPage.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;
            setTimeout(function () {
                _this.infiniteScroll.complete();
            });
        }
    };
    Object.defineProperty(BookmarksPage.prototype, "defaultLocalLimit", {
        /**
         * Default local limit
         */
        get: function () {
            return this.api.get('configs', 'bookmarksLocalLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BookmarksPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get bookmark list
     */
    BookmarksPage.prototype.getBookmarkList = function () {
        return this.bookmarks.slice(0, this.currentLocalLimit);
    };
    /**
     * Load more bookmarks
     */
    BookmarksPage.prototype.loadMoreBookmarks = function () {
        if (this.bookmarks.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;
            return;
        }
        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    };
    /**
     * Like user
     */
    BookmarksPage.prototype.likeUser = function (bookmark) {
        var _this = this;
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            var confirm_1 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', { name: bookmark.displayName ? bookmark.displayName : bookmark.userName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('like'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                            _this.sendLikeRequest(bookmark);
                        }
                    }
                ]
            });
            confirm_1.present();
            return;
        }
        this.sendLikeRequest(bookmark);
    };
    /**
     * Unmark
     */
    BookmarksPage.prototype.unmark = function (userId) {
        var _this = this;
        var buttons = [{
                text: this.translate.instant('no'),
                handler: function () { return _this.bookmarkList.closeSlidingItems(); }
            }, {
                text: this.translate.instant('yes'),
                handler: function () { return _this.deleteBookmark(userId); }
            }];
        var confirm = this.alert.create({
            message: this.translate.instant('delete_bookmark_confirmation'),
            buttons: buttons
        });
        confirm.present();
    };
    /**
     * View profile
     */
    BookmarksPage.prototype.viewProfile = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_7__profile_view_index__["a" /* ProfileViewPage */], {
            userId: userId
        });
    };
    /**
     * Show chat
     */
    BookmarksPage.prototype.showChat = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__messages_index__["a" /* MessagesPage */], {
            userId: userId
        });
    };
    /**
     * Delete bookmark
     */
    BookmarksPage.prototype.deleteBookmark = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var toast, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // refresh bookmarks array
                        this.bookmarks = this.bookmarks.filter(function (bookmark) { return bookmark.markUserId != userId; });
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_removed_from_bookmarks'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        return [4 /*yield*/, this.http.delete(this.config.getApiUrl() + "/bookmarks/" + userId + "/")
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send like request
     */
    BookmarksPage.prototype.sendLikeRequest = function (bookmark) {
        return __awaiter(this, void 0, void 0, function () {
            var likeParam, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.bookmarkList.closeSlidingItems();
                        likeParam = {
                            userId: bookmark.markUserId,
                            type: 'like'
                        };
                        bookmark.matchActions = likeParam;
                        this.ref.markForCheck();
                        // create a new like
                        return [4 /*yield*/, this.api.getMapper('matchActions').create(likeParam)];
                    case 1:
                        // create a new like
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search bookmarks
     */
    BookmarksPage.prototype.searchBookmarks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, urlParams, _a, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        this.pageReady = false;
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        urlParams = '?';
                        urlParams += 'with[]=avatar&';
                        urlParams += 'with[]=displayName&';
                        urlParams += 'with[]=userName&';
                        urlParams += 'with[]=matchActions';
                        // load all bookmarks
                        _a = this;
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/bookmarks/' + urlParams)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        // load all bookmarks
                        _a.bookmarks = _b.sent();
                        this.currentLocalLimit = this.defaultLocalLimit;
                        this.pageReady = true;
                        this.ref.markForCheck();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _b.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */])
    ], BookmarksPage.prototype, "infiniteScroll", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* List */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* List */])
    ], BookmarksPage.prototype, "bookmarkList", void 0);
    BookmarksPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'bookmarks',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\bookmarks\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'bookmarks_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-bookmarks-page">\n    <div *ngIf="pageReady">\n\n        <!-- nothing found wrapper  -->\n        <div class="sk-nothing-found" *ngIf="!bookmarks.length">\n            <img src="./assets/img/user_not_found.svg" alt="">\n            <h2>{{ \'empty_user_search_header\' | translate }}</h2>\n        </div>\n\n        <!-- users wrapper -->\n        <ion-list class="sk-userlist" *ngIf="bookmarks.length">\n            <ion-item-sliding *ngFor="let bookmark of getBookmarkList()">\n                <ion-item (tap)="viewProfile(bookmark.markUserId)">\n                    <ion-avatar item-left>\n                        <user-avatar [url]="bookmark.avatar.url" [isAvatarActive]="bookmark.avatar.active"></user-avatar>\n                    </ion-avatar>\n                    <h2>{{bookmark.displayName ? bookmark.displayName : bookmark.userName}}</h2>\n                </ion-item>\n                <ion-item-options side="right">\n                    <button ion-button color="green" *ngIf="!bookmark.matchActions.type" (click)="likeUser(bookmark)">\n                        {{ \'like\' | translate }}\n                    </button>\n                    <button ion-button color="primary" (click)="showChat(bookmark.markUserId)">\n                        {{ \'send_message\' | translate }}\n                    </button>\n                    <button ion-button color="bg-grey" (click)="unmark(bookmark.markUserId)">\n                        {{ \'unmark\' | translate }}\n                    </button>\n                </ion-item-options>\n            </ion-item-sliding>\n        </ion-list>\n\n        <ion-infinite-scroll (ionInfinite)="loadMoreBookmarks()">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\bookmarks\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_4__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], BookmarksPage);
    return BookmarksPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GuestsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__messages_index__ = __webpack_require__(62);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services



// pages


var GuestsPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function GuestsPage(toast, translate, alert, application, events, config, http, nav, ref, api, loadingCtrl) {
        // -- init callbacks --//
        var _this = this;
        this.toast = toast;
        this.translate = translate;
        this.alert = alert;
        this.application = application;
        this.events = events;
        this.config = config;
        this.http = http;
        this.nav = nav;
        this.ref = ref;
        this.api = api;
        this.loadingCtrl = loadingCtrl;
        this.infiniteScroll = null;
        this.deletedGuests = [];
        this.pageReady = false;
        this.guests = [];
        this.infiniteScrollNeedComplete = false;
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // guests updated handler
        this.guestsUpdatedHandler = function () {
            _this.guests = _this.api.filter('guests', {
                where: {
                    id: {
                        'notIn': _this.deletedGuests
                    }
                },
                orderBy: [
                    ['visitTimestamp', 'DESC'],
                    ['id', 'ASC']
                ]
            });
            _this.markGuestsAsViewed();
            _this.ref.markForCheck();
        };
        // profile liked
        this.profileLikedHandler = function (event) {
            var guest = _this.guests.find(function (guest) { return guest.guestId == event.userId; });
            if (guest) {
                if (event.type == 'like') {
                    guest.matchActions.type = 'like';
                }
                else {
                    guest.matchActions = {};
                }
                _this.ref.markForCheck();
            }
        };
        // profile disliked
        this.profileDislikedHandler = function (event) {
            var guest = _this.guests.find(function (guest) { return guest.guestId == event.userId; });
            if (guest) {
                guest.matchActions.type = 'dislike';
                _this.ref.markForCheck();
            }
        };
    }
    /**
     * Component init
     */
    GuestsPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
                        this.events.subscribe('guests:updated', this.guestsUpdatedHandler);
                        this.events.subscribe('profileView:like', this.profileLikedHandler);
                        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.api.findAll('guests')];
                    case 3:
                        _a.guests = _b.sent();
                        this.currentLocalLimit = this.defaultLocalLimit;
                        this.pageReady = true;
                        this.markGuestsAsViewed();
                        this.ref.markForCheck();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Component destroy
     */
    GuestsPage.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('guests:updated', this.guestsUpdatedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
    };
    /**
     * View rendered
     */
    GuestsPage.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;
            setTimeout(function () {
                _this.infiniteScroll.complete();
            });
        }
    };
    Object.defineProperty(GuestsPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuestsPage.prototype, "defaultLocalLimit", {
        /**
         * Default local limit
         */
        get: function () {
            return this.api.get('configs', 'guestsLocalLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get guest list
     */
    GuestsPage.prototype.getGuestList = function () {
        return this.guests.slice(0, this.currentLocalLimit);
    };
    /**
     * Load more guests
     */
    GuestsPage.prototype.loadMoreGuests = function () {
        if (this.guests.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.markGuestsAsViewed();
            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;
            return;
        }
        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    };
    /**
     * Remove guest confirmation
     */
    GuestsPage.prototype.removeGuestConfirmation = function (id) {
        var _this = this;
        var buttons = [{
                text: this.translate.instant('no'),
                handler: function () { return _this.guestList.closeSlidingItems(); }
            }, {
                text: this.translate.instant('yes'),
                handler: function () { return _this.deleteGuest(id); }
            }];
        var confirm = this.alert.create({
            message: this.translate.instant('delete_guest_confirmation'),
            buttons: buttons
        });
        confirm.present();
    };
    /**
     * View profile
     */
    GuestsPage.prototype.viewProfile = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_7__profile_view_index__["a" /* ProfileViewPage */], {
            userId: userId
        });
    };
    /**
     * Show chat
     */
    GuestsPage.prototype.showChat = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__messages_index__["a" /* MessagesPage */], {
            userId: userId
        });
    };
    /**
     * Like user
     */
    GuestsPage.prototype.likeUser = function (guest) {
        var _this = this;
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            var confirm_1 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', { name: guest.displayName ? guest.displayName : guest.userName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('like'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                            _this.sendLikeRequest(guest);
                        }
                    }
                ]
            });
            confirm_1.present();
            return;
        }
        this.sendLikeRequest(guest);
    };
    /**
     * Delete guest
     */
    GuestsPage.prototype.deleteGuest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var toast, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // refresh guests array
                        this.deletedGuests.push(id);
                        this.api.remove('guests', id);
                        this.guests = this.api.filter('guests', {
                            where: {
                                id: {
                                    'notIn': this.deletedGuests
                                }
                            },
                            orderBy: [
                                ['visitTimestamp', 'DESC'],
                                ['id', 'ASC']
                            ]
                        });
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_removed_from_guests'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        return [4 /*yield*/, this.api.destroy('guests', id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send like request
     */
    GuestsPage.prototype.sendLikeRequest = function (guest) {
        return __awaiter(this, void 0, void 0, function () {
            var likeParam, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.guestList.closeSlidingItems();
                        likeParam = {
                            userId: guest.guestId,
                            type: 'like'
                        };
                        guest.matchActions = likeParam;
                        this.ref.markForCheck();
                        // create a new like
                        return [4 /*yield*/, this.api.getMapper('matchActions').create(likeParam)];
                    case 1:
                        // create a new like
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mark guests as viewed
     */
    GuestsPage.prototype.markGuestsAsViewed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var guestsIds_1, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        guestsIds_1 = [];
                        this.getGuestList().forEach(function (guest) {
                            if (!guest.viewed) {
                                guest.viewed = true;
                                guestsIds_1.push(guest.guestId);
                            }
                        });
                        if (!guestsIds_1.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.http.put(this.config.getApiUrl() + "/guests/", guestsIds_1)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* InfiniteScroll */])
    ], GuestsPage.prototype, "infiniteScroll", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* List */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* List */])
    ], GuestsPage.prototype, "guestList", void 0);
    GuestsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'guests',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\guests\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'guests_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-guests-page">\n    <div *ngIf="pageReady">\n\n        <!-- nothing found wrapper  -->\n        <div class="sk-nothing-found" *ngIf="!guests.length">\n            <img src="./assets/img/user_not_found.svg" alt="">\n            <h2>{{ \'empty_user_search_header\' | translate }}</h2>\n        </div>\n\n        <!-- users wrapper -->\n        <ion-list class="sk-userlist" *ngIf="guests.length">\n            <ion-item-sliding *ngFor="let guest of getGuestList()">\n                <ion-item (tap)="viewProfile(guest.guestId)">\n                    <ion-avatar item-left>\n                        <user-avatar [url]="guest.avatar.url" [isAvatarActive]="guest.avatar.active"></user-avatar>\n                    </ion-avatar>\n                    <h2>{{guest.displayName ? guest.displayName : guest.userName}}</h2>\n                </ion-item>\n                <ion-item-options side="right">\n                    <button ion-button color="green" *ngIf="!guest.matchActions.type" (click)="likeUser(guest)">\n                        {{ \'like\' | translate }}\n                    </button>\n                    <button ion-button color="primary" (click)="showChat(guest.guestId)">\n                        {{ \'send_message\' | translate }}\n                    </button>\n                    <button ion-button color="bg-grey" (click)="removeGuestConfirmation(guest.id)">\n                        {{ \'hidden\' | translate }}\n                    </button>\n                </ion-item-options>\n            </ion-item-sliding>\n        </ion-list>\n\n        <ion-infinite-scroll (ionInfinite)="loadMoreGuests()">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\guests\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_6__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_4__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */]])
    ], GuestsPage);
    return GuestsPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompatibleUsersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__messages_index__ = __webpack_require__(62);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services



// pages


var CompatibleUsersPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function CompatibleUsersPage(application, events, config, http, alert, translate, ref, nav, loadingCtrl, api) {
        // -- init callbacks --//
        var _this = this;
        this.application = application;
        this.events = events;
        this.config = config;
        this.http = http;
        this.alert = alert;
        this.translate = translate;
        this.ref = ref;
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.api = api;
        this.infiniteScroll = null;
        this.users = [];
        this.pageReady = false;
        this.infiniteScrollNeedComplete = false;
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // profile liked
        this.profileLikedHandler = function (event) {
            console.log('liked');
            var user = _this.users.find(function (user) { return user.id == event.userId; });
            if (user) {
                if (event.type == 'like') {
                    user.matchActions.type = 'like';
                }
                else {
                    user.matchActions = {};
                }
                _this.ref.markForCheck();
            }
        };
        // profile disliked
        this.profileDislikedHandler = function (event) {
            console.log('disliked');
            var user = _this.users.find(function (user) { return user.id == event.userId; });
            if (user) {
                user.matchActions.type = 'dislike';
                _this.ref.markForCheck();
            }
        };
    }
    /**
     * Component init
     */
    CompatibleUsersPage.prototype.ngOnInit = function () {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        this.events.subscribe('profileView:like', this.profileLikedHandler);
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);
        this.searchUsers();
    };
    /**
     * Component destroy
     */
    CompatibleUsersPage.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
    };
    /**
     * View rendered
     */
    CompatibleUsersPage.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this.infiniteScrollNeedComplete) {
            this.infiniteScrollNeedComplete = false;
            setTimeout(function () {
                _this.infiniteScroll.complete();
            });
        }
    };
    Object.defineProperty(CompatibleUsersPage.prototype, "defaultLocalLimit", {
        /**
         * Default local limit
         */
        get: function () {
            return this.api.get('configs', 'compatibleUsersLocalLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get user list
     */
    CompatibleUsersPage.prototype.getUserList = function () {
        return this.users.slice(0, this.currentLocalLimit);
    };
    /**
     * Load more user
     */
    CompatibleUsersPage.prototype.loadMoreUsers = function () {
        if (this.users.length > this.currentLocalLimit) {
            this.currentLocalLimit += this.defaultLocalLimit;
            this.ref.markForCheck();
            this.infiniteScrollNeedComplete = true;
            return;
        }
        this.infiniteScroll.enabled = false; //don't show scroll any more
        this.infiniteScroll.complete();
    };
    /**
     * View profile
     */
    CompatibleUsersPage.prototype.viewProfile = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_7__profile_view_index__["a" /* ProfileViewPage */], {
            userId: userId
        });
    };
    /**
     * Show chat
     */
    CompatibleUsersPage.prototype.showChat = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__messages_index__["a" /* MessagesPage */], {
            userId: userId
        });
    };
    /**
     * Like user
     */
    CompatibleUsersPage.prototype.likeUser = function (user) {
        var _this = this;
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            var confirm_1 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', { name: user.displayName ? user.displayName : user.userName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('like'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                            _this.sendLikeRequest(user);
                        }
                    }
                ]
            });
            confirm_1.present();
            return;
        }
        this.sendLikeRequest(user);
    };
    /**
     * Send like request
     */
    CompatibleUsersPage.prototype.sendLikeRequest = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var likeParam, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.userList.closeSlidingItems();
                        likeParam = {
                            userId: user.id,
                            type: 'like'
                        };
                        user.matchActions = likeParam;
                        this.ref.markForCheck();
                        // create a new like
                        return [4 /*yield*/, this.api.getMapper('matchActions').create(likeParam)];
                    case 1:
                        // create a new like
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search users
     */
    CompatibleUsersPage.prototype.searchUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, urlParams, _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        this.pageReady = false;
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        urlParams = '?';
                        urlParams += 'with[]=avatar&';
                        urlParams += 'with[]=displayName&';
                        urlParams += 'with[]=userName&';
                        urlParams += 'with[]=matchActions';
                        // load all users
                        _a = this;
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/compatible-users/' + urlParams)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        // load all users
                        _a.users = _b.sent();
                        this.currentLocalLimit = this.defaultLocalLimit;
                        this.pageReady = true;
                        this.ref.markForCheck();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */])
    ], CompatibleUsersPage.prototype, "infiniteScroll", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* List */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* List */])
    ], CompatibleUsersPage.prototype, "userList", void 0);
    CompatibleUsersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'compatible-users',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\user\compatibleUsers\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'compatible_users_page_header\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-compatible-users-page">\n    <div *ngIf="pageReady">\n\n        <!-- nothing found wrapper  -->\n        <div class="sk-nothing-found" *ngIf="!users.length">\n            <img src="./assets/img/user_not_found.svg" alt="">\n            <h2>{{ \'empty_user_search_header\' | translate }}</h2>\n        </div>\n\n        <!-- users wrapper -->\n        <ion-list class="sk-userlist" *ngIf="users.length">\n            <ion-item-sliding *ngFor="let user of getUserList()">\n                <ion-item (tap)="viewProfile(user.id)">\n                    <ion-avatar item-left>\n                        <user-avatar [url]="user.avatar.url" [isAvatarActive]="user.avatar.active"></user-avatar>\n                    </ion-avatar>\n                    <h2>{{user.displayName ? user.displayName : user.userName}}</h2>\n                    <p>{{ \'compatibility\' | translate }}: {{user.compatibility}}</p>\n                </ion-item>\n                <ion-item-options side="right">\n                    <button ion-button color="green" *ngIf="!user.matchActions.type" (click)="likeUser(user)">\n                        {{ \'like\' | translate }}\n                    </button>\n                    <button ion-button color="primary" (click)="showChat(user.id)">\n                        {{ \'send_message\' | translate }}\n                    </button>\n                </ion-item-options>\n            </ion-item-sliding>\n        </ion-list>\n\n        <ion-infinite-scroll (ionInfinite)="loadMoreUsers()">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\user\compatibleUsers\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_5__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_4__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], CompatibleUsersPage);
    return CompatibleUsersPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserSearchFilterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// questions


var UserSearchFilterComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function UserSearchFilterComponent(translate, questionControl, questionManager, api, loadingCtrl, viewCtrl, navParams) {
        var _this = this;
        this.translate = translate;
        this.questionControl = questionControl;
        this.questionManager = questionManager;
        this.api = api;
        this.loadingCtrl = loadingCtrl;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        this.questions = []; // list of questions
        this.sections = [];
        this.formReady = false;
        this.searchFilter = {};
        this.genderList = [];
        var filter = this.navParams.get('filter');
        if (filter.length) {
            filter.forEach(function (question) {
                _this.searchFilter[question.name] = question.value;
            });
        }
    }
    Object.defineProperty(UserSearchFilterComponent.prototype, "isPhotoQuestionActive", {
        /**
         * Is photo question active
         */
        get: function () {
            return this.api.get('configs', 'showWithPhotoOnlyInSearch').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserSearchFilterComponent.prototype, "isOnlineQuestionActive", {
        /**
         * Is online question active
         */
        get: function () {
            return this.api.get('configs', 'showOnlineOnlyInSearch').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    UserSearchFilterComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, _a, searchQuestions, genders, questionsData, preferredAccountType, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this.api.getMapper('searchQuestions').findAll({}),
                                this.api.findAll('userGenders', {}, { force: true }),
                                this.api.findAll('questionsData'),
                            ])];
                    case 3:
                        _a = _b.sent(), searchQuestions = _a[0], genders = _a[1], questionsData = _a[2];
                        this.allSearchQuestions = searchQuestions;
                        // process genders
                        genders.forEach(function (gender) { return _this.genderList.push({
                            value: gender.id,
                            title: gender.name
                        }); });
                        // search default preferred account type
                        if (!this.searchFilter['match_sex']) {
                            preferredAccountType = questionsData.filter(function (question) {
                                return question.name == 'match_sex';
                            });
                            this.searchFilter['match_sex'] = preferredAccountType[0]
                                ? preferredAccountType[0].value[0]
                                : '';
                        }
                        this.initForm();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        loader.dismiss();
                        this.viewCtrl.dismiss([]);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Dismiss
     */
    UserSearchFilterComponent.prototype.dismiss = function () {
        this.viewCtrl.dismiss([]);
    };
    /**
     * Close
     */
    UserSearchFilterComponent.prototype.close = function () {
        var _this = this;
        var processedQuestions = [];
        this.questions.forEach(function (questionData) {
            processedQuestions.push({
                name: questionData.key,
                value: _this.form.value[questionData.key],
                type: questionData.controlType
            });
        });
        this.viewCtrl.dismiss(processedQuestions);
    };
    /**
     * Init form
     */
    UserSearchFilterComponent.prototype.initForm = function () {
        var _this = this;
        this.questions = [];
        this.sections = [];
        var hardcodedQuestions = {
            section: this.translate.instant('advanced_search_input_section'),
            items: []
        };
        // hardcoded questions list
        hardcodedQuestions.items.push({
            type: __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_SELECT,
            key: 'match_sex',
            label: this.translate.instant('looking_for_input'),
            values: this.genderList,
            validators: [
                { name: 'require' }
            ],
            params: {
                hideEmptyValue: true
            }
        });
        if (this.isOnlineQuestionActive) {
            hardcodedQuestions.items.push({
                type: __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_CHECKBOX,
                key: 'online',
                label: this.translate.instant('online_input'),
                value: false
            });
        }
        if (this.isPhotoQuestionActive) {
            hardcodedQuestions.items.push({
                type: __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */].TYPE_CHECKBOX,
                key: 'with_photo',
                label: this.translate.instant('with_photo_input'),
                value: false
            });
        }
        this.processQuestions([hardcodedQuestions]);
        // process search questions
        if (this.allSearchQuestions[this.searchFilter['match_sex']]
            && this.allSearchQuestions[this.searchFilter['match_sex']].length) {
            this.processQuestions(this.allSearchQuestions[this.searchFilter['match_sex']]);
        }
        // register all questions inside a form group
        this.form = this.questionControl.toFormGroup(this.questions);
        this.formReady = true;
        // looking for "match_sex" changes
        this.form.valueChanges.subscribe(function (question) {
            if (question.match_sex && question.match_sex != _this.searchFilter['match_sex']) {
                _this.searchFilter = Object.assign({}, _this.searchFilter, question);
                _this.initForm();
                return;
            }
            _this.searchFilter = Object.assign({}, _this.searchFilter, question);
        });
    };
    /**
     * Process questions
     */
    UserSearchFilterComponent.prototype.processQuestions = function (questions) {
        var _this = this;
        questions.forEach(function (questionData) {
            var data = {
                section: '',
                questions: []
            };
            data.section = questionData.section;
            questionData.items.forEach(function (question) {
                var questionItem = _this.questionManager.getQuestion(question.type, {
                    key: question.key,
                    label: question.label,
                    values: question.values,
                    value: _this.searchFilter[question.key] ? _this.searchFilter[question.key] : question.value
                }, question.params);
                // add validators
                if (question.validators) {
                    questionItem.validators = question.validators;
                }
                data.questions.push(questionItem);
                _this.questions.push(questionItem);
            });
            _this.sections.push(data);
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], UserSearchFilterComponent.prototype, "questions", void 0);
    UserSearchFilterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'user-search-filter',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\search\components\searchFilter\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-buttons start>\n            <button ion-button clear *ngIf="formReady" (click)="dismiss()">{{ \'cancel\' | translate }}</button>\n        </ion-buttons>\n        <ion-title>{{ \'search_filter_page_header\' | translate }}</ion-title>\n        <ion-buttons end>\n            <button ion-button clear *ngIf="formReady" [disabled]="!form.valid" (click)="close()">{{ \'done\' | translate }}</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-user-search-filter-page">\n    <form *ngIf="formReady" [formGroup]="form">\n        <ion-list class="sk-user-search-fields">\n            <div class="wrap">\n                <!-- questions -->\n                <div *ngFor="let sectionData of sections">\n                    <ion-item-divider text-wrap class="sk-questions-section" *ngIf="sectionData.section" color="light">\n                        <span>{{sectionData.section}}</span>\n                    </ion-item-divider>\n                    <question *ngFor="let question of sectionData.questions" [question]="question" [form]="form"></question>\n                </div>\n            </div>\n        </ion-list>\n    </form>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\search\components\searchFilter\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
                __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_4__services_questions_control_service__["a" /* QuestionControlService */],
            __WEBPACK_IMPORTED_MODULE_5__services_questions_manager__["a" /* QuestionManager */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */]])
    ], UserSearchFilterComponent);
    return UserSearchFilterComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewMembershipComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_inapps_index__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_dashboard_index__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var ViewMembershipComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function ViewMembershipComponent(api, apiUtils, auth, config, http, iaps, loadingCtrl, nav, navParams) {
        this.api = api;
        this.apiUtils = apiUtils;
        this.auth = auth;
        this.config = config;
        this.http = http;
        this.iaps = iaps;
        this.loadingCtrl = loadingCtrl;
        this.nav = nav;
        this.navParams = navParams;
        this.membership = {};
        this.membershipId = null;
    }
    Object.defineProperty(ViewMembershipComponent.prototype, "currency", {
        get: function () {
            return this.api.get('configs', 'billingCurrency').value;
        },
        enumerable: true,
        configurable: true
    });
    ViewMembershipComponent.prototype.ngOnInit = function () {
        this.membershipId = this.navParams.get('mewmbershipId');
        this.loadMembership();
    };
    ViewMembershipComponent.prototype.loadMembership = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, products_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/memberships/' + this.membershipId + '/')
                                .map(function (response) { return response.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, this.iaps.getProducts(data['plans'])];
                    case 4:
                        products_1 = _a.sent();
                        data['plans'] = data['plans'].filter(function (el) {
                            for (var key in products_1) {
                                if (el['productId'].toLowerCase() == products_1[key]['productId']) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        this.membership = data;
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 6];
                    case 6:
                        loader.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewMembershipComponent.prototype.buyProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.iaps.buyProduct(productId)];
                    case 3:
                        result = _a.sent();
                        if (result.id != -1) {
                            this.apiUtils.clearUserData(this.auth.getUserId(), true);
                            this.nav.push(__WEBPACK_IMPORTED_MODULE_8__pages_dashboard_index__["a" /* DashboardPage */]);
                        }
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ViewMembershipComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'membership',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\inapps\components\memberships\viewMembership\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ membership.title }}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content class="sk-memberships-inner-page">\n    <div class="sk-membership-items">\n        <div class="sk-membership-item" *ngFor="let plan of membership?.plans" (click)="buyProduct(plan.productId);">\n            <div class="sk-membership-price">\n                <span>{{ currency }} {{ plan.dto.price }}</span><span>per {{ plan.dto.period }} {{ plan.dto.periodUnits }}</span>\n            </div>\n            <span *ngIf="plan.dto.recurring == \'1\'">{{ \'recurring\' | translate }}</span>\n            <ion-icon name="ios-arrow-forward"></ion-icon>\n        </div>\n    </div>\n    <div class="wrap" *ngFor="let section of membership?.labels">\n        <div class="sk-section">\n            <span>{{ section.label }}</span>\n        </div>\n        <ion-list>\n            <ion-item *ngFor="let action of section?.actions">{{ action }}</ion-item>\n        </ion-list>\n    </div>\n</ion-content>'/*ion-inline-end:"G:\attheclubb\application\src\pages\inapps\components\memberships\viewMembership\index.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_6__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_7__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_4__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_5__services_inapps_index__["a" /* InAppsService */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["p" /* NavParams */]])
    ], ViewMembershipComponent);
    return ViewMembershipComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 491:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_web_animations_js_web_animations_min__ = __webpack_require__(868);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_web_animations_js_web_animations_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_web_animations_js_web_animations_min__);



Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 496:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__ = __webpack_require__(497);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_keyboard__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_transfer__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file_path__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_component__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ng2_translate_ng2_translate__ = __webpack_require__(572);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_admob__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_push__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_device__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_in_app_purchase__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angular2_swing__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angular2_swing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_angular2_swing__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_angular2_moment__ = __webpack_require__(582);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_angular2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_user_forgotPassword_checkEmail_index__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_user_forgotPassword_checkCode_index__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_user_forgotPassword_newPassword_index__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_user_verifyEmail_checkEmail_index__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_user_verifyEmail_checkCode_index__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_user_join_initial_index__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_user_join_questions_index__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_appUrl_index__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_user_disapproved_index__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_appMaintenance_index__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_user_edit_questions_index__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_user_edit_photos_index__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_user_completeProfile_index__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_user_completeAccountType_index__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_appConnectionError_index__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_appError_index__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_profile_photos_index__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_messages_index__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_appSettings_index__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_user_bookmarks_index__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_user_guests_index__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_user_compatibleUsers_index__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_messages_components_plainMessage_index__ = __webpack_require__(585);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_messages_components_winkMessage_index__ = __webpack_require__(586);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_dashboard_components_matchedUser_index__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_dashboard_components_hotList_index__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_dashboard_components_tinder_index__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_dashboard_components_profile_index__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__pages_dashboard_components_conversations_index__ = __webpack_require__(590);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__pages_dashboard_components_search_index__ = __webpack_require__(591);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__pages_dashboard_components_tabs_index__ = __webpack_require__(592);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_dashboard_components_search_components_searchFilter_index__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__pages_inapps_components_memberships_index__ = __webpack_require__(593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__pages_inapps_components_memberships_viewMembership_index__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__pages_inapps_components_credits_index__ = __webpack_require__(594);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__shared_components_question_index__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__shared_components_avatar_index__ = __webpack_require__(597);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__shared_components_locationAutocomplete_index__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__shared_components_customPage_index__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__shared_components_flag_index__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__shared_directives_autosize_index__ = __webpack_require__(598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__shared_directives_changeFocusByEnter_index__ = __webpack_require__(840);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__services_i18n_index__ = __webpack_require__(841);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__services_api_factory__ = __webpack_require__(842);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_74__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_75__services_questions_factory__ = __webpack_require__(866);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_76__services_questions_manager__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_77__services_admob_index__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_78__services_push_index__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_79__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_80__services_inapps_index__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_81__services_http_errorHandler__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_82__services_questions_validators_index__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_83__services_questions_validators_userEmail__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_84__services_questions_validators_username__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_85__services_questions_validators_require__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_86__services_questions_validators_email__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_87__services_questions_validators_url__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_88__services_questions_validators_minLength__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_89__services_questions_validators_maxLength__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_90__services_serverEvents_index__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_91__services_serverEvents_channels_configs__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_92__services_serverEvents_channels_permissions__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_93__services_serverEvents_channels_conversations__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_94__services_serverEvents_channels_matchedUsers__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_95__services_serverEvents_channels_messages__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_96__services_serverEvents_channels_guests__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_97__services_serverEvents_channels_hotList__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_98__shared_pipes_nlbr_index__ = __webpack_require__(867);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























// pages


























// messages components


// tabs components








// inapps components



// shared components





// shared directives


// services














// validators








// server events








// pipes

var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_9__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_36__pages_user_completeProfile_index__["a" /* CompleteProfilePage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_user_completeAccountType_index__["a" /* CompleteAccountTypePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_appConnectionError_index__["a" /* AppConnectionErrorPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_appError_index__["a" /* AppErrorPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_appSettings_index__["a" /* AppSettingsPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_profile_view_index__["a" /* ProfileViewPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_profile_photos_index__["a" /* ProfilePhotosPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_inapps_index__["a" /* InappsPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_messages_index__["a" /* MessagesPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_user_bookmarks_index__["a" /* BookmarksPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_user_guests_index__["a" /* GuestsPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_user_compatibleUsers_index__["a" /* CompatibleUsersPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_dashboard_index__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_user_login_index__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_user_forgotPassword_checkEmail_index__["a" /* ForgotPasswordCheckEmailPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_user_forgotPassword_checkCode_index__["a" /* ForgotPasswordCheckCodePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_user_forgotPassword_newPassword_index__["a" /* ForgotPasswordNewPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_user_verifyEmail_checkEmail_index__["a" /* VerifyEmailCheckEmailPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_user_verifyEmail_checkCode_index__["a" /* VerifyEmailCheckCodePage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_user_join_initial_index__["a" /* JoinInitialPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_user_join_questions_index__["a" /* JoinQuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_appUrl_index__["a" /* AppUrlPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_user_disapproved_index__["a" /* UserDisapprovedPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_appMaintenance_index__["a" /* AppMaintenancePage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_user_edit_questions_index__["a" /* EditUserQuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_user_edit_photos_index__["a" /* EditUserPhotosPage */],
                __WEBPACK_IMPORTED_MODULE_61__shared_components_question_index__["a" /* QuestionComponent */],
                __WEBPACK_IMPORTED_MODULE_62__shared_components_avatar_index__["a" /* AvatarComponent */],
                __WEBPACK_IMPORTED_MODULE_63__shared_components_locationAutocomplete_index__["a" /* LocationAutocompleteComponent */],
                __WEBPACK_IMPORTED_MODULE_64__shared_components_customPage_index__["a" /* CustomPageComponent */],
                __WEBPACK_IMPORTED_MODULE_65__shared_components_flag_index__["a" /* FlagComponent */],
                __WEBPACK_IMPORTED_MODULE_53__pages_dashboard_components_profile_index__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_52__pages_dashboard_components_tinder_index__["a" /* TinderComponent */],
                __WEBPACK_IMPORTED_MODULE_51__pages_dashboard_components_hotList_index__["a" /* HotListComponent */],
                __WEBPACK_IMPORTED_MODULE_50__pages_dashboard_components_matchedUser_index__["a" /* MatchedUserPageComponent */],
                __WEBPACK_IMPORTED_MODULE_48__pages_messages_components_plainMessage_index__["a" /* PlainMessageComponent */],
                __WEBPACK_IMPORTED_MODULE_49__pages_messages_components_winkMessage_index__["a" /* WinkMessageComponent */],
                __WEBPACK_IMPORTED_MODULE_56__pages_dashboard_components_tabs_index__["a" /* DashboardTabsComponent */],
                __WEBPACK_IMPORTED_MODULE_54__pages_dashboard_components_conversations_index__["a" /* ConversationsComponent */],
                __WEBPACK_IMPORTED_MODULE_55__pages_dashboard_components_search_index__["a" /* SearchComponent */],
                __WEBPACK_IMPORTED_MODULE_57__pages_dashboard_components_search_components_searchFilter_index__["a" /* UserSearchFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_58__pages_inapps_components_memberships_index__["a" /* MembershipsComponent */],
                __WEBPACK_IMPORTED_MODULE_59__pages_inapps_components_memberships_viewMembership_index__["a" /* ViewMembershipComponent */],
                __WEBPACK_IMPORTED_MODULE_60__pages_inapps_components_credits_index__["a" /* CreditsComponent */],
                __WEBPACK_IMPORTED_MODULE_57__pages_dashboard_components_search_components_searchFilter_index__["a" /* UserSearchFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_66__shared_directives_autosize_index__["a" /* AutosizeDirective */],
                __WEBPACK_IMPORTED_MODULE_67__shared_directives_changeFocusByEnter_index__["a" /* ChangeFocusByEnterDirective */],
                __WEBPACK_IMPORTED_MODULE_98__shared_pipes_nlbr_index__["a" /* NlbrPipe */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_21_angular2_moment__["MomentModule"],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_18_angular2_swing__["SwingModule"],
                __WEBPACK_IMPORTED_MODULE_10_ionic_angular__["j" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */], {
                    scrollAssist: false,
                    autoFocusAssist: false
                }, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_12_ng2_translate_ng2_translate__["b" /* TranslateModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_10_ionic_angular__["h" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_36__pages_user_completeProfile_index__["a" /* CompleteProfilePage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_user_completeAccountType_index__["a" /* CompleteAccountTypePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_appConnectionError_index__["a" /* AppConnectionErrorPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_appError_index__["a" /* AppErrorPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_appSettings_index__["a" /* AppSettingsPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_profile_view_index__["a" /* ProfileViewPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_profile_photos_index__["a" /* ProfilePhotosPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_inapps_index__["a" /* InappsPage */],
                __WEBPACK_IMPORTED_MODULE_59__pages_inapps_components_memberships_viewMembership_index__["a" /* ViewMembershipComponent */],
                __WEBPACK_IMPORTED_MODULE_43__pages_messages_index__["a" /* MessagesPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_user_bookmarks_index__["a" /* BookmarksPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_user_guests_index__["a" /* GuestsPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_user_compatibleUsers_index__["a" /* CompatibleUsersPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_dashboard_index__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_user_login_index__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_user_join_initial_index__["a" /* JoinInitialPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_user_join_questions_index__["a" /* JoinQuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_appUrl_index__["a" /* AppUrlPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_user_disapproved_index__["a" /* UserDisapprovedPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_appMaintenance_index__["a" /* AppMaintenancePage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_user_edit_questions_index__["a" /* EditUserQuestionsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_user_edit_photos_index__["a" /* EditUserPhotosPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_user_forgotPassword_checkEmail_index__["a" /* ForgotPasswordCheckEmailPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_user_forgotPassword_checkCode_index__["a" /* ForgotPasswordCheckCodePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_user_forgotPassword_newPassword_index__["a" /* ForgotPasswordNewPasswordPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_user_verifyEmail_checkEmail_index__["a" /* VerifyEmailCheckEmailPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_user_verifyEmail_checkCode_index__["a" /* VerifyEmailCheckCodePage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_user_join_initial_index__["a" /* JoinInitialPage */],
                __WEBPACK_IMPORTED_MODULE_63__shared_components_locationAutocomplete_index__["a" /* LocationAutocompleteComponent */],
                __WEBPACK_IMPORTED_MODULE_64__shared_components_customPage_index__["a" /* CustomPageComponent */],
                __WEBPACK_IMPORTED_MODULE_50__pages_dashboard_components_matchedUser_index__["a" /* MatchedUserPageComponent */],
                __WEBPACK_IMPORTED_MODULE_65__shared_components_flag_index__["a" /* FlagComponent */],
                __WEBPACK_IMPORTED_MODULE_57__pages_dashboard_components_search_components_searchFilter_index__["a" /* UserSearchFilterComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__["a" /* Facebook */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_keyboard__["a" /* Keyboard */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_transfer__["a" /* Transfer */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_file_path__["a" /* FilePath */],
                __WEBPACK_IMPORTED_MODULE_71__services_config_index__["a" /* ConfigService */],
                __WEBPACK_IMPORTED_MODULE_68__services_application_index__["a" /* ApplicationService */],
                __WEBPACK_IMPORTED_MODULE_70__services_auth_index__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_72__services_http_index__["a" /* SecureHttpService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_20_js_data__["DataStore"],
                    useFactory: __WEBPACK_IMPORTED_MODULE_73__services_api_factory__["a" /* apiFactory */],
                    deps: [
                        __WEBPACK_IMPORTED_MODULE_71__services_config_index__["a" /* ConfigService */],
                        __WEBPACK_IMPORTED_MODULE_70__services_auth_index__["a" /* AuthService */],
                        __WEBPACK_IMPORTED_MODULE_19_ng2_translate__["c" /* TranslateService */],
                        __WEBPACK_IMPORTED_MODULE_10_ionic_angular__["f" /* Events */],
                        __WEBPACK_IMPORTED_MODULE_81__services_http_errorHandler__["a" /* HttpErrorHandlerService */]
                    ]
                },
                __WEBPACK_IMPORTED_MODULE_74__services_api_utils__["a" /* ApiUtilsService */],
                __WEBPACK_IMPORTED_MODULE_72__services_http_index__["a" /* SecureHttpService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_76__services_questions_manager__["a" /* QuestionManager */],
                    useFactory: __WEBPACK_IMPORTED_MODULE_75__services_questions_factory__["a" /* questionManagerFactory */],
                    deps: [
                        __WEBPACK_IMPORTED_MODULE_10_ionic_angular__["m" /* ModalController */]
                    ]
                },
                __WEBPACK_IMPORTED_MODULE_82__services_questions_validators_index__["a" /* Validators */],
                __WEBPACK_IMPORTED_MODULE_83__services_questions_validators_userEmail__["a" /* UserEmailValidator */],
                __WEBPACK_IMPORTED_MODULE_84__services_questions_validators_username__["a" /* UserNameValidator */],
                __WEBPACK_IMPORTED_MODULE_85__services_questions_validators_require__["a" /* RequireValidator */],
                __WEBPACK_IMPORTED_MODULE_86__services_questions_validators_email__["a" /* EmailValidator */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_admob__["a" /* AdMob */],
                __WEBPACK_IMPORTED_MODULE_77__services_admob_index__["a" /* AdMobService */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_push__["a" /* Push */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_78__services_push_index__["a" /* PushNotificationsService */],
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_in_app_purchase__["a" /* InAppPurchase */],
                __WEBPACK_IMPORTED_MODULE_80__services_inapps_index__["a" /* InAppsService */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_photo_viewer__["a" /* PhotoViewer */],
                __WEBPACK_IMPORTED_MODULE_79__services_permissions_index__["a" /* PermissionsService */],
                __WEBPACK_IMPORTED_MODULE_81__services_http_errorHandler__["a" /* HttpErrorHandlerService */],
                __WEBPACK_IMPORTED_MODULE_90__services_serverEvents_index__["a" /* ServerEventsService */],
                __WEBPACK_IMPORTED_MODULE_91__services_serverEvents_channels_configs__["a" /* ConfigsChannelService */],
                __WEBPACK_IMPORTED_MODULE_92__services_serverEvents_channels_permissions__["a" /* PermissionsChannelService */],
                __WEBPACK_IMPORTED_MODULE_93__services_serverEvents_channels_conversations__["a" /* ConversationsChannelService */],
                __WEBPACK_IMPORTED_MODULE_94__services_serverEvents_channels_matchedUsers__["a" /* MatchedUsersChannelService */],
                __WEBPACK_IMPORTED_MODULE_95__services_serverEvents_channels_messages__["a" /* MessagesChannelService */],
                __WEBPACK_IMPORTED_MODULE_96__services_serverEvents_channels_guests__["a" /* GuestsChannelService */],
                __WEBPACK_IMPORTED_MODULE_97__services_serverEvents_channels_hotList__["a" /* HotListChannelService */],
                __WEBPACK_IMPORTED_MODULE_88__services_questions_validators_minLength__["a" /* MinLengthValidator */],
                __WEBPACK_IMPORTED_MODULE_89__services_questions_validators_maxLength__["a" /* MaxLengthValidator */],
                __WEBPACK_IMPORTED_MODULE_87__services_questions_validators_url__["a" /* UrlValidator */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_9__angular_core__["ErrorHandler"],
                    useClass: __WEBPACK_IMPORTED_MODULE_10_ionic_angular__["i" /* IonicErrorHandler */]
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_12_ng2_translate_ng2_translate__["a" /* MissingTranslationHandler */],
                    useClass: __WEBPACK_IMPORTED_MODULE_69__services_i18n_index__["a" /* CustomMissingTranslationHandler */]
                }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__profile_photos_index__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_user_edit_questions_index__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_user_edit_photos_index__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_messages_index__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__shared_animations_matchActions__ = __webpack_require__(571);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__shared_components_flag_index__ = __webpack_require__(324);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// services






// pages





// animations

// import shared components

var ProfileViewPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function ProfileViewPage(apiUtils, config, http, photoViewer, toast, modalController, actionSheetCtrl, events, translate, alert, application, nav, sanitizer, api, loading, auth, navParams, permissions) {
        var _this = this;
        this.apiUtils = apiUtils;
        this.config = config;
        this.http = http;
        this.photoViewer = photoViewer;
        this.toast = toast;
        this.modalController = modalController;
        this.actionSheetCtrl = actionSheetCtrl;
        this.events = events;
        this.translate = translate;
        this.alert = alert;
        this.application = application;
        this.nav = nav;
        this.sanitizer = sanitizer;
        this.api = api;
        this.loading = loading;
        this.auth = auth;
        this.navParams = navParams;
        this.permissions = permissions;
        this.slider = null;
        this.inappsPage = __WEBPACK_IMPORTED_MODULE_12__inapps_index__["a" /* InappsPage */];
        this.profilePhotosPage = __WEBPACK_IMPORTED_MODULE_13__profile_photos_index__["a" /* ProfilePhotosPage */];
        this.profilePhotosPageNavParams = {};
        this.editUserPhotosPage = __WEBPACK_IMPORTED_MODULE_15__pages_user_edit_photos_index__["a" /* EditUserPhotosPage */];
        this.trackedPhotos = [];
        this.userPhotos = [];
        this.userPhotosFetched = false;
        this.userPhotosCount = 0;
        this.isUserBlockStatusChanged = false;
        this.isUserBlocked = false;
        this.isUserBookmarked = false;
        this.isUserBookmarkStatusChanged = false;
        this.userLikeStatus = 'default';
        this.editUserQuestionsPage = __WEBPACK_IMPORTED_MODULE_14__pages_user_edit_questions_index__["a" /* EditUserQuestionsPage */];
        this.likeDelayHandler = null;
        this.likeDelay = 1000;
        this.pageWillLeave = false;
        this.photosLimit = this.api.get('configs', 'profilePhotosLimit').value;
        this.userId = this.navParams.get('userId');
        this.profilePhotosPageNavParams = {
            userId: this.userId
        };
        // -- init callbacks --//
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            // show permission denied slide
            if (_this.isViewAllowed && _this.user && !_this.isViewPhotoAllowed) {
                _this.slider.slideTo(1);
            }
            // user has not been loaded
            if ((_this.isViewAllowed && !_this.user) || (_this.isViewPhotoAllowed && !_this.userPhotosFetched)) {
                _this.loadUserData();
                return;
            }
            // user has been already loaded
            if (_this.isViewAllowed && _this.user) {
                _this.pageIsReady = true;
                return;
            }
        };
    }
    Object.defineProperty(ProfileViewPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Page will enter
     */
    ProfileViewPage.prototype.ionViewWillEnter = function () {
        this.pageIsReady = false;
        this.pageWillLeave = false;
        this.userPhotosFetched = false;
        // load user data
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
    };
    /**
     * Page will leave
     */
    ProfileViewPage.prototype.ionViewWillLeave = function () {
        this.pageWillLeave = true;
        if (this.isUserBlocked && this.isUserBlockStatusChanged) {
            this.events.publish('profileView:block', {
                userId: this.user.id
            });
        }
        if (this.isUserBookmarkStatusChanged) {
            this.events.publish('profileView:bookmarkUpdated', {
                userId: this.user.id
            });
        }
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
    };
    /**
     * Page did enter
     */
    ProfileViewPage.prototype.ionViewDidEnter = function () {
        this.loadUserData();
    };
    /**
     * View photo
     */
    ProfileViewPage.prototype.viewPhoto = function (url) {
        this.photoViewer.show(url);
    };
    /**
     * Photos slider did change
     */
    ProfileViewPage.prototype.photosSliderDidChange = function (slider) {
        // track action (photo view)
        if (!this.isProfileOwner) {
            if (slider.getActiveIndex()
                && slider.getActiveIndex() <= this.userPhotos.length
                && !this.trackedPhotos.includes(slider.getActiveIndex())) {
                // track action
                this.permissions.trackAction('photo', 'view');
                this.trackedPhotos.push(slider.getActiveIndex());
            }
        }
    };
    /**
     * Show photo actions
     */
    ProfileViewPage.prototype.showPhotoActions = function (photoId) {
        var _this = this;
        if (!this.isProfileOwner) {
            var actionSheet = this.actionSheetCtrl.create({
                buttons: [{
                        text: this.translate.instant('flag_photo'),
                        handler: function () {
                            var modal = _this.modalController.create(__WEBPACK_IMPORTED_MODULE_18__shared_components_flag_index__["a" /* FlagComponent */], {
                                identityId: photoId,
                                entityType: 'photo_comments'
                            });
                            modal.onDidDismiss(function (status) {
                                if (status.reported) {
                                    var toast = _this.toast.create({
                                        message: _this.translate.instant('photo_reported'),
                                        closeButtonText: _this.translate.instant('ok'),
                                        showCloseButton: true,
                                        duration: _this.toastDuration
                                    });
                                    toast.present();
                                }
                            });
                            modal.present();
                        }
                    }]
            });
            actionSheet.present();
        }
    };
    /**
     * Show profile actions
     */
    ProfileViewPage.prototype.showProfileActions = function () {
        var _this = this;
        if (!this.isProfileOwner) {
            var actionSheet = this.actionSheetCtrl.create({
                buttons: [{
                        text: this.translate.instant('flag_profile'),
                        handler: function () {
                            var modal = _this.modalController.create(__WEBPACK_IMPORTED_MODULE_18__shared_components_flag_index__["a" /* FlagComponent */], {
                                identityId: _this.user.id,
                                entityType: 'user_join'
                            });
                            modal.onDidDismiss(function (status) {
                                if (status.reported) {
                                    var toast = _this.toast.create({
                                        message: _this.translate.instant('profile_reported'),
                                        closeButtonText: _this.translate.instant('ok'),
                                        showCloseButton: true,
                                        duration: _this.toastDuration
                                    });
                                    toast.present();
                                }
                            });
                            modal.present();
                        }
                    }, {
                        text: this.isUserBlocked ? this.translate.instant('unblock_profile') : this.translate.instant('block_profile'),
                        handler: function () {
                            // unblock profile
                            if (_this.isUserBlocked) {
                                _this.unblockUser();
                                return;
                            }
                            // block profile
                            var confirm = _this.alert.create({
                                message: _this.translate.instant('block_profile_confirmation'),
                                buttons: [
                                    {
                                        text: _this.translate.instant('cancel')
                                    },
                                    {
                                        text: _this.translate.instant('block_profile'),
                                        handler: function () {
                                            _this.blockUser();
                                        }
                                    }
                                ]
                            });
                            confirm.present();
                        }
                    }]
            });
            actionSheet.present();
        }
    };
    /**
     * Bookmark user
     */
    ProfileViewPage.prototype.bookmarkUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast_1, toast, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.isUserBookmarked) return [3 /*break*/, 2];
                        this.isUserBookmarked = false;
                        this.isUserBookmarkStatusChanged = true;
                        toast_1 = this.toast.create({
                            message: this.translate.instant('profile_removed_from_bookmarks'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast_1.present();
                        // delete bookmark
                        return [4 /*yield*/, this.http.delete(this.config.getApiUrl() + "/bookmarks/" + this.user.id + "/")
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 1:
                        // delete bookmark
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        // bookmark profile
                        this.isUserBookmarked = true;
                        this.isUserBookmarkStatusChanged = true;
                        toast = this.toast.create({
                            message: this.translate.instant('profile_added_to_bookmarks'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        // create a new bookmark
                        return [4 /*yield*/, this.http.post(this.config.getApiUrl() + "/bookmarks/", {
                                userId: this.user.id
                            }).map(function (res) { return res.json(); }).toPromise()];
                    case 3:
                        // create a new bookmark
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Like user
     */
    ProfileViewPage.prototype.likeUser = function () {
        var _this = this;
        // show a confirmation window
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            var confirm_1 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', { name: this.user.realName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('like'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                            _this.sendLikeRequest();
                        }
                    }
                ]
            });
            confirm_1.present();
            return;
        }
        this.sendLikeRequest();
    };
    /**
     * Dislike user
     */
    ProfileViewPage.prototype.dislikeUser = function () {
        var _this = this;
        if (this.userLikeStatus == 'like') {
            return;
        }
        // show a confirmation window
        if (!Boolean(this.application.getAppSetting('user_dislike_pressed', false))) {
            var confirm_2 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('dislike_confirmation', { name: this.user.realName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_dislike_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('dislike'),
                        handler: function () {
                            _this.application.setAppSetting('user_dislike_pressed', true);
                            _this.sendDislikeRequest();
                        }
                    }
                ]
            });
            confirm_2.present();
            return;
        }
        this.sendDislikeRequest();
    };
    /**
     * Get compatibility background
     */
    ProfileViewPage.prototype.getCompatibilityBackground = function (match) {
        if (match === void 0) { match = 0; }
        var background = "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) " + match + "%, #d8d8d8 " + match + "%)";
        return this.sanitizer.bypassSecurityTrustStyle(background);
    };
    /**
     * Return back
     */
    ProfileViewPage.prototype.returnBack = function () {
        this.nav.pop();
    };
    /**
     * Show chat
     */
    ProfileViewPage.prototype.showChat = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_16__pages_messages_index__["a" /* MessagesPage */], {
            userId: this.user.id
        });
    };
    Object.defineProperty(ProfileViewPage.prototype, "isViewAllowed", {
        /**
         * Is view allowed
         */
        get: function () {
            return this.isProfileOwner || this.permissions.isActionAllowed('base_view_profile');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileViewPage.prototype, "isViewPhotoAllowed", {
        /**
         * Is view photo allowed
         */
        get: function () {
            return this.isProfileOwner || this.permissions.isActionAllowed('photo_view');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileViewPage.prototype, "isProfileOwner", {
        /**
         * Is profile owner
         */
        get: function () {
            return this.auth.getUserId() == this.userId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get user relations
     */
    ProfileViewPage.prototype.getUserRelations = function () {
        if (this.isProfileOwner) {
            this.userPhotosFetched = true;
            return [
                'avatar',
                'photos',
                'viewQuestions',
                'permissions',
                'memberships'
            ];
        }
        var relations = [];
        relations.push('avatar');
        relations.push('compatibility');
        relations.push('distance');
        relations.push('matchActions');
        relations.push('viewQuestions');
        relations.push('blocks');
        relations.push('bookmarks');
        if (this.isViewPhotoAllowed) {
            relations.push('photos');
            this.userPhotosFetched = true;
        }
        return relations;
    };
    /**
     * Send dislike request
     */
    ProfileViewPage.prototype.sendDislikeRequest = function () {
        var _this = this;
        this.events.publish('profileView:dislike', {
            userId: this.user.id
        });
        // create a new dislike
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.getMapper('matchActions').create({
                                userId: this.user.id,
                                type: 'dislike'
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, this.likeDelay);
        this.returnBack();
    };
    /**
     * Send like request
     */
    ProfileViewPage.prototype.sendLikeRequest = function () {
        var _this = this;
        this.userLikeStatus = this.userLikeStatus == 'like' ? 'default' : 'like';
        this.events.publish('profileView:like', {
            userId: this.user.id,
            type: this.userLikeStatus
        });
        if (this.likeDelayHandler) {
            clearTimeout(this.likeDelayHandler);
        }
        // delayed action
        this.likeDelayHandler = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.likeDelayHandler = null;
                        if (!(this.userLikeStatus == 'default')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.getMapper('matchActions').destroy(this.user.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: 
                    // create a new like
                    return [4 /*yield*/, this.api.getMapper('matchActions').create({
                            userId: this.user.id,
                            type: 'like'
                        })];
                    case 3:
                        // create a new like
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); }, this.likeDelay);
    };
    /**
     * Load user data
     */
    ProfileViewPage.prototype.loadUserData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, _a, _b, e_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        loader = this.loading.create();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _c.sent();
                        this.userPhotos = [];
                        this.pageIsReady = false;
                        if (!this.isViewAllowed) return [3 /*break*/, 7];
                        if (!this.isProfileOwner) return [3 /*break*/, 4];
                        this.apiUtils.clearUserData(this.userId, true);
                        _a = this;
                        return [4 /*yield*/, this.api.find('users', this.userId, {
                                params: {
                                    with: this.getUserRelations()
                                }
                            })];
                    case 3:
                        _a.user = _c.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        _b = this;
                        return [4 /*yield*/, this.api.getMapper('users').find(this.userId, {
                                params: {
                                    with: this.getUserRelations()
                                }
                            })];
                    case 5:
                        _b.user = _c.sent();
                        this.userLikeStatus = this.user.matchActions.type;
                        this.isUserBlocked = this.user.blocks.isBlocked;
                        this.isUserBookmarked = this.user.bookmarks.length > 0;
                        _c.label = 6;
                    case 6:
                        this.pageIsReady = true;
                        if (this.user.photos) {
                            // process photos
                            this.user.photos.forEach(function (photo) {
                                if (_this.isProfileOwner || photo.approved) {
                                    if (_this.userPhotos.length < _this.photosLimit) {
                                        _this.userPhotos.push(photo);
                                    }
                                    _this.userPhotosCount++;
                                }
                            });
                        }
                        _c.label = 7;
                    case 7:
                        loader.dismiss();
                        return [3 /*break*/, 9];
                    case 8:
                        e_4 = _c.sent();
                        loader.dismiss();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unblock user
     */
    ProfileViewPage.prototype.unblockUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.isUserBlocked = false;
                        toast = this.toast.create({
                            message: this.translate.instant('profile_unblocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.isUserBlockStatusChanged = true;
                        return [4 /*yield*/, this.api.getMapper('blocks').destroy(this.user.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Block user
     */
    ProfileViewPage.prototype.blockUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.isUserBlocked = true;
                        toast = this.toast.create({
                            message: this.translate.instant('profile_blocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.isUserBlockStatusChanged = true;
                        return [4 /*yield*/, this.api.getMapper('blocks').create({
                                userId: this.user.id
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('photosSlider'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* Slides */])
    ], ProfileViewPage.prototype, "slider", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ProfileViewPage.prototype, "activeComponent", void 0);
    ProfileViewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'profile-view',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\profile\view\index.html"*/'<ion-content class="sk-profile-view-page">\n\n    <!-- profile view is not allowed   -->\n    <div class="sk-permission-denied" *ngIf="!isViewAllowed">\n        <img src="./assets/img/no_permission.svg" alt="">\n        <h2>{{ \'permission_denied_header\' | translate }}</h2>\n        <span>{{ \'permission_denied_alert_message\' | translate }}</span>\n        <button ion-button outline round [navPush]="inappsPage">{{ \'upgrade\' | translate }}</button>\n        <button ion-button outline round (click)="returnBack()">{{ \'back\' | translate }}</button>\n    </div>\n\n    <div  class="{{ isProfileOwner ? \'\' : \'sk-not-profile-owner\' }}" *ngIf="isViewAllowed && pageIsReady">\n\n        <!-- slider wrapper -->\n        <div class="sk-slider-wrap">\n            <!-- back -->\n            <div class="sk-slider-back" (tap)="returnBack()">\n                <ion-icon name="ios-arrow-up"></ion-icon>\n            </div>\n\n            <!-- edit profile -->\n            <button *ngIf="isProfileOwner" type="button" ion-button block round class="sk-edit-myprofile" [navPush]="editUserQuestionsPage">{{ \'edit_profile\' | translate }}</button>\n\n            <!-- avatar and photos -->\n            <ion-slides #photosSlider [pager]="true" [paginationType]="bullets" class="profile-slider" (ionSlideDidChange)="photosSliderDidChange($event)">\n                <ion-slide>\n                    <user-avatar *ngIf="!isProfileOwner" [useBigAvatar]="true" [url]="user.avatar?.bigUrl" [isAvatarActive]="user.avatar?.active" (tap)="viewPhoto(user.avatar?.bigUrl)" (press)="showProfileActions()"></user-avatar>\n                    <user-avatar *ngIf="isProfileOwner"  [useBigAvatar]="true" [url]="user.avatar?.pendingBigUrl" (tap)="viewPhoto(user.avatar?.pendingBigUrl)" (press)="showProfileActions()"></user-avatar>\n                    <div *ngIf="isProfileOwner && user.avatar?.id && !user.avatar?.active" class="sk-photo-pending" (tap)="viewPhoto(user.avatar?.pendingBigUrl)" (press)="showProfileActions()">\n                        <img src="./assets/img/ic_pending.svg" alt="">\n                    </div>\n                </ion-slide>\n\n                <ng-container *ngIf="!isViewPhotoAllowed">\n                    <ion-slide>\n                        <div class="sk-permission-denied">\n                            <img src="./assets/img/no_permission.svg" alt="">\n                            <h2>{{ \'permission_denied_header\' | translate }}</h2>\n                            <button ion-button outline round [navPush]="purchasesPage">{{ \'upgrade\' | translate }}</button>\n                        </div>\n                    </ion-slide>\n                </ng-container>\n\n                <ng-container *ngIf="isViewPhotoAllowed">\n                    <ion-slide *ngFor="let photo of userPhotos">\n                        <img src="{{photo.bigUrl}}" alt="" (press)="showPhotoActions(photo.id)" (tap)="viewPhoto(photo.bigUrl)" />\n                        <div *ngIf="isProfileOwner && !photo.approved" class="sk-photo-pending" (press)="showPhotoActions(photo.id)" (tap)="viewPhoto(photo.bigUrl)">\n                            <img src="./assets/img/ic_pending.svg" alt="">\n                        </div>\n                    </ion-slide>\n                </ng-container>\n\n                <ion-slide *ngIf="isViewPhotoAllowed && userPhotosCount > photosLimit || isProfileOwner">\n                    <div class="sk-view-all-photos">\n                        <button *ngIf="!isProfileOwner" [navPush]="profilePhotosPage" [navParams]="profilePhotosPageNavParams" type="button" ion-button block round icon-right>{{ \'view_all_photos\' | translate }}<ion-icon name="md-images"></ion-icon></button>\n                        <button *ngIf="isProfileOwner" [navPush]="editUserPhotosPage" type="button" ion-button block round icon-right>{{ \'manage_photos\' | translate }}<ion-icon name="md-images"></ion-icon></button>\n                    </div>\n                </ion-slide>\n            </ion-slides>\n        </div>\n\n        <div class="{{user.isOnline && !isProfileOwner ? \'sk-profile-top sk-user-online\' : \'sk-profile-top\'}}">\n            <!-- base profile info -->\n            <div class="sk-user-info">\n                <span class="sk-name">{{user.realName}}<span *ngIf="user.age">, {{user.age}}</span></span>\n                <span class="sk-info" *ngIf="!isProfileOwner && user.distance.distance">\n                    <span *ngIf="user.distance.unit == \'km\'">{{ \'km_away\' | translate:{value: user.distance.distance} }}</span>\n                    <span *ngIf="user.distance.unit == \'miles\'">{{ \'miles_away\' | translate:{value: user.distance.distance} }}</span>\n                </span>\n            </div>\n            <div class="sk-user-cnx" *ngIf="!isProfileOwner" (click)="showProfileActions()">\n                <ion-icon name="md-more"></ion-icon>\n            </div>\n            <!-- compatibility -->\n        </div>\n        <div class="sk-profile-comp" *ngIf="!isProfileOwner">\n            <span>{{ \'compatibility\' | translate }}</span>\n            <div class="sk-comp-bar">\n                <div class="sk-comp-bar-mask" [style.background]="getCompatibilityBackground(user.compatibility.match)">\n                    <span>{{user.compatibility.match ? user.compatibility.match : 0}}%</span>\n                </div>\n            </div>\n        </div>\n        <!-- questions -->\n        <div class="sk-profile-bottom">\n            <ng-container *ngFor="let sectionData of user.viewQuestions">\n                <div class="sk-profile-section" *ngFor="let question of sectionData.items">\n                    <div class="sk-section-head">\n                        {{question.label}}\n                    </div>\n                    <p class="sk-section-text">\n                        {{question.value}}\n                    </p>\n                </div>\n            </ng-container>\n        </div>\n    </div>\n</ion-content>\n\n<ion-footer no-border class="{{ !pageWillLeave ? \'sk-profile-footer\' : \'sk-profile-footer-disabled\' }}" *ngIf="isViewAllowed && pageIsReady && !isProfileOwner">\n    <ion-toolbar color="transparent">\n        <div class="sk-profile-actions">\n            <button class="sk-messages" (click)="showChat()"></button>\n            <button class="sk-dislike" (tap)="dislikeUser()" [@dislike]="userLikeStatus"></button>\n            <button class="sk-like" (tap)="likeUser()" [@like]="userLikeStatus"></button>\n            <button class="{{ isUserBookmarked ? \'sk-bookmarked\' : \'sk-bookmark\' }}" (tap)="bookmarkUser()"></button>\n        </div>\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\profile\view\index.html"*/,
            animations: [
                __WEBPACK_IMPORTED_MODULE_17__shared_animations_matchActions__["b" /* like */],
                __WEBPACK_IMPORTED_MODULE_17__shared_animations_matchActions__["a" /* dislike */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_11__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_photo_viewer__["a" /* PhotoViewer */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_8__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_7__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_6__services_permissions_index__["a" /* PermissionsService */]])
    ], ProfileViewPage);
    return ProfileViewPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 541:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_keyboard__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__ = __webpack_require__(543);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_globalization__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_user_login_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_appUrl_index__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_appMaintenance_index__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_config_index__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








// import pages




// import services



var MyApp = /** @class */ (function () {
    /**
     * Constructor
     */
    function MyApp(geolocation, application, keyboard, platform, auth, api, config, globalization, statusBar, splashScreen) {
        this.geolocation = geolocation;
        this.application = application;
        this.keyboard = keyboard;
        this.platform = platform;
        this.auth = auth;
        this.api = api;
        this.config = config;
        this.globalization = globalization;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.initializeApp();
    }
    /**
     * Initialize app
     */
    MyApp.prototype.initializeApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var lang, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.platform.ready()];
                    case 1:
                        _a.sent();
                        // configure application
                        this.statusBar.styleDefault();
                        this.keyboard.disableScroll(false);
                        this.keyboard.hideKeyboardAccessoryBar(true);
                        // check token expiration time
                        this.nav.viewWillEnter.subscribe(function () {
                            if (_this.auth.getUserId() && !_this.auth.isAuthenticated()) {
                                _this.auth.logout();
                                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_9__pages_user_login_index__["a" /* LoginPage */]);
                            }
                        });
                        if (!this.platform.is('cordova')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.globalization.getPreferredLanguage()];
                    case 2:
                        lang = _a.sent();
                        this.application.setAppLanguage(lang.value.split('-')[0]);
                        // get current location
                        this.geolocation.getCurrentPosition().then(function (location) {
                            _this.application.setAppLocation(location.coords.latitude, location.coords.longitude);
                        }).catch(function () {
                        });
                        // application url is not defined yet
                        if (!this.config.getApiUrl()) {
                            this.splashScreen.hide();
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_appUrl_index__["a" /* AppUrlPage */]);
                            return [2 /*return*/];
                        }
                        this.loadDependencies();
                        return [2 /*return*/];
                    case 3:
                        // application url is not defined yet
                        if (!this.config.getApiUrl()) {
                            this.splashScreen.hide();
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_appUrl_index__["a" /* AppUrlPage */]);
                            return [2 /*return*/];
                        }
                        this.loadDependencies();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load dependencies
     */
    MyApp.prototype.loadDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.application.loadDependencies()];
                    case 1:
                        _a.sent();
                        this.splashScreen.hide();
                        // redirect to the page
                        if (this.api.get('configs', 'maintenanceMode').value) {
                            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__pages_appMaintenance_index__["a" /* AppMaintenancePage */]);
                            return [2 /*return*/];
                        }
                        this.nav.setRoot(!this.auth.isAuthenticated() ? __WEBPACK_IMPORTED_MODULE_9__pages_user_login_index__["a" /* LoginPage */] : __WEBPACK_IMPORTED_MODULE_8__pages_dashboard_index__["a" /* DashboardPage */]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"G:\attheclubb\application\src\app\app.html"*/'<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"G:\attheclubb\application\src\app\app.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_globalization__["a" /* Globalization */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__["a" /* Geolocation */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_12__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["q" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_13__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_6_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_14__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_globalization__["a" /* Globalization */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 554:
/***/ (function(module, exports) {

module.exports = {"id":"com.at.theclubb","version":"0.0.1","name":"At The Club APP","description":"At The Club mobile app","authorEmail":"info@attheclub.com","authorName":"attheclub","authorUrl":"https://attheclubb.com","serverUrl":"https://attheclubb.com","facebookAppId":"156591851548438","googleProjectNumber":"1068606795665","play_store_key":"","connectionTimeout":"40000"}

/***/ }),

/***/ 564:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionTextOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuestionTextParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TextQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuestionTextOptions = /** @class */ (function (_super) {
    __extends(QuestionTextOptions, _super);
    function QuestionTextOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionTextOptions;
}(__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */]));

;
var QuestionTextParams = /** @class */ (function (_super) {
    __extends(QuestionTextParams, _super);
    function QuestionTextParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionTextParams;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* QuestionBaseParams */]));

;
var TextQuestion = /** @class */ (function (_super) {
    __extends(TextQuestion, _super);
    /**
     * Constructor
     */
    function TextQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'text';
        _this.stackedInput = false;
        _this.type = options['type'] || '';
        if (params && params.stacked) {
            _this.stackedInput = true;
        }
        return _this;
    }
    /**
     * Get type
     */
    TextQuestion.prototype.getType = function () {
        return this.type ? this.type : this.controlType;
    };
    TextQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [QuestionTextOptions, QuestionTextParams])
    ], TextQuestion);
    return TextQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=text.js.map

/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionSelectOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuestionSelectParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SelectQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuestionSelectOptions = /** @class */ (function (_super) {
    __extends(QuestionSelectOptions, _super);
    function QuestionSelectOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionSelectOptions;
}(__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */]));

;
var QuestionSelectParams = /** @class */ (function (_super) {
    __extends(QuestionSelectParams, _super);
    function QuestionSelectParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionSelectParams;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* QuestionBaseParams */]));

;
var SelectQuestion = /** @class */ (function (_super) {
    __extends(SelectQuestion, _super);
    /**
     * Constructor
     */
    function SelectQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'select';
        _this.hideEmptyValue = false;
        _this.multiple = options['multiple'] || false;
        // init extra params
        if (params) {
            params.hideEmptyValue
                ? _this.hideEmptyValue = params.hideEmptyValue
                : false;
        }
        return _this;
    }
    SelectQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [QuestionSelectOptions, QuestionSelectParams])
    ], SelectQuestion);
    return SelectQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=select.js.map

/***/ }),

/***/ 566:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextareaQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TextareaQuestion = /** @class */ (function (_super) {
    __extends(TextareaQuestion, _super);
    function TextareaQuestion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.controlType = 'textarea';
        return _this;
    }
    TextareaQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], TextareaQuestion);
    return TextareaQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=textarea.js.map

/***/ }),

/***/ 567:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionRangeParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RangeQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuestionRangeParams = /** @class */ (function (_super) {
    __extends(QuestionRangeParams, _super);
    function QuestionRangeParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionRangeParams;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* QuestionBaseParams */]));

;
var RangeQuestion = /** @class */ (function (_super) {
    __extends(RangeQuestion, _super);
    /**
     * Constructor
     */
    function RangeQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'range';
        _this.min = 0;
        _this.max = 100;
        // init extra prams
        if (params) {
            params.min
                ? _this.min = params.min
                : null;
            params.max
                ? _this.max = params.max
                : null;
        }
        _this.value = Object.assign({}, options.value);
        return _this;
    }
    /**
     * On change range
     */
    RangeQuestion.prototype.onChangeRange = function () {
        this.value = this.controlView.value;
    };
    RangeQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */], QuestionRangeParams])
    ], RangeQuestion);
    return RangeQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=range.js.map

/***/ }),

/***/ 568:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckboxQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var CheckboxQuestion = /** @class */ (function (_super) {
    __extends(CheckboxQuestion, _super);
    function CheckboxQuestion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.controlType = 'checkbox';
        return _this;
    }
    CheckboxQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], CheckboxQuestion);
    return CheckboxQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__base__["a" /* QuestionBase */]));

//# sourceMappingURL=checkbox.js.map

/***/ }),

/***/ 569:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateRangeQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__date__ = __webpack_require__(297);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DateRangeQuestion = /** @class */ (function (_super) {
    __extends(DateRangeQuestion, _super);
    /**
     * Constructor
     */
    function DateRangeQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'date_range';
        _this.questionChanged = false;
        _this.value = Object.assign({}, options.value);
        return _this;
    }
    /**
     * Update date
     */
    DateRangeQuestion.prototype.update = function () {
        if (!this.questionChanged) {
            this.controlView.markAsDirty();
            this.controlView.markAsTouched();
            this.questionChanged = true;
        }
        // trigger manually about update in the question
        this.controlView.updateValueAndValidity();
    };
    DateRangeQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__base__["b" /* QuestionBaseOptions */], __WEBPACK_IMPORTED_MODULE_2__date__["b" /* QuestionDateParams */]])
    ], DateRangeQuestion);
    return DateRangeQuestion;
}(__WEBPACK_IMPORTED_MODULE_2__date__["a" /* DateQuestion */]));

//# sourceMappingURL=dateRange.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiUtilsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ApiUtilsService = /** @class */ (function () {
    /**
     * Constructor
     */
    function ApiUtilsService(api) {
        this.api = api;
    }
    /**
     * Clear user data
     */
    ApiUtilsService.prototype.clearUserData = function (userId, force) {
        if (force === void 0) { force = false; }
        var cacheLifeTime = parseInt(this.api.get('configs', 'userDataCacheTime').value);
        if (force || cacheLifeTime <= 0) {
            this.forceClearUserData(userId);
            this.setUserCacheData(userId, cacheLifeTime);
            return;
        }
        var userCache = this.api.get('usersCache', userId);
        if (userCache) {
            // check expiration time
            if (userCache.willExpire <= Math.floor(Date.now() / 1000)) {
                this.forceClearUserData(userId);
                this.setUserCacheData(userId, cacheLifeTime);
            }
            return;
        }
        this.setUserCacheData(userId, cacheLifeTime);
    };
    /**
     * Set user cache data
     */
    ApiUtilsService.prototype.setUserCacheData = function (userId, cacheLifeTime) {
        this.api.remove('usersCache', userId);
        this.api.add('usersCache', {
            id: userId,
            willExpire: Math.floor(Date.now() / 1000) + cacheLifeTime
        });
    };
    /**
     * Force clear user data
     */
    ApiUtilsService.prototype.forceClearUserData = function (userId) {
        this.api.removeAll('permissions', { userId: userId });
        this.api.removeAll('photos', { userId: userId });
        this.api.removeAll('viewQuestions', { userId: userId });
        this.api.removeAll('searchUsers', { userId: userId });
        this.api.removeAll('avatars', { userId: userId });
        this.api.removeAll('matchActions', { userId: userId });
        this.api.removeAll('compatibilities', { userId: userId });
        this.api.removeAll('blocks', { userId: userId });
        this.api.removeAll('memberships', { userId: userId });
        this.api.remove('users', userId);
    };
    ApiUtilsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]])
    ], ApiUtilsService);
    return ApiUtilsService;
}());

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 570:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuestionExtendedGoogleMapLocationParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExtendedGoogleMapLocationQuestion; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__googlemapLocation__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(40);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QuestionExtendedGoogleMapLocationParams = /** @class */ (function (_super) {
    __extends(QuestionExtendedGoogleMapLocationParams, _super);
    function QuestionExtendedGoogleMapLocationParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionExtendedGoogleMapLocationParams;
}(__WEBPACK_IMPORTED_MODULE_2__base__["c" /* QuestionBaseParams */]));

;
var ExtendedGoogleMapLocationQuestion = /** @class */ (function (_super) {
    __extends(ExtendedGoogleMapLocationQuestion, _super);
    /**
     * Constructor
     */
    function ExtendedGoogleMapLocationQuestion(options, params) {
        var _this = _super.call(this, options, params) || this;
        _this.controlType = 'extended_googlemap_location';
        _this.min = 5;
        _this.max = 100;
        _this.step = 10;
        _this.unit = 'miles';
        // init extra prams
        if (params) {
            params.min
                ? _this.min = params.min
                : null;
            params.max
                ? _this.max = params.max
                : null;
            params.step
                ? _this.step = params.step
                : null;
            params.unit
                ? _this.unit = params.unit
                : null;
        }
        _this.value = Object.assign({}, options.value);
        return _this;
    }
    /**
     * Get value
     */
    ExtendedGoogleMapLocationQuestion.prototype.getValue = function () {
        return this.value.location;
    };
    /**
     * Set value
     */
    ExtendedGoogleMapLocationQuestion.prototype.setValue = function (location) {
        this.value.location = location;
        this.controlView.setValue(this.value);
    };
    ExtendedGoogleMapLocationQuestion = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__base__["b" /* QuestionBaseOptions */], QuestionExtendedGoogleMapLocationParams])
    ], ExtendedGoogleMapLocationQuestion);
    return ExtendedGoogleMapLocationQuestion;
}(__WEBPACK_IMPORTED_MODULE_1__googlemapLocation__["a" /* GoogleMapLocationQuestion */]));

//# sourceMappingURL=extendedGooglemapLocation.js.map

/***/ }),

/***/ 571:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dislike; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return like; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(108);

var dislike = Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["i" /* trigger */])('dislike', [
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["f" /* state */])('default', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(1)' })),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["f" /* state */])('like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ opacity: 0.5, transform: 'scale(0.8)' })),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('void => like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('0')),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('* => default', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('.5s linear')),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('* => like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('.5s linear', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["d" /* keyframes */])([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ opacity: 1, transform: 'scale(1)', offset: 0 }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(0.4)', offset: 0.5 }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(0.8)', offset: 1 })
    ])))
]);
var like = Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["i" /* trigger */])('like', [
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["f" /* state */])('default', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(1)' })),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["f" /* state */])('like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(1.2)' })),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('void => like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('0')),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('* => default', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('.5s linear')),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["h" /* transition */])('* => like', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["c" /* animate */])('.5s linear', Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["d" /* keyframes */])([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ opacity: 1, transform: 'scale(1)', offset: 0 }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(1.4)', offset: 0.5 }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["g" /* style */])({ transform: 'scale(1.2)', offset: 1 })
    ])))
]);
//# sourceMappingURL=matchActions.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InappsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var InappsPage = /** @class */ (function () {
    function InappsPage() {
        this.targetPage = 'Memberships'; // id
    }
    /**
     * Select tab
     */
    InappsPage.prototype.select = function (index) {
        this.slider.slideTo(index);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('inappsSlider'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* Slides */])
    ], InappsPage.prototype, "slider", void 0);
    InappsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'inapps',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\inapps\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{ \'memberships_and_credits\' | translate }}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-memberships">\n\n    <ion-segment [(ngModel)]="targetPage">\n        <ion-segment-button value="Memberships">\n            {{ \'memberships\' | translate }}\n        </ion-segment-button>\n        <ion-segment-button value="Credits">\n            {{ \'credits\' | translate }}\n        </ion-segment-button>\n    </ion-segment>\n\n\n    <div class="sk-memberships-segment" [ngSwitch]="targetPage">\n        <div *ngSwitchCase="\'Memberships\'">\n            <memberships></memberships>\n        </div>\n\n        <div class="sk-credits-segment" *ngSwitchCase="\'Credits\'">\n            <credits></credits>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\inapps\index.html"*/,
            providers: []
        })
    ], InappsPage);
    return InappsPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 335,
	"./af.js": 335,
	"./ar": 336,
	"./ar-dz": 337,
	"./ar-dz.js": 337,
	"./ar-kw": 338,
	"./ar-kw.js": 338,
	"./ar-ly": 339,
	"./ar-ly.js": 339,
	"./ar-ma": 340,
	"./ar-ma.js": 340,
	"./ar-sa": 341,
	"./ar-sa.js": 341,
	"./ar-tn": 342,
	"./ar-tn.js": 342,
	"./ar.js": 336,
	"./az": 343,
	"./az.js": 343,
	"./be": 344,
	"./be.js": 344,
	"./bg": 345,
	"./bg.js": 345,
	"./bm": 346,
	"./bm.js": 346,
	"./bn": 347,
	"./bn.js": 347,
	"./bo": 348,
	"./bo.js": 348,
	"./br": 349,
	"./br.js": 349,
	"./bs": 350,
	"./bs.js": 350,
	"./ca": 351,
	"./ca.js": 351,
	"./cs": 352,
	"./cs.js": 352,
	"./cv": 353,
	"./cv.js": 353,
	"./cy": 354,
	"./cy.js": 354,
	"./da": 355,
	"./da.js": 355,
	"./de": 356,
	"./de-at": 357,
	"./de-at.js": 357,
	"./de-ch": 358,
	"./de-ch.js": 358,
	"./de.js": 356,
	"./dv": 359,
	"./dv.js": 359,
	"./el": 360,
	"./el.js": 360,
	"./en-au": 361,
	"./en-au.js": 361,
	"./en-ca": 362,
	"./en-ca.js": 362,
	"./en-gb": 363,
	"./en-gb.js": 363,
	"./en-ie": 364,
	"./en-ie.js": 364,
	"./en-nz": 365,
	"./en-nz.js": 365,
	"./eo": 366,
	"./eo.js": 366,
	"./es": 367,
	"./es-do": 368,
	"./es-do.js": 368,
	"./es-us": 369,
	"./es-us.js": 369,
	"./es.js": 367,
	"./et": 370,
	"./et.js": 370,
	"./eu": 371,
	"./eu.js": 371,
	"./fa": 372,
	"./fa.js": 372,
	"./fi": 373,
	"./fi.js": 373,
	"./fo": 374,
	"./fo.js": 374,
	"./fr": 375,
	"./fr-ca": 376,
	"./fr-ca.js": 376,
	"./fr-ch": 377,
	"./fr-ch.js": 377,
	"./fr.js": 375,
	"./fy": 378,
	"./fy.js": 378,
	"./gd": 379,
	"./gd.js": 379,
	"./gl": 380,
	"./gl.js": 380,
	"./gom-latn": 381,
	"./gom-latn.js": 381,
	"./gu": 382,
	"./gu.js": 382,
	"./he": 383,
	"./he.js": 383,
	"./hi": 384,
	"./hi.js": 384,
	"./hr": 385,
	"./hr.js": 385,
	"./hu": 386,
	"./hu.js": 386,
	"./hy-am": 387,
	"./hy-am.js": 387,
	"./id": 388,
	"./id.js": 388,
	"./is": 389,
	"./is.js": 389,
	"./it": 390,
	"./it.js": 390,
	"./ja": 391,
	"./ja.js": 391,
	"./jv": 392,
	"./jv.js": 392,
	"./ka": 393,
	"./ka.js": 393,
	"./kk": 394,
	"./kk.js": 394,
	"./km": 395,
	"./km.js": 395,
	"./kn": 396,
	"./kn.js": 396,
	"./ko": 397,
	"./ko.js": 397,
	"./ky": 398,
	"./ky.js": 398,
	"./lb": 399,
	"./lb.js": 399,
	"./lo": 400,
	"./lo.js": 400,
	"./lt": 401,
	"./lt.js": 401,
	"./lv": 402,
	"./lv.js": 402,
	"./me": 403,
	"./me.js": 403,
	"./mi": 404,
	"./mi.js": 404,
	"./mk": 405,
	"./mk.js": 405,
	"./ml": 406,
	"./ml.js": 406,
	"./mr": 407,
	"./mr.js": 407,
	"./ms": 408,
	"./ms-my": 409,
	"./ms-my.js": 409,
	"./ms.js": 408,
	"./mt": 410,
	"./mt.js": 410,
	"./my": 411,
	"./my.js": 411,
	"./nb": 412,
	"./nb.js": 412,
	"./ne": 413,
	"./ne.js": 413,
	"./nl": 414,
	"./nl-be": 415,
	"./nl-be.js": 415,
	"./nl.js": 414,
	"./nn": 416,
	"./nn.js": 416,
	"./pa-in": 417,
	"./pa-in.js": 417,
	"./pl": 418,
	"./pl.js": 418,
	"./pt": 419,
	"./pt-br": 420,
	"./pt-br.js": 420,
	"./pt.js": 419,
	"./ro": 421,
	"./ro.js": 421,
	"./ru": 422,
	"./ru.js": 422,
	"./sd": 423,
	"./sd.js": 423,
	"./se": 424,
	"./se.js": 424,
	"./si": 425,
	"./si.js": 425,
	"./sk": 426,
	"./sk.js": 426,
	"./sl": 427,
	"./sl.js": 427,
	"./sq": 428,
	"./sq.js": 428,
	"./sr": 429,
	"./sr-cyrl": 430,
	"./sr-cyrl.js": 430,
	"./sr.js": 429,
	"./ss": 431,
	"./ss.js": 431,
	"./sv": 432,
	"./sv.js": 432,
	"./sw": 433,
	"./sw.js": 433,
	"./ta": 434,
	"./ta.js": 434,
	"./te": 435,
	"./te.js": 435,
	"./tet": 436,
	"./tet.js": 436,
	"./th": 437,
	"./th.js": 437,
	"./tl-ph": 438,
	"./tl-ph.js": 438,
	"./tlh": 439,
	"./tlh.js": 439,
	"./tr": 440,
	"./tr.js": 440,
	"./tzl": 441,
	"./tzl.js": 441,
	"./tzm": 442,
	"./tzm-latn": 443,
	"./tzm-latn.js": 443,
	"./tzm.js": 442,
	"./uk": 444,
	"./uk.js": 444,
	"./ur": 445,
	"./ur.js": 445,
	"./uz": 446,
	"./uz-latn": 447,
	"./uz-latn.js": 447,
	"./uz.js": 446,
	"./vi": 448,
	"./vi.js": 448,
	"./x-pseudo": 449,
	"./x-pseudo.js": 449,
	"./yo": 450,
	"./yo.js": 450,
	"./zh-cn": 451,
	"./zh-cn.js": 451,
	"./zh-hk": 452,
	"./zh-hk.js": 452,
	"./zh-tw": 453,
	"./zh-tw.js": 453
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 583;

/***/ }),

/***/ 585:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlainMessageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_photo_viewer__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_inapps_index__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// services



// pages

var PlainMessageComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function PlainMessageComponent(ref, events, photoViewer, config, photoUploader, permissions, nav, api, alert, actionSheetCtrl, translate) {
        // -- init callbacks --//
        var _this = this;
        this.ref = ref;
        this.events = events;
        this.photoViewer = photoViewer;
        this.config = config;
        this.photoUploader = photoUploader;
        this.permissions = permissions;
        this.nav = nav;
        this.api = api;
        this.alert = alert;
        this.actionSheetCtrl = actionSheetCtrl;
        this.translate = translate;
        this.messageDeleted = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.messageDelivered = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.messageTracked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.isMessageOpening = false;
        this.isSendingInProcess = false;
        // send message failed handler
        this.messageSendFailedHandler = function () {
            _this.ref.markForCheck();
        };
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    PlainMessageComponent.prototype.ngOnInit = function () {
        this.events.subscribe('message:sendFailed', this.messageSendFailedHandler);
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
    };
    /**
     * Component destroy
     */
    PlainMessageComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('message:sendFailed', this.messageSendFailedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
    };
    /**
     * Show message
     */
    PlainMessageComponent.prototype.showMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        this.isMessageOpening = true;
                        return [4 /*yield*/, this.api.find('messages', this.message.id, {
                                force: true,
                                forceHandleError: true
                            })];
                    case 1:
                        _a.sent();
                        this.messageTracked.emit(this.message.id);
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.isMessageOpening = false;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(PlainMessageComponent.prototype, "isReadMessageAllowed", {
        /**
         * Is read message allowed
         */
        get: function () {
            return this.message.wasAuthorized
                || this.permissions.isActionAllowed('mailbox_read_chat_message');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlainMessageComponent.prototype, "isReadMessageAllowedAfterTracking", {
        /**
         * Is read message allowed after tracking
         */
        get: function () {
            return this.permissions.isAllowedAfterTracking('mailbox_read_chat_message');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlainMessageComponent.prototype, "isReadMessagePromoted", {
        /**
         * Is read message promoted
         */
        get: function () {
            return this.permissions.isActionPromoted('mailbox_read_chat_message');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show purchases page
     */
    PlainMessageComponent.prototype.showPurchasesPage = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_8__pages_inapps_index__["a" /* InappsPage */]);
    };
    /**
     * View photo
     */
    PlainMessageComponent.prototype.viewPhoto = function (url) {
        this.photoViewer.show(url);
    };
    /**
     * Show message action
     */
    PlainMessageComponent.prototype.showMessageActions = function () {
        var _this = this;
        var buttons = [];
        // delete message
        buttons.push({
            text: this.translate.instant('delete_message'),
            handler: function () {
                var buttons = [{
                        text: _this.translate.instant('no')
                    }, {
                        text: _this.translate.instant('yes'),
                        handler: function () { return _this.deleteMessage(); }
                    }];
                var confirm = _this.alert.create({
                    message: _this.translate.instant('delete_message_confirmation'),
                    buttons: buttons
                });
                confirm.present();
            }
        });
        // resend message
        buttons.push({
            text: this.translate.instant('resend_message'),
            handler: function () { return _this.resendMessage(); }
        });
        var actionSheet = this.actionSheetCtrl.create({
            subTitle: this.message.notDeliveredDesc ? this.message.notDeliveredDesc : '',
            buttons: buttons
        });
        actionSheet.present();
    };
    /**
     * Delete message
     */
    PlainMessageComponent.prototype.deleteMessage = function () {
        this.api.remove('messages', this.message.id);
        this.ref.markForCheck();
        this.messageDeleted.emit(this.message.id);
    };
    /**
     * Resend message
     */
    PlainMessageComponent.prototype.resendMessage = function () {
        if (!this.message.attachments.length) {
            this.resendTextMessage();
            return;
        }
        // get not delivered photo
        var photo = this.message.attachments[0];
        this.resendPhotoMessage(photo.fileName, photo.downloadUrl);
    };
    /**
     * Resend text message
     */
    PlainMessageComponent.prototype.resendTextMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newMessage, e_2, errorDescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.message.deliverInProcess = true;
                        this.isSendingInProcess = true;
                        this.ref.markForCheck();
                        return [4 /*yield*/, this.api.create('messages', {
                                opponentId: this.message.opponentId,
                                text: this.message.text,
                                conversationId: this.message.conversationId,
                                timeStamp: this.message.timeStamp
                            })];
                    case 1:
                        newMessage = _a.sent();
                        this.deleteMessage();
                        this.messageDelivered.emit(newMessage);
                        this.isSendingInProcess = false;
                        this.ref.markForCheck();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.message.deliverInProcess = false;
                        this.isSendingInProcess = false;
                        this.ref.markForCheck();
                        // update error description
                        if (e_2.response && e_2.response.data) {
                            errorDescription = e_2.response.data.shortDescription;
                            if (errorDescription) {
                                this.message.notDeliveredDesc = errorDescription;
                                return [2 /*return*/];
                            }
                            this.message.notDeliveredDesc = '';
                        }
                        this.ref.markForCheck();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resend photo message
     */
    PlainMessageComponent.prototype.resendPhotoMessage = function (imageName, imagePath) {
        var _this = this;
        this.message.deliverInProcess = true;
        this.isSendingInProcess = true;
        this.ref.markForCheck();
        // init photo uploader
        this.photoUploader.url = this.config.getApiUrl() + '/mailbox/photo-messages/?';
        this.photoUploader.url += "opponentId=" + this.message.opponentId + "&";
        this.photoUploader.url += "conversationId=" + this.message.conversationId + "&";
        // photo successfully uploaded
        this.photoUploader.successUploadCallback = function (newMessage) {
            newMessage = JSON.parse(newMessage);
            _this.deleteMessage();
            _this.api.add('messages', newMessage);
            _this.isSendingInProcess = false;
            _this.ref.markForCheck();
            _this.messageDelivered.emit(newMessage);
        };
        // uploading failed
        this.photoUploader.errorUploadCallback = function (error) {
            _this.message.deliverInProcess = false;
            _this.isSendingInProcess = false;
            _this.ref.markForCheck();
            // update error description
            if (error.message) {
                var errorParams = JSON.parse(error.message);
                if (errorParams.shortDescription) {
                    _this.message.notDeliveredDesc = errorParams.shortDescription;
                    return;
                }
                _this.message.notDeliveredDesc = '';
            }
            _this.ref.markForCheck();
        };
        // trying to upload photo
        this.photoUploader.uploadImage(imageName, imagePath);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], PlainMessageComponent.prototype, "message", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], PlainMessageComponent.prototype, "prevMessage", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], PlainMessageComponent.prototype, "messageDeleted", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], PlainMessageComponent.prototype, "messageDelivered", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], PlainMessageComponent.prototype, "messageTracked", void 0);
    PlainMessageComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'plain-message',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\messages\components\plainMessage\index.html"*/'<div class="sk-message-wrap sk-message-type-plain-message {{message.notDelivered && !isSendingInProcess ? \'sk-message-error\' : \' \'}} {{ message.attachments.length ? \'sk-message-type-attachment\' : \'\' }}">\n    <span class="sk-message-date" *ngIf="message.date && (!prevMessage || prevMessage && prevMessage.date != message.date)">{{message.dateLabel}}</span>\n    <div class="sk-message {{message.isAuthor ? \'sk-message-sent\' : \'sk-message-received\'}}">\n\n        <!-- message -->\n        <div *ngIf="isReadMessageAllowed">\n            <p *ngIf="!message.attachments.length" [innerHTML]="message.text | nlbr"></p>\n\n            <!-- attachments -->\n            <div class="sk-attachments-wrap" *ngFor="let attachment of message.attachments">\n                <img *ngIf="attachment.type == \'image\'" class="sk-attachment-img" [src]="attachment.downloadUrl" (click)="viewPhoto(attachment.downloadUrl)" />\n                <div *ngIf="attachment.type != \'image\'" class="sk-attachment-file">\n                    <a href="{{attachment.downloadUrl}}">{{attachment.fileName}}</a>\n                </div>\n            </div>\n        </div>\n\n        <!-- click to read message -->\n        <div *ngIf="!isReadMessageAllowed && isReadMessageAllowedAfterTracking">\n            <button ion-button clear [disabled]="isMessageOpening" (click)="showMessage()"><p>{{ \'read_mailbox_message\' | translate }}</p></button>\n        </div>\n\n        <!-- click to upgrade -->\n        <div *ngIf="!isReadMessageAllowed && isReadMessagePromoted && !isReadMessageAllowedAfterTracking">\n            <button ion-button clear (click)="showPurchasesPage()"><p>{{ \'view_mailbox_message_upgrade\' | translate }}</p></button>\n        </div>\n\n        <!-- permission denied -->\n        <div *ngIf="!isReadMessageAllowed && !isReadMessagePromoted && !isReadMessageAllowedAfterTracking">\n            {{ \'view_mailbox_message_denied\' | translate }}\n        </div>\n\n        <!-- time -->\n        <p class="sk-message-time" *ngIf="message.timeLabel || message.deliverInProcess">\n            <span *ngIf="message.timeLabel">\n                {{message.timeStamp | amFromUnix | amDateFormat:\'hh:mmA\'}}\n                <img *ngIf="message.isAuthor && !message.recipientRead" src="./assets/img/ic_chat_sent.svg" alt="" />\n                <img *ngIf="message.isAuthor && message.recipientRead" src="./assets/img/ic_chat_received.svg" alt="" />\n            </span>\n            <span *ngIf="message.deliverInProcess">\n                <img *ngIf="message.deliverInProcess" src="./assets/img/ic_clock.svg" alt="" />\n            </span>\n        </p>\n    </div>\n    <div *ngIf="message.notDelivered && !isSendingInProcess" class="sk-message-deliver-error">\n        <img (click)="showMessageActions()" src="./assets/img/ic_chat_warn.svg" alt="">\n    </div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\messages\components\plainMessage\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__["a" /* PhotoUploaderService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_photo_viewer__["a" /* PhotoViewer */],
            __WEBPACK_IMPORTED_MODULE_7__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_6__services_photoUploader_index__["a" /* PhotoUploaderService */],
            __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2_ng2_translate__["c" /* TranslateService */]])
    ], PlainMessageComponent);
    return PlainMessageComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 586:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WinkMessageComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var WinkMessageComponent = /** @class */ (function () {
    function WinkMessageComponent() {
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], WinkMessageComponent.prototype, "message", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], WinkMessageComponent.prototype, "prevMessage", void 0);
    WinkMessageComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'wink-message',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\messages\components\winkMessage\index.html"*/'<div class="sk-message-wrap sk-message-type-wink">\n    <span class="sk-message-date" *ngIf="!prevMessage || prevMessage && prevMessage.date != message.date">{{message.dateLabel}}</span>\n    <div class="sk-message {{message.isAuthor ? \'sk-message-sent\' : \'sk-message-received\'}}">\n        <span *ngIf="message.isAuthor">{{ \'mailbox_wink_sent_desc\' | translate }}<img src="./assets/img/wink-sent.svg" alt="" /></span>\n        <span *ngIf="!message.isAuthor"><img src="./assets/img/wink-received.svg" alt="" />{{ \'mailbox_wink_received_desc\' | translate }}</span>\n    </div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\messages\components\winkMessage\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        })
    ], WinkMessageComponent);
    return WinkMessageComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 587:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HotListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// pages

// services


var HotListComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function HotListComponent(loadingCtrl, toast, translate, alert, permissions, events, nav, auth, api, ref) {
        // -- init callbacks --//
        var _this = this;
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.translate = translate;
        this.alert = alert;
        this.permissions = permissions;
        this.events = events;
        this.nav = nav;
        this.auth = auth;
        this.api = api;
        this.ref = ref;
        this.searchInProgress = true;
        this.isUserInList = false;
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // hot list updated handler
        this.hotListUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    HotListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // config updated
                        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
                        // permissions updated
                        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
                        // hot list updated
                        this.events.subscribe('hotList:updated', this.hotListUpdatedHandler);
                        return [4 /*yield*/, this.api.findAll('hotListUsers')];
                    case 1:
                        _a.sent();
                        this.searchInProgress = false;
                        this.currentLocalLimit = this.defaultLocalLimit;
                        currentUser = this.api.filter('hotListUsers', {
                            where: {
                                userId: this.auth.getUserId()
                            }
                        });
                        if (currentUser.length) {
                            this.userHotList = currentUser[0];
                            this.isUserInList = true;
                        }
                        this.ref.markForCheck();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * After view init
     */
    HotListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(function () {
            var scrollTop = _this.scroll._scrollContent.nativeElement.scrollTop;
            var clientHeight = _this.scroll._scrollContent.nativeElement.clientHeight;
            var scrollHeight = _this.scroll._scrollContent.nativeElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - _this.scrollThreshold) {
                if (_this.isCheckLoadMoreActive) {
                    _this.loadMoreUsers();
                }
            }
        });
    };
    /**
     * Component destroy
     */
    HotListComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('hotList:updated', this.hotListUpdatedHandler);
        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    };
    Object.defineProperty(HotListComponent.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "isHotListJoinAllowed", {
        /**
         * Is hot list join allowed
         */
        get: function () {
            return this.permissions.isActionAllowed('hotlist_add_to_list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "isHotListJoinPromoted", {
        /**
         * Is hot list join promoted
         */
        get: function () {
            return this.permissions.isActionPromoted('hotlist_add_to_list');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "currentUser", {
        /**
         * Current user
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId()); // get logged user data
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "scrollThreshold", {
        /**
         * Get scroll threshold
         */
        get: function () {
            return this.api.get('configs', 'scrollThreshold').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "defaultLocalLimit", {
        /**
         * Get default local limit
         */
        get: function () {
            return this.api.get('configs', 'hotListLocalLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HotListComponent.prototype, "usersLength", {
        /**
         * Get users length
         */
        get: function () {
            return this.api.getAll('hotListUsers').length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get user list
     */
    HotListComponent.prototype.getUserList = function () {
        return this.api.filter('hotListUsers', {
            limit: this.currentLocalLimit,
            orderBy: [
                ['timestamp', 'DESC']
            ]
        });
    };
    /**
     * Join to hot list
     */
    HotListComponent.prototype.joinToHotList = function () {
        var _this = this;
        if (this.isHotListJoinPromoted) {
            this.permissions.showAccessDeniedAlert();
            return;
        }
        var actionPrice = this.permissions.getActionPrice('hotlist_add_to_list');
        // show confirmation window
        if (actionPrice < 0) {
            var avatarButtons = [{
                    text: this.translate.instant('no')
                }, {
                    text: this.translate.instant('yes'),
                    handler: function () { return _this.sendJoinToHotListRequest(); }
                }];
            var confirm_1 = this.alert.create({
                message: this.translate.instant('hot_list_join_confirmation', {
                    count: Math.abs(actionPrice)
                }),
                buttons: avatarButtons
            });
            confirm_1.present();
            return;
        }
        this.sendJoinToHotListRequest();
    };
    /**
     * Remove from hot list
     */
    HotListComponent.prototype.removeFromHotList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('hotListUsers', this.userHotList.id)];
                    case 3:
                        _a.sent();
                        this.userHotList = {};
                        this.isUserInList = false;
                        this.ref.markForCheck();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load more users
     */
    HotListComponent.prototype.loadMoreUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // load from a local list
                this.currentLocalLimit += this.defaultLocalLimit;
                this.ref.markForCheck();
                return [2 /*return*/];
            });
        });
    };
    /**
     * View profile
     */
    HotListComponent.prototype.viewProfile = function (user) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_4__profile_view_index__["a" /* ProfileViewPage */], {
            userId: user.userId
        });
    };
    /**
     * Send join to hot list request
     */
    HotListComponent.prototype.sendJoinToHotListRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, _a, actionPrice, toast, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.api.create('hotListUsers', {})];
                    case 3:
                        _a.userHotList = _b.sent();
                        this.isUserInList = true;
                        this.ref.markForCheck();
                        actionPrice = this.permissions.getActionPrice('hotlist_add_to_list');
                        if (actionPrice) {
                            toast = this.toast.create({
                                message: actionPrice > 0
                                    ? this.translate.instant('increase_credits_notification', { count: actionPrice })
                                    : this.translate.instant('decrease_credits_notification', { count: Math.abs(actionPrice) }),
                                closeButtonText: this.translate.instant('ok'),
                                showCloseButton: true,
                                duration: this.toastDuration
                            });
                            toast.present();
                        }
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _b.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(HotListComponent.prototype, "isCheckLoadMoreActive", {
        /**
         * Is check load more active
         */
        get: function () {
            if (this.activeComponent == 'search'
                && this.usersLength >= this.currentLocalLimit && this.currentLocalLimit) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], HotListComponent.prototype, "activeComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('hotListScroll'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["r" /* Scroll */])
    ], HotListComponent.prototype, "scroll", void 0);
    HotListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'hot-list',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\hotList\index.html"*/'<div class="sk-hot-list-tab sk-navigation-tab">\n    <ion-scroll #hotListScroll [scrollY]="searchInProgress ? false : true">\n\n        <!-- loading wrapper -->\n        <div class="sk-gradient-preloader" *ngIf="searchInProgress">\n        </div>\n\n        <!-- nothing found wrapper  -->\n        <div class="sk-nothing-found" *ngIf="!searchInProgress && !usersLength">\n            <img src="./assets/img/ic_hotlist.svg" alt="">\n            <span>{{ \'hot_list_empty_desc\' | translate }}</span>\n        </div>\n\n        <!-- user list -->\n        <ion-list class="sk-user-cards sk-user-cards-searchmode" *ngIf="!searchInProgress && usersLength">\n            <ng-container *ngFor="let user of getUserList()">\n                <div class="sk-item-card">\n                    <user-avatar [useBigAvatar]="true" [url]="user.avatar.bigUrl" [isAvatarActive]="user.avatar.active" (tap)="viewProfile(user)"></user-avatar>\n                    <div class="{{user.isOnline ? \'sk-card-bottom sk-user-online\' : \'sk-card-bottom\'}}">\n                        <div class="sk-card-info">\n                            <div class="sk-name"><span>{{user.displayName ? user.displayName : user.userName}}</span><b *ngIf="user.age">, {{user.age}}</b></div>\n                        </div>\n                    </div>\n                </div>\n            </ng-container>\n        </ion-list>\n\n    </ion-scroll>\n\n    <!-- join/remove buttons -->\n    <button ion-button class="sk-hot-list-button" *ngIf="!searchInProgress && !isUserInList && (isHotListJoinAllowed || isHotListJoinPromoted)" (click)="joinToHotList()">{{ \'hot_list_join\' | translate }}</button>\n    <button ion-button class="sk-hot-list-button" *ngIf="!searchInProgress && isUserInList" (click)="removeFromHotList()">{{ \'hot_list_remove\' | translate }}</button>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\hotList\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]])
    ], HotListComponent);
    return HotListComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 588:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TinderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_swing__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_swing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_swing__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_animations__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__profile_view_index__ = __webpack_require__(51);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







// services





// pages


var TinderComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function TinderComponent(translate, alert, nav, sanitizer, application, config, http, auth, api, events, permissions, ref) {
        var _this = this;
        this.translate = translate;
        this.alert = alert;
        this.nav = nav;
        this.sanitizer = sanitizer;
        this.application = application;
        this.config = config;
        this.http = http;
        this.auth = auth;
        this.api = api;
        this.events = events;
        this.permissions = permissions;
        this.ref = ref;
        this.removeCardDelay = 500;
        this.inappsPage = __WEBPACK_IMPORTED_MODULE_12__pages_inapps_index__["a" /* InappsPage */];
        this.searchInProgress = false;
        this.cards = [];
        this.throwOutDistance = 800;
        // full list of options: https://github.com/gajus/swing#configuration
        this.stackConfig = {
            // a value between 0 and 1 indicating the completeness of the throw out condition.
            throwOutConfidence: function (offsetX, offsetY, element) {
                return _this.isCardThrowAllowed()
                    ? Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1)
                    : 0;
            },
            throwOutDistance: function () { return _this.throwOutDistance; }
        };
        // -- init callbacks --//
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            // make users search
            if (_this.isSearchAllowed) {
                _this.searchUsers();
            }
            _this.ref.markForCheck();
        };
        // avatar updated handler
        this.avatarUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // avatar deleted handler
        this.avatarDeletedHandler = function () {
            _this.ref.markForCheck();
        };
        // profile updated handler
        this.profileUpdatedHandler = function () {
            if (_this.isSearchAllowed) {
                _this.searchUsers(true);
            }
            _this.ref.markForCheck();
        };
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // profile liked
        this.profileLikedHandler = function () {
            _this.likeUser(false, false);
        };
        // profile disliked
        this.profileDislikedHandler = function () {
            _this.dislikeUser(false, false);
        };
        // profile blocked
        this.profileBlockedHandler = function () {
            _this.dislikeUser(false, false);
        };
    }
    /**
     * Component init
     */
    TinderComponent.prototype.ngOnInit = function () {
        if (this.isSearchAllowed) {
            this.searchUsers();
        }
        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        // profile updated
        this.events.subscribe('user:updated', this.profileUpdatedHandler);
        // permissions updated
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        // avatar updated
        this.events.subscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        // avatar deleted
        this.events.subscribe('user:avatarDeleted', this.avatarDeletedHandler);
        // profile has been liked
        this.events.subscribe('profileView:like', this.profileLikedHandler);
        // profile has been disliked
        this.events.subscribe('profileView:dislike', this.profileDislikedHandler);
        // profile has been blocked
        this.events.subscribe('profileView:block', this.profileBlockedHandler);
    };
    /**
     * Component destroy
     */
    TinderComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('user:updated', this.profileUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        this.events.unsubscribe('user:avatarDeleted', this.avatarDeletedHandler);
        this.events.unsubscribe('profileView:like', this.profileLikedHandler);
        this.events.unsubscribe('profileView:dislike', this.profileDislikedHandler);
        this.events.unsubscribe('profileView:block', this.profileBlockedHandler);
        // clear timeout
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
    };
    Object.defineProperty(TinderComponent.prototype, "currentUser", {
        /**
         * current user
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId()); // get logged user data
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TinderComponent.prototype, "isSearchAllowed", {
        /**
         * Is search allowed
         */
        get: function () {
            return this.permissions.isActionAllowed('base_search_users');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TinderComponent.prototype, "usersLimit", {
        /**
         * Get users limit
         */
        get: function () {
            return this.api.get('configs', 'tinderUsersLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TinderComponent.prototype, "searchTimeout", {
        /**
         * Search timeout
         */
        get: function () {
            return this.api.get('configs', 'tinderSearchTimeout').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Tinder card moving
     */
    TinderComponent.prototype.tinderCardMoving = function (event) {
        var card = this.cards[this.cards.length - 1];
        if (event.throwDirection == __WEBPACK_IMPORTED_MODULE_1_angular2_swing__["Direction"].LEFT || event.throwDirection == __WEBPACK_IMPORTED_MODULE_1_angular2_swing__["Direction"].RIGHT) {
            card.swipeDirection = event.throwDirection == __WEBPACK_IMPORTED_MODULE_1_angular2_swing__["Direction"].LEFT ? 'left' : 'right';
            this.ref.markForCheck();
            return;
        }
        this.ref.markForCheck();
        card.swipeDirection = '';
    };
    /**
     * Tinder card stop moving
     */
    TinderComponent.prototype.tinderCardStopMoving = function () {
        var card = this.cards[this.cards.length - 1];
        if (card && !this.isCardThrowAllowed()) {
            switch (card.swipeDirection) {
                case 'left':
                    this.dislikeConfirmation(card, !Boolean(this.application.getAppSetting('user_dislike_pressed', false)));
                    break;
                case 'right':
                    this.likeConfirmation(card, !Boolean(this.application.getAppSetting('user_like_pressed', false)));
                    break;
                default:
            }
        }
        if (card) {
            card.swipeDirection = '';
            this.ref.markForCheck();
        }
    };
    /**
     * Like user
     */
    TinderComponent.prototype.likeUser = function (sendRequest, showAnimation) {
        var _this = this;
        if (sendRequest === void 0) { sendRequest = true; }
        if (showAnimation === void 0) { showAnimation = true; }
        if (!showAnimation) {
            var card_1 = this.cards.pop();
            this.ref.markForCheck();
            if (sendRequest) {
                this.sendLikeRequest(card_1);
            }
            this.searchUsers();
            return;
        }
        var card = this.cards[this.cards.length - 1];
        if (card.status != 'remove') {
            card.status = 'remove';
            this.ref.markForCheck();
            if (sendRequest) {
                this.sendLikeRequest(card);
            }
            // remove card
            setTimeout(function () {
                _this.cards.pop();
                _this.ref.markForCheck();
                _this.searchUsers();
            }, this.removeCardDelay);
        }
    };
    /**
     * Dislike user
     */
    TinderComponent.prototype.dislikeUser = function (sendRequest, showAnimation) {
        var _this = this;
        if (sendRequest === void 0) { sendRequest = true; }
        if (showAnimation === void 0) { showAnimation = true; }
        if (!showAnimation) {
            var card_2 = this.cards.pop();
            this.ref.markForCheck();
            if (sendRequest) {
                this.sendDislikeRequest(card_2);
            }
            this.searchUsers();
            return;
        }
        var card = this.cards[this.cards.length - 1];
        if (card.status != 'remove') {
            card.status = 'remove';
            this.ref.markForCheck();
            if (sendRequest) {
                this.sendDislikeRequest(card);
            }
            // remove card
            setTimeout(function () {
                _this.cards.pop();
                _this.ref.markForCheck();
                _this.searchUsers();
            }, this.removeCardDelay);
        }
    };
    /**
     * View profile
     */
    TinderComponent.prototype.viewProfile = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_13__profile_view_index__["a" /* ProfileViewPage */], {
            userId: userId
        });
    };
    /**
     * Get compatibility background
     */
    TinderComponent.prototype.getCompatibilityBackground = function (match) {
        if (match === void 0) { match = 0; }
        var background = "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) " + match + "%, #d8d8d8 " + match + "%)";
        return this.sanitizer.bypassSecurityTrustStyle(background);
    };
    /**
     * Like confirmation
     */
    TinderComponent.prototype.likeConfirmation = function (card, showAnimation) {
        var _this = this;
        if (showAnimation === void 0) { showAnimation = true; }
        if (!this.application.getAppSetting('user_like_pressed', false)) {
            var confirm_1 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('like_confirmation', { name: card.displayName ? card.displayName : card.userName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                        }
                    }, {
                        text: this.translate.instant('like'),
                        handler: function () {
                            _this.application.setAppSetting('user_like_pressed', true);
                            _this.likeUser(true, showAnimation);
                        }
                    }
                ]
            });
            confirm_1.present();
            return;
        }
        this.likeUser(true, showAnimation);
    };
    /**
     * Dislike confirmation
     */
    TinderComponent.prototype.dislikeConfirmation = function (card, showAnimation) {
        var _this = this;
        if (showAnimation === void 0) { showAnimation = true; }
        if (!Boolean(this.application.getAppSetting('user_dislike_pressed', false))) {
            var confirm_2 = this.alert.create({
                enableBackdropDismiss: false,
                message: this.translate.instant('dislike_confirmation', { name: card.displayName ? card.displayName : card.userName }),
                buttons: [{
                        text: this.translate.instant('cancel'),
                        handler: function () {
                            _this.application.setAppSetting('user_dislike_pressed', true);
                        }
                    },
                    {
                        text: this.translate.instant('dislike'),
                        handler: function () {
                            _this.application.setAppSetting('user_dislike_pressed', true);
                            _this.dislikeUser(true, showAnimation);
                        }
                    }
                ]
            });
            confirm_2.present();
            return;
        }
        this.dislikeUser(true, showAnimation);
    };
    /**
     * Search users
     */
    TinderComponent.prototype.searchUsers = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var urlParams, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!force && this.cards.length || this.searchInProgress) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.cards = [];
                        this.searchInProgress = true;
                        // clear timeout
                        if (this.timeoutHandler) {
                            clearTimeout(this.timeoutHandler);
                        }
                        urlParams = '?';
                        urlParams += 'with[]=avatar&';
                        urlParams += 'with[]=compatibility&';
                        urlParams += 'with[]=distance&';
                        urlParams += 'with[]=matchActions&';
                        urlParams += "limit=" + this.usersLimit;
                        if (this.application.getAppLocation()) {
                            urlParams += "location=" + this.application.getAppLocation() + "&";
                        }
                        // search users
                        _a = this;
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/tinder-users/' + urlParams)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 2:
                        // search users
                        _a.cards = _b.sent();
                        this.searchInProgress = false;
                        this.ref.markForCheck();
                        // try to load users later
                        if (!this.cards.length) {
                            this.timeoutHandler = setTimeout(function () {
                                if (_this.isSearchAllowed) {
                                    _this.searchUsers();
                                }
                            }, this.searchTimeout);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        this.searchInProgress = false;
                        this.ref.markForCheck();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send like request
     */
    TinderComponent.prototype.sendLikeRequest = function (card) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.getMapper('matchActions').create({
                                userId: card.id,
                                type: 'like'
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send dislike request
     */
    TinderComponent.prototype.sendDislikeRequest = function (card) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.getMapper('matchActions').create({
                                userId: card.id,
                                type: 'dislike'
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Is card throw allowed
     */
    TinderComponent.prototype.isCardThrowAllowed = function () {
        return Boolean(this.application.getAppSetting('user_dislike_pressed', false))
            && Boolean(this.application.getAppSetting('user_like_pressed', false));
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TinderComponent.prototype, "activeComponent", void 0);
    TinderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'tinder',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\tinder\index.html"*/'<div class="sk-tinder-tab sk-navigation-tab">\n\n    <!-- search is not allowed   -->\n    <div class="sk-permission-denied" *ngIf="!isSearchAllowed">\n        <img src="./assets/img/no_permission.svg" alt="">\n        <h2>{{ \'permission_denied_header\' | translate }}</h2>\n        <span>{{ \'permission_denied_alert_message\' | translate }}</span>\n        <button ion-button outline round [navPush]="inappsPage">{{ \'upgrade\' | translate }}</button>\n    </div>\n\n    <!-- loading wrapper -->\n    <div class="sk-searchlist-loading" *ngIf="!cards.length && isSearchAllowed">\n        <div class="sk-circle-anim_wrap">\n            <div class="sk-circle-anim sk-circle-anim_first"></div>\n            <div class="sk-circle-anim sk-circle-anim_second"></div>\n            <div class="sk-circle-anim sk-circle-anim_third"></div>\n            <user-avatar [useBigAvatar]="false" [url]="currentUser?.avatar?.pendingUrl"></user-avatar>\n            <div *ngIf="currentUser?.avatar?.id && !currentUser?.avatar?.active" class="sk-photo-pending">\n                <img src="./assets/img/ic_pending.svg" alt="">\n            </div>\n        </div>\n    </div>\n\n    <!-- tinder cards -->\n    <div *ngIf="cards.length && isSearchAllowed" class="sk-tinder-cards-wrapper" swing-stack [stackConfig]="stackConfig" (dragend)="tinderCardStopMoving()" (dragmove)="tinderCardMoving($event)" (throwoutleft)="dislikeUser(true, false)" (throwoutright)="likeUser(true, false)">\n        <ion-card swing-card *ngFor="let card of cards">\n            <div [class]="card.swipeDirection ? (card.swipeDirection == \'left\' ? \'swiper-no-swiping sk-card-wrapper sk-swipe-left\' : \'swiper-no-swiping sk-card-wrapper sk-swipe-right\') : \'swiper-no-swiping sk-card-wrapper\'" [@removed]="card.status">\n                <div class="sk-item-card">\n                    <div class="sk-tinder-cover" (tap)="viewProfile(card.id)">\n                        <div class="sk-tinder-like">\n                            <span>{{ \'yes\' | translate }}</span>\n                        </div>\n                        <div class="sk-tinder-dislike">\n                            <span>{{ \'nope\' | translate }}</span>\n                        </div>\n                    </div>\n                    <user-avatar [useBigAvatar]="true" [url]="card.avatar.bigUrl" [isAvatarActive]="card.avatar.active"></user-avatar>\n                    <div class="{{card.isOnline ? \'sk-card-bottom sk-user-online\' : \'sk-card-bottom\'}}">\n                        <div class="sk-card-info">\n                            <div class="sk-name"><span>{{card.displayName ? card.displayName : card.userName}}</span><b *ngIf="card.age">, {{card.age}}</b></div>\n                            <span class="sk-info" *ngIf="card.distance.distance">\n                                <span *ngIf="card.distance.unit == \'km\'">{{ \'km_away\' | translate:{value: card.distance.distance} }}</span>\n                                <span *ngIf="card.distance.unit == \'miles\'">{{ \'miles_away\' | translate:{value: card.distance.distance} }}</span>\n                            </span>\n                            <div class="sk-comp-bar">\n                                <div class="sk-comp-bar-mask" [style.background]="getCompatibilityBackground(card.compatibility.match)">\n                                    <span>{{card.compatibility.match ? card.compatibility.match : 0}}%</span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="sk-card-buttons">\n                            <button (tap)="dislikeConfirmation(card)" class="sk-dislike" ></button>\n                            <button (tap)="likeConfirmation(card)" class="sk-like"></button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </ion-card>\n    </div>\n\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\tinder\index.html"*/,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_6__angular_animations__["i" /* trigger */])('removed', [
                    Object(__WEBPACK_IMPORTED_MODULE_6__angular_animations__["f" /* state */])('remove', Object(__WEBPACK_IMPORTED_MODULE_6__angular_animations__["g" /* style */])({ opacity: 0 })),
                    Object(__WEBPACK_IMPORTED_MODULE_6__angular_animations__["h" /* transition */])('* => remove', Object(__WEBPACK_IMPORTED_MODULE_6__angular_animations__["c" /* animate */])('.5s linear')),
                ])
            ],
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_11__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_10__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_9__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_8__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_7__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]])
    ], TinderComponent);
    return TinderComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 589:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_user_edit_questions_index__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_user_edit_photos_index__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__appSettings_index__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_user_bookmarks_index__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_user_guests_index__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_user_compatibleUsers_index__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// pages








// services

var ProfileComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function ProfileComponent(events, ref, auth, nav, api) {
        // -- init callbacks --//
        var _this = this;
        this.events = events;
        this.ref = ref;
        this.auth = auth;
        this.nav = nav;
        this.api = api;
        this.appSettingsPage = __WEBPACK_IMPORTED_MODULE_7__appSettings_index__["a" /* AppSettingsPage */];
        this.profileEditPage = __WEBPACK_IMPORTED_MODULE_4__pages_user_edit_questions_index__["a" /* EditUserQuestionsPage */];
        this.profileEditPhotosPage = __WEBPACK_IMPORTED_MODULE_5__pages_user_edit_photos_index__["a" /* EditUserPhotosPage */];
        this.bookmarksPage = __WEBPACK_IMPORTED_MODULE_8__pages_user_bookmarks_index__["a" /* BookmarksPage */];
        this.inappsPage = __WEBPACK_IMPORTED_MODULE_3__pages_inapps_index__["a" /* InappsPage */];
        this.guestsPage = __WEBPACK_IMPORTED_MODULE_9__pages_user_guests_index__["a" /* GuestsPage */];
        this.compatibleUsersPage = __WEBPACK_IMPORTED_MODULE_10__pages_user_compatibleUsers_index__["a" /* CompatibleUsersPage */];
        // guests updated handler
        this.guestsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    ProfileComponent.prototype.ngOnInit = function () {
        this.events.subscribe('guests:updated', this.guestsUpdatedHandler);
    };
    /**
     * Component destroy
     */
    ProfileComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('guests:updated', this.guestsUpdatedHandler);
    };
    Object.defineProperty(ProfileComponent.prototype, "user", {
        /**
         * User data
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get new guests count
     */
    ProfileComponent.prototype.getNewGuestsCount = function () {
        return this.api.filter('guests', {
            where: {
                viewed: false
            }
        }).length;
    };
    /**
     * Show profile
     */
    ProfileComponent.prototype.showProfile = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_6__pages_profile_view_index__["a" /* ProfileViewPage */], {
            userId: this.auth.getUserId()
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ProfileComponent.prototype, "activeComponent", void 0);
    ProfileComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'profile',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\profile\index.html"*/'<div class="sk-profile-tab sk-navigation-tab">\n    <ion-scroll scrollY="true">\n        <div class="sk-user">\n            <div class="sk-user-avatar">\n                <div class="wrap">\n                    <user-avatar (tap)="showProfile()" [useBigAvatar]="true" [url]="user.avatar?.pendingBigUrl"></user-avatar>\n                    <div *ngIf="user.avatar?.id && !user.avatar?.active" class="sk-photo-pending" (tap)="showProfile()">\n                        <img src="./assets/img/ic_pending.svg" alt="">\n                    </div>\n                    <button ion-button clear  class="edit" [navPush]="profileEditPhotosPage"></button>\n                </div>\n            </div>\n            <div class="sk-user-info">\n                <span class="sk-name">\n                    {{user.displayName}}\n                </span>\n                <span class="sk-about">\n                    {{user.aboutMe}}\n                </span>\n            </div>\n            <div class="sk-user-buttons">\n                <button ion-button outline round [navPush]="profileEditPage">{{ \'profile_edit_profile\' | translate }}</button>\n                <button ion-button outline round [navPush]="appSettingsPage">{{ \'profile_app_settings\' | translate }}</button>\n            </div>\n            <div class="sk-user-links">\n                <button ion-button clear [navPush]="guestsPage">{{ \'profile_my_guests\' | translate }} <span class="sk-guest-count" *ngIf="getNewGuestsCount()">{{getNewGuestsCount()}}</span></button>\n                <button ion-button clear [navPush]="bookmarksPage">{{ \'profile_bookmarks\' | translate }}</button>\n                <button ion-button clear [navPush]="compatibleUsersPage">{{ \'profile_compatible_users\' | translate }}</button>\n                <button ion-button clear [navPush]="inappsPage">{{ \'profile_credits_and_memberships\' | translate }}</button>\n            </div>\n        </div>\n    </ion-scroll>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\profile\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_11__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], ProfileComponent);
    return ProfileComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 590:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConversationsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__messages_index__ = __webpack_require__(62);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// pages

var ConversationsComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function ConversationsComponent(events, ref, loadingCtrl, toast, alert, translate, actionSheetCtrl, keyboard, api, navController) {
        var _this = this;
        this.events = events;
        this.ref = ref;
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.alert = alert;
        this.translate = translate;
        this.actionSheetCtrl = actionSheetCtrl;
        this.keyboard = keyboard;
        this.api = api;
        this.navController = navController;
        this.pageReady = false;
        this.userNameFilter = '';
        this.currentConversationsLimit = this.conversationsLimit;
        // -- init callbacks --//
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // conversations updated handler
        this.conversationsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // matched users updated handler
        this.matchedUsersUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    Object.defineProperty(ConversationsComponent.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConversationsComponent.prototype, "scrollThreshold", {
        /**
         * Get scroll threshold
         */
        get: function () {
            return this.api.get('configs', 'scrollThreshold').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConversationsComponent.prototype, "conversationsLimit", {
        /**
         * Conversations limit
         */
        get: function () {
            return this.api.get('configs', 'conversationsLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Component init
     */
    ConversationsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
                        this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);
                        this.events.subscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
                        // load matches and conversations
                        return [4 /*yield*/, Promise.all([
                                this.api.findAll('matchedUsers'),
                                this.api.findAll('conversations')
                            ])];
                    case 1:
                        // load matches and conversations
                        _a.sent();
                        this.pageReady = true;
                        this.ref.markForCheck();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * After view init
     */
    ConversationsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(function () {
            var scrollTop = _this.scroll._scrollContent.nativeElement.scrollTop;
            var clientHeight = _this.scroll._scrollContent.nativeElement.clientHeight;
            var scrollHeight = _this.scroll._scrollContent.nativeElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - _this.scrollThreshold) {
                if (_this.isCheckLoadMoreActive) {
                    _this.loadMoreConversations();
                }
            }
        });
    };
    /**
     * Component destroy
     */
    ConversationsComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    };
    /**
     * Username filter changed
     */
    ConversationsComponent.prototype.userNameFilterChanged = function () {
        this.currentConversationsLimit = this.conversationsLimit;
    };
    /**
     * Get matches
     */
    ConversationsComponent.prototype.getMatches = function () {
        return this.api.filter('matchedUsers', {
            where: {
                displayName: {
                    'likei': "%" + this.userNameFilter + "%"
                }
            },
            orderBy: [
                ['isNew', 'DESC'],
                ['createStamp', 'DESC']
            ]
        });
    };
    /**
     * Get conversations
     */
    ConversationsComponent.prototype.getConversations = function () {
        return this.api.filter('conversations', {
            where: {
                opponentDisplayName: {
                    'likei': "%" + this.userNameFilter + "%"
                }
            },
            limit: this.currentConversationsLimit,
            orderBy: [
                ['isRead', 'ASC'],
                ['lastMessageTimestamp', 'DESC']
            ]
        });
    };
    /**
     * Show conversation actions
     */
    ConversationsComponent.prototype.showConversationActions = function (conversation) {
        var _this = this;
        var buttons = [];
        // block (unblock) opponent
        if (!conversation.opponentBlocked) {
            buttons.push({
                text: this.translate.instant('block_profile'),
                handler: function () {
                    var buttons = [{
                            text: _this.translate.instant('no')
                        }, {
                            text: _this.translate.instant('yes'),
                            handler: function () { return _this.blockUser(conversation.opponentId); }
                        }];
                    var confirm = _this.alert.create({
                        message: _this.translate.instant('block_profile_confirmation'),
                        buttons: buttons
                    });
                    confirm.present();
                }
            });
        }
        else {
            buttons.push({
                text: this.translate.instant('unblock_profile'),
                handler: function () { return _this.unblockUser(conversation.opponentId); }
            });
        }
        // delete conversation
        buttons.push({
            text: this.translate.instant('delete_conversation'),
            handler: function () {
                var buttons = [{
                        text: _this.translate.instant('no')
                    }, {
                        text: _this.translate.instant('yes'),
                        handler: function () { return _this.deleteConversation(conversation.id); }
                    }];
                var confirm = _this.alert.create({
                    message: _this.translate.instant('delete_conversation_confirmation'),
                    buttons: buttons
                });
                confirm.present();
            }
        });
        // mark read/unread conversation
        buttons.push({
            text: conversation.isRead
                ? this.translate.instant('mark_unread_conversation')
                : this.translate.instant('mark_read_conversation'),
            handler: function () { return _this.markConversation(conversation.id, conversation.isRead); }
        });
        var actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });
        actionSheet.present();
    };
    /**
     * Close keyboard
     */
    ConversationsComponent.prototype.closeKeyboard = function () {
        this.keyboard.close();
    };
    /**
     * Show chat
     */
    ConversationsComponent.prototype.showChat = function (userId, conversationId) {
        this.navController.push(__WEBPACK_IMPORTED_MODULE_5__messages_index__["a" /* MessagesPage */], {
            userId: userId,
            conversationId: conversationId
        });
    };
    /**
     * Load more conversations
     */
    ConversationsComponent.prototype.loadMoreConversations = function () {
        this.currentConversationsLimit += this.conversationsLimit;
        this.ref.markForCheck();
    };
    Object.defineProperty(ConversationsComponent.prototype, "isCheckLoadMoreActive", {
        /**
         * Is check load more active
         */
        get: function () {
            if (this.activeComponent == 'conversations') {
                var conversations = this.api.filter('conversations', {
                    where: {
                        opponentDisplayName: {
                            'likei': "%" + this.userNameFilter + "%"
                        }
                    }
                });
                if (conversations.length > this.currentConversationsLimit) {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Mark conversation
     */
    ConversationsComponent.prototype.markConversation = function (conversationId, isRead) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.update('conversations', conversationId, {
                                isRead: !isRead
                            })];
                    case 3:
                        _a.sent();
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: isRead
                                ? this.translate.instant('conversation_has_been_marked_as_unread')
                                : this.translate.instant('conversation_has_been_marked_as_read'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete conversation
     */
    ConversationsComponent.prototype.deleteConversation = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('conversations', conversationId)];
                    case 3:
                        _a.sent();
                        // remove messages from storage
                        this.api.removeAll('messages', {
                            conversationId: conversationId
                        });
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: this.translate.instant('conversation_has_been_deleted'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unblock user
     */
    ConversationsComponent.prototype.unblockUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('blocks').destroy(userId)];
                    case 3:
                        _a.sent();
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_unblocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Block user
     */
    ConversationsComponent.prototype.blockUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('blocks').create({
                                userId: userId
                            })];
                    case 3:
                        _a.sent();
                        this.ref.markForCheck();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_blocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('conversationsScroll'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["r" /* Scroll */])
    ], ConversationsComponent.prototype, "scroll", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], ConversationsComponent.prototype, "activeComponent", void 0);
    ConversationsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'conversations',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\conversations\index.html"*/'<div class="sk-conversations-tab sk-navigation-tab">\n\n    <div class="sk-conversation-preloader" *ngIf="!pageReady"></div>\n    <div class="sk-search-bar" *ngIf="getConversations().length || getMatches().length || userNameFilter">\n        <ion-searchbar\n                [(ngModel)]="userNameFilter"\n                (ngModelChange)="userNameFilterChanged()"\n                (search)="closeKeyboard()"\n                placeholder="{{ \'username_input\' | translate }}">\n        </ion-searchbar>\n    </div>\n\n    <ion-scroll #conversationsScroll [scrollY]="!pageReady ? false : true">\n        <div class="sk-conversations-wrapper" *ngIf="pageReady">\n            <div class="sk-messages-wrap">\n                <!-- matches list -->\n                <div class="sk-matches-list" *ngIf="getMatches().length">\n                    <span>{{ \'new_matches\' | translate }}</span>\n                    <ion-scroll scrollX="true" class="sk-match-scroll swiper-no-swiping">\n                        <div class="sk-matches-wrap">\n                            <div class="sk-match-item {{match.isNew ? \'sk-match-item-new\' : \'\'}}" *ngFor="let match of getMatches()" (click)="showChat(match.userId)">\n                                <div class="sk-match-avatar">\n                                    <user-avatar [url]="match.avatar" [isAvatarActive]="match.isAvatarActive"></user-avatar>\n                                </div>\n                                <span>{{match.displayName}}</span>\n                            </div>\n                        </div>\n                    </ion-scroll>\n                </div>\n\n                <!-- conversations list -->\n                <div class="sk-conversation-list" *ngIf="getConversations().length">\n                    <span>{{ \'new_messages\' | translate }}</span>\n                    <div class="sk-conversations-wrap">\n                        <div (press)="showConversationActions(conversation)" class="sk-conversation-item {{!conversation.isRead ? \'sk-conversation-item-new\' : \'\'}} {{conversation.opponentBlocked ? \'sk-conversation-item-blocked\' : \'\'}}" *ngFor="let conversation of getConversations()" (click)="showChat(conversation.opponentId, conversation.id)">\n                            <div class="sk-conversation-item-avatar">\n                                <user-avatar [url]="conversation.opponentAvatar" [isAvatarActive]="conversation.isOpponentAvatarActive"></user-avatar>\n                            </div>\n                            <div class="sk-conversation-item-inner">\n                                <span>{{conversation.opponentDisplayName}}</span>\n                                <p>\n                                    <img *ngIf="conversation.isReply && !conversation.opponentIsRead" src="./assets/img/ic_sent.svg" alt="" />\n                                    <img *ngIf="conversation.isReply && conversation.opponentIsRead" src="./assets/img/ic_received.svg" alt="" />\n                                    {{conversation.previewText}}\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <!-- no results found -->\n                <div class="sk-no-results" *ngIf="!getConversations().length && !getMatches().length">\n                    <img src="./assets/img/ic_no_matches.png" alt="">\n                    <span>{{ \'conversations_no_results\' | translate }}</span>\n                </div>\n            </div>\n\n        </div>\n    </ion-scroll>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\conversations\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */]])
    ], ConversationsComponent);
    return ConversationsComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 591:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_searchFilter_index__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_application_index__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__inapps_index__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__profile_view_index__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_questions_manager__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






// import components

// services



// pages


// questions

var SearchComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function SearchComponent(keyboard, modalCtrl, ref, events, nav, application, auth, api, permissions) {
        // -- init callbacks --//
        var _this = this;
        this.keyboard = keyboard;
        this.modalCtrl = modalCtrl;
        this.ref = ref;
        this.events = events;
        this.nav = nav;
        this.application = application;
        this.auth = auth;
        this.api = api;
        this.permissions = permissions;
        this.searchUserNameFilter = '';
        this.searchFilter = [];
        this.inappsPage = __WEBPACK_IMPORTED_MODULE_8__inapps_index__["a" /* InappsPage */];
        this.userListLoading = false;
        this.showUserListLoading = true;
        this.users = [];
        this.isNewSearch = true;
        this.searchStarted = false;
        // permissions updated handler
        this.permissionsUpdatedHandler = function () {
            // make users search
            if (_this.isSearchAllowed && !_this.searchStarted) {
                _this.searchUsers(true);
            }
            _this.ref.markForCheck();
        };
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // avatar updated handler
        this.avatarUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // avatar deleted handler
        this.avatarDeletedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    SearchComponent.prototype.ngOnInit = function () {
        if (this.isSearchAllowed) {
            this.searchUsers(true);
        }
        // config updated
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
        // permissions updated
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        // avatar updated
        this.events.subscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        // avatar deleted
        this.events.subscribe('user:avatarDeleted', this.avatarDeletedHandler);
    };
    /**
     * After view init
     */
    SearchComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // load more users while scrolling
        this.clearScrollHandler = this.scroll.addScrollEventListener(function () {
            var scrollTop = _this.scroll._scrollContent.nativeElement.scrollTop;
            var clientHeight = _this.scroll._scrollContent.nativeElement.clientHeight;
            var scrollHeight = _this.scroll._scrollContent.nativeElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - _this.scrollThreshold) {
                if (_this.isCheckLoadMoreActive && !_this.userListLoading) {
                    _this.loadMoreUsers();
                }
            }
        });
    };
    /**
     * Component destroy
     */
    SearchComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('user:avatarUpdated', this.avatarUpdatedHandler);
        this.events.unsubscribe('user:avatarDeleted', this.avatarDeletedHandler);
        if (this.clearScrollHandler) {
            this.clearScrollHandler();
        }
    };
    /**
     * Show search filter modal
     */
    SearchComponent.prototype.showSearchFilterModal = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__components_searchFilter_index__["a" /* UserSearchFilterComponent */], {
            filter: this.searchFilter // pass collected filter
        });
        // capture returned data
        modal.onDidDismiss(function (filter) {
            if (filter.length) {
                _this.searchFilter = filter;
                _this.searchUsers(true);
                _this.ref.markForCheck();
            }
        });
        modal.present();
    };
    Object.defineProperty(SearchComponent.prototype, "currentUser", {
        /**
         * Current user
         */
        get: function () {
            return this.api.get('users', this.auth.getUserId()); // get logged user data
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchComponent.prototype, "isSearchAllowed", {
        /**
         * Is search allowed
         */
        get: function () {
            return this.permissions.isActionAllowed('base_search_users');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchComponent.prototype, "defaultGlobalLimit", {
        /**
         * Get default global limit
         */
        get: function () {
            return this.api.get('configs', 'searchUserLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchComponent.prototype, "scrollThreshold", {
        /**
         * Get scroll threshold
         */
        get: function () {
            return this.api.get('configs', 'scrollThreshold').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchComponent.prototype, "defaultLocalLimit", {
        /**
         * Get default local limit
         */
        get: function () {
            return this.api.get('configs', 'searchUserLocalLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * View profile
     */
    SearchComponent.prototype.viewProfile = function (user) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_9__profile_view_index__["a" /* ProfileViewPage */], {
            userId: user.id
        });
    };
    /**
     * Search users
     */
    SearchComponent.prototype.searchUsers = function (startNewSearch) {
        if (startNewSearch === void 0) { startNewSearch = false; }
        return __awaiter(this, void 0, void 0, function () {
            var lastSearchId, filter, newSearch, search, foundUsers, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        this.searchStarted = true;
                        this.userListLoading = true;
                        this.keyboard.close();
                        lastSearchId = 0;
                        this.ref.markForCheck();
                        if (!startNewSearch) return [3 /*break*/, 2];
                        this.isNewSearch = true;
                        this.currentGlobalLimit = this.defaultGlobalLimit;
                        this.currentLocalLimit = this.defaultLocalLimit;
                        filter = this.searchFilter;
                        // process filters
                        if (this.searchUserNameFilter.trim()) {
                            filter = filter.concat([{
                                    name: 'username',
                                    value: this.searchUserNameFilter,
                                    type: __WEBPACK_IMPORTED_MODULE_10__services_questions_manager__["a" /* QuestionManager */].TYPE_TEXT
                                }]);
                        }
                        return [4 /*yield*/, this.api.create('searchUsers', { userId: this.auth.getUserId() }, {
                                params: {
                                    filter: JSON.stringify(filter)
                                }
                            })];
                    case 1:
                        newSearch = _a.sent();
                        lastSearchId = newSearch.id;
                        return [3 /*break*/, 3];
                    case 2:
                        search = this.api.filter('searchUsers', {
                            where: {
                                userId: this.auth.getUserId()
                            },
                            orderBy: [
                                ['id', 'DESC']
                            ],
                            limit: 1
                        });
                        lastSearchId = search[0].id;
                        this.isNewSearch = false;
                        _a.label = 3;
                    case 3:
                        if (!lastSearchId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.api.getMapper('users').findAll({
                                with: ['avatar', 'distance'],
                                limit: this.currentGlobalLimit,
                                searchId: lastSearchId,
                                location: this.application.getAppLocation()
                            })];
                    case 4:
                        foundUsers = _a.sent();
                        this.users = foundUsers;
                        return [3 /*break*/, 6];
                    case 5:
                        this.users = [];
                        _a.label = 6;
                    case 6:
                        this.userListLoading = false;
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        this.userListLoading = false;
                        return [3 /*break*/, 8];
                    case 8:
                        this.ref.markForCheck();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user list
     */
    SearchComponent.prototype.getUserList = function () {
        return this.users.slice(0, this.currentLocalLimit);
    };
    /**
     * Load more users
     */
    SearchComponent.prototype.loadMoreUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.currentLocalLimit + this.defaultLocalLimit > this.users.length)) return [3 /*break*/, 2];
                        this.currentGlobalLimit += this.defaultGlobalLimit;
                        this.showUserListLoading = false;
                        this.ref.markForCheck();
                        return [4 /*yield*/, this.searchUsers(false)];
                    case 1:
                        _a.sent();
                        this.showUserListLoading = true;
                        _a.label = 2;
                    case 2:
                        // load from a local list
                        this.currentLocalLimit += this.defaultLocalLimit;
                        this.ref.markForCheck();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(SearchComponent.prototype, "isCheckLoadMoreActive", {
        /**
         * Is check load more active
         */
        get: function () {
            if (this.activeComponent == 'search'
                && this.users.length >= this.currentLocalLimit && this.currentLocalLimit && this.isSearchAllowed) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], SearchComponent.prototype, "activeComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('searchScroll'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* Scroll */])
    ], SearchComponent.prototype, "scroll", void 0);
    SearchComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'search',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\search\index.html"*/'<div class="sk-search-tab sk-navigation-tab">\n\n    <!-- search box -->\n    <div class="sk-dashboard-tabs-search-bar" *ngIf="isSearchAllowed">\n        <ion-searchbar\n            [(ngModel)]="searchUserNameFilter"\n            (search)="searchUsers(true)"\n            placeholder="{{ \'username_input\' | translate }}">\n        </ion-searchbar>\n        <div class="sk-searchlist" (click)="showSearchFilterModal()"></div>\n    </div>\n\n    <ion-scroll #searchScroll [scrollY]="userListLoading && showUserListLoading ? false : true">\n        <!-- loading wrapper -->\n        <div class="sk-gradient-preloader" *ngIf="userListLoading && showUserListLoading">\n        </div>\n\n        <!-- nothing found wrapper  -->\n        <div class="sk-nothing-found" *ngIf="!users.length && !userListLoading && isSearchAllowed">\n            <img src="./assets/img/user_not_found.svg" alt="">\n            <h2>{{ \'empty_user_search_header\' | translate }}</h2>\n            <span>{{ \'empty_user_search_desc\' | translate }}</span>\n        </div>\n\n        <!-- search is not allowed   -->\n        <div class="sk-permission-denied" *ngIf="!isSearchAllowed">\n            <img src="./assets/img/no_permission.svg" alt="">\n            <h2>{{ \'permission_denied_header\' | translate }}</h2>\n            <span>{{ \'permission_denied_alert_message\' | translate }}</span>\n            <button ion-button outline round [navPush]="inappsPage">{{ \'upgrade\' | translate }}</button>\n        </div>\n\n        <!-- user list -->\n        <ion-list class="sk-user-cards sk-user-cards-searchmode" *ngIf="isSearchAllowed && users.length && (!userListLoading || userListLoading && !isNewSearch)">\n            <ng-container *ngFor="let user of getUserList()">\n                <div class="sk-item-card">\n                    <user-avatar [useBigAvatar]="true" [url]="user.avatar.bigUrl" [isAvatarActive]="user.avatar.active" (tap)="viewProfile(user)"></user-avatar>\n                    <div class="{{user.isOnline ? \'sk-card-bottom sk-user-online\' : \'sk-card-bottom\'}}">\n                        <div class="sk-card-info">\n                            <div class="sk-name"><span>{{user.realName}}</span><b *ngIf="user.age">, {{user.age}}</b></div>\n                        <span class="sk-info" *ngIf="user.distance.distance">\n                            <span *ngIf="user.distance.unit == \'km\'">{{ \'km_away\' | translate:{value: user.distance.distance} }}</span>\n                            <span *ngIf="user.distance.unit == \'miles\'">{{ \'miles_away\' | translate:{value: user.distance.distance} }}</span>\n                        </span>\n                        <span class="sk-info" *ngIf="!user.distance.distance">\n                            <br>\n                        </span>\n                        </div>\n                    </div>\n                </div>\n            </ng-container>\n        </ion-list>\n\n        <ion-spinner *ngIf="userListLoading && !showUserListLoading"></ion-spinner>\n\n    </ion-scroll>\n\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\search\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_7__services_application_index__["a" /* ApplicationService */],
            __WEBPACK_IMPORTED_MODULE_6__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_5__services_permissions_index__["a" /* PermissionsService */]])
    ], SearchComponent);
    return SearchComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 592:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardTabsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DashboardTabsComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function DashboardTabsComponent(ref, events, api) {
        // -- init callbacks --//
        var _this = this;
        this.ref = ref;
        this.events = events;
        this.api = api;
        this.componentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        // conversations updated handler
        this.conversationsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
        // matched users updated handler
        this.matchedUsersUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    DashboardTabsComponent.prototype.ngOnInit = function () {
        this.events.subscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
        this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);
    };
    /**
     * Component destroy
     */
    DashboardTabsComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('matchedUsers:updated', this.matchedUsersUpdatedHandler);
    };
    /**
     * Change component
     */
    DashboardTabsComponent.prototype.changeComponent = function (componentName, subComponentName) {
        this.componentChanged.emit({
            componentName: componentName,
            subComponentName: subComponentName
        });
    };
    Object.defineProperty(DashboardTabsComponent.prototype, "getUnreadConversationsCount", {
        /**
         * Get unread conversations count
         */
        get: function () {
            return this.api.filter('conversations', {
                where: {
                    isRead: false
                }
            }).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DashboardTabsComponent.prototype, "getNewMatchedUsersCount", {
        /**
         * Get new matched users count
         */
        get: function () {
            return this.api.filter('matchedUsers', {
                where: {
                    isNew: true
                }
            }).length;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], DashboardTabsComponent.prototype, "activeComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], DashboardTabsComponent.prototype, "activeSubComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], DashboardTabsComponent.prototype, "componentChanged", void 0);
    DashboardTabsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'dashboard-tabs',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\dashboard\components\tabs\index.html"*/'<div class="sk-dashboard-tabs">\n    <!-- profile tab -->\n    <div class="{{activeComponent == \'profile\' ? \'sk-tabs-item sk-tabs-item-1 sk-tabs-item-active\' : \'sk-tabs-item sk-tabs-item-1\'}}" (tap)="changeComponent(\'profile\')">\n        <svg class="sk-real" width="22px" height="28px" viewBox="0 0 22 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <!-- Generator: Sketch 41 (35326) - http://www.bohemiancoding.com/sketch -->\n            <title>Page 1</title>\n            <desc>Created with Sketch.</desc>\n            <defs>\n                <polygon id="path-1" points="11.3689165 0.0134364261 0.00946947005 0.0134364261 0.00946947005 11.4738879 11.3689165 11.4738879 11.3689165 0.0134364261"></polygon>\n                <polygon id="path-3" points="21.1710714 0.036762457 21.1710714 14.4243986 0 14.4243986 0 0.036762457 21.1710714 0.036762457"></polygon>\n            </defs>\n            <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="Navigation-Bar/Back" transform="translate(-11.000000, -30.000000)">\n                    <g id="Page-1" transform="translate(11.000000, 30.000000)">\n                        <g id="Group-3" transform="translate(4.903846, 0.000000)">\n                            <mask id="mask-2" fill="white">\n                                <use xlink:href="#path-1"></use>\n                            </mask>\n                            <g id="Clip-2"></g>\n                            <path d="M5.68919297,0.0134067869 C2.55241878,0.0134067869 0.00946947005,2.578875 0.00946947005,5.74364734 C0.00946947005,8.90841967 2.55241878,11.4738879 5.68919297,11.4738879 C8.82606509,11.4738879 11.3689165,8.90841967 11.3689165,5.74364734 C11.3689165,2.578875 8.82606509,0.0134067869 5.68919297,0.0134067869 Z" id="Fill-1" fill="#D5D7DB" mask="url(#mask-2)"></path>\n                        </g>\n                        <g id="Group-6" transform="translate(0.000000, 12.964286)">\n                            <mask id="mask-4" fill="white">\n                                <use xlink:href="#path-3"></use>\n                            </mask>\n                            <g id="Clip-5"></g>\n                            <path d="M10.7972327,0.036762457 L10.3738975,0.036762457 C4.64452535,0.036762457 -1.95852535e-05,4.72261727 -1.95852535e-05,10.502948 L-1.95852535e-05,12.2668741 C3.25328687,13.6561611 6.83043548,14.4244085 10.5855161,14.4244085 C14.3405968,14.4244085 17.9177454,13.6559635 21.1711498,12.2667753 L21.1711498,10.502948 C21.1711498,4.72261727 16.5266048,0.036762457 10.7972327,0.036762457" id="Fill-4" fill="#D5D7DB" mask="url(#mask-4)"></path>\n                        </g>\n                    </g>\n                </g>\n            </g>\n        </svg>\n        <svg class="sk-mask" width="22px" height="28px" viewBox="0 0 22 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <!-- Generator: Sketch 41 (35326) - http://www.bohemiancoding.com/sketch -->\n            <title>Page 1</title>\n            <desc>Created with Sketch.</desc>\n            <defs>\n                <polygon id="path-1" points="11.3689165 0.0134364261 0.00946947005 0.0134364261 0.00946947005 11.4738879 11.3689165 11.4738879 11.3689165 0.0134364261"></polygon>\n                <polygon id="path-3" points="21.1710714 0.036762457 21.1710714 14.4243986 0 14.4243986 0 0.036762457 21.1710714 0.036762457"></polygon>\n            </defs>\n            <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="Navigation-Bar/Back" transform="translate(-11.000000, -30.000000)">\n                    <g id="Page-1" transform="translate(11.000000, 30.000000)">\n                        <g id="Group-3" transform="translate(4.903846, 0.000000)">\n                            <mask id="mask-2" fill="white">\n                                <use xlink:href="#path-1"></use>\n                            </mask>\n                            <g id="Clip-2"></g>\n                            <path d="M5.68919297,0.0134067869 C2.55241878,0.0134067869 0.00946947005,2.578875 0.00946947005,5.74364734 C0.00946947005,8.90841967 2.55241878,11.4738879 5.68919297,11.4738879 C8.82606509,11.4738879 11.3689165,8.90841967 11.3689165,5.74364734 C11.3689165,2.578875 8.82606509,0.0134067869 5.68919297,0.0134067869 Z" id="Fill-1" fill="#D5D7DB" mask="url(#mask-2)"></path>\n                        </g>\n                        <g id="Group-6" transform="translate(0.000000, 12.964286)">\n                            <mask id="mask-4" fill="white">\n                                <use xlink:href="#path-3"></use>\n                            </mask>\n                            <g id="Clip-5"></g>\n                            <path d="M10.7972327,0.036762457 L10.3738975,0.036762457 C4.64452535,0.036762457 -1.95852535e-05,4.72261727 -1.95852535e-05,10.502948 L-1.95852535e-05,12.2668741 C3.25328687,13.6561611 6.83043548,14.4244085 10.5855161,14.4244085 C14.3405968,14.4244085 17.9177454,13.6559635 21.1711498,12.2667753 L21.1711498,10.502948 C21.1711498,4.72261727 16.5266048,0.036762457 10.7972327,0.036762457" id="Fill-4" fill="#D5D7DB" mask="url(#mask-4)"></path>\n                        </g>\n                    </g>\n                </g>\n            </g>\n        </svg>\n    </div>\n\n    <!-- hot list,tinder, search tabs -->\n    <div class="sk-search-toggle {{activeComponent == \'search\' ? \'sk-tabs-item-active\' : \'\'}} {{activeSubComponent == \'hot-list\' || !activeSubComponent ? \'active-hot-list \' : \'\'}} {{activeSubComponent == \'tinder\' ? \'active-tinder\' : \'\'}} {{activeSubComponent == \'search\' ? \'active-search\' : \'\'}}">\n        <div class="sk-search-toggle-item sk-search-toggle-item-1" (tap)="changeComponent(\'search\', \'hot-list\')">\n            <svg version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"\n                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"\n                 x="0px" y="0px" width="26px" height="26px" viewBox="0 0 16 21" xml:space="preserve">\n            <g id="Symbols">\n                <g id="Rectangle" transform="translate(-13.000000, -4.000000)">\n                    <path id="Fill-1" style="fill:#D5D7DB;" d="M28.621,18.375c0.062-2.832-0.909-5.299-2.574-7.536\n                        c-1.706-2.295-3.792-4.22-5.919-6.108C19.859,4.493,19.581,4.265,19.269,4c-0.049,0.153-0.082,0.243-0.105,0.333\n                        c-0.476,1.884-1.275,3.629-2.278,5.285c-0.895,1.477-1.835,2.927-2.693,4.424c-0.885,1.544-1.386,3.214-1.122,5.012\n                        c0.341,2.326,1.711,3.702,3.584,4.599c0.589,0.427,1.287,0.751,2.055,1.007c-0.091-0.086-0.181-0.174-0.272-0.26\n                        c-1.254-1.193-1.501-2.357-0.8-3.939c0.396-0.893,0.835-1.765,1.264-2.665c0.703,0.574,1.085,1.364,1.265,2.366\n                        c0.568-0.863,0.927-1.709,1.165-2.609c0.23-0.877,0.288-1.771,0.189-2.752c1.195,0.877,2.129,1.918,2.723,3.234\n                        c1.084,2.405,0.51,4.948-1.488,6.634c-0.045,0.038-0.08,0.085-0.129,0.139c0.055,0.015,0.08,0.029,0.102,0.026\n                        c0.675-0.097,1.314-0.364,1.879-0.75C26.859,23.166,28.565,20.837,28.621,18.375l5.861-36.903"/>\n                </g>\n            </g>\n            </svg>\n        </div>\n        <div class="sk-search-toggle-item sk-search-toggle-item-2" (tap)="changeComponent(\'search\', \'tinder\')">\n            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="26px"\n            	 viewBox="0 0 372 318.9" style="enable-background:new 0 0 372 318.9;" xml:space="preserve" style="margin-bottom;-1px;">\n            <style type="text/css">\n            	.st0{fill:#D5D7DB;}\n            </style>\n            <path class="st0" d="M273.5,0c-38.1,0-71.1,21.6-87.5,53.2v0C169.6,21.6,136.6,0,98.5,0C44.1,0,0,44.1,0,98.5\n            	C0,237,186,318.9,186,318.9S372,237,372,98.5C372,44.1,327.9,0,273.5,0z M239,161.9l-93,83l37.7-77l-26.7-30l93-75l-40,75L239,161.9\n            	z"/>\n            </svg>\n        </div>\n        <div class="sk-search-toggle-item sk-search-toggle-item-3" (tap)="changeComponent(\'search\', \'search\')">\n            <svg class="nc-icon outline" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="26px" viewBox="0 0 32 32" style= "margin-top:1px;"><g transform="translate(0, 0)">\n                <line data-cap="butt" fill="none" stroke="#d5d7db" stroke-width="2" stroke-miterlimit="10" x1="30" y1="30" x2="21.5" y2="21.5" stroke-linejoin="miter" stroke-linecap="butt"></line>\n                <circle fill="none" stroke="#d5d7db" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" cx="13" cy="13" r="12" stroke-linejoin="miter"></circle>\n            </g></svg>\n        </div>\n        <div class="sk-search-toggle-background">\n        </div>\n    </div>\n\n    <!-- conversations tab -->\n    <div class="{{activeComponent == \'conversations\' ? \'sk-tabs-item sk-tabs-item-3 sk-tabs-item-active\' : \'sk-tabs-item sk-tabs-item-3\'}} {{getUnreadConversationsCount || getNewMatchedUsersCount ? \'sk-conversation-notification\' : \'\'}}" (tap)="changeComponent(\'conversations\')">\n        <svg class="sk-real" width="32px" height="24px" viewBox="0 0 32 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <defs>\n                <linearGradient x1="0%" y1="-9.29130979%" x2="84.899353%" y2="88.1787478%" id="linearGradient-1">\n                    <stop stop-color="#F08D31" offset="0%"></stop>\n                    <stop stop-color="#EE0E5C" offset="100%"></stop>\n                </linearGradient>\n                <polygon id="path-2" points="25.4920335 0.0221032141 7.56071995e-06 0.0221032141 7.56071995e-06 23.5431413 25.4920335 23.5431413 25.4920335 0.0221032141"></polygon>\n                <polygon id="path-4" points="0.0012853224 16.6314087 18.9030853 16.6314087 18.9030853 8.32677034 18.9030853 0.0221320131 0.0012853224 0.0221320131 0.0012853224 16.6314087"></polygon>\n            </defs>\n            <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="Ic_Bubble">\n                    <g id="Page-1">\n                        <g id="Group-3" transform="translate(0.000000, 0.049894)">\n                            <mask id="mask-3" fill="white">\n                                <use xlink:href="#path-2"></use>\n                            </mask>\n                            <g id="Clip-2"></g>\n                            <path d="M14.5137925,8.01214152 C16.5505748,6.43467761 19.2372011,5.5658845 22.0785952,5.5658845 C23.2547408,5.5658845 24.4041215,5.71520719 25.4920335,6.00154101 C24.8356118,4.91833953 23.9354325,3.92131898 22.812968,3.05202188 C20.2901825,1.09815535 16.941464,0.0220816149 13.3837673,0.0220816149 C9.82607046,0.0220816149 6.47735198,1.09815535 3.95456654,3.05202188 C1.4044113,5.02705566 7.56071995e-06,7.66086601 7.56071995e-06,10.4681902 C7.56071995e-06,12.1416987 0.491076324,13.7401139 1.45960455,15.2191573 C2.33513593,16.5560777 3.59354216,17.7488593 5.1093153,18.6806502 L5.07952607,23.1084208 C5.07846757,23.2634313 5.16465977,23.4070661 5.30544038,23.4848234 C5.37583068,23.523702 5.45446217,23.5431413 5.53316926,23.5431413 C5.61172515,23.5431413 5.69035663,23.523774 5.76074694,23.4848954 L10.7745628,20.7155138 C11.6310411,20.8474852 12.5079334,20.9143708 13.3837673,20.9143708 C13.874836,20.9143708 14.3615952,20.8931315 14.8430618,20.852597 C14.7316924,20.7731118 14.6216083,20.6920427 14.5137925,20.6085257 C12.37116,18.9491287 11.1911585,16.7123842 11.1911585,14.3103336 C11.1911585,11.908355 12.37116,9.67161052 14.5137925,8.01214152 Z" id="Fill-1" fill="#D5D8DB" mask="url(#mask-3)"></path>\n                        </g>\n                        <g id="Group-6" transform="translate(12.626402, 6.961648)">\n                            <mask id="mask-5" fill="white">\n                                <use xlink:href="#path-4"></use>\n                            </mask>\n                            <g id="Clip-5"></g>\n                            <path d="M16.110609,2.16167994 C15.3844774,1.59923594 14.5613418,1.13996427 13.6708402,0.793008604 C12.3767474,0.288810531 10.9403618,0.0221320131 9.4521853,0.0221320131 C6.93990926,0.0221320131 4.57529409,0.781920998 2.79376164,2.16167994 C0.993024962,3.55634235 0.0012853224,5.41618022 0.0012853224,7.39855774 C0.0012853224,9.38100725 0.993024962,11.2408451 2.79376164,12.6355075 C3.27802576,13.0106142 3.80576401,13.3394265 4.3675255,13.6200725 C5.87210878,14.3717978 7.6228691,14.7750555 9.4521853,14.7750555 C10.0706522,14.7750555 10.6898752,14.7278251 11.2946572,14.6346605 L14.8351155,16.5902549 C14.884865,16.6176859 14.9403607,16.6314375 14.9958564,16.6314375 C15.0514277,16.6314375 15.1069234,16.617614 15.1566729,16.5901829 C15.2560208,16.5353209 15.3169602,16.4338045 15.3162041,16.3244404 L15.2951853,13.1977355 C16.3655564,12.5398229 17.2541679,11.6975249 17.8724079,10.7534225 C18.5562751,9.70902759 18.9030853,8.58032372 18.9030853,7.39855774 C18.9030853,5.41618022 17.9113456,3.55634235 16.110609,2.16167994" id="Fill-4" fill="#D5D7DB" mask="url(#mask-5)"></path>\n                        </g>\n                    </g>\n                </g>\n            </g>\n        </svg>\n        <svg class="sk-mask" width="32px" height="24px" viewBox="0 0 32 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <defs>\n                <linearGradient x1="0%" y1="-9.29130979%" x2="84.899353%" y2="88.1787478%" id="linearGradient-1">\n                    <stop stop-color="#F08D31" offset="0%"></stop>\n                    <stop stop-color="#EE0E5C" offset="100%"></stop>\n                </linearGradient>\n                <polygon id="path-2" points="25.4920335 0.0221032141 7.56071995e-06 0.0221032141 7.56071995e-06 23.5431413 25.4920335 23.5431413 25.4920335 0.0221032141"></polygon>\n                <polygon id="path-4" points="0.0012853224 16.6314087 18.9030853 16.6314087 18.9030853 8.32677034 18.9030853 0.0221320131 0.0012853224 0.0221320131 0.0012853224 16.6314087"></polygon>\n            </defs>\n            <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="Ic_Bubble">\n                    <g id="Page-1">\n                        <g id="Group-3" transform="translate(0.000000, 0.049894)">\n                            <mask id="mask-3" fill="white">\n                                <use xlink:href="#path-2"></use>\n                            </mask>\n                            <g id="Clip-2"></g>\n                            <path d="M14.5137925,8.01214152 C16.5505748,6.43467761 19.2372011,5.5658845 22.0785952,5.5658845 C23.2547408,5.5658845 24.4041215,5.71520719 25.4920335,6.00154101 C24.8356118,4.91833953 23.9354325,3.92131898 22.812968,3.05202188 C20.2901825,1.09815535 16.941464,0.0220816149 13.3837673,0.0220816149 C9.82607046,0.0220816149 6.47735198,1.09815535 3.95456654,3.05202188 C1.4044113,5.02705566 7.56071995e-06,7.66086601 7.56071995e-06,10.4681902 C7.56071995e-06,12.1416987 0.491076324,13.7401139 1.45960455,15.2191573 C2.33513593,16.5560777 3.59354216,17.7488593 5.1093153,18.6806502 L5.07952607,23.1084208 C5.07846757,23.2634313 5.16465977,23.4070661 5.30544038,23.4848234 C5.37583068,23.523702 5.45446217,23.5431413 5.53316926,23.5431413 C5.61172515,23.5431413 5.69035663,23.523774 5.76074694,23.4848954 L10.7745628,20.7155138 C11.6310411,20.8474852 12.5079334,20.9143708 13.3837673,20.9143708 C13.874836,20.9143708 14.3615952,20.8931315 14.8430618,20.852597 C14.7316924,20.7731118 14.6216083,20.6920427 14.5137925,20.6085257 C12.37116,18.9491287 11.1911585,16.7123842 11.1911585,14.3103336 C11.1911585,11.908355 12.37116,9.67161052 14.5137925,8.01214152 Z" id="Fill-1" fill="#D5D8DB" mask="url(#mask-3)"></path>\n                        </g>\n                        <g id="Group-6" transform="translate(12.626402, 6.961648)">\n                            <mask id="mask-5" fill="white">\n                                <use xlink:href="#path-4"></use>\n                            </mask>\n                            <g id="Clip-5"></g>\n                            <path d="M16.110609,2.16167994 C15.3844774,1.59923594 14.5613418,1.13996427 13.6708402,0.793008604 C12.3767474,0.288810531 10.9403618,0.0221320131 9.4521853,0.0221320131 C6.93990926,0.0221320131 4.57529409,0.781920998 2.79376164,2.16167994 C0.993024962,3.55634235 0.0012853224,5.41618022 0.0012853224,7.39855774 C0.0012853224,9.38100725 0.993024962,11.2408451 2.79376164,12.6355075 C3.27802576,13.0106142 3.80576401,13.3394265 4.3675255,13.6200725 C5.87210878,14.3717978 7.6228691,14.7750555 9.4521853,14.7750555 C10.0706522,14.7750555 10.6898752,14.7278251 11.2946572,14.6346605 L14.8351155,16.5902549 C14.884865,16.6176859 14.9403607,16.6314375 14.9958564,16.6314375 C15.0514277,16.6314375 15.1069234,16.617614 15.1566729,16.5901829 C15.2560208,16.5353209 15.3169602,16.4338045 15.3162041,16.3244404 L15.2951853,13.1977355 C16.3655564,12.5398229 17.2541679,11.6975249 17.8724079,10.7534225 C18.5562751,9.70902759 18.9030853,8.58032372 18.9030853,7.39855774 C18.9030853,5.41618022 17.9113456,3.55634235 16.110609,2.16167994" id="Fill-4" fill="#D5D7DB" mask="url(#mask-5)"></path>\n                        </g>\n                    </g>\n                </g>\n            </g>\n        </svg>\n    </div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\dashboard\components\tabs\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], DashboardTabsComponent);
    return DashboardTabsComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 593:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MembershipsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__viewMembership_index__ = __webpack_require__(471);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var MembershipsComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function MembershipsComponent(auth, api, config, http, loadingCtrl, nav) {
        this.auth = auth;
        this.api = api;
        this.config = config;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.nav = nav;
        this.memberships = [];
        this.currentMembership = '';
        this.loadMemberships();
    }
    MembershipsComponent.prototype.viewMembership = function (membershipId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_6__viewMembership_index__["a" /* ViewMembershipComponent */], { 'mewmbershipId': membershipId });
    };
    MembershipsComponent.prototype.loadMemberships = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loader, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/memberships/')
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        _a.memberships = _b.sent();
                        this.memberships.forEach(function (membership) {
                            if (membership.current == true) {
                                _this.currentMembership = membership.title;
                            }
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        loader.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    MembershipsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
            selector: 'memberships',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\inapps\components\memberships\index.html"*/'<div class="sk-memberships-head">\n    <span>{{ \'your_membership\' | translate }}:</span>\n    <button color="stable" class="sk-memberships-info">{{ currentMembership | translate }}<img src="assets/img/ic_info.svg" alt=""></button>\n</div>\n\n<div class="sk-membership-item-container" *ngFor="let membership of memberships">\n    <div class="sk-membership-item" *ngIf="membership?.plans?.length > 0" (click)="viewMembership(membership.id)">\n        <div class="wrap">\n            <span>{{ membership.title }}</span>\n            <p>\n                <span class="plan" *ngFor="let plan of membership.plans">{{plan.plan_format}}</span>\n            </p>\n        </div>\n        <ion-icon name="ios-arrow-forward"></ion-icon>\n    </div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\inapps\components\memberships\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_0_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_4__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_3__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */]])
    ], MembershipsComponent);
    return MembershipsComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreditsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_inapps_index__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_api_utils__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_dashboard_index__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var CreditsComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function CreditsComponent(auth, apiUtils, config, http, iaps, loadingCtrl, nav) {
        this.auth = auth;
        this.apiUtils = apiUtils;
        this.config = config;
        this.http = http;
        this.iaps = iaps;
        this.loadingCtrl = loadingCtrl;
        this.nav = nav;
        this.creditPacks = [];
        this.creditBalance = 0;
        this.loadCreditPacks();
    }
    CreditsComponent.prototype.buyPack = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.iaps.buyProduct(productId)];
                    case 3:
                        result = _a.sent();
                        if (result) {
                            this.apiUtils.clearUserData(this.auth.getUserId(), true);
                            this.nav.push(__WEBPACK_IMPORTED_MODULE_7__pages_dashboard_index__["a" /* DashboardPage */]);
                        }
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreditsComponent.prototype.loadCreditPacks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, data, products_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        return [4 /*yield*/, loader.present()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.http.get(this.config.getApiUrl() + '/credits/')
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, this.iaps.getProducts(data['packs'])];
                    case 4:
                        products_1 = _a.sent();
                        data['packs'] = data['packs'].filter(function (el) {
                            for (var key in products_1) {
                                if (el['productId'].toLowerCase() == products_1[key]['productId']) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        this.creditPacks = data['packs'];
                        this.creditBalance = data['balance'];
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        loader.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreditsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'credits',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\inapps\components\credits\index.html"*/'<div class="sk-memberships-head">\n    <span>{{ \'your_credits\' | translate }}:</span>\n    <button color="stable" class="sk-memberships-info">{{ creditBalance }}<img src="assets/img/ic_info.svg" alt=""></button>\n</div>\n\n<div class="sk-membership-item" *ngFor="let pack of creditPacks" (click)="buyPack(pack.productId)">\n    <div class="wrap">\n        <span>{{ pack.credits }}{{ \'credits\' | translate }}</span>\n    </div>\n    <div class="sk-credits-price">{{ currency }}{{ pack.price }}</div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\inapps\components\credits\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_6__services_api_utils__["a" /* ApiUtilsService */],
            __WEBPACK_IMPORTED_MODULE_3__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_2__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_5__services_inapps_index__["a" /* InAppsService */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["o" /* NavController */]])
    ], CreditsComponent);
    return CreditsComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 595:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_questions_questions_base__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_sprintf_js__ = __webpack_require__(596);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_sprintf_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_sprintf_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_questions_validators_index__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_questions_validators_require__ = __webpack_require__(160);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// validators


var QuestionComponent = /** @class */ (function () {
    function QuestionComponent(events, ref, validators, requireValidator, alert, translate) {
        // -- init callbacks --//
        var _this = this;
        this.events = events;
        this.ref = ref;
        this.validators = validators;
        this.requireValidator = requireValidator;
        this.alert = alert;
        this.translate = translate;
        this.baseQuestionClass = 'sk-base-question-presentation';
        this.baseQuestionWarningClass = 'sk-question-warning';
        // async validator finished validation process handler
        this.asyncValidatorFinishedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    QuestionComponent.prototype.ngOnInit = function () {
        var _this = this;
        // async validator finished
        this.events.subscribe('asyncValidator:finished', this.asyncValidatorFinishedHandler);
        this.form.valueChanges.subscribe(function () {
            _this.ref.markForCheck();
        });
    };
    /**
     * Component destroy
     */
    QuestionComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('asyncValidator:finished', this.asyncValidatorFinishedHandler);
    };
    Object.defineProperty(QuestionComponent.prototype, "isValid", {
        /**
         * Is question valid
         */
        get: function () {
            var control = this.form.controls[this.question.key];
            if ((!control.valid && control.dirty && !control.pending)
                || (this.hasGroupError() && control.dirty && !control.pending)) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionComponent.prototype, "getQuestionClass", {
        /**
         * Get question class
         */
        get: function () {
            var params = this.question.params;
            var control = this.form.controls[this.question.key];
            var hideWarning = params && params.hideWarning && params.hideWarning == true;
            var appliedRequireValidators = [];
            if (this.question.validators && this.question.validators.length) {
                appliedRequireValidators = this.question.validators.filter(function (validator) {
                    return validator.name == 'require';
                });
            }
            var warning = !hideWarning && appliedRequireValidators.length && !this.requireValidator.isValid(control.value)
                ? this.baseQuestionWarningClass
                : '';
            if (params && params.questionClass) {
                return this.baseQuestionClass + " " + warning + " " + params.questionClass;
            }
            return this.baseQuestionClass + " " + warning;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show errors
     */
    QuestionComponent.prototype.showErrors = function (event) {
        event.stopPropagation();
        var errors = '';
        this.getErrors().forEach(function (error) {
            errors += error + "<br />";
        });
        var alert = this.alert.create({
            subTitle: errors,
            buttons: [this.translate.instant('ok')]
        });
        alert.present();
    };
    Object.defineProperty(QuestionComponent.prototype, "hasVisibleErrors", {
        /**
         * Has visible errors
         */
        get: function () {
            var params = this.question.params;
            var hideErrors = params && params.hideErrors && params.hideErrors == true;
            return !hideErrors && !this.isValid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get list of errors
     */
    QuestionComponent.prototype.getErrors = function () {
        var _this = this;
        var control = this.form.controls[this.question.key];
        var errors = [];
        // check all assigned question's validators
        this.question.validators.forEach(function (validator) {
            if (control.hasError(validator.name)) {
                var message = !validator.message
                    ? _this.validators.getDefaultMessage(validator.name)
                    : validator.message;
                errors.push(Object(__WEBPACK_IMPORTED_MODULE_4_sprintf_js__["sprintf"])(message, control.value));
            }
        });
        // check a group error
        if (this.hasGroupError()) {
            var groupError = control.parent.errors;
            errors.push(Object(__WEBPACK_IMPORTED_MODULE_4_sprintf_js__["sprintf"])(groupError.message, control.value));
        }
        return errors;
    };
    /**
     * Has group error
     */
    QuestionComponent.prototype.hasGroupError = function () {
        var control = this.form.controls[this.question.key];
        if (control.parent) {
            var groupError = control.parent.errors;
            if (groupError
                && groupError.question
                && groupError.message
                && groupError.question == this.question.key) {
                return true;
            }
        }
        return false;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__services_questions_questions_base__["a" /* QuestionBase */])
    ], QuestionComponent.prototype, "question", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* FormGroup */])
    ], QuestionComponent.prototype, "form", void 0);
    QuestionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'question',template:/*ion-inline-start:"G:\attheclubb\application\src\shared\components\question\index.html"*/'<div [class]="getQuestionClass">\n\n    <!-- text -->\n    <div class="{{question.stackedInput ? \'sk-stacked-text-question-presentation\' : \'sk-text-question-presentation\'}}" *ngIf="question.controlType == \'text\'">\n        <ion-item [formGroup]="form">\n            <ion-label *ngIf="question.stackedInput" stacked>{{question.label}}</ion-label>\n            <ion-input changeFocusByEnter [type]="question.type" [placeholder]="question.label" [formControlName]="question.key" [id]="question.key"></ion-input>\n        </ion-item>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- select -->\n    <div class="sk-select-question-presentation" *ngIf="question.controlType == \'select\'">\n        <ion-item [formGroup]="form">\n            <ion-label>{{question.label}}</ion-label>\n            <ion-select [formControlName]="question.key" [multiple]="question.multiple" [id]="question.key" cancelText="{{ \'cancel\' | translate }}" okText="{{ \'ok\' | translate }}">\n                <ion-option *ngIf="!question.multiple && !question.hideEmptyValue" value="">{{ \'select_input_empty_value\' | translate }}</ion-option>\n                <ion-option *ngFor="let opt of question.values" [value]="opt.value">{{opt.title}}</ion-option>\n            </ion-select>\n        </ion-item>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- date -->\n    <div class="sk-date-question-presentation" *ngIf="question.controlType == \'date\'">\n        <ion-item [formGroup]="form">\n            <ion-label>{{question.label}}</ion-label>\n            <ion-datetime [displayFormat]="question.displayFormat"\n                    monthNames="{{ \'date_input_months\' | translate }}"\n                    monthShortNames="{{ \'date_input_months_short\' | translate }}"\n                    dayNames="{{ \'date_input_days\' | translate }}"\n                    dayShortNames="{{ \'date_input_days_short\' | translate }}"\n                    [min]="question.minDate"\n                    [max]="question.maxDate"\n                    [formControlName]="question.key"\n                    [id]="question.key"\n                    placeholder="{{ \'choose_date\' | translate }}"\n                    cancelText="{{ \'cancel\' | translate }}"\n                    doneText="{{ \'done\' | translate }}">\n            </ion-datetime>\n            <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n        </ion-item>\n    </div>\n\n    <!-- date range -->\n    <div class="sk-date-range-question-presentation" *ngIf="question.controlType == \'date_range\'" id="question.key">\n        <ion-label>{{question.label}} {{ \'from\' | translate }}</ion-label>\n        <div class="sk-date-range-question-wrap">\n              <div class="wrap">\n                    <ion-item>\n                        <ion-datetime [displayFormat]="question.displayFormat"\n                            [(ngModel)]="question.value.start"\n                            monthNames="{{ \'date_input_months\' | translate }}"\n                            monthShortNames="{{ \'date_input_months_short\' | translate }}"\n                            dayNames="{{ \'date_input_days\' | translate }}"\n                            dayShortNames="{{ \'date_input_days_short\' | translate }}"\n                            [min]="question.minDate"\n                            [max]="question.maxDate"\n                            placeholder="{{ \'choose_date\' | translate }}"\n                            cancelText="{{ \'cancel\' | translate }}"\n                            doneText="{{ \'done\' | translate }}" (ionChange)="question.update()">\n                        </ion-datetime>\n                    </ion-item>\n                    <span>{{ \'to\' | translate }}</span>\n                    <ion-item>\n                        <ion-datetime [displayFormat]="question.displayFormat"\n                            [(ngModel)]="question.value.end"\n                            monthNames="{{ \'date_input_months\' | translate }}"\n                            monthShortNames="{{ \'date_input_months_short\' | translate }}"\n                            dayNames="{{ \'date_input_days\' | translate }}"\n                            dayShortNames="{{ \'date_input_days_short\' | translate }}"\n                            [min]="question.minDate"\n                            [max]="question.maxDate"\n                            placeholder="{{ \'choose_date\' | translate }}"\n                            cancelText="{{ \'cancel\' | translate }}"\n                            doneText="{{ \'done\' | translate }}" (ionChange)="question.update()">\n                        </ion-datetime>\n                    </ion-item>\n              </div>\n        </div>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- googlemap location -->\n    <div class="sk-googlemap-location-question-presentation" *ngIf="question.controlType == \'googlemap_location\'" (click)="question.showAddressModal()">\n        <ion-item>\n            <ion-label stacked>{{question.label}}</ion-label>\n            <ion-input readonly="true" [id]="question.key" type="text" placeholder="{{ \'choose_location_input\' | translate }}" value="{{question.value}}"></ion-input>\n        </ion-item>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- extended googlemap location -->\n    <div class="sk-extended-googlemap-location-question-presentation" id="question.key" *ngIf="question.controlType == \'extended_googlemap_location\'" (click)="question.showAddressModal()">\n        <ion-item>\n            <ion-label stacked><span>{{question.label}}</span> <span>{{question.value.distance}} {{ question.unit | translate }} {{ \'from\' | translate }}</span></ion-label>\n            <ion-range min="{{question.min}}" max="{{question.max}}" step="{{question.step}}" [(ngModel)]="question.value.distance"></ion-range>\n            <ion-input readonly="true" type="text" placeholder="{{ \'choose_location_input\' | translate }}" value="{{question.value.location}}"></ion-input>\n        </ion-item>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- range -->\n    <div class="sk-range-question-presentation" *ngIf="question.controlType == \'range\'">\n        <ion-item [formGroup]="form">\n            <ion-label stacked><span>{{question.label}}</span><span>{{question.value.lower}}-{{question.value.upper}}</span></ion-label>\n            <ion-range (ionChange)="question.onChangeRange()" [formControlName]="question.key" [id]="question.key" dualKnobs="true" min="{{question.min}}" max="{{question.max}}"></ion-range>\n        </ion-item>\n    </div>\n\n    <!-- textarea -->\n    <div class="sk-textarea-question-presentation" *ngIf="question.controlType == \'textarea\'">\n        <ion-item [formGroup]="form">\n            <ion-label stacked>{{question.label}}</ion-label>\n            <ion-textarea rows="1" autosize [spellcheck]=false [type]="question.type" [placeholder]="question.label" [formControlName]="question.key" [id]="question.key"></ion-textarea>\n        </ion-item>\n        <div *ngIf="hasVisibleErrors" class="sk-question-error" (click)="showErrors($event)"></div>\n    </div>\n\n    <!-- checkbox -->\n    <div class="sk-checkbox-question-presentation" *ngIf="question.controlType == \'checkbox\'">\n        <ion-item [formGroup]="form">\n            <ion-label>{{question.label}}</ion-label>\n            <ion-toggle [formControlName]="question.key" [id]="question.key"></ion-toggle>\n        </ion-item>\n    </div>\n</div>\n'/*ion-inline-end:"G:\attheclubb\application\src\shared\components\question\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
            __WEBPACK_IMPORTED_MODULE_6__services_questions_validators_index__["a" /* Validators */],
            __WEBPACK_IMPORTED_MODULE_7__services_questions_validators_require__["a" /* RequireValidator */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5_ng2_translate__["c" /* TranslateService */]])
    ], QuestionComponent);
    return QuestionComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 597:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AvatarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AvatarComponent = /** @class */ (function () {
    /**
     * Constructor
     */
    function AvatarComponent(events, api, ref) {
        // -- init callbacks --//
        var _this = this;
        this.events = events;
        this.api = api;
        this.ref = ref;
        this.isAvatarActive = true;
        this.useBigAvatar = false;
        // configs updated handler
        this.configsUpdatedHandler = function () {
            _this.ref.markForCheck();
        };
    }
    /**
     * Component init
     */
    AvatarComponent.prototype.ngOnInit = function () {
        this.events.subscribe('configs:updated', this.configsUpdatedHandler);
    };
    /**
     * Component destroy
     */
    AvatarComponent.prototype.ngOnDestroy = function () {
        this.events.unsubscribe('configs:updated', this.configsUpdatedHandler);
    };
    Object.defineProperty(AvatarComponent.prototype, "defaultAvatar", {
        /**
         * Get default avatar
         */
        get: function () {
            return this.api.get('configs', 'defaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvatarComponent.prototype, "bigDefaultAvatar", {
        /**
         * Get big default avatar
         */
        get: function () {
            return this.api.get('configs', 'bigDefaultAvatar').value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AvatarComponent.prototype, "isAvatarActive", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], AvatarComponent.prototype, "url", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AvatarComponent.prototype, "useBigAvatar", void 0);
    AvatarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'user-avatar',template:/*ion-inline-start:"G:\attheclubb\application\src\shared\components\avatar\index.html"*/'<div *ngIf="!url || !isAvatarActive" class="{{useBigAvatar ? \'sk-no-big-avatar\' : \'sk-no-sm-avatar\'}}">\n    <img src="{{useBigAvatar ? bigDefaultAvatar : defaultAvatar}}" />\n</div>\n<img *ngIf="url && isAvatarActive" src="{{url}}" />\n'/*ion-inline-end:"G:\attheclubb\application\src\shared\components\avatar\index.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]])
    ], AvatarComponent);
    return AvatarComponent;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 598:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AutosizeDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_js_data__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var AutosizeDirective = /** @class */ (function () {
    /**
     * Constructor
     */
    function AutosizeDirective(api, element, ngZone, model) {
        this.api = api;
        this.element = element;
        this.ngZone = ngZone;
        this.model = model;
        this.debounceTime = 100;
    }
    AutosizeDirective.prototype.onInput = function () {
        // this is run whenever the user changes the input.
        this.adjust();
    };
    /**
     * View in init
     */
    AutosizeDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.model) {
            return;
        }
        // listen for changes to the underlying model
        // to adjust the textarea size.
        this.modelSub = this.model
            .valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(function () { return _this.adjust(); });
    };
    /**
     * View destroy
     */
    AutosizeDirective.prototype.ngOnDestroy = function () {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }
    };
    /**
     * After view init
     */
    AutosizeDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.isTextarea(this.element.nativeElement)) {
            this.setupTextarea(this.element.nativeElement);
            return;
        }
        var children = Array.from(this.element.nativeElement.children);
        var textareaEl = children.find(function (el) { return _this.isTextarea(el); });
        if (textareaEl) {
            this.setupTextarea(textareaEl);
            return;
        }
        throw new Error('The `autosize` attribute directive must be used on a `textarea` or an element that contains a `textarea`.');
    };
    Object.defineProperty(AutosizeDirective.prototype, "maxHeight", {
        /**
         * Max textarea height
         */
        get: function () {
            return this.api.get('configs', 'maxTextareaHeight').value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if is it a textarea
     */
    AutosizeDirective.prototype.isTextarea = function (el) {
        return el.tagName === 'TEXTAREA';
    };
    /**
     * Setup textarea
     */
    AutosizeDirective.prototype.setupTextarea = function (textareaEl) {
        var _this = this;
        this.textareaEl = textareaEl;
        // Set some necessary styles
        var style = this.textareaEl.style;
        style.overflow = 'hidden';
        style.resize = 'none';
        // Listen for window resize events
        this.ngZone.runOutsideAngular(function () {
            __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].fromEvent(window, 'resize')
                .debounceTime(_this.debounceTime)
                .subscribe(function () { return _this.adjust(); });
        });
        // ensure we adjust the textarea if
        // content is already present
        this.adjust();
    };
    /**
     * Adjust textarea height
     */
    AutosizeDirective.prototype.adjust = function () {
        if (!this.textareaEl) {
            return;
        }
        if (this.textareaEl.scrollHeight <= this.maxHeight) {
            this.textareaEl.style.height = 'auto';
            this.textareaEl.style.height = this.textareaEl.scrollHeight + 'px';
            return;
        }
        this.textareaEl.style.overflow = 'auto';
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('input'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AutosizeDirective.prototype, "onInput", null);
    AutosizeDirective = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[autosize]'
        }),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"])()),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* NgModel */]])
    ], AutosizeDirective);
    return AutosizeDirective;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessagesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_permissions_index__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_http_errorHandler__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_http_index__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_config_index__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_photoUploader_index__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__profile_view_index__ = __webpack_require__(51);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




// services





// pages


var MessagesPage = /** @class */ (function () {
    /**
     * Constructor
     */
    function MessagesPage(nav, toast, alert, photoUploader, translate, actionSheetCtrl, config, http, events, httpErrorHandler, loadingCtrl, permissions, navParams, api) {
        var _this = this;
        this.nav = nav;
        this.toast = toast;
        this.alert = alert;
        this.photoUploader = photoUploader;
        this.translate = translate;
        this.actionSheetCtrl = actionSheetCtrl;
        this.config = config;
        this.http = http;
        this.events = events;
        this.httpErrorHandler = httpErrorHandler;
        this.loadingCtrl = loadingCtrl;
        this.permissions = permissions;
        this.navParams = navParams;
        this.api = api;
        this.infiniteScroll = null;
        this.conversationId = 0;
        this.isConversationEmpty = true;
        this.pageReady = false;
        this.message = '';
        this.needToScrollContent = false;
        this.contentScrolled = false;
        this.fetchHistory = true;
        this.messages = [];
        this.unreadMessageId = 0;
        this.userId = this.navParams.get('userId');
        this.conversationId = this.navParams.get('conversationId');
        // try to find user's conversation
        if (!this.conversationId) {
            var conversation = this.getConversation();
            if (conversation) {
                this.conversationId = conversation.id;
            }
        }
        // -- init callbacks --//
        // permissions updated handler
        this.permissionsUpdatedHandler = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.permissions.isActionAllowed('mailbox_read_chat_message') && this.checkForEmptyMessages())) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadMessages(true)];
                    case 1:
                        _a.sent();
                        // mark conversation as read
                        if (!this.checkForEmptyMessages()) {
                            this.markConversationAsRead();
                        }
                        // mark messages as read
                        this.markMessagesAsRead();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        // conversations updated handler
        this.conversationsUpdatedHandler = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.markAsReadOutcomigMessages();
                this.setMessages();
                if (!this.messages.length) {
                    this.isConversationEmpty = true;
                }
                return [2 /*return*/];
            });
        }); };
        // messages updated handler
        this.messagesUpdatedHandler = function (updatedMessages) {
            if (_this.conversationId) {
                var isThereNewMessages_1 = false;
                var isThereUpdatedMessages_1 = false;
                // check for new messages
                updatedMessages.newMessages.every(function (message) {
                    if (message.conversationId == _this.conversationId) {
                        isThereNewMessages_1 = true;
                        return false;
                    }
                    return true;
                });
                // check for updated messages
                updatedMessages.updatedMessages.every(function (message) {
                    if (message.conversationId == _this.conversationId) {
                        isThereUpdatedMessages_1 = true;
                        return false;
                    }
                    return true;
                });
                if (isThereNewMessages_1 || isThereUpdatedMessages_1) {
                    _this.setMessages();
                    if (isThereNewMessages_1) {
                        _this.needToScrollContent = true;
                        // mark conversation as read
                        if (!_this.checkForEmptyMessages()) {
                            _this.markConversationAsRead();
                        }
                        // mark messages as read
                        _this.markMessagesAsRead();
                    }
                }
            }
        };
    }
    /**
     * Page will be active
     */
    MessagesPage.prototype.ionViewWillEnter = function () {
        // don't handle http errors
        this.httpErrorHandler.setHandleHttpErrors(false);
        // refresh messages list
        this.events.subscribe('permissions:updated', this.permissionsUpdatedHandler);
        // change status of outcoming messages
        this.events.subscribe('conversations:updated', this.conversationsUpdatedHandler);
        // new messages
        this.events.subscribe('messages:updated', this.messagesUpdatedHandler);
    };
    /**
     * Page will leave
     */
    MessagesPage.prototype.ionViewWillLeave = function () {
        this.httpErrorHandler.setHandleHttpErrors(true);
        this.events.unsubscribe('permissions:updated', this.permissionsUpdatedHandler);
        this.events.unsubscribe('conversations:updated', this.conversationsUpdatedHandler);
        this.events.unsubscribe('messages:updated', this.messagesUpdatedHandler);
        this.fetchHistory = false;
    };
    /**
     * Component init
     */
    MessagesPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setMessages();
                        if (!(this.permissions.isActionAllowed('mailbox_read_chat_message') && this.checkForEmptyMessages())) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadMessages(true)]; // force to load new messages
                    case 1:
                        _a = _b.sent(); // force to load new messages
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.loadMessages()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        _a;
                        // mark conversation as read
                        if (this.messages.length && !this.checkForEmptyMessages()) {
                            this.markConversationAsRead();
                        }
                        // mark user match as viewed
                        if (this.user.matchActions.isMutual && this.user.matchActions.isNew) {
                            this.markMatchedUser();
                        }
                        this.markMessagesAsRead();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * View rendered
     */
    MessagesPage.prototype.ngAfterViewChecked = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.needToScrollContent) return [3 /*break*/, 2];
                        this.needToScrollContent = false;
                        return [4 /*yield*/, this.content.scrollToBottom()];
                    case 1:
                        _a.sent();
                        this.contentScrolled = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set messages
     */
    MessagesPage.prototype.setMessages = function () {
        this.messages = this.api.filter('messages', {
            where: {
                conversationId: this.conversationId
            }, orderBy: [
                ['timeStamp', 'ASC']
            ]
        });
    };
    /**
     * Message tracked
     */
    MessagesPage.prototype.messageTrackedEvent = function () {
        this.setMessages();
        if (!this.checkForEmptyMessages()) {
            this.markConversationAsRead();
        }
        this.markMessagesAsRead();
    };
    /**
     * Message deleted
     */
    MessagesPage.prototype.messageDeletedEvent = function () {
        this.setMessages();
        if (!this.messages.length) {
            this.isConversationEmpty = true;
        }
    };
    /**
     * Message delivered
     */
    MessagesPage.prototype.messageDeliveredEvent = function (message) {
        this.setMessages();
        if (!this.conversationId) {
            this.isConversationEmpty = false;
            this.conversationId = message.conversationId;
        }
    };
    /**
     * Load more messages
     */
    MessagesPage.prototype.loadMoreMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var url, oldMessages, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.messages) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        url = this.config.getApiUrl()
                            + ("/mailbox/messages/history/?beforeMessageId=" + this.messages[0].id + "&conversationId=" + this.conversationId + "&limit=" + this.messagesLimit);
                        return [4 /*yield*/, this.http.get(url, true)
                                .map(function (res) { return res.json(); })
                                .toPromise()];
                    case 2:
                        oldMessages = _a.sent();
                        if (!oldMessages.length) {
                            this.fetchHistory = false;
                            if (this.infiniteScroll) {
                                this.infiniteScroll.complete();
                                this.infiniteScroll.enable(false);
                            }
                            return [2 /*return*/];
                        }
                        oldMessages.forEach(function (message) { return _this.api.add('messages', message); });
                        this.setMessages();
                        this.findUnreadMessageId();
                        this.markMessagesAsRead();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.infiniteScroll) {
                            this.infiniteScroll.complete();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MessagesPage.prototype, "toastDuration", {
        /**
         * Get toast duration
         */
        get: function () {
            return this.api.get('configs', 'toastDuration').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "messagesLimit", {
        /**
         * Get messages limit
         */
        get: function () {
            return this.api.get('configs', 'messagesLimit').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "attachMaxUploadSize", {
        /**
         * Attach max upload size
         */
        get: function () {
            return this.api.get('configs', 'attachMaxUploadSize').value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "isCheckLoadMoreActive", {
        /**
         * Is check load more active
         */
        get: function () {
            return this.contentScrolled && this.fetchHistory
                && this.conversationId && this.messages.length >= this.messagesLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "isSendMessageAreaAllowed", {
        /**
         * Is send message area allowed
         */
        get: function () {
            // continue the conversation
            if (this.conversationId && !this.isConversationEmpty) {
                return this.permissions.isActionAllowed('mailbox_reply_to_chat_message')
                    || this.permissions.isActionPromoted('mailbox_reply_to_chat_message');
            }
            // start a new conversation
            return this.permissions.isActionAllowed('mailbox_send_chat_message')
                || this.permissions.isActionPromoted('mailbox_send_chat_message');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "isSendMessageAreaPromoted", {
        /**
         * Is send message area promoted
         */
        get: function () {
            // continue the conversation
            if (this.conversationId && !this.isConversationEmpty) {
                return this.permissions.isActionPromoted('mailbox_reply_to_chat_message');
            }
            // start a new conversation
            return this.permissions.isActionPromoted('mailbox_send_chat_message');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesPage.prototype, "isMessageValid", {
        /**
         * Is message valid
         */
        get: function () {
            return this.message.trim() != '' || this.isSendMessageAreaPromoted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show conversation actions
     */
    MessagesPage.prototype.showConversationActions = function () {
        var _this = this;
        var buttons = [];
        buttons.push({
            text: this.user.blocks.isBlocked
                ? this.translate.instant('unblock_profile')
                : this.translate.instant('block_profile'),
            handler: function () {
                // unblock profile
                if (_this.user.blocks.isBlocked) {
                    _this.unblockUser();
                    return;
                }
                // block profile
                var confirm = _this.alert.create({
                    message: _this.translate.instant('block_profile_confirmation'),
                    buttons: [
                        {
                            text: _this.translate.instant('cancel')
                        },
                        {
                            text: _this.translate.instant('block_profile'),
                            handler: function () {
                                _this.blockUser();
                            }
                        }
                    ]
                });
                confirm.present();
            }
        });
        if (this.conversationId) {
            // delete conversation
            buttons.push({
                text: this.translate.instant('delete_conversation'),
                handler: function () {
                    var buttons = [{
                            text: _this.translate.instant('no')
                        }, {
                            text: _this.translate.instant('yes'),
                            handler: function () { return _this.deleteConversation(); }
                        }];
                    var confirm = _this.alert.create({
                        message: _this.translate.instant('delete_conversation_confirmation'),
                        buttons: buttons
                    });
                    confirm.present();
                }
            });
            // mark as unread conversation
            buttons.push({
                text: this.translate.instant('mark_unread_conversation'),
                handler: function () { return _this.markConversationAsUnread(); }
            });
        }
        var actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });
        actionSheet.present();
    };
    /**
     * Show upload image actions
     */
    MessagesPage.prototype.showUploadImageActions = function () {
        var _this = this;
        // check send message permission
        if (this.isSendMessageAreaPromoted) {
            this.permissions.showAccessDeniedAlert();
            return;
        }
        var buttons = [];
        buttons.push({
            text: this.translate.instant('take_photo'),
            handler: function () { return _this.sendImage('camera'); }
        });
        buttons.push({
            text: this.translate.instant('choose_photo_from_library'),
            handler: function () { return _this.sendImage('library'); }
        });
        var actionSheet = this.actionSheetCtrl.create({
            buttons: buttons
        });
        actionSheet.present();
    };
    /**
     * Send message
     */
    MessagesPage.prototype.sendMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fakeMessage, newMessage, e_2, errorDescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // check send message permission
                        if (this.isSendMessageAreaPromoted) {
                            this.permissions.showAccessDeniedAlert();
                            return [2 /*return*/];
                        }
                        fakeMessage = this.getFakeMessage(this.message);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.unreadMessageId = 0;
                        // create a fake message
                        this.isConversationEmpty = false;
                        this.api.add('messages', fakeMessage);
                        this.setMessages();
                        this.message = '';
                        this.needToScrollContent = true;
                        return [4 /*yield*/, this.api.create('messages', Object.assign({}, fakeMessage))];
                    case 2:
                        newMessage = _a.sent();
                        if (!this.conversationId) {
                            this.conversationId = newMessage.conversationId;
                        }
                        newMessage.deliverInProcess = false;
                        this.api.add('messages', newMessage);
                        // remove previously created fake message
                        this.api.remove('messages', fakeMessage.id);
                        this.setMessages();
                        this.needToScrollContent = true;
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        // mark message as not delivered
                        fakeMessage.notDelivered = true;
                        fakeMessage.deliverInProcess = false;
                        if (e_2.response && e_2.response.data) {
                            errorDescription = e_2.response.data.shortDescription;
                            if (errorDescription) {
                                fakeMessage.notDeliveredDesc = errorDescription;
                            }
                        }
                        // update fake message
                        this.api.add('messages', fakeMessage);
                        this.setMessages();
                        this.events.publish('message:sendFailed');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get system message type
     */
    MessagesPage.prototype.getSystemMessageType = function (text) {
        var params = JSON.parse(text);
        if (params.entityType) {
            return params.entityType;
        }
    };
    /**
     * View profile
     */
    MessagesPage.prototype.viewProfile = function (userId) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_10__profile_view_index__["a" /* ProfileViewPage */], {
            userId: userId
        });
    };
    /**
     * Send image
     */
    MessagesPage.prototype.sendImage = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var fakeMessage;
            return __generator(this, function (_a) {
                fakeMessage = this.getFakeMessage();
                try {
                    this.unreadMessageId = 0;
                    // init photo uploader
                    this.photoUploader.maxFileSizeMb = this.attachMaxUploadSize;
                    this.photoUploader.url = this.config.getApiUrl() + '/mailbox/photo-messages/?';
                    this.photoUploader.url += "opponentId=" + this.userId + "&";
                    this.photoUploader.url += "conversationId=" + this.conversationId;
                    // photo successfully uploaded
                    this.photoUploader.successUploadCallback = function (newMessage) {
                        newMessage = JSON.parse(newMessage);
                        if (!_this.conversationId) {
                            _this.conversationId = newMessage.conversationId;
                        }
                        _this.api.add('messages', newMessage);
                        // remove previously created fake message
                        _this.api.remove('messages', fakeMessage.id);
                        _this.setMessages();
                        _this.needToScrollContent = true;
                    };
                    // start uploading image
                    this.photoUploader.photoCopiedCallback = function (image) {
                        // create a fake message
                        fakeMessage.attachments.push({
                            fileName: image.name,
                            downloadUrl: image.path,
                            type: 'image'
                        });
                        // create a fake message
                        _this.isConversationEmpty = false;
                        _this.api.add('messages', fakeMessage);
                        _this.setMessages();
                        _this.needToScrollContent = true;
                    };
                    // uploading failed
                    this.photoUploader.errorUploadCallback = function (error) {
                        // retry to send again
                        if (__WEBPACK_IMPORTED_MODULE_8__services_photoUploader_index__["a" /* PhotoUploaderService */].ERROR_UPLOADING_FILE == error.type) {
                            // mark message as not delivered
                            fakeMessage.notDelivered = true;
                            fakeMessage.deliverInProcess = false;
                            if (error.message) {
                                var errorParams = JSON.parse(error.message);
                                if (errorParams.shortDescription) {
                                    fakeMessage.notDeliveredDesc = errorParams.shortDescription;
                                }
                            }
                            // update fake message
                            _this.api.add('messages', fakeMessage);
                            _this.setMessages();
                            _this.events.publish('message:sendFailed');
                        }
                    };
                    this.photoUploader.takePicture(source);
                }
                catch (e) { }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check for empty messages
     */
    MessagesPage.prototype.checkForEmptyMessages = function () {
        var isThereEmptyMessage = false;
        this.messages.every(function (message) {
            if (!message.text.trim() && !message.attachments.length && !message.newMessage) {
                isThereEmptyMessage = true;
                return false;
            }
            return true;
        });
        return isThereEmptyMessage;
    };
    /**
     * Load messages
     */
    MessagesPage.prototype.loadMessages = function (forceToLoad) {
        if (forceToLoad === void 0) { forceToLoad = false; }
        return __awaiter(this, void 0, void 0, function () {
            var loader, limit, _a, _b, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        this.pageReady = false;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _c.sent();
                        if (!this.conversationId) return [3 /*break*/, 4];
                        limit = this.messages.length > this.messagesLimit
                            ? this.messages.length
                            : this.messagesLimit;
                        _a = this;
                        return [4 /*yield*/, Promise.all([
                                this.api.getMapper('users').find(this.userId, {
                                    params: {
                                        with: ['blocks', 'avatar', 'matchActions']
                                    }
                                }),
                                this.api.findAll('messages', {
                                    conversationId: this.conversationId,
                                    limit: limit
                                }, {
                                    force: forceToLoad,
                                    forceHandleError: true
                                })
                            ])];
                    case 3:
                        // load user data and list of messages
                        _a.user = (_c.sent())[0];
                        this.setMessages();
                        this.findUnreadMessageId();
                        return [3 /*break*/, 6];
                    case 4:
                        // load user data
                        _b = this;
                        return [4 /*yield*/, this.api.getMapper('users').find(this.userId, {
                                params: {
                                    with: ['blocks', 'avatar', 'matchActions']
                                }
                            })];
                    case 5:
                        // load user data
                        _b.user = _c.sent();
                        _c.label = 6;
                    case 6:
                        if (this.messages.length) {
                            this.isConversationEmpty = false;
                        }
                        loader.dismiss();
                        this.pageReady = true;
                        this.needToScrollContent = true;
                        return [3 /*break*/, 8];
                    case 7:
                        e_3 = _c.sent();
                        loader.dismiss();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * mark conversation as read
     */
    MessagesPage.prototype.markConversationAsRead = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        conversation = this.getConversation();
                        if (!(conversation && !conversation.isRead)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.update('conversations', conversation.id, {
                                isRead: true
                            }, {
                                forceHandleError: true
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get fake messge
     */
    MessagesPage.prototype.getFakeMessage = function (message) {
        if (message === void 0) { message = ''; }
        var timeStamp = Math.floor(Date.now() / 1000);
        return {
            id: timeStamp,
            isAuthor: true,
            opponentId: this.userId,
            text: message,
            conversationId: this.conversationId,
            timeStamp: timeStamp,
            deliverInProcess: true,
            notDelivered: false,
            notDeliveredDesc: '',
            wasAuthorized: true,
            newMessage: true,
            attachments: []
        };
    };
    /**
     * Get conversation
     */
    MessagesPage.prototype.getConversation = function () {
        var conversation = this.api.filter('conversations', {
            where: {
                opponentId: this.userId
            }
        });
        if (conversation[0]) {
            return conversation[0];
        }
    };
    /**
     * Mark as read outcoming messages
     */
    MessagesPage.prototype.markAsReadOutcomigMessages = function () {
        // get current conversation
        var conversation = this.getConversation();
        if (conversation && conversation.opponentIsRead) {
            // get not read outcoming messages
            var messages = this.api.filter('messages', {
                where: {
                    conversationId: conversation.id,
                    isAuthor: true,
                    recipientRead: false,
                    newMessage: false
                }
            });
            var updateMessages_1 = false;
            // mark messages as read by recipient
            messages.forEach(function (message) {
                message.recipientRead = true;
                updateMessages_1 = true;
            });
            if (updateMessages_1) {
                this.setMessages();
            }
        }
    };
    /**
     * Mark matched user
     */
    MessagesPage.prototype.markMatchedUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.update('matchedUsers', this.user.matchActions.id, {
                                isNew: false
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mark messages as read
     */
    MessagesPage.prototype.markMessagesAsRead = function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages, needToUpdate_1, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.conversationId) return [3 /*break*/, 2];
                        messages = this.api.filter('messages', {
                            where: {
                                conversationId: this.conversationId,
                                isAuthor: false,
                                recipientRead: false,
                                text: {
                                    '!=': ''
                                }
                            }
                        });
                        needToUpdate_1 = [];
                        messages.forEach(function (message) {
                            needToUpdate_1.push({
                                id: message.id
                            });
                        });
                        if (!needToUpdate_1.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.updateAll('messages', needToUpdate_1, {}, {
                                forceHandleError: true
                            })];
                    case 1:
                        _a.sent();
                        this.setMessages();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Find unread message id
     */
    MessagesPage.prototype.findUnreadMessageId = function () {
        if (this.conversationId) {
            var message = this.api.filter('messages', {
                where: {
                    conversationId: this.conversationId,
                    isAuthor: false,
                    recipientRead: false,
                    newMessage: false
                },
                limit: 1,
                orderBy: [
                    ['timeStamp', 'ASC']
                ]
            });
            if (message[0]) {
                this.unreadMessageId = message[0].id;
            }
        }
    };
    /**
     * Block user
     */
    MessagesPage.prototype.blockUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        this.user.blocks.isBlocked = true;
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('blocks').create({
                                userId: this.userId
                            }, {
                                forceHandleError: true
                            })];
                    case 3:
                        _a.sent();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_blocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _a.sent();
                        this.user.blocks.isBlocked = false;
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Unblock user
     */
    MessagesPage.prototype.unblockUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        this.user.blocks.isBlocked = false;
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.getMapper('blocks').destroy(this.user.id, {
                                forceHandleError: true
                            })];
                    case 3:
                        _a.sent();
                        toast = this.toast.create({
                            message: this.translate.instant('profile_unblocked'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 4:
                        e_8 = _a.sent();
                        loader.dismiss();
                        this.user.blocks.isBlocked = true;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete conversation
     */
    MessagesPage.prototype.deleteConversation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.destroy('conversations', this.conversationId, {
                                forceHandleError: true
                            })];
                    case 3:
                        _a.sent();
                        // remove messages from storage
                        this.api.removeAll('messages', {
                            conversationId: this.conversationId
                        });
                        loader.dismiss();
                        toast = this.toast.create({
                            message: this.translate.instant('conversation_has_been_deleted'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_9__dashboard_index__["a" /* DashboardPage */], {
                            component: 'conversations'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Mark conversation as unread
     */
    MessagesPage.prototype.markConversationAsUnread = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, toast, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this.loadingCtrl.create();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, loader.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.api.update('conversations', this.conversationId, {
                                isRead: false
                            }, {
                                forceHandleError: true
                            })];
                    case 3:
                        _a.sent();
                        loader.dismiss();
                        toast = this.toast.create({
                            message: this.translate.instant('conversation_has_been_marked_as_unread'),
                            closeButtonText: this.translate.instant('ok'),
                            showCloseButton: true,
                            duration: this.toastDuration
                        });
                        toast.present();
                        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_9__dashboard_index__["a" /* DashboardPage */], {
                            component: 'conversations'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_10 = _a.sent();
                        loader.dismiss();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Content */])
    ], MessagesPage.prototype, "content", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* InfiniteScroll */])
    ], MessagesPage.prototype, "infiniteScroll", void 0);
    MessagesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'messages',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\messages\index.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-buttons end *ngIf="pageReady">\n            <button ion-button icon-only (click)="showConversationActions()">\n                <ion-icon name="md-more"></ion-icon>\n            </button>\n        </ion-buttons>\n        <ion-title *ngIf="pageReady" (click)="viewProfile(user.id)">{{user.displayName}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="sk-messages-page">\n    <!-- new conversation -->\n    <div *ngIf="pageReady && isConversationEmpty" class="sk-new-conversation">\n        <user-avatar [useBigAvatar]="true" [url]="user.avatar.bigUrl" [isAvatarActive]="user.avatar.active" (click)="viewProfile(user.id)"></user-avatar>\n        <h4 (click)="viewProfile(user.id)">{{user.displayName}}</h4>\n        <span>{{ \'mailbox_start_conversation_desc\' | translate }}</span>\n    </div>\n\n    <!-- load history -->\n    <ion-infinite-scroll (ionInfinite)="loadMoreMessages()" *ngIf="pageReady && isCheckLoadMoreActive" position="top">\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n    </ion-infinite-scroll>\n\n    <!-- messages -->\n    <div class="sk-messages" *ngIf="pageReady && !isConversationEmpty">\n        <div class="sk-message-wrap" *ngFor="let message of messages; let i = index;">\n            <!-- unread messages devider -->\n            <div class="sk-unread-message-divider" *ngIf="message.id == unreadMessageId">\n                {{ \'mailbox_unread_messages\' | translate }}\n            </div>\n            <plain-message *ngIf="!message.isSystem"\n                           [message]="message"\n                           [prevMessage]="messages[i - 1]"\n                           (messageDelivered)="messageDeliveredEvent($event)"\n                           (messageDeleted)="messageDeletedEvent()"\n                           (messageTracked)="messageTrackedEvent()">\n            </plain-message>\n            <wink-message *ngIf="message.isSystem && getSystemMessageType(message.text) == \'wink\'"\n                          [message]="message"\n                          [prevMessage]="messages[i - 1]">\n            </wink-message>\n        </div>\n    </div>\n</ion-content>\n\n<ion-footer *ngIf="pageReady && isSendMessageAreaAllowed" no-border class="sk-messages-footer {{ isSendMessageAreaPromoted ? \'sk-messages-footer-promoted\' : \'\'}}">\n    <ion-toolbar>\n        <button (click)="showUploadImageActions()" ion-button class="sk-chat-footer-attach"><img src="./assets/img/ic_attachment.svg" alt=""></button>\n        <ion-textarea *ngIf="!isSendMessageAreaPromoted" rows="1" autosize [(ngModel)]="message"></ion-textarea>\n        <ion-textarea *ngIf="isSendMessageAreaPromoted" (click)="sendMessage()" rows="2" readonly="true" placeholder="{{ \'mailbox_send_message_promotion_desc\' | translate }}"></ion-textarea>\n        <button ion-button (click)="sendMessage()" [disabled]="!isMessageValid">{{ \'send\' | translate }}</button>\n    </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\messages\index.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_8__services_photoUploader_index__["a" /* PhotoUploaderService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_8__services_photoUploader_index__["a" /* PhotoUploaderService */],
            __WEBPACK_IMPORTED_MODULE_3_ng2_translate__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_7__services_config_index__["a" /* ConfigService */],
            __WEBPACK_IMPORTED_MODULE_6__services_http_index__["a" /* SecureHttpService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_5__services_http_errorHandler__["a" /* HttpErrorHandlerService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__services_permissions_index__["a" /* PermissionsService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_js_data__["DataStore"]])
    ], MessagesPage);
    return MessagesPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseValidator; });
var BaseValidator = /** @class */ (function () {
    function BaseValidator() {
    }
    /**
     * Add params
     */
    BaseValidator.prototype.addParams = function (params) {
        this.params = params;
    };
    return BaseValidator;
}());

//# sourceMappingURL=baseValidator.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppMaintenancePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth_index__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_dashboard_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_user_login_index__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// services

// import pages


var AppMaintenancePage = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppMaintenancePage(auth, api, events, nav) {
        this.auth = auth;
        this.api = api;
        this.events = events;
        this.nav = nav;
    }
    /**
     * Do refresh
     */
    AppMaintenancePage.prototype.doRefresh = function (refresher) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // update all configs
                        return [4 /*yield*/, this.api.findAll('configs', {}, { force: true })];
                    case 1:
                        // update all configs
                        _a.sent();
                        refresher.complete();
                        // check maintenance mode
                        if (!this.api.get('configs', 'maintenanceMode').value) {
                            this.events.publish('maintenance:restore');
                            this.nav.setRoot(!this.auth.isAuthenticated() ? __WEBPACK_IMPORTED_MODULE_5__pages_user_login_index__["a" /* LoginPage */] : __WEBPACK_IMPORTED_MODULE_4__pages_dashboard_index__["a" /* DashboardPage */]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        refresher.complete();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AppMaintenancePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-maintenance',template:/*ion-inline-start:"G:\attheclubb\application\src\pages\appMaintenance\index.html"*/'<ion-content class="sk-app-mtnmode-page">\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    <div class="wrap">\n        <img src="./assets/img/mtn-mode.png" alt="">\n        <p class="sk-text" [innerHTML]="\'maintenance_mode\' | translate"></p>\n    </div>\n</ion-content>\n'/*ion-inline-end:"G:\attheclubb\application\src\pages\appMaintenance\index.html"*/,
            providers: []
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* NavController */]])
    ], AppMaintenancePage);
    return AppMaintenancePage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhotoUploaderService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_transfer__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_path__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_translate__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__auth_index__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







// import services

var PhotoUploaderService = /** @class */ (function () {
    /**
     * Constructor
     */
    function PhotoUploaderService(transfer, file, filePath, camera, platform, alert, auth, translate) {
        this.transfer = transfer;
        this.file = file;
        this.filePath = filePath;
        this.camera = camera;
        this.platform = platform;
        this.alert = alert;
        this.auth = auth;
        this.translate = translate;
        this.maxFileSizeMb = 30;
        this.httpMethod = 'POST';
    }
    PhotoUploaderService_1 = PhotoUploaderService;
    /**
     * Take picture
     */
    PhotoUploaderService.prototype.takePicture = function (fromSource) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceType, options, imagePath, filePath, correctPath_1, currentName_1, currentName, correctPath, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        sourceType = fromSource == 'camera'
                            ? this.camera.PictureSourceType.CAMERA
                            : this.camera.PictureSourceType.PHOTOLIBRARY;
                        options = {
                            quality: 100,
                            allowEdit: true,
                            encodingType: this.camera.EncodingType.JPEG,
                            sourceType: sourceType,
                            saveToPhotoAlbum: false,
                            correctOrientation: true,
                            mediaType: this.camera.MediaType.PICTURE
                        };
                        return [4 /*yield*/, this.camera.getPicture(options)];
                    case 1:
                        imagePath = _a.sent();
                        if (!(this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.filePath.resolveNativePath(imagePath)];
                    case 2:
                        filePath = _a.sent();
                        correctPath_1 = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        currentName_1 = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath_1, currentName_1, this.createFileName());
                        return [3 /*break*/, 4];
                    case 3:
                        currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                        correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        if (this.errorUploadCallback) {
                            this.errorUploadCallback.call(null, {
                                type: PhotoUploaderService_1.ERROR_SELECTING_IMAGE,
                                message: e_1.message
                            });
                        }
                        if (e_1 != 'no image selected') {
                            this.showAlert('error_selecting_image');
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upload image
     */
    PhotoUploaderService.prototype.uploadImage = function (imageName, imagePath) {
        var _this = this;
        var language = this.translate.currentLang
            ? this.translate.currentLang
            : this.translate.getDefaultLang();
        var headers = {
            'api-language': language
        };
        // add auth header
        if (this.auth.getToken()) {
            headers[this.auth.getAuthHeaderName()] = this.auth.getAuthHeaderValue();
        }
        var options = {
            fileKey: 'file',
            fileName: imageName,
            chunkedMode: false,
            httpMethod: this.httpMethod,
            mimeType: 'image/jpeg',
            params: {
                fileName: imageName
            },
            headers: headers
        };
        var fileTransfer = this.transfer.create();
        // use the FileTransfer to upload the image
        fileTransfer.upload(imagePath, this.url, options)
            .then(function (data) {
            if (_this.successUploadCallback) {
                _this.successUploadCallback.call(null, data.response);
            }
        }, function (err) {
            if (_this.errorUploadCallback) {
                _this.errorUploadCallback.call(null, {
                    type: PhotoUploaderService_1.ERROR_UPLOADING_FILE,
                    message: err.body
                });
            }
            _this.showAlert('error_uploading_file');
        });
    };
    /**
     * Create file name
     */
    PhotoUploaderService.prototype.createFileName = function () {
        var d = new Date();
        return d.getTime() + ".jpg";
    };
    /**
     * Copy file to a local dir
     */
    PhotoUploaderService.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var directory, file, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (this.startUploadingCallback) {
                            this.startUploadingCallback.call(null);
                        }
                        return [4 /*yield*/, this.file.resolveDirectoryUrl(namePath)];
                    case 1:
                        directory = _a.sent();
                        return [4 /*yield*/, this.file.getFile(directory, currentName, {
                                create: false
                            })];
                    case 2:
                        file = _a.sent();
                        file.getMetadata(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var e_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 4, , 5]);
                                        if (!(data.size / 1024 / 1024 <= this.maxFileSizeMb)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)];
                                    case 1:
                                        _a.sent();
                                        if (this.photoCopiedCallback) {
                                            this.photoCopiedCallback.call(null, {
                                                name: newFileName,
                                                path: this.pathForImage(newFileName)
                                            });
                                        }
                                        // upload file
                                        this.image = newFileName;
                                        this.uploadImage(this.image, this.pathForImage(this.image));
                                        return [3 /*break*/, 3];
                                    case 2:
                                        this.errorUploadCallback.call(null, {
                                            type: PhotoUploaderService_1.ERROR_MAX_SIZE_LIMIT_EXCEEDED,
                                            message: 'The uploaded file exceeds the max upload filesize'
                                        });
                                        this.showAlert('error_file_exceeds_max_upload_size', {
                                            size: this.maxFileSizeMb
                                        });
                                        _a.label = 3;
                                    case 3: return [3 /*break*/, 5];
                                    case 4:
                                        e_3 = _a.sent();
                                        if (this.errorUploadCallback) {
                                            this.errorUploadCallback.call(null, {
                                                type: PhotoUploaderService_1.ERROR_STORING_FILE,
                                                message: e_3.message
                                            });
                                        }
                                        this.showAlert('error_storing_file');
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, function (error) {
                            if (_this.errorUploadCallback) {
                                _this.errorUploadCallback.call(null, {
                                    type: PhotoUploaderService_1.ERROR_GETTING_FILE_INFO,
                                    message: error.code
                                });
                            }
                            _this.showAlert('error_getting_file_info');
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        if (this.errorUploadCallback) {
                            this.errorUploadCallback.call(null, {
                                type: PhotoUploaderService_1.ERROR_GETTING_FILE_INFO,
                                message: e_2.message
                            });
                        }
                        this.showAlert('error_getting_file_info');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Show alert
     */
    PhotoUploaderService.prototype.showAlert = function (description, params) {
        var alert = this.alert.create({
            title: this.translate.instant('error_occurred'),
            subTitle: this.translate.instant(description, params),
            buttons: [this.translate.instant('ok')]
        });
        alert.present();
    };
    /**
     * Path for image
     */
    PhotoUploaderService.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        return cordova.file.dataDirectory + img;
    };
    // error codes
    PhotoUploaderService.ERROR_SELECTING_IMAGE = 'error_selecting_image';
    PhotoUploaderService.ERROR_STORING_FILE = 'error_storing_file';
    PhotoUploaderService.ERROR_GETTING_FILE_INFO = 'error_getting_file_info';
    PhotoUploaderService.ERROR_MAX_SIZE_LIMIT_EXCEEDED = 'error_max_size_limit_exceeded';
    PhotoUploaderService.ERROR_UPLOADING_FILE = 'error_uploading_file';
    PhotoUploaderService = PhotoUploaderService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_native_transfer__["a" /* Transfer */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_path__["a" /* FilePath */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_7__auth_index__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_6_ng2_translate__["c" /* TranslateService */]])
    ], PhotoUploaderService);
    return PhotoUploaderService;
    var PhotoUploaderService_1;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 840:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangeFocusByEnterDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ChangeFocusByEnterDirective = /** @class */ (function () {
    function ChangeFocusByEnterDirective(inputRef) {
        this.inputRef = inputRef;
    }
    ChangeFocusByEnterDirective.prototype.onInputChange = function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            e.preventDefault();
            this.inputRef.focusNext();
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ChangeFocusByEnterDirective.prototype, "onInputChange", null);
    ChangeFocusByEnterDirective = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
            selector: '[changeFocusByEnter]'
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* TextInput */]])
    ], ChangeFocusByEnterDirective);
    return ChangeFocusByEnterDirective;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 841:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomMissingTranslationHandler; });
var CustomMissingTranslationHandler = /** @class */ (function () {
    function CustomMissingTranslationHandler() {
    }
    CustomMissingTranslationHandler.prototype.handle = function (params) {
        console.warn("Translation is missing for key: " + params.key);
    };
    return CustomMissingTranslationHandler;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 842:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = apiFactory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_data_http__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_data_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_js_data_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_data___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_data__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__resources_distances__ = __webpack_require__(843);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__resources_compatibilities__ = __webpack_require__(844);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__resources_avatars__ = __webpack_require__(845);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__resources_users__ = __webpack_require__(846);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__resources_userMemberships__ = __webpack_require__(847);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__resources_questionsData__ = __webpack_require__(848);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__resources_joinQuestions__ = __webpack_require__(849);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__resources_editQuestions__ = __webpack_require__(850);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__resources_searchQuestions__ = __webpack_require__(851);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__resources_searchUsers__ = __webpack_require__(852);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__resources_userGenders__ = __webpack_require__(853);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__resources_configs__ = __webpack_require__(854);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__resources_permissions__ = __webpack_require__(855);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__resources_photos__ = __webpack_require__(856);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__resources_usersCache__ = __webpack_require__(857);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__resources_matchActions__ = __webpack_require__(858);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__resources_viewQuestions__ = __webpack_require__(859);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__resources_blocks__ = __webpack_require__(860);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__resources_matchedUsers__ = __webpack_require__(861);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__resources_conversations__ = __webpack_require__(862);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__resources_messages__ = __webpack_require__(863);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__resources_guests__ = __webpack_require__(864);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__resources_hotListUsers__ = __webpack_require__(865);


// import all registered resources























/**
 * Api factory
 */
function apiFactory(config, auth, translate, events, errorHandler) {
    // register all mappers
    var mappers = {
        users: __WEBPACK_IMPORTED_MODULE_5__resources_users__["a" /* Users */],
        usersCache: __WEBPACK_IMPORTED_MODULE_16__resources_usersCache__["a" /* UsersCache */],
        questionsData: __WEBPACK_IMPORTED_MODULE_7__resources_questionsData__["a" /* QuestionsData */],
        avatars: __WEBPACK_IMPORTED_MODULE_4__resources_avatars__["a" /* Avatars */],
        compatibilities: __WEBPACK_IMPORTED_MODULE_3__resources_compatibilities__["a" /* Compatibilities */],
        distances: __WEBPACK_IMPORTED_MODULE_2__resources_distances__["a" /* Distances */],
        memberships: __WEBPACK_IMPORTED_MODULE_6__resources_userMemberships__["a" /* UserMemberships */],
        permissions: __WEBPACK_IMPORTED_MODULE_14__resources_permissions__["a" /* Permissions */],
        photos: __WEBPACK_IMPORTED_MODULE_15__resources_photos__["a" /* Photos */],
        joinQuestions: __WEBPACK_IMPORTED_MODULE_8__resources_joinQuestions__["a" /* JoinQuestions */],
        editQuestions: __WEBPACK_IMPORTED_MODULE_9__resources_editQuestions__["a" /* EditQuestions */],
        searchQuestions: __WEBPACK_IMPORTED_MODULE_10__resources_searchQuestions__["a" /* SearchQuestions */],
        viewQuestions: __WEBPACK_IMPORTED_MODULE_18__resources_viewQuestions__["a" /* ViewQuestions */],
        searchUsers: __WEBPACK_IMPORTED_MODULE_11__resources_searchUsers__["a" /* SearchUsers */],
        userGenders: __WEBPACK_IMPORTED_MODULE_12__resources_userGenders__["a" /* UserGenders */],
        matchActions: __WEBPACK_IMPORTED_MODULE_17__resources_matchActions__["a" /* MatchActions */],
        configs: __WEBPACK_IMPORTED_MODULE_13__resources_configs__["a" /* Configs */],
        blocks: __WEBPACK_IMPORTED_MODULE_19__resources_blocks__["a" /* Blocks */],
        matchedUsers: __WEBPACK_IMPORTED_MODULE_20__resources_matchedUsers__["a" /* MatchedUsers */],
        conversations: __WEBPACK_IMPORTED_MODULE_21__resources_conversations__["a" /* Conversations */],
        messages: __WEBPACK_IMPORTED_MODULE_22__resources_messages__["a" /* Messages */],
        guests: __WEBPACK_IMPORTED_MODULE_23__resources_guests__["a" /* Guests */],
        hotListUsers: __WEBPACK_IMPORTED_MODULE_24__resources_hotListUsers__["a" /* HotListUsers */]
    };
    var properties = {
        users: __WEBPACK_IMPORTED_MODULE_5__resources_users__["b" /* UsersProperties */]
    };
    // common mappers
    var commonMappers = ['configs'];
    var api = new __WEBPACK_IMPORTED_MODULE_1_js_data__["DataStore"]();
    var httpAdapter = new __WEBPACK_IMPORTED_MODULE_0_js_data_http__["HttpAdapter"]({
        basePath: config.getApiUrl(),
        forceTrailingSlash: true,
        httpConfig: {
            timeout: parseInt(config.getConfig('connectionTimeout'))
        },
        beforeHTTP: function (config) {
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
        error: function (error, errorDesc) {
            var errorCode = 500; // default error code
            var errorType = '';
            var errorDescription = '';
            if (errorDesc.message && errorDesc.message.match(/^timeout|network error/i)) {
                errorCode = 0;
            }
            else {
                // try to extract error code and error desc
                errorCode = errorDesc.response.status;
                var errorDetails = errorDesc.response.data;
                errorType = errorDetails && errorDetails.type ? errorDetails.type : '';
                errorDescription = errorDetails && errorDetails.description ? errorDetails.description : '';
            }
            var forceHandleError = errorDesc.config.forceHandleError
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
    var systemEvents = [
        'user:logout',
        'user:status_restore',
        'maintenance:restore'
    ];
    // clear mappers
    systemEvents.forEach(function (event) {
        events.subscribe(event, function () {
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
//# sourceMappingURL=factory.js.map

/***/ }),

/***/ 843:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Distances; });
var Distances = {
    name: 'Distances',
    endpoint: 'distances',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=distances.js.map

/***/ }),

/***/ 844:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Compatibilities; });
var Compatibilities = {
    name: 'Compatibilities',
    endpoint: 'compatibilities',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=compatibilities.js.map

/***/ }),

/***/ 845:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Avatars; });
var Avatars = {
    name: 'Avatars',
    endpoint: 'avatars',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=avatars.js.map

/***/ }),

/***/ 846:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Users; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UsersProperties; });
var Users = {
    name: 'Users',
    endpoint: 'users',
    relations: {
        hasMany: {
            permissions: {
                foreignKey: 'userId',
                localField: 'permissions'
            },
            photos: {
                foreignKey: 'userId',
                localField: 'photos'
            },
            viewQuestions: {
                foreignKey: 'userId',
                localField: 'viewQuestions'
            },
            searchUsers: {
                foreignKey: 'userId',
                localField: 'searchUsers'
            }
        },
        hasOne: {
            avatars: {
                foreignKey: 'userId',
                localField: 'avatar'
            },
            blocks: {
                foreignKey: 'userId',
                localField: 'block'
            },
            matchActions: {
                foreignKey: 'userId',
                localField: 'matchActions'
            },
            compatibilities: {
                foreignKey: 'userId',
                localField: 'compatibility'
            },
            memberships: {
                foreignKey: 'userId',
                localField: 'membership'
            }
        }
    }
};
var UsersProperties = {
    realName: {
        get: function () {
            return this.displayName ? this.displayName : this.userName;
        }
    }
};
//# sourceMappingURL=users.js.map

/***/ }),

/***/ 847:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserMemberships; });
var UserMemberships = {
    name: 'UserMemberships',
    endpoint: 'memberships',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=userMemberships.js.map

/***/ }),

/***/ 848:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionsData; });
var QuestionsData = {
    name: 'QuestionsData',
    endpoint: 'questions-data',
    relations: {}
};
//# sourceMappingURL=questionsData.js.map

/***/ }),

/***/ 849:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinQuestions; });
var JoinQuestions = {
    name: 'JoinQuestions',
    endpoint: 'join-questions',
    relations: {}
};
//# sourceMappingURL=joinQuestions.js.map

/***/ }),

/***/ 850:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditQuestions; });
var EditQuestions = {
    name: 'EditQuestions',
    endpoint: 'edit-questions',
    relations: {}
};
//# sourceMappingURL=editQuestions.js.map

/***/ }),

/***/ 851:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchQuestions; });
var SearchQuestions = {
    name: 'SearchQuestions',
    endpoint: 'search-questions',
    relations: {}
};
//# sourceMappingURL=searchQuestions.js.map

/***/ }),

/***/ 852:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchUsers; });
var SearchUsers = {
    name: 'SearchUsers',
    endpoint: 'search-users',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=searchUsers.js.map

/***/ }),

/***/ 853:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserGenders; });
var UserGenders = {
    name: 'UserGenders',
    endpoint: 'user-genders',
    relations: {}
};
//# sourceMappingURL=userGenders.js.map

/***/ }),

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Configs; });
var Configs = {
    name: 'Configs',
    endpoint: 'configs',
    relations: {}
};
//# sourceMappingURL=configs.js.map

/***/ }),

/***/ 855:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Permissions; });
var Permissions = {
    name: 'Permissions',
    endpoint: 'permissions',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=permissions.js.map

/***/ }),

/***/ 856:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Photos; });
var Photos = {
    name: 'Photos',
    endpoint: 'photos',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=photos.js.map

/***/ }),

/***/ 857:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersCache; });
var UsersCache = {
    name: 'UsersCache',
    endpoint: 'usersCache',
    relations: {}
};
//# sourceMappingURL=usersCache.js.map

/***/ }),

/***/ 858:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchActions; });
var MatchActions = {
    name: 'MatchActions',
    endpoint: 'math-actions/user',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=matchActions.js.map

/***/ }),

/***/ 859:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewQuestions; });
var ViewQuestions = {
    name: 'ViewQuestions',
    endpoint: 'view-questions',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=viewQuestions.js.map

/***/ }),

/***/ 860:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Blocks; });
var Blocks = {
    name: 'Blocks',
    endpoint: 'blocks/user',
    relations: {
        belongsTo: {
            users: {
                foreignKey: 'userId',
                localField: 'user'
            }
        }
    }
};
//# sourceMappingURL=blocks.js.map

/***/ }),

/***/ 861:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchedUsers; });
var MatchedUsers = {
    name: 'MatchedUsers',
    endpoint: 'matched-users'
};
//# sourceMappingURL=matchedUsers.js.map

/***/ }),

/***/ 862:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Conversations; });
var Conversations = {
    name: 'Conversations',
    endpoint: 'mailbox/conversations'
};
//# sourceMappingURL=conversations.js.map

/***/ }),

/***/ 863:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Messages; });
var Messages = {
    name: 'Messages',
    endpoint: 'mailbox/messages'
};
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 864:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Guests; });
var Guests = {
    name: 'Guests',
    endpoint: 'guests'
};
//# sourceMappingURL=guests.js.map

/***/ }),

/***/ 865:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HotListUsers; });
var HotListUsers = {
    name: 'HotListUsers',
    endpoint: 'hotlist-users'
};
//# sourceMappingURL=hotListUsers.js.map

/***/ }),

/***/ 866:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = questionManagerFactory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager__ = __webpack_require__(22);

/**
 * Question manager factory
 */
function questionManagerFactory(modalCtrl) {
    return new __WEBPACK_IMPORTED_MODULE_0__manager__["a" /* QuestionManager */](modalCtrl);
}
//# sourceMappingURL=factory.js.map

/***/ }),

/***/ 867:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NlbrPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NlbrPipe = /** @class */ (function () {
    function NlbrPipe() {
    }
    NlbrPipe.prototype.transform = function (value, args) {
        return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };
    NlbrPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'nlbr' })
    ], NlbrPipe);
    return NlbrPipe;
}());

//# sourceMappingURL=index.js.map

/***/ })

},[491]);
//# sourceMappingURL=main.js.map