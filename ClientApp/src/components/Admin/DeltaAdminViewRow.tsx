import * as React from 'react';
import { getAdminApi, getApi } from "../api/ApiFactory"
import { Match, BetsStageStatus, DeltaBet, DeltaBetTeams } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';


interface DeltaBetAdminViewRowState {
    homeTeamId: string;
    awayTeamId: string;
    loading: boolean;
    isEditable: boolean;
    teams: DeltaBetTeams,
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
            teams: {} as DeltaBetTeams
        }
    }

    public componentDidMount() {
        this.getData();
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
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td>
                                {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.homeTeamId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleHomeTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.teams.possibleHomeTeams.filter(t => t.id == this.state.homeTeamId)[0]} />}
                            </td>
                            <td>
                                {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.awayTeamId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleAwayTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.teams.possibleHomeTeams.filter(t => t.id == this.state.homeTeamId)[0]} />}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            {
                                this.state.isEditable
                                ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                : <div />
                            }
                        </tr>
                    </tbody>
                </Table>
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
        await getAdminApi().updateMatch(this.props.match.id, this.state.homeTeamId, this.state.awayTeamId);
        this.setState({ isEditable: false })
    }
}

