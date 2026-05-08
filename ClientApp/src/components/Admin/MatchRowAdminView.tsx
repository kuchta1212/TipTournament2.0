import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { Match, Result } from "../../typings/index"
import { TeamCell } from '../TeamCell'
import { ConfirmModal } from './ConfirmModal';

interface MatchRowAdminViewState {
    withResult: boolean,
    match: Match,
    showConfirm: boolean
}

interface MatchRowAdminViewProps {
    match: Match,
}

export class MatchRowAdminView extends React.Component<MatchRowAdminViewProps, MatchRowAdminViewState> {
    constructor(props: MatchRowAdminViewProps) {
        super(props);

        const match = this.props.match;
        if (!match.ended) {
            match.result = {} as Result;
        }

        this.state = {
            withResult: this.props.match.ended,
            match: match,
            showConfirm: false
        }
    }

    public render() {
        return this.state.withResult
            ? this.renderMatchWithResult()
            : this.renderMatchWithoutResult()
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

    private renderMatchWithoutResult() {
        return (
            <tr>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                <td>
                    <input type="number" className="score-input" min="0" max="9" value={this.state.match.result?.homeTeam ?? ""} onChange={(event) => this.setHomeResult(event.target.value)} />
                </td>
                <td>
                    <input type="number" className="score-input" min="0" max="9" value={this.state.match.result?.awayTeam ?? ""} onChange={(event) => this.setAwayResult(event.target.value)} />
                </td>
                <td>
                    <button className="btn btn-primary btn-sm" onClick={() => this.setState({ showConfirm: true })}>Ulozit</button>
                </td>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Ulozit vysledek"
                        message={`Ulozit vysledek ${this.state.match.result?.homeTeam ?? 0} : ${this.state.match.result?.awayTeam ?? 0} pro tento zapas?`}
                        variant="warning"
                        confirmText="Ulozit"
                        onConfirm={() => this.uploadResult()}
                        onCancel={() => this.setState({ showConfirm: false })}
                    />
                }
            </tr>
        );
    }

    private clampGoals(value: string): number {
        const digits = (value || "").replace(/\D/g, '');
        if (!digits) return 0;
        return Number(digits[digits.length - 1]);
    }

    private setHomeResult(tip: string) {
        let newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {} as Result
        }
        newMatch.result.homeTeam = this.clampGoals(tip);
        this.setState({ match: newMatch });
    }

    private setAwayResult(tip: string) {
        let newMatch = this.state.match;
        if (!newMatch.result) {
            newMatch.result = {} as Result;
        }
        newMatch.result.awayTeam = this.clampGoals(tip);
        this.setState({ match: newMatch });
    }

    private async uploadResult(): Promise<void> {
        this.setState({ showConfirm: false });
        document.body.style.cursor = "wait";
        const result: Result = {
            homeTeam: this.state.match.result?.homeTeam ?? 0,
            awayTeam: this.state.match.result?.awayTeam ?? 0
        };
        this.state.match.result = result;
        await getAdminApi().uploadMatchResult(result, this.props.match.id);
        document.body.style.cursor = "pointer";
        this.state.match.ended = true;
        this.setState({ withResult: true })
    }
}
