import { MainData, Match, Bet, Result, User } from "../../typings";
import { IDictionary } from "../../typings/Dictionary"

export interface IApi {
    getData(): Promise<MainData>;
    getMatches(): Promise<Match[]>;
    getBets(user: User | undefined): Promise<Bet[]>;
    getBetsForUsers(users: User[]): Promise<any>
    uploadTip(bet: Result, matchId: string): Promise<void>;
    getDidPayed(): Promise<boolean>;
    getUsers(): Promise<User[]>;
}