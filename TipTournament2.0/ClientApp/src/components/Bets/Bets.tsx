import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match } from "../../typings/index"
import authService from '../api-authorization/AuthorizeService'
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';

interface BetsState {
    matches: Match[],
    loading: boolean
}

interface BetsProps {

}

export class Bets extends React.Component<BetsProps, BetsState> {

    constructor(props: BetsProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            loading: true
        }
    }

    public componentDidMount() {
        this.getMatches();
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderBetsTable(this.state.matches);

        return (
            <div>
                <h1 id="tabelLabel" >Hlavní část</h1>
                {contents}
            </div>
        );
    }

    private async getMatches() {
        //const token = await authService.getAccessToken();
        const matches = await getApi().getMatches();
        this.setState({ matches: matches, loading: false });
    }

    private renderBetsTable(data: Match[]) {
        return (
            <Table>
                <thead>
                </thead>
                <tbody>
                    {data.map((match, index) => (
                        <tr key={match.id}>
                            <MatchBetRow match={match} />
                        </tr>)
                    )}
                </tbody>
            </Table>
         );
    }
}

