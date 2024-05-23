import { MainData, Match, Bet, Result, User, UpdateStatus, TournamentStage, GroupBet, Team, Group, DeltaBet, BetsStageStatus, BetsStatus, PlaceTeamBet, TopShooterBet, GroupResult } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"

export interface IApi {
    uploadShooterBet(bet: string): Promise<TopShooterBet>;
    getShooterBet(userId: string | undefined): Promise<TopShooterBet>;
    getTeamsForTeamPlaceBet(isWinnerBet: boolean): Promise<Team[]>
    uploadTeamPlaceBet(stage: TournamentStage, teamId: string, isWinnerBet: boolean): Promise<PlaceTeamBet>
    getTeamPlaceBet(userId: string | undefined): Promise<PlaceTeamBet>
    getWinnerBet(userId: string | undefined): Promise<PlaceTeamBet>;
    generateGroupBets(): Promise<boolean>;
    getBetsStatus(): Promise<BetsStatus>;
    confirmStageBets(stage: TournamentStage): Promise<BetsStatus>;
    modifyStageBet(stage: TournamentStage): Promise<BetsStatus>;
    getBetsStageStatus(stage: TournamentStage): Promise<BetsStageStatus>;
    uploadDeltaBet(bet: DeltaBet, id: string);
    getTeamsForDeltaBet(id: string, stage: TournamentStage, userId: string | undefined);
    getDeltaBet(matchId: string, userId: string | undefined);
    getData(): Promise<MainData>;
    getAllMatches(): Promise<Match[]>;
    getMatches(stage: TournamentStage): Promise<Match[]>;
    getBets(userId?: string | undefined): Promise<Bet[]>;
    getBetsForUsers(users: User[]): Promise<any>
    uploadTip(bet: Result, matchId: string): Promise<void>;
    getDidPayed(): Promise<boolean>;
    getUsers(sorted: boolean): Promise<User[]>;
    getUpdateStatus(): Promise<UpdateStatus>;
    getGroupBet(groupId: string, userId: string | undefined): Promise<GroupBet>;
    getGroupTeams(groupId: string): Promise<Team[]>;
    getGroups(): Promise<Group[]>
    uploadGroupBet(bet: GroupBet, groupId: string): Promise<void>;
}