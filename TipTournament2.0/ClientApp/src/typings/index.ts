export interface MainData {
    matches: Match[];
    users: User[];
    bets: Bet[];
    status: UpdateStatus;
}

export interface Match {
    id: string;
    home: Team;
    away: Team;
    startTime: Date;
    result: Result;
    ended: boolean;
    link: string;
    stage: TournamentStage;
}

export interface Team {
    id: string;
    name: string;
    iconPath: string
}

export interface Group {
    id: string;
    groupName: string;
    matches: Match[];
}

export interface Result {
    id?: string;
    homeTeam: number;
    awayTeam: number;
}

export interface Bet {
    id: string;
    match: Match;
    tip: Result;
    result: BetResult;
    user: User;
}

export interface GroupBet {
    id: string;
    first: Team;
    second: Team;
    third: Team;
    fourth: Team;
    points: number;
}

export interface DeltaBet {
    id: string;
    match: Match;
    homeTeamBet: Team;
    awayTeamBet: Team;
    points: number;
    user: User;
}

export enum BetResult {
    nothing = 0,
    winner = 1,
    difference = 2,
    score = 4
}

export interface User {
    id: string;
    userName: string;
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

export interface UpdateStatus {
    date: Date;
    errorMessage: string;
}

export interface BetsStatus {
    id: string,
    matchesInGroupsDone: boolean,
    groupStagesDone: boolean,
    querterfinalStageDone: boolean,
    semifinalStageDone: boolean,
    finalStageDone: boolean,
}

export enum TournamentStage {
    Group = 0,
    FirstRound = 1,
    Quarterfinal = 2,
    Semifinal = 3,
    Final = 4,
    Winner = 5
}

export interface DeltaBetTeams {
    possibleHomeTeams: Team[];
    possibleAwayTeams: Team[];
}

export enum BetsStageStatus {
    NotReady = 0,
    Ready = 1,
    Done = 2
}