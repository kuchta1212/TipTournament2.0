"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPage = void 0;
var React = require("react");
var AdminMatchView_1 = require("./AdminMatchView");
var MatchLoader_1 = require("./MatchLoader");
var UpdateChecker_1 = require("./UpdateChecker");
var UserOverview_1 = require("./UserOverview");
var AdminPage = /** @class */ (function (_super) {
    __extends(AdminPage, _super);
    function AdminPage(props) {
        return _super.call(this, props) || this;
    }
    AdminPage.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(MatchLoader_1.MatchLoader, null),
            React.createElement(UpdateChecker_1.UpdateChecker, null),
            React.createElement(UserOverview_1.UserOverview, null),
            React.createElement(AdminMatchView_1.AdminMatchView, null)));
    };
    return AdminPage;
}(React.Component));
exports.AdminPage = AdminPage;
//# sourceMappingURL=AdminPage.js.map