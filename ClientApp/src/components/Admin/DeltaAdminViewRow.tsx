import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { Match, DeltaBetTeams } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { TeamCell } from '../TeamCell';
import { ConfirmModal } from './ConfirmModal';

interface DeltaBetAdminViewRowState {
    homeTeamId: string;
    awayTeamId: string;
    loading: boolean;
    isEditable: boolean;
    teams: DeltaBetTeams;
    showConfirm: boolean;
}

interface DeltaBetAdminViewRowProps {
     match: Match
}

export class DeltaBetAdminViewRow extends React.Component<DeltaBetAdminViewRowProps, DeltaBetAdminViewRowState> {

    constructor(props: DeltaBetAdminViewRowProps) {
        super(props);
        this.state = {
            homeTeamId: this.props.match.home?.id,
            awayTeamId: this.props.match.away?.id,
            loading: true,
            isEditable: !this.props.match.home,
            teams: {} as DeltaBetTeams,
            showConfirm: false
        }
    }

    public componentDidMount() {
        if (this.state.isEditable) {
            this.getData();
        } else {
            this.setState({ loading: false });
        }
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.isEditable && !this.state.teams.possibleAwayTeams
                ? <div>Nejsou data</div>
                : this.renderDeltaBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const teams = await getAdminApi().getTeamForMatch(this.props.match.id, this.props.match.stage);
        this.setState({ loading: false, teams: teams });
    }

    private renderDeltaBet() {
        const homeTeam = this.props.match.home
            || this.state.teams.possibleHomeTeams?.find(t => t.id === this.state.homeTeamId);
        const awayTeam = this.props.match.away
            || this.state.teams.possibleAwayTeams?.find(t => t.id === this.state.awayTeamId);

        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td>
                                {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tym</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.homeTeamId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
                                            {this.state.teams.possibleHomeTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : homeTeam ? <TeamCell team={homeTeam} /> : <td>-</td>}
                            </td>
                            <td>
                                {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Tym</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.awayTeamId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
                                            {this.state.teams.possibleAwayTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : awayTeam ? <TeamCell team={awayTeam} /> : <td>-</td>}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            <td>
                                {this.state.isEditable &&
                                    <button className="btn btn-primary" onClick={() => this.setState({ showConfirm: true })}>Potvrdit</button>
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Potvrdit tymy"
                        message="Ulozit vyber tymu pro tento zapas playoff?"
                        variant="warning"
                        confirmText="Potvrdit"
                        onConfirm={() => this.confirm()}
                        onCancel={() => this.setState({ showConfirm: false })}
                    />
                }
            </div>
        );
    }

    private onSelect(event: any) {
        switch (event.id) {
            case "inputFirstTeamSelect":
                this.setState({ homeTeamId: event.value });
                break;

            case "inputSecondTeamSelect":
                this.setState({ awayTeamId: event.value });
                break;
        }
    }

    private async confirm(): Promise<void> {
        this.setState({ showConfirm: false });
        await getAdminApi().updateMatch(this.props.match.id, this.state.homeTeamId, this.state.awayTeamId);
        this.setState({ isEditable: false })
    }
}
