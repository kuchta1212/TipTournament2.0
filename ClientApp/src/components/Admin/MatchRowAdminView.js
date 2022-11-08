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
exports.MatchRowAdminView = void 0;
var React = require("react");
var ApiFactory_1 = require("../api/ApiFactory");
var TeamCell_1 = require("../TeamCell");
var MatchRowAdminView = /** @class */ (function (_super) {
    __extends(MatchRowAdminView, _super);
    function MatchRowAdminView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            withResult: !!_this.props.match.result,
            match: _this.props.match
        };
        return _this;
    }
    MatchRowAdminView.prototype.render = function () {
        return this.state.withResult
            ? this.renderMatchWithResult()
            : this.renderMatchWithouResult();
    };
    MatchRowAdminView.prototype.renderMatchWithResult = function () {
        return (React.createElement("tr", null,
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.home }),
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.away }),
            React.createElement("td", { key: this.props.match.result.id },
                this.props.match.result.homeTeam,
                " : ",
                this.props.match.result.awayTeam)));
    };
    MatchRowAdminView.prototype.renderMatchWithouResult = function () {
        var _this = this;
        var _a, _b;
        return (React.createElement("div", null,
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.home }),
            React.createElement(TeamCell_1.TeamCell, { team: this.props.match.away }),
            React.createElement("td", null,
                React.createElement("input", { type: "number", min: "0", max: "99", value: !!((_a = this.state.match.result) === null || _a === void 0 ? void 0 : _a.homeTeam) ? this.state.match.result.homeTeam : "0", onChange: function (event) { return _this.setHomeResult(event.target.value); } })),
            React.createElement("td", null,
                React.createElement("input", { type: "number", min: "0", max: "99", value: !!((_b = this.state.match.result) === null || _b === void 0 ? void 0 : _b.awayTeam) ? this.state.match.result.awayTeam : "0", onChange: function (event) { return _this.setAwayResult(event.target.value); } })),
            React.createElement("td", null,
                React.createElement("button", { className: "btn btn-secondary", onClick: function () { return _this.uploadResult(); } }, " Ulo\u017Eit "))));
    };
    MatchRowAdminView.prototype.setHomeResult = function (tip) {
        var newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {};
        }
        newMatch.result.homeTeam = Number(tip);
        this.setState({ match: newMatch });
    };
    MatchRowAdminView.prototype.setAwayResult = function (tip) {
        var newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {};
        }
        newMatch.result.awayTeam = Number(tip);
        this.setState({ match: newMatch });
    };
    MatchRowAdminView.prototype.uploadResult = function () {
        document.body.style.cursor = "wait";
        this.setState({ withResult: true });
        ApiFactory_1.getApi().uploadMatchResult(this.state.match.result, this.props.match.id);
        document.body.style.cursor = "normal";
    };
    return MatchRowAdminView;
}(React.Component));
exports.MatchRowAdminView = MatchRowAdminView;
//# sourceMappingURL=MatchRowAdminView.js.map