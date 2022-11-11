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
exports.MatchBetRow = void 0;
var React = require("react");
var ApiFactory_1 = require("../api/ApiFactory");
var TeamCell_1 = require("./../TeamCell");
var MatchBetRow = /** @class */ (function (_super) {
    __extends(MatchBetRow, _super);
    function MatchBetRow(props) {
        var _this = _super.call(this, props) || this;
        if (!_this.props.bets || _this.props.bets.length == 0) {
            _this.state = { tips: [{ homeTeam: 0, awayTeam: 0 }], setted: false };
        }
        else {
            _this.state = { tips: _this.props.bets.map(function (bet) { return { homeTeam: bet.tip.homeTeam, awayTeam: bet.tip.awayTeam }; }), setted: true };
        }
        return _this;
    }
    MatchBetRow.prototype.render = function () {
        return this.state.setted
            ? this.renderSettedBet()
            : this.renderNotSettedBet();
    };
    MatchBetRow.prototype.renderSettedBet = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.home }),
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.away }),
            this.state.tips.map(function (tip) {
                return (React.createElement("td", { key: tip.id },
                    tip.homeTeam,
                    " : ",
                    tip.awayTeam));
            }),
            !this.props.isReadOnly ? React.createElement("td", null,
                React.createElement("button", { className: "btn btn-link", onClick: function () { return _this.modify(); } }, "Upravit")) : React.createElement("td", null)));
    };
    MatchBetRow.prototype.renderNotSettedBet = function () {
        var _this = this;
        return !this.props.isReadOnly ?
            (React.createElement(React.Fragment, null,
                React.createElement(TeamCell_1.TeamCell, { team: this.props.match.home }),
                React.createElement(TeamCell_1.TeamCell, { team: this.props.match.away }),
                React.createElement("td", null,
                    React.createElement("input", { type: "number", min: "0", max: "99", value: !!this.state.tips[0].homeTeam ? this.state.tips[0].homeTeam : "0", onChange: function (event) { return _this.setHomeTip(event.target.value); } })),
                React.createElement("td", null,
                    React.createElement("input", { type: "number", min: "0", max: "99", value: !!this.state.tips[0].awayTeam ? this.state.tips[0].awayTeam : "0", onChange: function (event) { return _this.setAwayTip(event.target.value); } })),
                React.createElement("td", null,
                    React.createElement("button", { className: "btn btn-secondary", onClick: function () { return _this.uploadTip(); } }, "Ulo\u017Eit"))))
            : null;
    };
    MatchBetRow.prototype.setHomeTip = function (tip) {
        var newTips = this.state.tips;
        newTips[0] = { homeTeam: Number(tip), awayTeam: this.state.tips[0].awayTeam };
        this.setState({ tips: newTips });
    };
    MatchBetRow.prototype.setAwayTip = function (tip) {
        var newTips = this.state.tips;
        newTips[0] = { homeTeam: this.state.tips[0].homeTeam, awayTeam: Number(tip) };
        this.setState({ tips: newTips });
    };
    MatchBetRow.prototype.uploadTip = function () {
        document.body.style.cursor = "wait";
        this.setState({ setted: true });
        ApiFactory_1.getApi().uploadTip(this.state.tips[0], this.props.match.id);
        document.body.style.cursor = "normal";
    };
    MatchBetRow.prototype.modify = function () {
        this.setState({ setted: false });
    };
    return MatchBetRow;
}(React.Component));
exports.MatchBetRow = MatchBetRow;
//# sourceMappingURL=MatchBetRow.js.map