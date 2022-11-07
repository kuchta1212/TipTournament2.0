import * as React from 'react';
import { Match, Bet, UpdateStatus, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';

interface AlfaMatchesState {
    matches: Match[],
    bets: Bet[];
    loading: boolean
}

interface AlfaMatchesProps {

}

export class AlfaMatches extends React.Component<AlfaMatchesProps, AlfaMatchesState> {

    constructor(props: AlfaMatchesProps) {
        super(props);

        this.state = {
            matches: {} as Match[],
            bets: {} as Bet[],
            loading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderMatchTable()

        return (
            <div className="col">
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(TournamentStage.Group);
        const bets = await getApi().getBets(undefined);
        this.setState({ matches: matches, bets: bets, loading: false });
    }

    private renderMatchTable() {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {this.state.matches.map((match, index) => (
                        <tr key={match.id}>
                            <MainRow match={match} bet={this.getBet(match)} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }

    private getBet(match: Match): Bet | undefined {
        return this.state.bets.find(b => b.match.id == match.id);
    }
}