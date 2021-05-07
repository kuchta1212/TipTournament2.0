import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { IApi} from "../api/IApi"
import { Match } from "../../typings/index"
import authService from '../api-authorization/AuthorizeService'


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
                <td>{this.props.match.homeTeam}</td>
                <td>{this.props.match.awayTeam}</td>
                <td>{this.props.match.result.home} : {this.props.match.result.away}</td>
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

