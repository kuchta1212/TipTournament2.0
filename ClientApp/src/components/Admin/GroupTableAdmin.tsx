import * as React from 'react';
import { getAdminApi, getApi } from "../api/ApiFactory"
import { Team, Group, GroupResult } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { TeamCell } from '../TeamCell';
import { ConfirmModal } from './ConfirmModal';

interface GroupTableAdminState {
    result: GroupResult;
    loading: boolean;
    teams: Team[];
    isEditable: boolean;
    showConfirm: boolean;
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
            isEditable: !this.props.group.result,
            showConfirm: false
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
                        <tr>
                            <th>#</th>
                            <th>{this.props.group.groupName}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.</td>
                            {this.state.isEditable
                                ? <td>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Tymy</label>
                                        </div>
                                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.result?.firstId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
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
                                            <label className="input-group-text" htmlFor="inputSecondTeamSelect">Tymy</label>
                                        </div>
                                        <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.result?.secondId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
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
                                            <label className="input-group-text" htmlFor="inputThirdTeamSelect">Tymy</label>
                                        </div>
                                        <select className="custom-select" id="inputThirdTeamSelect" defaultValue={this.state.result?.thirdId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
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
                                            <label className="input-group-text" htmlFor="inputFourthTeamSelect">Tymy</label>
                                        </div>
                                        <select className="custom-select" id="inputFourthTeamSelect" defaultValue={this.state.result?.fourthId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                            <option key="default-id" value="default" >Vyber tym</option>
                                            {this.state.teams.map((team, index) => {
                                                return <option key={team.id} value={team.id}>{team.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </td>
                                : <TeamCell team={this.getTeamById(this.state.result.fourthId)} />}
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {this.state.isEditable
                                    ? <button className="btn btn-primary" onClick={() => this.requestConfirm()}>Potvrdit</button>
                                    : <button className="btn btn-secondary" onClick={() => this.modify()}>Upravit</button>
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Potvrdit skupinu"
                        message={`Ulozit poradi pro skupinu ${this.props.group.groupName}?`}
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

    private requestConfirm() {
        if (this.validateResult(this.state.result)) {
            this.setState({ showConfirm: true });
        }
    }

    private async confirm(): Promise<void> {
        this.setState({ showConfirm: false });
        await getAdminApi().uploadGroupResult(this.state.result, this.props.group.id);
        this.setState({ isEditable: false });
    }

    private validateResult(result: GroupResult): boolean {
        if (!!result.firstId && !!result.secondId && !!result.thirdId && !!result.fourthId) {
            return true;
        }

        alert("Neco neni vyplnene");
        return false;
    }

    private getTeamById(id: string): Team {
        return this.state.teams.filter(t => t.id == id)[0];
    }
}
