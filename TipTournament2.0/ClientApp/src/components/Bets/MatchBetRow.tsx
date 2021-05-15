import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Bet, Match, Result } from "../../typings/index"

interface MatchBetRowState {
    tip: Result,
    setted: boolean
}

interface MatchBetRowProps {
    match: Match,
    bet: Bet | undefined
}

export class MatchBetRow extends React.Component<MatchBetRowProps, MatchBetRowState> {

    private homeTip: number = 0;
    private awayTip: number = 0;

    constructor(props: MatchBetRowProps) {
        super(props);

        this.state = { tip: { homeTeam: 0, awayTeam: 0 }, setted: false }
    }

    public render() {
        return this.state.setted
            ? this.renderSettedBet()
            : this.renderNotSettedBet()
    }

    private renderSettedBet() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.state.tip.homeTeam} : {this.state.tip.awayTeam}</td>
                <td><button onClick={ () => this.modify()}>Upravit</button></td>
            </React.Fragment>
        );
    }

    private renderNotSettedBet() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td><input type="number" min="0" max="99" placeholder="0" onChange={(event) => this.setHomeTip(event.target.value)} /></td>
                <td><input type="number" min="0" max="99" placeholder="0" onChange={(event) => this.setAwayTip(event.target.value)} /></td>
                <td><button onClick={ () => this.saveTip()}>Ulozit</button></td>
            </React.Fragment>
        );
    }

    private setHomeTip(tip: string) {
        this.homeTip = Number(tip);
    }

    private setAwayTip(tip: string) {
        this.awayTip = Number(tip);
    }

    private saveTip() {
        console.log(` Home: ${this.homeTip}, Away: ${this.awayTip}`);
        this.setState({
            tip: {
                homeTeam: this.homeTip,
                awayTeam: this.awayTip
            },
            setted: true
        });
        this.uploadTip();
    }

    private uploadTip() {
        console.log(this.state.tip);
        getApi().uploadTip(this.state.tip, this.props.match.id);
    }

    private modify() {
        this.setState({
            tip: {
                homeTeam: this.homeTip,
                awayTeam: this.awayTip
            },
            setted: false
        });
    }
}

