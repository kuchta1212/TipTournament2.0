import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, Team, Group, GroupBet } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';

interface BetSelection {
    firstId: string;
    secondId: string;
    thirdId: string;
    fourthId: string;
}

interface GroupTableState {
    bet: GroupBet;
    loading: boolean;
    isEditable: boolean;
    selection: BetSelection;
    teams: Team[];
}

interface GroupTableProps {
    group: Group;
    isReadOnly: boolean;
    showResult: boolean;
}

export class GroupTable extends React.Component<GroupTableProps, GroupTableState> {

    constructor(props: GroupTableProps) {
        super(props);
        this.state = {
            bet: {} as GroupBet,
            loading: true,
            isEditable: !this.props.isReadOnly,
            teams: {} as Team[],
            selection: {} as BetSelection
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.props.isReadOnly && !this.state.bet.id
                ? <div> Ještě sis nevsadil! </div>
                : this.renderGroupsBets();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bet = await getApi().getGroupBet(this.props.group.id, userId);
        const teams = await getApi().getGroupTeams(this.props.group.id);
        if (!bet.id) {
            this.setState({ isEditable: true && !this.props.isReadOnly, loading: false, teams: teams });
        } else {
            const selection = this.convertToSelection(bet);
            this.setState({ bet: bet, loading: false, isEditable: false, teams: teams, selection: selection });

        }
    }

    private convertToSelection(bet: GroupBet): BetSelection {
        let bs = {} as BetSelection;
        bs.firstId = bet.first.id;
        bs.secondId = bet.second.id;
        bs.thirdId = bet.third.id;
        bs.fourthId = bet.fourth.id;
        return bs;
    }

    private renderGroupsBets() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <thead>
                        <th>#</th>
                        <th>{this.props.group.groupName}</th>
                    </thead>
                    <tbody>
                        <tr className={this.getClass(1)}>
                            <td>1.</td>
                            {this.state.isEditable && !this.props.isReadOnly
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.firstId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {
                                                this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.state.bet.first} />}
                        </tr>
                        <tr className={this.getClass(2)}>
                            <td>2.</td>
                            {this.state.isEditable && !this.props.isReadOnly
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.selection.secondId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.state.bet.second} />}
                        </tr>
                        <tr className={this.getClass(3)}>
                            <td>3.</td>
                            {this.state.isEditable && !this.props.isReadOnly
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputThirdTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputThirdTeamSelect" defaultValue={this.state.selection.thirdId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.state.bet.third} />}
                        </tr>
                        <tr className={this.getClass(4)}>
                            <td>4.</td>
                            {this.state.isEditable && !this.props.isReadOnly
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputFourthTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputFourthTeamSelect" defaultValue={this.state.selection.fourthId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.state.bet.fourth} />}
                        </tr>
                        {
                            this.props.showResult
                                ? <tr className={this.getBackgroundClass()}><td>Body:</td><td>{this.state.bet.result?.points ?? 0}</td></tr>
                                : this.props.isReadOnly
                                    ? <div />
                                    : this.state.isEditable
                                        ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                        : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>
                        }
                    </tbody>
                </Table>
            </div>
        );
    }

    private getBackgroundClass(): string {
        if (!this.props.showResult || !this.state.bet.result) {
            return "";
        }

        const points = this.state.bet.result?.points ?? 0;
        switch (points) {
            case 0:
                return "bg-danger";
            case 1:
                return "bg-info";
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
                return this.state.bet.result.isFirstCorrect ? "border-success" : "border-fail";
            case 2:
                return this.state.bet.result.isSecondCorrect ? "border-success" : "border-fail";
            case 3:
                return this.state.bet.result.isThirdCorrect ? "border-success" : "border-fail";
            case 4:
                return this.state.bet.result.isFourthCorrect ? "border-success" : "border-fail";
        }

        return "";
    }

    private onSelect(event: any) {
        let selection = this.state.selection;
        switch (event.id) {
            case "inputFirstTeamSelect":
                selection.firstId = event.value;
                break;

            case "inputSecondTeamSelect":
                selection.secondId = event.value;
                break;

            case "inputThirdTeamSelect":
                selection.thirdId = event.value;
                break;

            case "inputFourthTeamSelect":
                selection.fourthId = event.value;
                break;
        }

        this.setState({ selection: selection });
    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm() : Promise<void> {
        if (this.validateSelection(this.state.selection)) {
            const bet = this.toBet(this.state.selection);

            await getApi().uploadGroupBet(bet, this.props.group.id);

            this.setState({ isEditable: false, bet: bet })
        }
    }

    private validateSelection(selection: BetSelection): boolean {
        if (selection.firstId != selection.secondId && selection.firstId != selection.thirdId && selection.firstId != selection.fourthId &&
            selection.secondId != selection.thirdId && selection.secondId != selection.fourthId &&
            selection.thirdId != selection.fourthId &&
            !!selection.firstId && !!selection.secondId && !!selection.thirdId && !!selection.fourthId &&
            selection.firstId != "default" && selection.secondId != "default" && selection.thirdId != "default" && selection.fourthId != "default") {
            return true;
        }

        alert("Něco není vyplněné nebo tam je něco dvakrát");
        return false;
    }

    private toBet(selection: BetSelection): GroupBet {
        let gb = this.state.bet;
        gb.first = this.getTeamById(selection.firstId);
        gb.second = this.getTeamById(selection.secondId);
        gb.third = this.getTeamById(selection.thirdId);
        gb.fourth = this.getTeamById(selection.fourthId);
        return gb;
    }

    private getTeamById(id: string): Team {
        return this.state.teams.filter(t => t.id == id)[0];
    }
}

