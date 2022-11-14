"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminApi = exports.getApi = void 0;
var Api_1 = require("./Api");
var AdminApi_1 = require("./AdminApi");
function getApi() {
    return new Api_1.Api();
}
exports.getApi = getApi;
function getAdminApi() {
    return new AdminApi_1.AdminApi();
}
exports.getAdminApi = getAdminApi;
//# sourceMappingURL=ApiFactory.js.map