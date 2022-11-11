import { DeltaBetTeams, GroupResult, Result, TournamentStage, User } from "../../typings";

export interface IAdminApi {
    getTeamForMatch(id: string, stage: TournamentStage): Promise<DeltaBetTeams>;

    updateMatch(id: string, homeTeamId: string, awayTeamId: string): Promise<void>;

    uploadGroupResult(result: GroupResult, id: string): Promise<void>

    uploadMatchResult(result: Result, id: string): Promise<void>;

    checkForUpdates(): Promise<number>;

    loadMatches(): Promise<number>;

    payed(userId: string, payed: boolean): Promise<void>;
}