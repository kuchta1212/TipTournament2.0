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
    isReadOnly: boolean
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

    private renderSettedBet() {
        return (
            <React.Fragment>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                {this.state.tips.map((tip) => {
                    return (<td key={tip.id}>{tip.homeTeam} : {tip.awayTeam}</td>)
                })}
                {!this.props.isReadOnly ? <td><button className="btn btn-link" onClick={() => this.modify()}>Upravit</button></td> : <td/>} 
            </React.Fragment>
        );
    }

    private renderNotSettedBet() {
        return !this.props.isReadOnly ?
            (
                <React.Fragment>
                    <TeamCell team={this.props.match.home} />
                    <TeamCell team={this.props.match.away} />
                    <td><input type="number" min="0" max="99" value={!!this.state.tips[0].homeTeam ? this.state.tips[0].homeTeam : "0"} onChange={(event) => this.setHomeTip(event.target.value)} /></td>
                    <td><input type="number" min="0" max="99" value={!!this.state.tips[0].awayTeam ? this.state.tips[0].awayTeam : "0"} onChange={(event) => this.setAwayTip(event.target.value)} /></td>
                    {<td><button className="btn btn-secondary" onClick={() => this.uploadTip()}>Uložit</button></td>}
                </React.Fragment>
            )
            : null;
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
        this.setState({ setted: true })
        getApi().uploadTip(this.state.tips[0], this.props.match.id);
    }

    private modify() {
        this.setState({ setted: false });
    }
}

