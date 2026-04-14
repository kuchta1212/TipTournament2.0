import * as React from 'react';
import { Bet, BetResult } from "../../typings/index";
import './../../custom.css';

interface UserBetRowProps {
    bet: Bet;
}

export class UserBetRow extends React.Component<UserBetRowProps> {
    constructor(props: UserBetRowProps) {
        super(props);
    }

    public render() {
        return this.props.bet.match.ended
            ? this.renderPlayedMatchBet()
            : this.renderNotPlayedMatchBet();
    }

    private renderPlayedMatchBet() {
        const { bet } = this.props;
        const classNames = this.getClassNames(bet.result);

        return (
            <>
                <td className={classNames.textClass}>
                    {bet.isJoker && <span className="joker-badge">{'\u2605'}</span>}{' '}
                    {bet.tip.homeTeam} : {bet.tip.awayTeam}
                </td>
                <td className={classNames.bgClass}>
                    {bet.isJoker && bet.result !== BetResult.nothing ? bet.result * 2 : bet.result}
                    {bet.dixitBonus > 0 && <span className="dixit-bonus">+{bet.dixitBonus}</span>}
                </td>
            </>
        );
    }

    private renderNotPlayedMatchBet() {
        return !!this.props.bet?.tip
            ? this.renderBetSetted()
            : this.renderNoBet();
    }

    private renderBetSetted() {
        return (
            <>
                <td>
                    {this.props.bet.isJoker && <span className="joker-badge">{'\u2605'}</span>}{' '}
                    {this.props.bet.tip.homeTeam} : {this.props.bet.tip.awayTeam}
                </td>
                <td />
            </>
        );
    }

    private renderNoBet() {
        return (
            <>
                <td />
                <td />
            </>
        );
    }

    private getClassNames(result: BetResult) {
        switch (result) {
            case BetResult.nothing:
                return { textClass: "text-danger", bgClass: "bg-danger" };
            case BetResult.winner:
                return { textClass: "text-info", bgClass: "bg-info" };
            case BetResult.difference:
                return { textClass: "text-warning", bgClass: "bg-warning" };
            case BetResult.score:
                return { textClass: "text-success", bgClass: "bg-success" };
            default:
                return { textClass: "text-info", bgClass: "bg-info" };
        }
    }
}
