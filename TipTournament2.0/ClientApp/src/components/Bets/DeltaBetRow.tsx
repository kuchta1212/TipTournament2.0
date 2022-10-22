import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Team, DeltaBet, DeltaBetTeams } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';

interface BetSelection {
    homeId: string;
    awayId: string;
}

interface DeltaBetState {
    bet: DeltaBet;
    loading: boolean;
    isEditable: boolean;
    teams: DeltaBetTeams,
    selection: BetSelection
}

interface DeltaBetProps {
    match: Match;
}

export class DeltaBetRow extends React.Component<DeltaBetProps, DeltaBetState> {

    constructor(props: DeltaBetProps) {
        super(props);
        this.state = {
            bet: {} as DeltaBet,
            loading: true,
            isEditable: false,
            teams: {} as DeltaBetTeams,
            selection: {} as BetSelection
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
        const bet = await getApi().getDeltaBet(this.props.match.id);
        const teams = await getApi().getTeamsForDeltaBet(this.props.match.id, this.props.match.stage)
        if (!bet.id) {
            this.setState({ isEditable: true, loading: false, teams: teams });
        } else {
            this.setState({ bet: bet, loading: false, isEditable: false, teams: teams });

        }
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
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.homeId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleHomeTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.bet.homeTeamBet} />}
                            </td>
                            <td>
                                {this.state.isEditable
                                ?   <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.selection.awayId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleAwayTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.bet.awayTeamBet} />}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            {this.state.isEditable ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button> : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>}
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    private onSelect(event: any) {
        let selection = this.state.selection;
        let correct = false;
        switch (event.id) {
            case "inputFirstTeamSelect":
                if (event.value !== selection.awayId) {
                    selection.homeId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;

            case "inputSecondTeamSelect":
                if (event.value !== selection.homeId) {
                    selection.awayId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;
        }

        if (correct) {
            this.setState({ selection: selection });
        } else {
            event.value = "default";
        }

    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm() : Promise<void> {
        if (this.validateSelection(this.state.selection)) {
            const bet = this.toBet(this.state.selection);

            await getApi().uploadDeltaBet(bet, this.props.match.id);

            this.setState({ isEditable: false, bet: bet })
        }
    }

    private validateSelection(selection: BetSelection): boolean {
        if (!!selection.homeId && !!selection.awayId) {
            return true;
        }

        alert("Něco není vyplněné");
        return false;
    }

    private toBet(selection: BetSelection): DeltaBet {
        let db = this.state.bet;
        db.homeTeamBet = this.state.teams.possibleHomeTeams.filter(t => t.id == selection.homeId)[0];
        db.awayTeamBet = this.state.teams.possibleAwayTeams.filter(t => t.id == selection.awayId)[0];
        return db;
    }
}

