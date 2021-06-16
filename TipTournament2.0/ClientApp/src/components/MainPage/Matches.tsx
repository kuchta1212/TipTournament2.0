import * as React from 'react';
import { Match, Bet, UpdateStatus } from "../../typings/index"
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';

interface MatchesProps {
    matches: Match[],
    bets: Bet[];
    status: UpdateStatus
}

export class Matches extends React.Component<MatchesProps> {

    constructor(props: MatchesProps) {
        super(props);
    }

    public render() {
        let contents = this.renderMatchTable()

        return (
            <div className="col">
                <h1 id="tabelLabel" >Zápasy a sázky</h1>
                {contents}
                <p className="text-light font-weight-light">Naposledy updatováno:{new Date(this.props.status.date).toLocaleString('cs-CS')}</p>
            </div>
        );
    }

    private renderMatchTable() {
        return (
                <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {this.props.matches.map((match, index) => (
                        <tr key={match.id}>
                            <MainRow match={match} bet={this.getBet(match)} />
                        </tr>)
                    )}
                </tbody>
                </Table>
        );
    }

    private getBet(match: Match): Bet | undefined {
       return this.props.bets.find(b => b.match.id == match.id);
    }
}

