import * as React from 'react';
import { Match, Bet, BetResult } from '../../typings/index';
import { getApi } from '../api/ApiFactory';

interface MatchBetsModalProps {
    match: Match;
    currentUserId: string;
    onClose: () => void;
}

interface MatchBetsModalState {
    bets: Bet[];
    loading: boolean;
    error: string | null;
}

export class MatchBetsModal extends React.Component<MatchBetsModalProps, MatchBetsModalState> {
    constructor(props: MatchBetsModalProps) {
        super(props);
        this.state = { bets: [], loading: true, error: null };
    }

    public componentDidMount() {
        this.loadBets();
    }

    private async loadBets() {
        try {
            const bets = await getApi().getBetsForMatch(this.props.match.id);
            bets.sort((a, b) => this.getPoints(b) - this.getPoints(a));
            this.setState({ bets, loading: false });
        } catch {
            this.setState({ error: 'Nepodařilo se načíst sázky.', loading: false });
        }
    }

    private getPoints(bet: Bet): number {
        const base = bet.isJoker && bet.result !== BetResult.nothing ? bet.result * 2 : bet.result;
        return base + (bet.dixitBonus ?? 0);
    }

    private getPointsClass(result: BetResult): string {
        switch (result) {
            case BetResult.score: return 'modal-bet-points-score';
            case BetResult.difference: return 'modal-bet-points-difference';
            case BetResult.winner: return 'modal-bet-points-winner';
            case BetResult.nothing: return 'modal-bet-points-nothing';
            default: return '';
        }
    }

    public render() {
        const { match, onClose } = this.props;

        return (
            <div className="modal-bet-overlay" onClick={onClose}>
                <div className="modal-bet-card" onClick={e => e.stopPropagation()}>
                    <button className="modal-bet-close" onClick={onClose}>&times;</button>

                    <div className="modal-bet-header">
                        <div className="modal-bet-team">
                            <img src={process.env.PUBLIC_URL + match.home.iconPath} width="28" height="28" alt={match.home.name} />
                            <span>{match.home.name}</span>
                        </div>
                        <div className="modal-bet-score">
                            {match.result.homeTeam} : {match.result.awayTeam}
                        </div>
                        <div className="modal-bet-team">
                            <img src={process.env.PUBLIC_URL + match.away.iconPath} width="28" height="28" alt={match.away.name} />
                            <span>{match.away.name}</span>
                        </div>
                    </div>

                    <div className="modal-bet-list">
                        {this.state.loading && <div className="modal-bet-loading">Načítání...</div>}
                        {this.state.error && <div className="modal-bet-loading">{this.state.error}</div>}
                        {!this.state.loading && !this.state.error && this.state.bets.length === 0 && (
                            <div className="modal-bet-loading">Žádné sázky.</div>
                        )}
                        {this.state.bets.map(bet => {
                            const isCurrentUser = bet.user?.id === this.props.currentUserId;
                            const points = this.getPoints(bet);
                            return (
                                <div key={bet.id} className={`modal-bet-row ${isCurrentUser ? 'modal-bet-row-current' : ''}`}>
                                    <span className="modal-bet-player">{bet.user?.userName ?? '?'}</span>
                                    <span className="modal-bet-tip">{bet.tip.homeTeam}:{bet.tip.awayTeam}</span>
                                    <span className={`modal-bet-points ${this.getPointsClass(bet.result)}`}>
                                        {points}b
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
