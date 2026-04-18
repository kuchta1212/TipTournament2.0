import * as React from 'react';
import { Match, Bet, TournamentStage } from "../../typings/index";
import { MainRow } from './MainRow';
import { MatchBetsModal } from './MatchBetsModal';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import authService from './../api-authorization/AuthorizeService';
import './../../custom.css';

interface AlfaMatchesState {
    matches: Match[];
    bets: Bet[];
    loading: boolean;
    selectedMatch: Match | null;
    currentUserId: string;
}

interface AlfaMatchesProps { }

export class AlfaMatches extends React.Component<AlfaMatchesProps, AlfaMatchesState> {

    constructor(props: AlfaMatchesProps) {
        super(props);

        this.state = {
            matches: [],
            bets: [],
            loading: true,
            selectedMatch: null,
            currentUserId: "",
        };
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderMatchTable();

        return (
            <div className="alfa-matches">
                {contents}
                {this.state.selectedMatch && (
                    <MatchBetsModal
                        match={this.state.selectedMatch}
                        currentUserId={this.state.currentUserId}
                        onClose={() => this.setState({ selectedMatch: null })}
                    />
                )}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(TournamentStage.Group);
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bets = !!userId ? await getApi().getBets(userId) : await getApi().getBets();
        const user = await authService.getUser();
        this.setState({ matches: matches, bets: bets, loading: false, currentUserId: user ? user["sub"] : "" });
    }

    private renderMatchTable() {
        return (
            <div className="main-match-card-list">
                {this.state.matches.map((match) => (
                    <MainRow
                        key={match.id}
                        match={match}
                        bet={this.getBet(match)}
                        onClick={this.isMatchClickable(match) ? () => this.setState({ selectedMatch: match }) : undefined}
                    />
                ))}
            </div>
        );
    }

    private getBet(match: Match): Bet | undefined {
        return this.state.bets.find(b => b.match.id === match.id);
    }

    private isMatchClickable(match: Match): boolean {
        return match.ended || new Date(match.startTime) <= new Date();
    }
}
