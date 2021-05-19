import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Bet, Match, Result } from "../../typings/index"

interface MatchBetRowState {
    tip: Result,
    setted: boolean
}

interface MatchBetRowProps {
    match: Match,
    bet: Bet | undefined,
    isReadOnly: boolean
}

export class MatchBetRow extends React.Component<MatchBetRowProps, MatchBetRowState> {
    constructor(props: MatchBetRowProps) {
        super(props);

        if (!this.props.bet) {
            this.state = { tip: { homeTeam: 0, awayTeam: 0 }, setted: false }
        } else {
            this.state = { tip: { homeTeam: this.props.bet.tip.homeTeam, awayTeam: this.props.bet.tip.awayTeam }, setted: true }
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
                <td>{this.props.match.homeTeam} <span>\ue721</span></td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.state.tip.homeTeam} : {this.state.tip.awayTeam}</td>
                {!this.props.isReadOnly ? <td><button onClick={() => this.modify()}>Upravit</button></td> : <td/>} 
            </React.Fragment>
        );
    }

    private renderNotSettedBet() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td><input type="number" min="0" max="99" value={!!this.state.tip.homeTeam ? this.state.tip.homeTeam : "0"} onChange={(event) => this.setHomeTip(event.target.value)} /></td>
                <td><input type="number" min="0" max="99" value={!!this.state.tip.awayTeam ? this.state.tip.awayTeam : "0"} onChange={(event) => this.setAwayTip(event.target.value)} /></td>
                {!this.props.isReadOnly ? <td><button onClick={() => this.uploadTip()}>Ulozit</button></td> : <td/>}
            </React.Fragment>
        );
    }

    private setHomeTip(tip: string) {
        this.setState({ tip: { homeTeam: Number(tip), awayTeam: this.state.tip.awayTeam }, setted: false });
    }

    private setAwayTip(tip: string) {
        this.setState({ tip: { homeTeam: this.state.tip.homeTeam, awayTeam: Number(tip) }, setted: false });
    }

    private uploadTip() {
        this.setState({tip: this.state.tip, setted: true})
        getApi().uploadTip(this.state.tip, this.props.match.id);
    }

    private modify() {
        this.setState({ tip: this.state.tip, setted: false });
    }
}

