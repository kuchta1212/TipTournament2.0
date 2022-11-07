import { MainData, Match, Bet, Result, User, UpdateStatus, TournamentStage, GroupBet, Team, Group, DeltaBet, BetsStageStatus, BetsStatus, PlaceTeamBet, TopShooterBet } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"

export interface IApi {
    uploadMatchResult(result: Result, id: string): Promise<void>;
    uploadShooterBet(bet: string): Promise<TopShooterBet>;
    getShooterBet(): Promise<TopShooterBet>;
    getTeamsForTeamPlaceBet(isWinnerBet: boolean): Promise<Team[]>
    uploadTeamPlaceBet(stage: TournamentStage, teamId: string, isWinnerBet: boolean): Promise<PlaceTeamBet>
    getTeamPlaceBet(): Promise<PlaceTeamBet>
    getWinnerBet(): Promise<PlaceTeamBet>;
    generateGroupBets(): Promise<boolean>;
    getBetsStatus(): Promise<BetsStatus>;
    confirmStageBets(stage: TournamentStage): Promise<BetsStatus>;
    modifyStageBet(stage: TournamentStage): Promise<BetsStatus>;
    getBetsStageStatus(stage: TournamentStage): Promise<BetsStageStatus>;
    uploadDeltaBet(bet: DeltaBet, id: string);
    getTeamsForDeltaBet(id: string, stage: TournamentStage);
    getDeltaBet(matchId: string);
    getData(): Promise<MainData>;
    getAllMatches(): Promise<Match[]>;
    getMatches(stage: TournamentStage): Promise<Match[]>;
    getBets(user: User | undefined): Promise<Bet[]>;
    getBetsForUsers(users: User[]): Promise<any>
    uploadTip(bet: Result, matchId: string): Promise<void>;
    getDidPayed(): Promise<boolean>;
    getUsers(sorted: boolean): Promise<User[]>;
    getUpdateStatus(): Promise<UpdateStatus>;
    getGroupBet(groupId: string): Promise<GroupBet>;
    getGroupTeams(groupId: string): Promise<Team[]>;
    getGroups(): Promise<Group[]>
    uploadGroupBet(bet: GroupBet, groupId: string): Promise<void>;
}