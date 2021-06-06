import * as React from 'react';
import { Match } from "../../typings/index"
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
            <div className="col">
                <h1 id="tabelLabel" >Zápasy</h1>
                {contents}
            </div>
        );
    }

    private renderMatchTable(data: Match[]) {
        return (
                <Table className="table table-striped opacity-table">
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

