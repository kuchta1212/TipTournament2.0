import * as React from 'react';
import { Match } from "../../typings/index";
import { TeamCell } from "./../TeamCell"

interface MatchRowProps {
    match: Match
}

export class MatchRow extends React.Component<MatchRowProps> {

    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {
        return this.props.match.ended
            ? this.renderPlayedMatch()
            : this.renderNotPlayedMatch()
    }

    private renderPlayedMatch() {
        return (
            <React.Fragment>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                <td>{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</td>
                {/*<td><a href={this.props.match.link}>Záznam</a></td>*/}
            </React.Fragment>
        );
    }

    private renderNotPlayedMatch() {
        return (
            <React.Fragment>
                <TeamCell team={this.props.match.home} />
                <TeamCell team={this.props.match.away} />
                <td>{new Date(this.props.match.startTime).toLocaleDateString('cs-CS')}</td>
                {/*<td><a href={this.props.match.link}>Záznam</a></td>*/}
            </React.Fragment>
        );
    }

}

