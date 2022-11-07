import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Bet, Match, Result } from "../../typings/index"
import { TeamCell } from '../TeamCell'

interface MatchRowAdminViewState {
    withResult: boolean,
    match: Match
}

interface MatchRowAdminViewProps {
    match: Match,
}

export class MatchRowAdminView extends React.Component<MatchRowAdminViewProps, MatchRowAdminViewState> {
    constructor(props: MatchRowAdminViewProps) {
        super(props);

        this.state = {
            withResult: !!this.props.match.result,
            match: this.props.match
        }
    }

    public render() {
        return this.state.withResult
            ? this.renderMatchWithResult()
            : this.renderMatchWithouResult()
    }

    private renderMatchWithResult() {
        return (
            <tr>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                <td key={this.props.match.result.id}>{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</td>
            </tr>
        );
    }

    private renderMatchWithouResult() {
        return (
            <div>
                <TeamCell team={this.props.match.home } />
                <TeamCell team={this.props.match.away } />
                <td>
                    <input type="number" min="0" max="99" value={!!this.state.match.result?.homeTeam ? this.state.match.result.homeTeam : "0"} onChange={(event) => this.setHomeResult(event.target.value)} />
                </td>
                <td>
                    <input type="number" min="0" max="99" value={!!this.state.match.result?.awayTeam ? this.state.match.result.awayTeam : "0"} onChange={(event) => this.setAwayResult(event.target.value)} />
                </td>
                <td>
                    <button className="btn btn-secondary" onClick={() => this.uploadResult()}> Uložit </button>
                </td>
            </div>
        );
    }

    private setHomeResult(tip: string) {
        let newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {} as Result
        }
        newMatch.result.homeTeam = Number(tip);

        this.setState({ match: newMatch });
    }

    private setAwayResult(tip: string) {
        let newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {} as Result;
        }
        newMatch.result.awayTeam = Number(tip);
        this.setState({ match: newMatch });
    }

    private async uploadResult(): Promise<void> {
        document.body.style.cursor = "wait";
        await getApi().uploadMatchResult(this.state.match.result, this.props.match.id);
        document.body.style.cursor = "normal";
        this.setState({ withResult: true })
    }
}

