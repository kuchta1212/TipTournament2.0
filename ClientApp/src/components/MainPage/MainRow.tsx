import * as React from 'react';
import { Match, Bet, BetResult } from "../../typings/index";

interface MainRowProps {
    match: Match;
    bet: Bet | undefined;
    onClick?: () => void;
}

export class MainRow extends React.Component<MainRowProps> {
    public render() {
        const { match, bet, onClick } = this.props;
        const isPlayed = match.ended;
        const hasBet = !!bet;
        const classes = ['main-match-card'];
        if (isPlayed && hasBet) classes.push(this.getCardBorderClass(bet!));
        if (hasBet && bet!.isJoker) classes.push('main-match-card-joker');
        if (onClick) classes.push('main-match-card-clickable');

        return (
            <div className={classes.join(' ')} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
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
                        tip {bet.tip.homeTeam}:{bet.tip.awayTeam}
                    </span>
                )}
            </div>
        );
    }

    private renderPointsBadge(bet: Bet) {
        const points = bet.isJoker && bet.result !== BetResult.nothing ? bet.result * 2 : bet.result;
        const dixitBonus = bet.dixitBonus ?? 0;
        const totalPoints = points + dixitBonus;
        return (
            <div className="main-match-points-area">
                <div className={`main-match-points ${this.getPointsClass(bet.result)}`}>
                    <span className="main-match-points-value">{totalPoints}</span>
                    <span className="main-match-points-label">b</span>
                </div>
                {bet.isJoker && <span className="main-match-joker-tag">{'\u2605'} 2x</span>}
                {dixitBonus > 0 && <span className="main-match-dixit-tag">dixit +{dixitBonus}</span>}
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
