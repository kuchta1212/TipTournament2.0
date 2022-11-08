"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetsStageStatus = exports.TournamentStage = exports.HttpStatusCode = exports.BetResult = void 0;
var BetResult;
(function (BetResult) {
    BetResult[BetResult["nothing"] = 0] = "nothing";
    BetResult[BetResult["winner"] = 1] = "winner";
    BetResult[BetResult["difference"] = 2] = "difference";
    BetResult[BetResult["score"] = 4] = "score";
})(BetResult = exports.BetResult || (exports.BetResult = {}));
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["NoContent"] = 204] = "NoContent";
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    HttpStatusCode[HttpStatusCode["PreconditionFailed"] = 412] = "PreconditionFailed";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
var TournamentStage;
(function (TournamentStage) {
    TournamentStage[TournamentStage["Group"] = 0] = "Group";
    TournamentStage[TournamentStage["FirstRound"] = 1] = "FirstRound";
    TournamentStage[TournamentStage["Quarterfinal"] = 2] = "Quarterfinal";
    TournamentStage[TournamentStage["Semifinal"] = 3] = "Semifinal";
    TournamentStage[TournamentStage["Final"] = 4] = "Final";
    TournamentStage[TournamentStage["Winner"] = 5] = "Winner";
    TournamentStage[TournamentStage["Lambda"] = 6] = "Lambda";
    TournamentStage[TournamentStage["Omikron"] = 7] = "Omikron";
})(TournamentStage = exports.TournamentStage || (exports.TournamentStage = {}));
var BetsStageStatus;
(function (BetsStageStatus) {
    BetsStageStatus[BetsStageStatus["NotReady"] = 0] = "NotReady";
    BetsStageStatus[BetsStageStatus["Ready"] = 1] = "Ready";
    BetsStageStatus[BetsStageStatus["Done"] = 2] = "Done";
})(BetsStageStatus = exports.BetsStageStatus || (exports.BetsStageStatus = {}));
//# sourceMappingURL=index.js.map