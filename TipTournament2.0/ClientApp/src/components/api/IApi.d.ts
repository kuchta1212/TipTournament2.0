import { MainData, Match, Bet, AllBets, Result } from "../../typings";

export interface IApi {
    getData(): Promise<MainData>;
    getMatches(): Promise<Match[]>;
    getBets(): Promise<Bet[]>;
    getAllBets(): Promise<AllBets[]>;
    //uploadBets(bets: Bet[]): Promise<void>;
    uploadTip(bet: Result, matchId: string): Promise<void>;
    getDidPayed(): Promise<boolean>;
}