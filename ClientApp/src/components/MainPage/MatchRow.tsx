import * as React from 'react';
import { Match } from "../../typings/index";

interface MatchRowProps {
    match: Match;
}

export class MatchRow extends React.Component<MatchRowProps> {
    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return this.props.match.ended
            ? this.renderPlayedMatch()
            : this.renderNotPlayedMatch();
    }

    private renderPlayedMatch() {
        return (
            <div className="match-card-teams">
                <div className="match-card-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.home.iconPath} width="25" height="25" alt={this.props.match.home.name} />
                    {this.props.match.home.name}
                </div>
                <div className="match-card-score">
                    <span className="score-display">{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</span>
                </div>
                <div className="match-card-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.away.iconPath} width="25" height="25" alt={this.props.match.away.name} />
                    {this.props.match.away.name}
                </div>
            </div>
        );
    }

    private renderNotPlayedMatch() {
        const date = new Date(this.props.match.startTime);
        const dateStr = `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return (
            <div className="match-card-teams">
                <div className="match-card-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.home.iconPath} width="25" height="25" alt={this.props.match.home.name} />
                    {this.props.match.home.name}
                </div>
                <div className="match-card-score">
                    <span className="score-display" style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{dateStr}</span>
                </div>
                <div className="match-card-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.away.iconPath} width="25" height="25" alt={this.props.match.away.name} />
                    {this.props.match.away.name}
                </div>
            </div>
        );
    }
}
