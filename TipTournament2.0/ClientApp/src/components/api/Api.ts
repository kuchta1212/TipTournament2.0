import { MainData, Match, Bet, AllBets } from "../../typings";
import { IApi } from "./IApi";
import { get, post } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api';

export class Api implements IApi {

    getData(userId: string): Promise<MainData> {
        return convert<MainData>(get(`${API_URL}/data/`));
    }

    getMatches(): Promise<Match[]> {
        return convert<Match[]>(get(`${API_URL}/matches/`));
    }

    getAllBets(): Promise<AllBets[]> {
        return convert<AllBets[]>(get(`${API_URL}/bets/all/`));
    }

    uploadBets(bets: Bet[], userId: string): Promise<void> {
        return convert<void>(post(`${API_URL}/bets/`, bets));
    }
    getDidPayed(userId: string): Promise<boolean> {
        return convert<boolean>(get(`${API_URL}/user/payed/`));
    }

}