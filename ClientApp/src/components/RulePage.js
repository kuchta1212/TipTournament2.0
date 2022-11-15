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
exports.RulePage = void 0;
var React = require("react");
var RulePage = /** @class */ (function (_super) {
    __extends(RulePage, _super);
    function RulePage(props) {
        return _super.call(this, props) || this;
    }
    RulePage.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { className: "row" },
                React.createElement("h1", null, "Pravidla hry a tak obecn\u011B ")),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "O co jde?"),
                    React.createElement("p", null, "Jde o mal\u00FD tipovac\u00ED turn\u00E1jek. Jeho\u017E c\u00EDlem je zpest\u0159it si sledov\u00E1n\u00ED Mistovstv\u00ED sv\u011Bta 2022 a p\u0159i tro\u0161e \u0161t\u011Bst\u00ED, m\u00EDt t\u0159eba i dobr\u00FD pocit z v\u00EDt\u011Bzstv\u00ED.")),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Jak na to?"),
                    React.createElement("ul", null,
                        React.createElement("li", null, " Je nutn\u00E9 se registrovat. "),
                        React.createElement("li", null, " Po registraci je v hlavn\u00ED nab\u00EDdce mo\u017Enost \"S\u00E1zky\" "),
                        React.createElement("li", null, " Zobraz\u00ED se seznam r\u016Fzn\u00FDch sekc\u00ED na tipov\u00E1n\u00ED."),
                        React.createElement("li", null, " \u00DAkolem je natipovat v\u0161echny tyto sekce a to pokud mo\u017Eno co nejp\u0159esn\u011Bji."),
                        React.createElement("li", null, " Po ka\u017Ed\u00E9m odehran\u00E9m z\u00E1pase se ti na z\u00E1klad\u011B tv\u00E9ho tipu ur\u010D\u00ED body."),
                        React.createElement("li", null, "Body se postupn\u011B s\u010D\u00EDt\u00E1j\u00ED a v\u00EDt\u011Bz je ten kdo m\u00E1 nejv\u00EDce bod\u016F (p\u0159ekvapiv\u011B)"),
                        React.createElement("li", null, "Aby teda bylo je\u0161t\u011B o co hr\u00E1t a v\u00EDt\u011Bz(j\u00E1 proto\u017Ee m\u00E1m p\u0159\u00EDm\u00FD p\u0159\u00EDstup do datab\u00E1ze a budu podv\u00E1d\u011Bt ;-) ) a pop\u0159\u00EDpad\u011B i vy ostatn\u00ED n\u011Bco vyhr\u00E1li. Tak je ur\u010Deno startovn\u00E9 100K\u010D, kter\u00E9 mi pros\u00EDm bu\u010F dejte osobn\u011B, pop\u0159\u00EDpad\u011B po\u0161lete po n\u011Bkom pop\u0159\u00EDpad\u011B po\u0161lete na \u00FA\u010Det 1363633012/3030 a do p\u0159edm\u011Btu napi\u0161t\u011B n\u011Bco abych tomu rozum\u011Bl"))),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Pravidla"),
                    React.createElement("ul", null,
                        React.createElement("li", null, " Zadat v\u0161echny v\u00FDsledky nejpozd\u011Bji do 20.11 do 19:00 "),
                        React.createElement("li", null, " Zaplatit startovn\u00E9 ")))),
            React.createElement("div", { className: "row" },
                React.createElement("h1", null, "Sekce - p\u0159ehled + bodov\u00E1n\u00ED")),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Alfa+Beta"),
                    "Z\u00E1pasy ve skupin\u011B. Tipuje se p\u0159esn\u00FD v\u00FDsledek.",
                    React.createElement("ul", null,
                        React.createElement("li", null, "4 - P\u0158ESN\u00DD V\u00DDSLEDEK"),
                        React.createElement("li", null, "2 - SPR\u00C1VN\u00DD V\u00CDT\u011AZ A ROZD\u00CDL SK\u00D3RE (re\u00E1ln\u00FD v\u00FDsledek byl 2:1 a v\u00E1\u0161 tip 1:0)"),
                        React.createElement("li", null, "1 - SPR\u00C1VN\u00DD V\u00CDT\u011AZ"),
                        React.createElement("li", null, "0 - KDY\u017D STE VEDLE"))),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Gamma"),
                    "Po\u0159ad\u00ED ve skupin\u00E1ch.",
                    React.createElement("ul", null,
                        React.createElement("li", null, "1 - KA\u017DD\u00C9 SPR\u00C1VN\u00C9 M\u00CDSTO"))),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Delta"),
                    "\u00DA\u010Dastn\u00EDci ve vy\u0159azovac\u00EDch kolech",
                    React.createElement("ul", null,
                        React.createElement("li", null, "2 - KA\u017DD\u00C9 SPR\u00C1VN\u00C9 \u00DA\u010CASTN\u00CDKA KOL"))),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Lambda"),
                    "Tip na nejlep\u0161\u00EDho st\u0159elce",
                    React.createElement("ul", null,
                        React.createElement("li", null, "7 - ZA SPR\u00C1VN\u00C9HO NEJLEP\u0160\u00CDHO ST\u0158ELCE"))),
                React.createElement("div", { className: "col-md-4" },
                    React.createElement("h2", null, "Omikron"),
                    "Norm\u00E1ln\u011B by zde byl tip, jak dopadne \u010Cesk\u00FD v\u00FDb\u011Br, ale chyba l\u00E1vky.... no tak tip jak dopadne jeden z trojce Polso, Srbsko, Uruguay",
                    React.createElement("ul", null,
                        React.createElement("li", null, "3 - ZA SPR\u00C1VN\u00C9 UM\u00CDST\u011AN\u00CD VYBRAN\u00C9HO T\u00DDMU"))))));
    };
    return RulePage;
}(React.Component));
exports.RulePage = RulePage;
//# sourceMappingURL=RulePage.js.map