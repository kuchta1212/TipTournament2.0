import { MainData, Match, Result, AllBets, Bet, User, UpdateStatus, TournamentStage, GroupBet, Team, Group, DeltaBet, DeltaBetTeams, BetsStageStatus, BetsStatus, PlaceTeamBet, TopShooterBet, GroupResult } from "../../typings";
import { IDictionary } from "../../typings/Dictionary";
import { IApi } from "./IApi";
import { get, post } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api';

export class Api implements IApi {
    uploadShooterBet(bet: string): Promise<TopShooterBet> {
        return convert<TopShooterBet>(post(`${API_URL}/bets/shooter?name=${bet}`));
    }
    getShooterBet(): Promise<TopShooterBet> {
        return convert<TopShooterBet>(get(`${API_URL}/bets/shooter`));
    }
    getTeamsForTeamPlaceBet(isWinnerBet: boolean): Promise<Team[]> {
        return convert<Team[]>(get(`${API_URL}/bets/teamplace/teams?isWinnerBet=${isWinnerBet}`));
    }
    uploadTeamPlaceBet(stage: TournamentStage, teamId: string, isWinnerBet: boolean): Promise<PlaceTeamBet> {
        return convert<PlaceTeamBet>(post(`${API_URL}/bets/teamplace?teamId=${teamId}&isWinnerBet=${isWinnerBet}&stage=${stage}`));
    }
    getTeamPlaceBet(): Promise<PlaceTeamBet> {
        return convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=false`));
    }
    getWinnerBet(): Promise<PlaceTeamBet> {
        return convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=true`));
    }
    generateGroupBets(): Promise<boolean> {
        return convert<boolean>(post(`${API_URL}/bets/generate/groupbet`));
    }
    getBetsStatus(): Promise<BetsStatus> {
        return convert<BetsStatus>(get(`${API_URL}/bets/status`));
    }
    confirmStageBets(stage: TournamentStage): Promise<BetsStatus> {
        return convert<BetsStatus>(post(`${API_URL}/bets/status/${stage}/confirm`));
    }
    modifyStageBet(stage: TournamentStage): Promise<BetsStatus> {
        return convert<BetsStatus>(post(`${API_URL}/bets/status/${stage}/modify`));
    }
    getBetsStageStatus(stage: TournamentStage): Promise<BetsStageStatus> {
        return convert<BetsStageStatus>(get(`${API_URL}/bets/status/${stage}`));
    }
    async uploadDeltaBet(bet: DeltaBet, matchId: string): Promise<void> {
        await post(`${API_URL}/bets/delta?matchId=${matchId}`, bet);
    }
    getTeamsForDeltaBet(matchId: string, stage: TournamentStage) {
        return convert<DeltaBetTeams>(get(`${API_URL}/bets/delta/teams?matchId=${matchId}&stage=${stage}`));
    }
    getDeltaBet(matchId: string) {
        return convert<DeltaBet>(get(`${API_URL}/bets/delta?matchId=${matchId}`));
    }
    async uploadGroupBet(bet: GroupBet, groupId: string): Promise<void> {
        await post(`${API_URL}/bets/group?groupId=${groupId}`, bet);
    }
    getGroups(): Promise<Group[]> {
        return convert<Group[]>(get(`${API_URL}/bets/groups`));
    }
    getGroupBet(groupId: string): Promise<GroupBet> {
        return convert<GroupBet>(get(`${API_URL}/bets/group?groupId=${groupId}`));
    }
    getGroupTeams(groupId: string): Promise<Team[]> {
        return convert<Team[]>(get(`${API_URL}/bets/group/teams?groupId=${groupId}`));
    }

    getData(): Promise<MainData> {
        return convert<MainData>(get(`${API_URL}/data/`));
    }

    getAllMatches(): Promise<Match[]> {
        return convert<Match[]>(get(`${API_URL}/match/all`));
    }

    getMatches(stage: TournamentStage): Promise<Match[]> {
        return convert<Match[]>(get(`${API_URL}/match?stage=${stage}`));
    }

    getBets(user: User | undefined): Promise<Bet[]> {
        return !!user
            ? convert<Bet[]>(get(`${API_URL}/bets/${user.id}`))
            : convert<Bet[]>(get(`${API_URL}/bets/`));
    }

    getBetsForUsers(users: User[]): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users`, users.map((user) => { if (!!user) { return user.id } })))
    }

    getGroupBetsForUsers(users: User[]): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users/group`, users.map((user) => { if (!!user) { return user.id } })))
    }

    getDeltaForUsers(users: User[], stage: TournamentStage): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users/delta?stage=${stage}`, users.map((user) => { if (!!user) { return user.id } })))
    }

    getLambdaForUsers(users: User[]): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users/lambda`, users.map((user) => { if (!!user) { return user.id } })))
    }

    getOmikronBetsForUsers(users: User[], isWinner: boolean): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users/omikron?isWinner=${isWinner}`, users.map((user) => { if (!!user) { return user.id } })))
    }

    async uploadTip(tip: Result, matchId: string): Promise<void> {
        await post(`${API_URL}/bets/tip/`, { tip: tip, matchId: matchId });
    }

    getDidPayed(): Promise<boolean> {
        return convert<boolean>(get(`${API_URL}/user/payed/`));
    }

    getUsers(sorted: boolean): Promise<User[]> {
        return convert<User[]>(get(`${API_URL}/users?orderByPoints=${sorted}`));
    }

    getUpdateStatus(): Promise<UpdateStatus> {
        return convert<UpdateStatus>(get(`${API_URL}/status/`))
    }
}