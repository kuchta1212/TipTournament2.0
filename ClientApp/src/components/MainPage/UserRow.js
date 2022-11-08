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
var UserRow = /** @class */ (function (_super) {
    __extends(UserRow, _super);
    function UserRow(props) {
        return _super.call(this, props) || this;
    }
    UserRow.prototype.render = function () {
        var className = this.props.index >= 0 && this.props.index <= 2
            ? "text-success"
            : this.props.index > 2 && this.props.index < 5
                ? "text-warning"
                : "";
        className += this.props.currentUser == this.props.user.id ? " bg-secondary" : "";
        return (React.createElement(React.Fragment, null,
            React.createElement("td", { className: className },
                this.props.index + 1,
                ". ",
                this.props.user.userName,
                "  ",
                this.didPay()),
            React.createElement("td", null, this.props.user.alfaPoints),
            React.createElement("td", null, this.props.user.gamaPoints),
            React.createElement("td", null, this.props.user.deltaPoints),
            React.createElement("td", null, this.props.user.lambdaPoints),
            React.createElement("td", null, this.props.user.omikronPoints),
            React.createElement("td", { className: "font-weight-bold" }, this.props.user.totalPoints)));
    };
    UserRow.prototype.didPay = function () {
        return !this.props.user.payed ? React.createElement("p", { className: "font-weight-light text-danger" }, "NEZAPLACENO") : React.createElement("p", null);
    };
    return UserRow;
}(React.Component));
exports.UserRow = UserRow;
//# sourceMappingURL=UserRow.js.map