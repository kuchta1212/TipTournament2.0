export interface MainData {
    matches: Match[];
    users: User[];
    userBets: Bet[]
}

export interface Match {
    id: string;
    homeTeam: string;
    awayTeam: string;
    startTime: Date;
    result: Result;
    ended: boolean;
    link: string;
}

export interface Result {
    home: number;
    away: number;
}

export interface Bet {
    id: string;
    match: Match;
    tip: Result;
    betResult: BetResult;
    user: User;
}

export enum BetResult {
    nothing = 0,
    winner = 1,
    difference = 2,
    score = 4
}

export interface User {
    points: number;
    payed: boolean;
}

export interface AllBets {
    [user: string] : Bet[]
}

export enum HttpStatusCode {
    OK = 200,
    NoContent = 204,
    Unauthorized = 401,
    NotFound = 404,
    PreconditionFailed = 412
}