import { MainData, Match, Bet, Result, User } from "../../typings";

export interface IApi {
    getData(): Promise<MainData>;
    getMatches(): Promise<Match[]>;
    getBets(user: User | undefined): Promise<Bet[]>;
    //uploadBets(bets: Bet[]): Promise<void>;
    uploadTip(bet: Result, matchId: string): Promise<void>;
    getDidPayed(): Promise<boolean>;
    getUsers(): Promise<User[]>;
}