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
exports.UserRow = void 0;
var React = require("react");
var ApiFactory_1 = require("../api/ApiFactory");
var UserRow = /** @class */ (function (_super) {
    __extends(UserRow, _super);
    function UserRow(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { payed: _this.props.user.payed };
        return _this;
    }
    UserRow.prototype.render = function () {
        return this.state.payed
            ? this.renderPayed()
            : this.renderNotPayed();
    };
    UserRow.prototype.renderPayed = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("td", null, this.props.user.userName),
            React.createElement("td", { className: "text-success" }, "Zaplaceno"),
            React.createElement("td", null,
                React.createElement("button", { onClick: function () { return _this.cancelPayment(); } }, "Zru\u0161it placen\u00ED"))));
    };
    UserRow.prototype.renderNotPayed = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("td", null, this.props.user.userName),
            React.createElement("td", { className: "text-danger" }, "NEZAPLACENO"),
            React.createElement("td", null,
                React.createElement("button", { onClick: function () { return _this.payed(); } }, "Zaplatil"))));
    };
    UserRow.prototype.cancelPayment = function () {
        this.setState({ payed: false });
        ApiFactory_1.getAdminApi().payed(this.props.user.id, false);
    };
    UserRow.prototype.payed = function () {
        this.setState({ payed: true });
        ApiFactory_1.getAdminApi().payed(this.props.user.id, true);
    };
    return UserRow;
}(React.Component));
exports.UserRow = UserRow;
//# sourceMappingURL=UserRow.js.map