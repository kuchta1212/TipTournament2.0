import * as React from 'react';
import { getIconName } from "./IconProvider"

interface MatchRowProps {
    teamName: string
}

export class TeamCell extends React.Component<MatchRowProps> {

    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return <td>{this.props.teamName} <img src={process.env.PUBLIC_URL + getIconName(this.props.teamName)} width="25" height="25" /></td>
    }
}

