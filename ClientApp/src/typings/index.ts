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
    round: number;
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
    dixitBonus: number;
    isJoker: boolean;
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
    dixitBonus: number;
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
    medals?: UserMedal[];
}

export enum MedalTournament {
    E20 = 0,
    E24 = 1,
    WC22 = 2
}

export enum MedalPlace {
    Gold = 0,
    Silver = 1,
    Bronze = 2
}

export interface UserMedal {
    tournament: MedalTournament;
    place: MedalPlace;
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

export enum TournamentStage {
    Group = 0,
    RoundOf32 = 1,
    RoundOf16 = 2,
    Quarterfinal = 3,
    Semifinal = 4,
    Final = 5,
    Winner = 6,
    Lambda = 7,
    Omikron = 8,
}

export interface DeltaBetTeams {
    possibleHomeTeams: Team[];
    possibleAwayTeams: Team[];
}

export enum BetsStageStatus {
    Open = 0,
    Locked = 1
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
    points: number;
    additionalResult: DeltaBetResult
}

export interface GroupResult {
    id: string;
    firstId: string;
    secondId: string;
    thirdId: string;
    fourthId: string;
}

export interface DeadlineInfo {
    tournamentStart: string;
    stageDeadlines: { [key: string]: string };
}

// Stats types
export interface StatsResponse {
    rankingOverTime: RankingOverTimeEntry[];
    matchNoOneGuessed: MatchStatEntry[];
    exactScoreHeroes: PlayerCountStat[];
    dixitLegends: PlayerCountStat[];
    biggestUpsets: MatchPercentageStat[];
    mostPredictableMatches: MatchPercentageStat[];
    jokerEfficiency: JokerEfficiencyStat[];
    averagePointsPerMatch: PlayerAverageStat[];
    tournamentStarted: boolean;
    winnerBets: TeamCountStat[];
    shooterBets: ShooterCountStat[];
    czechiaPlacementBets: StagePlacementStat[];
}

export interface TeamCountStat {
    teamId: string;
    teamName: string;
    teamIcon: string;
    count: number;
}

export interface ShooterCountStat {
    name: string;
    count: number;
}

export interface StagePlacementStat {
    stage: number;
    stageLabel: string;
    count: number;
}

export interface RankingOverTimeEntry {
    matchLabel: string;
    matchStartTime: string;
    playerPoints: PlayerPointSnapshot[];
}

export interface PlayerPointSnapshot {
    userName: string;
    cumulativePoints: number;
}

export interface MatchStatEntry {
    matchId: string;
    home: string;
    away: string;
    homeIcon: string;
    awayIcon: string;
    result: string;
    startTime: string;
}

export interface PlayerCountStat {
    userName: string;
    count: number;
}

export interface MatchPercentageStat {
    matchId: string;
    home: string;
    away: string;
    homeIcon: string;
    awayIcon: string;
    result: string;
    correctPercentage: number;
    totalBets: number;
}

export interface JokerEfficiencyStat {
    userName: string;
    jokersUsed: number;
    jokersCorrect: number;
    successRate: number;
    totalExtraPoints: number;
}

export interface PlayerAverageStat {
    userName: string;
    totalAlfaPoints: number;
    matchesBetOn: number;
    average: number;
}

