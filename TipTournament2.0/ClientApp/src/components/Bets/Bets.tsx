﻿import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from './../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';

interface BetsState {
    matches: Match[],
    bets: Bet[],
    loading: boolean,
    afterLimit: boolean
}

interface BetsProps {
    user: User | undefined,
}

export class Bets extends React.Component<BetsProps, BetsState> {

    constructor(props: BetsProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            bets: {} as Bet[],
            loading: true,
            afterLimit: new Date() > new Date("2021-06-11 21:00")
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderBetsTable(this.state.matches, this.state.bets);

        return (
            <div>
                <h1 id="tabelLabel" >Sázky</h1>
                {this.state.afterLimit ? <WarningNotification text="Prošvihl si to! Sázkám, už je konec." type={WarningTypes.error} /> : <WarningNotification text="Sázky se uzavřou s prvním zápasem. Takže 11.6 v 21:00." type={WarningTypes.warning} />}
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches();
        const bets = await getApi().getBets(this.props.user)
        this.setState({ matches: matches, bets: bets, loading: false, afterLimit: this.state.afterLimit });
    }

    private renderBetsTable(matches: Match[], bets: Bet[]) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={match.id}>
                            <MatchBetRow match={match} bet={bets.find(b => !!b.match && b.match.id == match.id)} isReadOnly={!!this.props.user || this.state.afterLimit} />
                        </tr>)
                    )}
                </tbody>
            </Table>
         );
    }
}

