import * as React from 'react';
import { Team } from '../typings';
import './../custom.css';

interface MatchRowProps {
    team: Team;
}

export class TeamCell extends React.Component<MatchRowProps> {
    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return (
            <td className="team-cell">
                <img src={process.env.PUBLIC_URL + this.props.team.iconPath} width="25" height="25" alt={this.props.team.name} /> {this.props.team.name}
            </td>
        );
    }
}

export class TeamDisplay extends React.Component<MatchRowProps> {
    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return (
            <div className="match-card-team">
                <img src={process.env.PUBLIC_URL + this.props.team.iconPath} width="25" height="25" alt={this.props.team.name} />
                {this.props.team.name}
            </div>
        );
    }
}
