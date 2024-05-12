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
    result: GroupResult;
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
    result: GroupBetResult;
}

export interface DeltaBet {
    id: string;
    match: Match;
    homeTeamBet: Team;
    awayTeamBet: Team;
    result: DeltaBetResult;
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
    totalPoints: number;
    alfaPoints: number;
    gamaPoints: number;
    deltaPoints: number;
    lambdaPoints: number;
    omikronPoints: number;
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
    firstStagesDones: boolean,
    querterfinalStageDone: boolean,
    semifinalStageDone: boolean,
    finalStageDone: boolean,
    winnerStageDone: boolean,
    lambdaStageDone: boolean,
    omikronStageDone: boolean
}

export enum TournamentStage {
    Group = 0,
    FirstRound = 1,
    Quarterfinal = 2,
    Semifinal = 3,
    Final = 4,
    Winner = 5,
    Lambda = 6,
    Omikron = 7,

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

export interface PlaceTeamBet {
    id: string;
    team: Team;
    stageBet: TournamentStage;
    isWinnerBet: boolean;
    isCorrect: boolean;
    userId: string;
}

export interface TopShooterBet {
    id: string;
    shoterName: string;
    userId: string;
    points: number;
    isCorrect: boolean;
}

export interface GroupBetResult {
    id: string;
    isFirstCorrect: boolean;
    isSecondCorrect: boolean;
    isThirdCorrect: boolean;
    isFourthCorrect: boolean;
    points: number;

}

export interface DeltaBetResult {
    id: string;
    isHomeTeamCorrect: boolean;
    isAwayTeamCorrect: boolean;
    points: number
}

export interface GroupResult {
    id: string;
    firstId: string;
    secondId: string;
    thirdId: string;
    fourthId: string;
}

