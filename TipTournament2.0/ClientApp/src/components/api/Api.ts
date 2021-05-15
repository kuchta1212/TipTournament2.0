import { MainData, Match, Result, AllBets, Bet } from "../../typings";
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

    getBets(): Promise<Bet[]> {
        return convert<Bet[]>(get(`${API_URL}/bets`))
    }


    getAllBets(): Promise<AllBets[]> {
        return convert<AllBets[]>(get(`${API_URL}/bets/all/`));
    }

    uploadTip(tip: Result, matchId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/tip/`, { tip: tip, matchId: matchId }));
    }

    getDidPayed(): Promise<boolean> {
        return convert<boolean>(get(`${API_URL}/user/payed/`));
    }

}