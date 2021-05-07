import { MainData, Match, Bet, AllBets } from "../../typings";

export interface IApi {
    getData(): Promise<MainData>;
    getMatches(): Promise<Match[]>;
    getAllBets(): Promise<AllBets[]>;
    uploadBets(bets: Bet[]): Promise<void>;
    getDidPayed(): Promise<boolean>;
}