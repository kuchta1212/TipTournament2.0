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
            <div className="main-match-teams">
                <div className="main-match-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.home.iconPath} width="20" height="20" alt={this.props.match.home.name} />
                    {this.props.match.home.name}
                </div>
                <div className="main-match-result">{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</div>
                <div className="main-match-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.away.iconPath} width="20" height="20" alt={this.props.match.away.name} />
                    {this.props.match.away.name}
                </div>
            </div>
        );
    }

    private renderNotPlayedMatch() {
        return (
            <div className="main-match-teams">
                <div className="main-match-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.home.iconPath} width="20" height="20" alt={this.props.match.home.name} />
                    {this.props.match.home.name}
                </div>
                <div className="main-match-date">{new Date(this.props.match.startTime).toLocaleDateString('cs-CS')}</div>
                <div className="main-match-team">
                    <img src={process.env.PUBLIC_URL + this.props.match.away.iconPath} width="20" height="20" alt={this.props.match.away.name} />
                    {this.props.match.away.name}
                </div>
            </div>
        );
    }
}
