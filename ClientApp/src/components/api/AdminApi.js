"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminApi = void 0;
var HttpClient_1 = require("./HttpClient");
var ResponseConvertor_1 = require("./ResponseConvertor");
var API_URL = '/api/admin';
var AdminApi = /** @class */ (function () {
    function AdminApi() {
    }
    AdminApi.prototype.checkForUpdates = function () {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/matches/check/"));
    };
    AdminApi.prototype.loadMatches = function () {
        return ResponseConvertor_1.convert(HttpClient_1.get(API_URL + "/matches/load/"));
    };
    AdminApi.prototype.payed = function (userId, payed) {
        return ResponseConvertor_1.convert(HttpClient_1.post(API_URL + "/" + userId + "/payed?payed=" + payed));
    };
    return AdminApi;
}());
exports.AdminApi = AdminApi;
//# sourceMappingURL=AdminApi.js.map