import { DeltaBetTeams, GroupResult, Result, TournamentStage, User } from "../../typings";

export interface IAdminApi {
    evaluateTopShooter(name: string);

    setWinner(matchId: string, winner: string);

    getTeamForMatch(id: string, stage: TournamentStage): Promise<DeltaBetTeams>;

    updateMatch(id: string, homeTeamId: string, awayTeamId: string): Promise<void>;

    uploadGroupResult(result: GroupResult, id: string): Promise<void>

    uploadMatchResult(result: Result, id: string): Promise<void>;

    payed(userId: string, payed: boolean): Promise<void>;

    evalateTeamPlaceBets(): Promise<void>;

    setAdmin(userId: string, isAdmin: boolean): Promise<void>;

    getUsersWithRoles(): Promise<any[]>;

    toggleMedal(userId: string, tournament: number, place: number): Promise<{ assigned: boolean }>;
}