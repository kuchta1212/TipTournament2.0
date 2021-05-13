import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { IApi } from "../api/IApi"
import { Bet, BetResult, Match, Result } from "../../typings/index"
import authService from '../api-authorization/AuthorizeService'

interface MatchBetRowState {
    tip: Result,
    setted: boolean
}

interface MatchBetRowProps {
    match: Match
}

export class MatchBetRow extends React.Component<MatchBetRowProps, MatchBetRowState> {

    constructor(props: MatchBetRowProps) {
        super(props);
        const [tip, setTip] = React.useState({ tip: { homeTeam: undefined, awayteam: undefined }, setted: false });
    }

    public render() {
        return this.state.setted
            ? this.renderSettedBet()
            : this.renderNotSettedbet()
    }

    private renderSettedbet() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</td>
                <td><a href={this.props.match.link}>Záznam</a></td>
            </React.Fragment>
        );
    }

    private renderNotPlayedMatch() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.props.match.startTime}</td>
                <td><a href={this.props.match.link}>Záznam</a></td>
            </React.Fragment>
        );
    }

}

