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

        if (!!this.props.bet.match.ended) {
            switch (this.props.bet.result) {
                case BetResult.nothing:
                    return this.renderPlayedMatchBet("text-danger", "bg-danger");
                case BetResult.winner:
                    return this.renderPlayedMatchBet("text-success", "bg-success");
                case BetResult.difference:
                    return this.renderPlayedMatchBet("text-warning", "bg-warning");
                case BetResult.score:
                    return this.renderPlayedMatchBet("text-info", "bg-info");
                default:
                    return this.renderPlayedMatchBet("text-info", "bg-info");
            }
        } else {
            return this.renderNotPlayedMatchBet();
        }
    }

    private renderPlayedMatchBet(textClassName: string, backgroundClassName: string) {
        return (
            <React.Fragment>
                <td className={textClassName}>{this.props.bet.tip.homeTeam} : {this.props.bet.tip.awayTeam}</td>
                <td className={backgroundClassName}>{this.props.bet.result}</td>
            </React.Fragment>
        );
    }

    private renderNotPlayedMatchBet() {
        return !!this.props.bet?.tip
            ? this.renderBetSetted()
            : this.renderNoBet();
    }

    private renderBetSetted() {
        return (
            <React.Fragment>
                <td>{this.props.bet.tip.homeTeam} : {this.props.bet.tip.awayTeam}</td>
                <td />
            </React.Fragment>
        );
    }

    private renderNoBet() {
        return (
            <React.Fragment>
                <td />
                <td />
            </React.Fragment>
        );
    }
}

