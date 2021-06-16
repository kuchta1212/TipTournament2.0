import { MainData, Match, Result, AllBets, Bet, User, UpdateStatus } from "../../typings";
import { IDictionary } from "../../typings/Dictionary";
import { IApi } from "./IApi";
import { get, post } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api';

export class Api implements IApi {

    getData(): Promise<MainData> {
        return convert<MainData>(get(`${API_URL}/data/`));
    }

    getMatches(): Promise<Match[]> {
        return convert<Match[]>(get(`${API_URL}/matches/`));
    }

    getBets(user: User | undefined): Promise<Bet[]> {
        return !!user
            ? convert<Bet[]>(get(`${API_URL}/bets/${user.id}`))
            : convert<Bet[]>(get(`${API_URL}/bets/`));
    }

    getBetsForUsers(users: User[]): Promise<any> {
        return convert<any>(post(`${API_URL}/bets/users?userIds`, users.map((user) => { if (!!user) { return user.id } })))
    }

    uploadTip(tip: Result, matchId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tip/`, { tip: tip, matchId: matchId }));
    }

    getDidPayed(): Promise<boolean> {
        return convert<boolean>(get(`${API_URL}/user/payed/`));
    }

    getUsers(): Promise<User[]> {
        return convert<User[]>(get(`${API_URL}/users/`));
    }

    getUpdateStatus(): Promise<UpdateStatus> {
        return convert<UpdateStatus>(get(`${API_URL}/status/`))
    }
}