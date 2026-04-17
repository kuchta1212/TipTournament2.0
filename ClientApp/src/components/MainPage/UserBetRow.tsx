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
        const badgeClass = this.getBadgeClass(bet.result);
        const points = bet.isJoker && bet.result !== BetResult.nothing ? bet.result * 2 : bet.result;

        return (
            <div className="main-match-bet">
                <span className="bet-tip">
                    {bet.isJoker && <span className="joker-badge">{'\u2605'}</span>}{' '}
                    {bet.tip.homeTeam} : {bet.tip.awayTeam}
                </span>
                <span className={`bet-result-badge ${badgeClass}`}>
                    {points}
                    {bet.dixitBonus > 0 && <span className="dixit-bonus">+{bet.dixitBonus}</span>}
                </span>
            </div>
        );
    }

    private renderNotPlayedMatchBet() {
        return !!this.props.bet?.tip
            ? this.renderBetSetted()
            : this.renderNoBet();
    }

    private renderBetSetted() {
        return (
            <div className="main-match-bet">
                <span className="bet-tip">
                    {this.props.bet.isJoker && <span className="joker-badge">{'\u2605'}</span>}{' '}
                    {this.props.bet.tip.homeTeam} : {this.props.bet.tip.awayTeam}
                </span>
            </div>
        );
    }

    private renderNoBet() {
        return <div className="main-match-bet"></div>;
    }

    private getBadgeClass(result: BetResult): string {
        switch (result) {
            case BetResult.nothing:
                return "bet-result-nothing";
            case BetResult.winner:
                return "bet-result-winner";
            case BetResult.difference:
                return "bet-result-difference";
            case BetResult.score:
                return "bet-result-score";
            default:
                return "bet-result-winner";
        }
    }
}
