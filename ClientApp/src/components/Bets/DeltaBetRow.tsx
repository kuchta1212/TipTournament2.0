﻿import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, BetsStageStatus, DeltaBet, DeltaBetTeams } from "../../typings/index"
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
    isReadOnly: boolean;
    showResult: boolean;
}

export class DeltaBetRow extends React.Component<DeltaBetProps, DeltaBetState> {

    constructor(props: DeltaBetProps) {
        super(props);
        this.state = {
            bet: {} as DeltaBet,
            loading: true,
            isEditable: !this.props.isReadOnly,
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
            : this.props.isReadOnly && !this.state.bet.homeTeamBet
                ? <div> Ještě sis nevsadil! </div>
                : this.renderDeltaBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bet = await getApi().getDeltaBet(this.props.match.id, userId);
        const teams = await getApi().getTeamsForDeltaBet(this.props.match.id, this.props.match.stage, userId);
        if (!bet.id || (!bet.homeTeamBet || !bet.awayTeamBet)) {
            this.setState({ loading: false, teams: teams });
        } else {
            this.setState({ bet: bet, loading: false, isEditable: false, teams: teams});
        }
    }

    private renderDeltaBet() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td className={this.getClass(1)}>
                                {this.state.isEditable
                                    ? <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.homeId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleHomeTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : (this.state.bet.homeTeamBet && <TeamCell team={this.state.bet.homeTeamBet} />)
                                }
                            </td>
                            <td className={this.getClass(2)}>
                                {this.state.isEditable
                                ?   <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Tým</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.selection.awayId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.possibleAwayTeams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    : (this.state.bet.awayTeamBet && <TeamCell team={this.state.bet.awayTeamBet} />)
                                }
                            </td>
                        </tr>
                        {(this.state.bet.result?.additionalResult && <tr>
                            <td className={this.getAdditionalClass(this.state.bet.result?.additionalResult?.isHomeTeamCorrect)}>
                                {(this.state.bet.result?.additionalResult?.isHomeTeamCorrect && <p style={{ fontSize: 'small'}}>Dodatečné body za postup týmu, přes jinou část pavkouka</p>)}
                            </td>
                            <td className={this.getAdditionalClass(this.state.bet.result?.additionalResult?.isAwayTeamCorrect)}>
                                {(this.state.bet.result?.additionalResult?.isAwayTeamCorrect && <p style={{ fontSize: 'small'}}>Dodatečné body za postup týmu, přes jinou část pavkouka</p>)}
                            </td>
                        </tr>)}
                        <tr>
                            <td />
                            {this.props.showResult
                                ? <tr className={this.getBackgroundClass()}><td>Body:</td><td>{this.getTotalPoints()}</td></tr>
                                : this.props.isReadOnly
                                    ? <div />
                                    : this.state.isEditable
                                        ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                        : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>}
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    private getTotalPoints(): number {
        return (this.state.bet.result?.points ?? 0) + (this.state.bet.result?.additionalResult?.points ?? 0);
    }

    private getBackgroundClass(): string {
        if (!this.props.showResult || !this.state.bet.result) {
            return "";
        }

        const points = this.getTotalPoints();

        switch (points) {
            case 0:
                return "bg-danger";
            case 1:
            case 2:
            case 3:
                return "bg-warning";
            case 4:
                return "bg-success";
            default:
                return "";
        }
    }
     
    private getClass(order: number): string {
        if (!this.props.showResult || !this.state.bet.result) {
            return "";
        }

        switch (order) {
            case 1:
                return this.state.bet.result.isHomeTeamCorrect ? "border-success" : "border-fail";
            case 2:
                return this.state.bet.result.isAwayTeamCorrect ? "border-success" : "border-fail";
        }

        return "";
    }

    private getAdditionalClass(isTeamCorrect: boolean): string {
        return isTeamCorrect ? "border-success" : "";
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

