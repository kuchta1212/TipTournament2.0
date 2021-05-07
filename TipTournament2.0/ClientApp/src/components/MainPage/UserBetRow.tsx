import * as React from 'react';
import { IApi } from "../api/IApi"
import { Bet, BetResult } from "../../typings/index"

interface UserBetRowProps {
    bet: Bet
}

export class UserBetRow extends React.Component<UserBetRowProps> {

    constructor(props: UserBetRowProps) {
        super(props);

        console.log(props.bet);
    }

    public render() {

        if (this.props.bet.match.ended) {
            switch (this.props.bet.betResult) {
                case BetResult.nothing:
                    return this.renderPlayedMatchBet();
                case BetResult.winner:
                    return this.renderPlayedMatchBet();
                case BetResult.difference:
                    return this.renderPlayedMatchBet();
                case BetResult.score:
                    return this.renderPlayedMatchBet();
            }
        } 

        return this.renderNotPlayedMatchBet();
    }

    private renderPlayedMatchBet() {
        return (
            <React.Fragment>
                <td>{this.props.bet.tip.home} : {this.props.bet.tip.away}</td>
                <td>{this.props.bet.betResult}</td>
            </React.Fragment>
        );
    }

    private renderNotPlayedMatchBet() {
        return (
            <React.Fragment>
                <td>{this.props.bet.tip.home} : {this.props.bet.tip.away}</td>
                <td />
            </React.Fragment>
        );
    }

}

