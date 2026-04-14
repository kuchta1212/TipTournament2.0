import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Bet, Match, Result } from "../../typings/index"
import { TeamCell } from './../TeamCell'

interface MatchBetRowState {
    tips: Result[],
    setted: boolean
}

interface MatchBetRowProps {
    match: Match,
    bets: Bet[] | undefined,
    isReadOnly: boolean,
    isJoker?: boolean,
    canSetJoker?: boolean,
    onJokerToggle?: () => void,
    onBetSaved?: () => void
}

export class MatchBetRow extends React.Component<MatchBetRowProps, MatchBetRowState> {
    constructor(props: MatchBetRowProps) {
        super(props);

        if (!this.props.bets || this.props.bets.length == 0) {
            this.state = { tips: [{ homeTeam: 0, awayTeam: 0 }], setted: false }
        } else {
            this.state = { tips: this.props.bets.map((bet) => { return { homeTeam: bet.tip.homeTeam, awayTeam: bet.tip.awayTeam }}) , setted: true }
        }
    }

    public render() {
        return this.state.setted
            ? this.renderSettedBet()
            : this.renderNotSettedBet()
    }

    private isMatchLocked(): boolean {
        if (!this.props.match.startTime) return this.props.isReadOnly;
        return this.props.isReadOnly || new Date() > new Date(this.props.match.startTime);
    }

    private formatMatchTime(): string {
        if (!this.props.match.startTime) return '';
        const date = new Date(this.props.match.startTime);
        return `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    private renderJokerButton() {
        if (this.props.canSetJoker && this.props.onJokerToggle) {
            return (
                <td>
                    <button
                        className={`btn btn-sm ${this.props.isJoker ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={this.props.onJokerToggle}
                        title={this.props.isJoker ? 'Joker nastaven' : 'Nastavit Joker'}
                    >
                        {this.props.isJoker ? '\u2605 Joker' : '\u2606'}
                    </button>
                </td>
            );
        }
        if (this.props.isJoker) {
            return <td><span className="joker-badge">{'\u2605'} 2x</span></td>;
        }
        if (this.props.canSetJoker !== undefined) {
            return <td></td>;
        }
        return null;
    }

    private renderSettedBet() {
        return (
            <React.Fragment>
                <td className="text-muted small">{this.formatMatchTime()}</td>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                {this.state.tips.map((tip) => {
                    return (<td key={tip.id}>{tip.homeTeam} : {tip.awayTeam}</td>)
                })}
                {!this.isMatchLocked() ? <td><button className="btn btn-link" onClick={() => this.modify()}>Upravit</button></td> : null}
                {this.renderJokerButton()}
            </React.Fragment>
        );
    }

    private renderNotSettedBet() {
        return (
            <React.Fragment>
                <td className="text-muted small">{this.formatMatchTime()}</td>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                {!this.isMatchLocked() ? (
                    <>
                        <td><input type="number" min="0" max="99" value={!!this.state.tips[0].homeTeam ? this.state.tips[0].homeTeam : "0"} onChange={(event) => this.setHomeTip(event.target.value)} /></td>
                        <td><input type="number" min="0" max="99" value={!!this.state.tips[0].awayTeam ? this.state.tips[0].awayTeam : "0"} onChange={(event) => this.setAwayTip(event.target.value)} /></td>
                        <td><button className="btn btn-secondary" onClick={() => this.uploadTip()}>Uložit</button></td>
                    </>
                ) : (
                    <td>-</td>
                )}
                {this.renderJokerButton()}
            </React.Fragment>
        );
    }

    private setHomeTip(tip: string) {
        let newTips = this.state.tips;
        newTips[0] = { homeTeam: Number(tip), awayTeam: this.state.tips[0].awayTeam };
        this.setState({ tips: newTips });
    }

    private setAwayTip(tip: string) {
        let newTips = this.state.tips;
        newTips[0] = { homeTeam: this.state.tips[0].homeTeam, awayTeam: Number(tip) };
        this.setState({ tips: newTips });
    }

    private async uploadTip() {
        if (this.isMatchLocked()) return;
        this.setState({ setted: true });
        await getApi().uploadTip(this.state.tips[0], this.props.match.id);
        if (this.props.onBetSaved) {
            this.props.onBetSaved();
        }
    }

    private modify() {
        if (this.isMatchLocked()) return;
        this.setState({ setted: false });
    }
}
