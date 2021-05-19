import * as React from 'react';
import { Match } from "../../typings/index"

interface MatchRowProps {
    match: Match
}

export class MatchRow extends React.Component<MatchRowProps> {

    constructor(props: MatchRowProps) {
        super(props);

        console.log(props.match);
    }

    public render() {
        return this.props.match.ended
            ? this.renderPlayedMatch()
            : this.renderNotPlayedMatch()
    }

    private renderPlayedMatch() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam} <span>'\ue721'</span></td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.props.match.result.homeTeam} : {this.props.match.result.awayTeam}</td>
                <td><a href={this.props.match.link}>Záznam</a></td>
            </React.Fragment>
        );
    }

    private renderNotPlayedMatch() {
        return (
            <React.Fragment>
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.props.match.startTime}</td>
                <td><a href={this.props.match.link}>Záznam</a></td>
            </React.Fragment>
        );
    }

}

