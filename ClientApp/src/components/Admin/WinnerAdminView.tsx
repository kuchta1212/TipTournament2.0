import * as React from 'react';
import { getAdminApi, getApi } from "../api/ApiFactory"
import { Match, BetsStageStatus, Team, DeltaBetTeams, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';


interface WinnerAdminViewRowState {
    winner: string;
    teams: Team[],
    loading: boolean,
    evaluated: boolean,
}

interface WinnerAdminViewRowProps {
}

export class WinnerAdminViewRow extends React.Component<WinnerAdminViewRowProps, WinnerAdminViewRowState> {

    constructor(props: WinnerAdminViewRowProps) {
        super(props);
        this.state = {
            loading: true,
            winner: "",
            teams: {} as Team[],
            evaluated: false,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderDeltaBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const deltaTeams = await getAdminApi().getTeamForMatch("match_64", TournamentStage.Winner);
        const teams = [];
        teams.push(deltaTeams.possibleHomeTeams[0]);
        teams.push(deltaTeams.possibleAwayTeams[0]);
        this.setState({ loading: false, teams: teams });
    }

    private renderDeltaBet() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td>
                                {this.state.winner == ""
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.winner ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.teams.filter(t => t.id == this.state.winner)[0]} />}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            {
                                !this.state.evaluated
                                    ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                    : <p>Done</p>
                            }
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    private onSelect(event: any) {
        this.setState({ winner: event.value });
    }

    private async confirm(): Promise<void> {
        await getAdminApi().setWinner("match_64", this.state.winner);
        this.setState({ evaluated: true });
    }
}

