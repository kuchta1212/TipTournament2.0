import * as React from 'react';
import { Match, Bet, BetResult } from "../../typings/index";

interface MainRowProps {
    match: Match;
    bet: Bet | undefined;
}

export class MainRow extends React.Component<MainRowProps> {
    public render() {
        const { match, bet } = this.props;
        const isPlayed = match.ended;
        const hasBet = !!bet;
        const cardClass = isPlayed && hasBet
            ? `main-match-card ${this.getCardBorderClass(bet!)}`
            : 'main-match-card';

        return (
            <div className={cardClass}>
                {/* Points badge - prominent, right side */}
                {isPlayed && hasBet && this.renderPointsBadge(bet!)}

                {/* Teams + score area */}
                <div className="match-card-teams" style={{ flex: 1 }}>
                    <div className="match-card-team">
                        <img src={process.env.PUBLIC_URL + match.home.iconPath} width="25" height="25" alt={match.home.name} />
                        {match.home.name}
                    </div>
                    <div className="main-match-center">
                        {isPlayed
                            ? this.renderPlayedScore(match, bet)
                            : this.renderUnplayedCenter(match, bet)
                        }
                    </div>
                    <div className="match-card-team">
                        <img src={process.env.PUBLIC_URL + match.away.iconPath} width="25" height="25" alt={match.away.name} />
                        {match.away.name}
                    </div>
                </div>
            </div>
        );
    }

    private renderPlayedScore(match: Match, bet: Bet | undefined) {
        return (
            <div className="main-match-scores">
                <span className="score-display">{match.result.homeTeam} : {match.result.awayTeam}</span>
                {bet && (
                    <span className="main-match-tip">
                        {bet.isJoker && <span className="joker-badge-sm">{'\u2605'}</span>}
                        tip {bet.tip.homeTeam}:{bet.tip.awayTeam}
                    </span>
                )}
            </div>
        );
    }

    private renderUnplayedCenter(match: Match, bet: Bet | undefined) {
        const date = new Date(match.startTime);
        const dateStr = `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return (
            <div className="main-match-scores">
                <span className="main-match-date-center">{dateStr}</span>
                {bet?.tip && (
                    <span className="main-match-tip">
                        {bet.isJoker && <span className="joker-badge-sm">{'\u2605'}</span>}
                        tip {bet.tip.homeTeam}:{bet.tip.awayTeam}
                    </span>
                )}
            </div>
        );
    }

    private renderPointsBadge(bet: Bet) {
        const points = bet.isJoker && bet.result !== BetResult.nothing ? bet.result * 2 : bet.result;
        const totalPoints = points + (bet.dixitBonus ?? 0);
        return (
            <div className={`main-match-points ${this.getPointsClass(bet.result)}`}>
                <span className="main-match-points-value">{totalPoints}</span>
                <span className="main-match-points-label">b</span>
            </div>
        );
    }

    private getCardBorderClass(bet: Bet): string {
        switch (bet.result) {
            case BetResult.score: return 'main-match-card-score';
            case BetResult.difference: return 'main-match-card-difference';
            case BetResult.winner: return 'main-match-card-winner';
            case BetResult.nothing: return 'main-match-card-nothing';
            default: return '';
        }
    }

    private getPointsClass(result: BetResult): string {
        switch (result) {
            case BetResult.score: return 'main-match-points-score';
            case BetResult.difference: return 'main-match-points-difference';
            case BetResult.winner: return 'main-match-points-winner';
            case BetResult.nothing: return 'main-match-points-nothing';
            default: return '';
        }
    }
}
