import { DeltaBetTeams, GroupResult, Result, TournamentStage, User } from "../../typings";
import { IAdminApi } from "./IAdminApi";
import { get, post } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api/admin';

export class AdminApi implements IAdminApi {
    async evaluateTopShooter(name: string): Promise<void> {
        await post(`${API_URL}/shooter?name=${name}`);
    }
    async setWinner(matchId: string, winner: string): Promise<void> {
        await post(`${API_URL}/winner?teamId=${winner}`);
    }
    async evalateTeamPlaceBets(): Promise<void> {
        await post(`${API_URL}/omikron`);
    }
    getTeamForMatch(id: string, stage: TournamentStage): Promise<DeltaBetTeams> {
        return convert<DeltaBetTeams>(get(`${API_URL}/delta/teams?matchId=${id}&stage=${stage}`));
    }
    async updateMatch(id: string, homeTeamId: string, awayTeamId: string): Promise<void> {
        await post(`${API_URL}/match?matchId=${id}&homeTeamId=${homeTeamId}&awayTeamId=${awayTeamId}`);
    }

    async uploadGroupResult(result: GroupResult, id: string): Promise<void> {
        await post(`${API_URL}/group/result?groupId=${id}`, result);
    }

    async uploadMatchResult(result: Result, id: string): Promise<void> {
        await post(`${API_URL}/result?matchId=${id}`, result);
    }

    payed(userId: string, payed: boolean): Promise<void> {
        return convert<void>(post(`${API_URL}/${userId}/payed?payed=${payed}`));
    }

    setAdmin(userId: string, isAdmin: boolean): Promise<void> {
        return convert<void>(post(`${API_URL}/${userId}/admin?isAdmin=${isAdmin}`));
    }

    getUsersWithRoles(): Promise<any[]> {
        return convert<any[]>(get(`${API_URL}/users`));
    }
}