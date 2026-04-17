import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User, TournamentStage, DeadlineInfo } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from './../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"

interface JokerSelection {
    [round: number]: string; // round -> matchId
}

interface BetsState {
    matches: Match[],
    bets: IDictionary<Bet[]>,
    loading: boolean,
    jokerSelection: JokerSelection,
}

interface BetsProps {
    users: User[] | undefined,
    deadlines?: DeadlineInfo | null
}

export class Bets extends React.Component<BetsProps, BetsState> {

    constructor(props: BetsProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            bets: new Dictionary(),
            loading: true,
            jokerSelection: {},
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderBetsTable(this.state.matches, this.state.bets);

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(TournamentStage.Group);
        let userBets: IDictionary<Bet[]> = !!this.props.users ? await this.getBetsForMultipleUsers(this.props.users) : await this.getBetsForCurrentUser();

        // Initialize joker selection from existing bet data
        const jokerSelection: JokerSelection = {};
        const currentBets = userBets.get("current");
        if (currentBets) {
            currentBets.forEach(b => {
                if (b.isJoker && b.match) {
                    const round = b.match.round || 0;
                    jokerSelection[round] = b.match.id;
                }
            });
        }

        this.setState({ matches: matches, bets: userBets, loading: false, jokerSelection: jokerSelection });
    }

    private async getBetsForCurrentUser(): Promise<IDictionary<Bet[]>> {
        const bets = await getApi().getBets(undefined);
        let userBets = this.state.bets;
        userBets.put("current", bets)
        return userBets;
    }

    private async getBetsForMultipleUsers(users: User[]): Promise<IDictionary<Bet[]>> {
        let bets = await getApi().getBetsForUsers(users);

        return Dictionary.convert<Bet[]>(bets);
    }

    private isMatchLocked(match: Match): boolean {
        if (!match.startTime) return false;
        return new Date() > new Date(match.startTime);
    }

    private getMatchesForRound(matches: Match[], round: number): Match[] {
        return matches.filter(m => (m.round || 0) === round);
    }

    private getRounds(matches: Match[]): number[] {
        const rounds = matches.map(m => m.round || 0)
            .filter((value, index, self) => self.indexOf(value) === index);
        return rounds.sort((a, b) => a - b);
    }

    private hasBetForMatch(matchId: string): boolean {
        const currentBets = this.state.bets.get("current");
        if (!currentBets) return false;
        return currentBets.some(b => b.match && b.match.id === matchId);
    }

    private handleJokerToggle(matchId: string, round: number) {
        // Update local state immediately for instant UI feedback
        const jokerSelection = { ...this.state.jokerSelection };
        jokerSelection[round] = matchId;
        this.setState({ jokerSelection });

        // If bet already exists on server, persist joker immediately
        if (this.hasBetForMatch(matchId)) {
            getApi().setJoker(matchId);
        }
    }

    private async handleBetSaved(matchId: string) {
        // Find the round for this match
        const match = this.state.matches.find(m => m.id === matchId);
        const round = match ? (match.round || 0) : 0;

        // If this match is the selected joker for its round, persist it now
        if (this.state.jokerSelection[round] === matchId) {
            await getApi().setJoker(matchId);
        }

        // Refresh bets from server to sync state
        const bets = await getApi().getBets(undefined);
        let userBets = this.state.bets;
        userBets.put("current", bets);
        this.setState({ bets: userBets });
    }

    private renderBetsTable(matches: Match[], userBets: IDictionary<Bet[]>) {
        return !!this.props.users
            ? this.renderBetsTableForMultipleUsers(matches, userBets)
            : this.renderBetsTableForCurrentUser(matches, userBets);
    }

    private renderBetsTableForMultipleUsers(matches: Match[], userBets: IDictionary<Bet[]>) {
        return (
            <Table className="table table-striped comparison-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {userBets.getKeys().map((userId) => {
                            return (<th key={userId}>{this.props.users?.find(u => u.id === userId)?.userName}</th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={match.id}>
                            <MatchBetRow match={match} bets={this.getBetsRow(userBets, match)} isReadOnly={!!this.props.users} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }

    private getBetsRow(userBets: IDictionary<Bet[]>, match: Match): Bet[] {
        let bets = userBets.getValues().reduce((acc, cur) => {
            let bet = cur.find(b => !!b.match && b.match.id == match.id)
            if (!!bet) {
                acc.push(bet);
            }
            return acc;
        },
        [] as Bet[]);

        return bets;
    }

    private renderBetsTableForCurrentUser(matches: Match[], userBets: IDictionary<Bet[]>) {
        const rounds = this.getRounds(matches);

        return (
            <div>
                {rounds.map(round => {
                    const roundMatches = this.getMatchesForRound(matches, round);
                    const jokerMatchId = this.state.jokerSelection[round] || null;
                    // If joker is on a match that already started, lock joker for entire round
                    const jokerMatch = jokerMatchId ? roundMatches.find(m => m.id === jokerMatchId) : null;
                    const isRoundJokerLocked = jokerMatch ? this.isMatchLocked(jokerMatch) : false;
                    return (
                        <div key={round} className="mb-3">
                            {round > 0 && <h5 className="round-header">Kolo {round}</h5>}
                            <div className="match-card-list">
                                {roundMatches.map((match) => {
                                    const bets = this.getBetsRow(userBets, match);
                                    const isLocked = this.isMatchLocked(match);
                                    const isJoker = jokerMatchId === match.id;
                                    return (
                                        <MatchBetRow
                                            key={match.id}
                                            match={match}
                                            bets={bets}
                                            isReadOnly={isLocked}
                                            isJoker={isJoker}
                                            canSetJoker={!isLocked && !isRoundJokerLocked}
                                            onJokerToggle={() => this.handleJokerToggle(match.id, round)}
                                            onBetSaved={() => this.handleBetSaved(match.id)}
                                            useCardLayout={true}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
