import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, Team, Group, GroupBet, GroupBetResult, GroupResult, BetResult } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';

interface GroupTableAdminState {
    result: GroupResult;
    loading: boolean;
    teams: Team[];
    isEditable: boolean;
}

interface GroupTableAdminProps {
    group: Group;
}

export class GroupTableAdmin extends React.Component<GroupTableAdminProps, GroupTableAdminState> {

    constructor(props: GroupTableAdminProps) {
        super(props);
        this.state = {
            result: this.props.group.result,
            loading: true,
            teams: {} as Team[],
            isEditable: !this.props.group.result
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderGroupsResults();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData(): Promise<void> {
        const teams = await getApi().getGroupTeams(this.props.group.id);
        this.setState({ loading: false, teams: teams, });
    }

    private renderGroupsResults() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <thead>
                        <th>#</th>
                        <th>{this.props.group.groupName}</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.</td>
                            {this.state.isEditable
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.result?.firstId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.getTeamById(this.state.result.firstId)} />}
                        </tr>
                        <tr>
                            <td>2.</td>
                            {this.state.isEditable
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.result?.secondId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.getTeamById(this.state.result.secondId)} />}
                        </tr>
                        <tr>
                            <td>3.</td>
                            {this.state.isEditable
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputThirdTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputThirdTeamSelect" defaultValue={this.state.result?.thirdId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.getTeamById(this.state.result.thirdId)} />}
                        </tr>
                        <tr>
                            <td>4.</td>
                            {this.state.isEditable
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputFourthTeamSelect">Týmy</label>
                                        </div>
                                        <select className="custom-select" id="inputFourthTeamSelect" defaultValue={this.state.result?.fourthId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tým</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.getTeamById(this.state.result.fourthId)} />}
                        </tr>
                        {
                            this.state.isEditable
                                ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>
                        }
                    </tbody>
                </Table>
            </div>
        );
    }

    private onSelect(event: any) {
        let currentResult = this.state.result;
        if (!currentResult) {
            currentResult = {} as GroupResult;
        }
        let correct = false;
        switch (event.id) {
            case "inputFirstTeamSelect":
                if (event.value !== currentResult?.secondId && event.value !== currentResult?.thirdId && event.value !== currentResult?.fourthId) {
                    currentResult.firstId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;

            case "inputSecondTeamSelect":
                if (event.value !== currentResult?.firstId && event.value !== currentResult?.thirdId && event.value !== currentResult?.fourthId) {
                    currentResult.secondId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;

            case "inputThirdTeamSelect":
                if (event.value !== currentResult.secondId && event.value !== currentResult.firstId && event.value !== currentResult.fourthId) {
                    currentResult.thirdId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;

            case "inputFourthTeamSelect":
                if (event.value !== currentResult.secondId && event.value !== currentResult.thirdId && event.value !== currentResult.firstId) {
                    currentResult.fourthId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;
        }

        if (correct) {
            this.setState({ result: currentResult });
        } else {
            event.value = "default";
        }

    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm(): Promise<void> {
        if (this.validateResult(this.state.result)) {

            await getApi().uploadGroupResult(this.state.result, this.props.group.id);
            this.setState({ isEditable: false })
        }
    }

    private validateResult(result: GroupResult): boolean {
        if (!!result.firstId && !!result.secondId && !!result.thirdId && !!result.fourthId) {
            return true;
        }

        alert("Něco není vyplněné");
        return false;
    }

    private getTeamById(id: string): Team {
        return this.state.teams.filter(t => t.id == id)[0];
    }
}

