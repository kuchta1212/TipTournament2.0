import { MainData, Match, Bet, Result, User, UpdateStatus, TournamentStage, GroupBet, Team, Group } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"

export interface IApi {
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