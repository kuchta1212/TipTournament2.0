﻿import * as React from 'react';
import { Match, Bet, TournamentStage } from "../../typings/index";
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import './../../custom.css';

interface AlfaMatchesState {
    matches: Match[];
    bets: Bet[];
    loading: boolean;
}

interface AlfaMatchesProps { }

export class AlfaMatches extends React.Component<AlfaMatchesProps, AlfaMatchesState> {

    constructor(props: AlfaMatchesProps) {
        super(props);

        this.state = {
            matches: [],
            bets: [],
            loading: true
        };
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderMatchTable();

        return (
            <div className="alfa-matches">
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(TournamentStage.Group);
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bets = !!userId ? await getApi().getBets(userId) : await getApi().getBets();
        this.setState({ matches: matches, bets: bets, loading: false });
    }

    private renderMatchTable() {
        return (
            <Table className="table table-striped table-bordered">
                <thead>
                </thead>
                <tbody>
                    {this.state.matches.map((match) => (
                        <tr key={match.id}>
                            <MainRow match={match} bet={this.getBet(match)} />
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }

    private getBet(match: Match): Bet | undefined {
        return this.state.bets.find(b => b.match.id === match.id);
    }
}
