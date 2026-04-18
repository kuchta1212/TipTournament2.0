import * as React from 'react';
import { Match, Bet, UpdateStatus, TournamentStage } from "../../typings/index"
import { MainRow } from './MainRow';
import { MatchBetsModal } from './MatchBetsModal';
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import authService from './../api-authorization/AuthorizeService';


interface MatchStagesProps {
    stage: TournamentStage;
    isActive: boolean
}

interface MatchStagesState {
    matches: Match[],
    bets: Bet[];
    loading: boolean;
    selectedMatch: Match | null;
    currentUserId: string;
}

export class MatchStages extends React.Component<MatchStagesProps, MatchStagesState> {

    constructor(props: MatchStagesProps) {
        super(props);
        this.state = {
            matches: [],
            bets: [],
            loading: true,
            selectedMatch: null,
            currentUserId: "",
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.matches.every(m => !!m.home && !!m.away)
                ? this.renderMatchTable()
                : this.renderMesage();

        return (
            <div className="col">
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
        const matches = await getApi().getMatches(this.props.stage);
        const bets = await getApi().getBets(undefined);
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

    private renderMesage() {
        return (
            <div>
                Zatím zde nejsou žádné zápasy.
            </div>
        );
    }

    private getBet(match: Match): Bet | undefined {
       return this.state.bets.find(b => b.match.id == match.id);
    }

    private isMatchClickable(match: Match): boolean {
        return match.ended || new Date(match.startTime) <= new Date();
    }
}
