import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Group, Match, TournamentStage, UpdateStatus } from "../../typings/index"
import { Loader } from './../Loader'
import './../../custom.css'
import authService from './../api-authorization/AuthorizeService'
import { TeamPlaceBet } from '../Bets/TeamPlaceBet';
import { BestShooterBet } from '../Bets/BestShooterBet';
import { MatchBetRow } from '../Bets/MatchBetRow';
import { MatchRowAdminView } from './MatchRowAdminView';
import { Table } from 'reactstrap';
import { GroupTable } from '../Bets/GroupTable';
import { GroupTableAdmin } from './GroupTableAdmin';

interface AdminMatchViewState {
    matches: Match[],
    groups: Group[],
    loading: boolean
}

interface AdminMatchViewProps {

}

export class AdminMatchView extends React.Component<AdminMatchViewProps, AdminMatchViewState> {

    constructor(props: AdminMatchViewProps) {
        super(props);
        this.state = {
            loading: true,
            matches: {} as Match[],
            groups: {} as Group[]
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderData();

        return (
            <div>
                <h1 id="tabelLabel">Výsledky</h1>
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getAllMatches();
        const groups = await getApi().getGroups();
        this.setState({ matches: matches, groups: groups, loading: false });
    }


    private renderData() {
        return (
            <div className="accordion" id="accordionExample">
                <div className="card opacity-card">
                    <div className="card-header" id="heading-matches-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-matches-card" aria-expanded="false" aria-controls="collapse-matches-card">
                                    Skupinové zápasy
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-matches-card" className="collapse" aria-labelledby="matches-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <Table className="table table-striped opacity-table">
                            {
                                this.state.matches.map(m => {
                                    return !!m.home ? <MatchRowAdminView match={m} /> : <div/>
                                })
                            }
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-groups-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-groups-card" aria-expanded="false" aria-controls="collapse-groups-card">
                                    Skupiny
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-groups-card" className="collapse" aria-labelledby="groups-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <Table className="table table-striped opacity-table">
                                {this.state.groups.map((group, index) => {
                                    return <GroupTableAdmin key={group.id} group={group} />
                                })}
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

