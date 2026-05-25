import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Group, Match, TournamentStage } from "../../typings/index"
import { Loader } from './../Loader'
import './../../custom.css'
import { MatchRowAdminView } from './MatchRowAdminView';
import { Table } from 'reactstrap';
import { GroupTableAdmin } from './GroupTableAdmin';
import { DeltaBetAdminViewRow } from './DeltaAdminViewRow';
import { WinnerAdminViewRow } from './WinnerAdminView';
import { ShooterBetAdminView } from './ShooterBetAdminView';
import { TeamPlaceBetAdminView } from './TeamPlaceBetAdminView';

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
                                    this.state.matches.filter(m => m.stage == TournamentStage.Group).map(m => {
                                    return <MatchRowAdminView match={m} />
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
                            <div className="groupList">
                                {this.state.groups.map((group, index) => {
                                    return <GroupTableAdmin key={group.id} group={group} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-r32-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-r32-card" aria-expanded="false" aria-controls="collapse-r32-card">
                                    1. kolo playoff
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-r32-card" className="collapse" aria-labelledby="r32-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <div className="groupList">
                                {
                                    this.state.matches.filter(m => m.stage == TournamentStage.RoundOf32).map(m => {
                                        return <DeltaBetAdminViewRow key={m.id} match={m} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-first-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-first-card" aria-expanded="false" aria-controls="collapse-first-card">
                                    Osmifinále
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-first-card" className="collapse" aria-labelledby="first-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <div className="groupList">
                                {
                                    this.state.matches.filter(m => m.stage == TournamentStage.RoundOf16).map(m => {
                                        return <DeltaBetAdminViewRow key={m.id} match={m} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-querter-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-querter-card" aria-expanded="false" aria-controls="collapse-querter-card">
                                    Čtvrtfinále
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-querter-card" className="collapse" aria-labelledby="querter-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <div className="groupList">
                                {
                                    this.state.matches.filter(m => m.stage == TournamentStage.Quarterfinal).map(m => {
                                        return <DeltaBetAdminViewRow key={m.id} match={m} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-semi-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-semi-card" aria-expanded="false" aria-controls="collapse-semi-card">
                                    Semifinále
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-semi-card" className="collapse" aria-labelledby="semi-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <div className="groupList">
                                {
                                    // match_103 = 3rd-place playoff; sits at Semifinal stage in legacy DBs
                                    // but isn't part of the betting bracket. Hide it here.
                                    this.state.matches.filter(m => m.stage == TournamentStage.Semifinal && m.id !== 'match_103').map(m => {
                                        return <DeltaBetAdminViewRow key={m.id} match={m} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-final-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-final-card" aria-expanded="false" aria-controls="collapse-final-card">
                                    Finále
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-final-card" className="collapse" aria-labelledby="final-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <div className="groupList">
                                {
                                    this.state.matches.filter(m => m.stage == TournamentStage.Final).map(m => {
                                        return <DeltaBetAdminViewRow key={m.id} match={m} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-winner-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-winner-card" aria-expanded="false" aria-controls="collapse-winner-card">
                                    Vítěz
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-winner-card" className="collapse" aria-labelledby="winner-card" data-parent="#accordionExample">
                        <div className="card-body">
                          <WinnerAdminViewRow />
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-lambda-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-lambda-card" aria-expanded="false" aria-controls="collapse-lambda-card">
                                    Lambda
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-lambda-card" className="collapse" aria-labelledby="lambda-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <ShooterBetAdminView />
                        </div>
                    </div>
                </div>
                <div className="card opacity-card">
                    <div className="card-header" id="heading-omikron-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-omikron-card" aria-expanded="false" aria-controls="collapse-omikron-card">
                                    Omikron
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="collapse-omikron-card" className="collapse" aria-labelledby="lambda-card" data-parent="#accordionExample">
                        <div className="card-body">
                            <TeamPlaceBetAdminView />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

