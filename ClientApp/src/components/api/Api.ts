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
    getShooterBet(userId: string | undefined): Promise<TopShooterBet> {
        return !userId
            ? convert<TopShooterBet>(get(`${API_URL}/bets/shooter`))
            : convert<TopShooterBet>(get(`${API_URL}/bets/shooter?userId=${userId}`));
    }
    getTeamsForTeamPlaceBet(isWinnerBet: boolean): Promise<Team[]> {
        return convert<Team[]>(get(`${API_URL}/bets/teamplace/teams?isWinnerBet=${isWinnerBet}`));
    }
    uploadTeamPlaceBet(stage: TournamentStage, teamId: string, isWinnerBet: boolean): Promise<PlaceTeamBet> {
        return convert<PlaceTeamBet>(post(`${API_URL}/bets/teamplace?teamId=${teamId}&isWinnerBet=${isWinnerBet}&stage=${stage}`));
    }
    getTeamPlaceBet(userId: string | undefined): Promise<PlaceTeamBet> {
        return !userId
            ? convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=false`))
            : convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=false&userId=${userId}`))
    }
    getWinnerBet(userId: string | undefined): Promise<PlaceTeamBet> {
        return !userId
            ? convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=true`))
            : convert<PlaceTeamBet>(get(`${API_URL}/bets/teamplace?isWinnerBet=true&userId=${userId}`))
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
    getTeamsForDeltaBet(matchId: string, stage: TournamentStage, userId: string | undefined) {
        return !userId
            ? convert<DeltaBetTeams>(get(`${API_URL}/bets/delta/teams?matchId=${matchId}&stage=${stage}`))
            : convert<DeltaBetTeams>(get(`${API_URL}/bets/delta/teams?matchId=${matchId}&stage=${stage}&userId=${userId}`))
    }
    getDeltaBet(matchId: string, userId: string | undefined) {
        return !userId
            ? convert<DeltaBet>(get(`${API_URL}/bets/delta?matchId=${matchId}`))
            : convert<DeltaBet>(get(`${API_URL}/bets/delta?matchId=${matchId}&userId=${userId}`));
    }
    async uploadGroupBet(bet: GroupBet, groupId: string): Promise<void> {
        await post(`${API_URL}/bets/group?groupId=${groupId}`, bet);
    }
    getGroups(): Promise<Group[]> {
        return convert<Group[]>(get(`${API_URL}/bets/groups`));
    }
    getGroupBet(groupId: string, userId: string | undefined): Promise<GroupBet> {
        return !userId 
            ? convert<GroupBet>(get(`${API_URL}/bets/group?groupId=${groupId}`))
            : convert<GroupBet>(get(`${API_URL}/bets/group?groupId=${groupId}&userId=${userId}`))
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

    getBets(userId?: string | undefined): Promise<Bet[]> {
        return !!userId
            ? convert<Bet[]>(get(`${API_URL}/bets/${userId}`))
            : convert<Bet[]>(get(`${API_URL}/bets/`));
    }

    getBetsForUsers(users: User[]): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users?userIds`, users.map((user) => { if (!!user) { return user.id } })))
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