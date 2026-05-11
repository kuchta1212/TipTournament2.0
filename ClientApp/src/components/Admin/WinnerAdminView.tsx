import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { Team, DeltaBetTeams, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { TeamCell } from '../TeamCell';
import { ConfirmModal } from './ConfirmModal';

interface WinnerAdminViewRowState {
    winner: string;
    teams: Team[];
    loading: boolean;
    evaluated: boolean;
    showConfirm: boolean;
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
            showConfirm: false
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
        const deltaTeams = await getAdminApi().getTeamForMatch("match_104", TournamentStage.Winner);
        const teams = [];
        if (deltaTeams.possibleHomeTeams?.length > 0) {
            teams.push(deltaTeams.possibleHomeTeams[0]);
            teams.push(deltaTeams.possibleAwayTeams[0]);
        }
        this.setState({ loading: false, teams: teams });
    }

    private renderDeltaBet() {
        const selectedTeam = this.state.winner ? this.state.teams.filter(t => t.id == this.state.winner)[0] : null;

        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td>
                                {this.state.winner == ""
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tym</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.winner ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={selectedTeam!} />}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {!this.state.evaluated
                                    ? <button className="btn btn-primary" onClick={() => this.setState({ showConfirm: true })}>Potvrdit</button>
                                    : <span className="admin-action-status">Vyhodnoceno</span>
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Nastavit viteze"
                        message={`Opravdu chcete nastavit ${selectedTeam?.name || 'vybrany tym'} jako viteze turnaje? Tato akce ovlivni bodovani.`}
                        variant="danger"
                        confirmText="Potvrdit viteze"
                        onConfirm={() => this.confirm()}
                        onCancel={() => this.setState({ showConfirm: false })}
                    />
                }
            </div>
        );
    }

    private onSelect(event: any) {
        this.setState({ winner: event.value });
    }

    private async confirm(): Promise<void> {
        this.setState({ showConfirm: false });
        await getAdminApi().setWinner("match_104", this.state.winner);
        this.setState({ evaluated: true });
    }
}
