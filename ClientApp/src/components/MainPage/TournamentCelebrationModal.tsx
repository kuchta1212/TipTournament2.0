import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { User } from '../../typings/index';
import './../../custom.css';

interface TournamentCelebrationModalProps {
    users: User[];
    currentUserId: string;
    onClose: () => void;
}

const STAR_COUNT = 28;

const AI_PLAYER_TOKENS = ['chatgpt', 'copilot', 'claude', 'gemin'];

interface RankedUser {
    user: User;
    place: number;
}

export class TournamentCelebrationModal extends React.Component<TournamentCelebrationModalProps> {

    public render() {
        const humans = this.props.users.filter(u => !this.isAiPlayer(u.userName));
        const ranked = this.rankUsers(humans);
        const podium = ranked.slice(0, 3);
        const rest = ranked.slice(3);

        return ReactDOM.createPortal(
            <div className="celebration-overlay" onClick={this.props.onClose}>
                <div className="celebration-stars" aria-hidden="true">
                    {Array.from({ length: STAR_COUNT }).map((_, i) => (
                        <span key={i} className="celebration-star" style={this.getStarStyle(i)}>★</span>
                    ))}
                </div>

                <div className="celebration-card" onClick={e => e.stopPropagation()}>
                    <button className="celebration-close" onClick={this.props.onClose} aria-label="Zavřít">&times;</button>

                    <div className="celebration-head">
                        <div className="celebration-trophy">🏆</div>
                        <h2 className="celebration-title">Turnaj skončil!</h2>
                        <p className="celebration-subtitle">Konečné pořadí</p>
                    </div>

                    <div className="celebration-podium">
                        {this.renderPodiumSpot(podium[1], 'left')}
                        {this.renderPodiumSpot(podium[0], 'center')}
                        {this.renderPodiumSpot(podium[2], 'right')}
                    </div>

                    {rest.length > 0 && (
                        <div className="celebration-list">
                            {rest.map(entry => (
                                <div
                                    key={entry.user.userName}
                                    className={`celebration-row ${entry.user.id === this.props.currentUserId ? 'celebration-row-current' : ''}`}
                                >
                                    <span className="celebration-rank">{entry.place}.</span>
                                    <span className="celebration-name">{entry.user.userName}</span>
                                    <span className="celebration-points">{entry.user.totalPoints} b</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>,
            document.body
        );
    }

    private renderPodiumSpot(entry: RankedUser | undefined, position: 'left' | 'center' | 'right') {
        if (!entry) {
            return <div className={`celebration-spot celebration-spot--${position} celebration-spot-empty`} />;
        }

        const place = entry.place;
        const medal = place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉';
        const isCurrent = entry.user.id === this.props.currentUserId;

        return (
            <div className={`celebration-spot celebration-spot--${position} celebration-spot--place${place} ${isCurrent ? 'celebration-spot-current' : ''}`}>
                <div className="celebration-medal">{medal}</div>
                <div className="celebration-spot-name" title={entry.user.userName}>{entry.user.userName}</div>
                <div className="celebration-spot-points">{entry.user.totalPoints} b</div>
                <div className="celebration-pedestal">{place}</div>
            </div>
        );
    }

    private rankUsers(users: User[]): RankedUser[] {
        const sorted = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

        let previousPoints: number | null = null;
        let previousPlace = 0;

        return sorted.map((user, index) => {
            const place = previousPoints !== null && user.totalPoints === previousPoints
                ? previousPlace
                : index + 1;
            previousPoints = user.totalPoints;
            previousPlace = place;
            return { user, place };
        });
    }

    private isAiPlayer(userName: string): boolean {
        const normalized = userName.trim().toLowerCase();
        return AI_PLAYER_TOKENS.some(token => normalized.includes(token));
    }

    private getStarStyle(i: number): React.CSSProperties {
        const left = (i * 53) % 100;
        const drift = (i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 8);
        const duration = 4 + (i % 6);
        const delay = -((i * 7) % 60) / 10;
        const size = 10 + (i % 5) * 6;

        const style: { [key: string]: string } = {
            left: `${left}%`,
            fontSize: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            '--drift': `${drift}px`,
        };

        return style as React.CSSProperties;
    }
}
