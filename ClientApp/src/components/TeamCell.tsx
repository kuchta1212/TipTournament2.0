import * as React from 'react';
import { Team } from '../typings';

interface MatchRowProps {
    team: Team
}

export class TeamCell extends React.Component<MatchRowProps> {

    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return <td>{this.props.team.name} <img src={process.env.PUBLIC_URL + this.props.team.iconPath} width="25" height="25" /></td>
    }
}

