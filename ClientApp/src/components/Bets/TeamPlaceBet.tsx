import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, Team, TournamentStage, PlaceTeamBet, BetsStageStatus } from "../../typings/index"
import { Table } from 'reactstrap';
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import { TeamCell } from '../TeamCell';

interface BetSelection {
    teamId: string;
    stage: TournamentStage;
}

interface TeamPlaceBetState {
    loading: boolean,
    isEditable: boolean,
    bet: PlaceTeamBet;
    possible: Team[],
    selection: BetSelection
}

interface TeamPlaceBetProps {
    isWinnerBet: boolean,
    status: BetsStageStatus,
    showResult: boolean
}

export class TeamPlaceBet extends React.Component<TeamPlaceBetProps, TeamPlaceBetState> {

    constructor(props: TeamPlaceBetProps) {
        super(props);
        this.state = {
            loading: true,
            isEditable: true,
            bet: {} as PlaceTeamBet,
            possible: {} as Team[],
            selection: {} as BetSelection
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.props.status == BetsStageStatus.NotReady
                ? <div />
                : this.props.status == BetsStageStatus.Done && this.state.isEditable
                    ? <div> Ještě sis nevsadil! </div>
                    : this.renderTable()

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        if (this.props.status == BetsStageStatus.NotReady) {
            this.setState({ loading: false, isEditable: false })
            return;
        }
        const bet = this.props.isWinnerBet
            ? await getApi().getWinnerBet()
            : await getApi().getTeamPlaceBet()

        const teams = await getApi().getTeamsForTeamPlaceBet(this.props.isWinnerBet);
        if (!bet.id) {
            this.setState({ loading: false, isEditable: true, possible: teams })
        } else {
            this.setState({ loading: false, isEditable: false, bet: bet, possible: teams });
        }
    }

    private renderTable() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td className={this.getClass()}>
                            {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.teamId ?? "default"} onChange={(event) => this.onTeamSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.possible.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : <TeamCell team={this.state.bet.team} />
                                }
                            </td>
                            <td className={this.getClass()}>
                                {this.state.isEditable && !this.props.isWinnerBet
                                    ?   <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text" htmlFor="inputGroupSelect02">Fáze</label>
                                            </div>
                                            <select className="custom-select" id="inputStageSelect" defaultValue={!!this.state.selection.stage ? this.state.selection.stage.toString() : "default"} onChange={(event) => this.onStageChange(event.target)}>
                                                <option key="default-id" value="default" >Vyber fázi turnaje</option>
                                                <option key={TournamentStage.Group.toString()} value={TournamentStage.Group.toString()}>{this.stageToString(TournamentStage.Group)}</option>
                                                <option key={TournamentStage.FirstRound.toString()} value={TournamentStage.FirstRound.toString()}>{this.stageToString(TournamentStage.FirstRound)}</option>
                                                <option key={TournamentStage.Quarterfinal.toString()} value={TournamentStage.Quarterfinal.toString()}>{this.stageToString(TournamentStage.Quarterfinal)}</option>
                                                <option key={TournamentStage.Semifinal.toString()} value={TournamentStage.Semifinal.toString()}>{this.stageToString(TournamentStage.Semifinal)}</option>
                                                <option key={TournamentStage.Final.toString()} value={TournamentStage.Final.toString()}>{this.stageToString(TournamentStage.Final)}</option>
                                                <option key={TournamentStage.Winner.toString()} value={TournamentStage.Winner.toString()}>{this.stageToString(TournamentStage.Winner)}</option>
                                            </select>
                                        </div>
                                    : !this.props.isWinnerBet
                                        ? <td>{this.stageToString(this.state.bet.stageBet)}</td>
                                        : <div />
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.props.showResult
                                    ? <tr><td>Body:</td><td>{this.state.bet.isCorrect ? 3 : 0}</td></tr>
                                    : this.props.status == BetsStageStatus.Done
                                        ? <div />
                                        : this.state.isEditable
                                            ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                            : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>}
                                </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    private getClass(): string {
        if (!this.props.showResult) {
            return "";
        }

        return this.state.bet.isCorrect ? "border border-success" : "border border-danger";
    }

    private stageToString(stage: TournamentStage) {
        switch (stage) {
            case TournamentStage.Group: return "Skupina";
            case TournamentStage.FirstRound: return "Osmifinále";
            case TournamentStage.Quarterfinal: return "Čtvrtfinále";
            case TournamentStage.Semifinal: return "Semifinále";
            case TournamentStage.Final: return "Finále";
            case TournamentStage.Winner: return "Vítěz";
        }
    }


    private onTeamSelect(event: any) {
        let selection = this.state.selection;
        selection.teamId = event.value;
        this.setState({ selection: selection });
    }

    private onStageChange(event: any) {
        let selection = this.state.selection;
        selection.stage = parseInt(event.value);
        this.setState({ selection: selection });
    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm(): Promise<void> {
        if (!this.state.selection.teamId || this.state.selection.teamId == 'default' || this.state.selection.stage == undefined) {
            alert("Něco není vyplněno");
        } else {
            const bet = await getApi().uploadTeamPlaceBet(this.props.isWinnerBet ? TournamentStage.Winner : this.state.selection.stage, this.state.selection.teamId, this.props.isWinnerBet);
            this.setState({ isEditable: false, bet: bet })
        }

    }
}

