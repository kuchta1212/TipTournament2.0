import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { IApi} from "../api/IApi"
import { Match } from "../../typings/index"
import authService from '../api-authorization/AuthorizeService'
import { MatchRow } from "./MatchRow"
import { Table } from 'reactstrap';

interface MatchesProps {
    matches: Match[]
}

export class Matches extends React.Component<MatchesProps> {

    constructor(props: MatchesProps) {
        super(props);
    }

    public render() {
        let contents = this.renderMatchTable(this.props.matches)

        return (
            <div>
                <h1 id="tabelLabel" >Zápasy</h1>
                {contents}
            </div>
        );
    }

    private renderMatchTable(data: Match[]) {
        return (
            <Table>
                <thead>
                </thead>
                <tbody>
                    {data.map((match, index) => (
                        <tr key={match.id}>
                            <MatchRow match={match} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }
}

