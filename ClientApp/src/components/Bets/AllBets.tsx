import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { BetsStageStatus, User } from "../../typings/index"
import { Bets } from './Bets';
import { Loader } from './../Loader'
import { UserSelector } from './UserSelector';
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary";

interface AllBetsState {
    users: User[];
    selectedUsers: IDictionary<User>;
    selectorIds: string[];
    loading: boolean;
    isUserSelected: boolean,
    isAllowed: boolean
}

interface AllBetsProps {

}

export class AllBets extends React.Component<AllBetsProps, AllBetsState> {

    constructor(props: AllBetsProps) {
        super(props);

        this.state = {
            users: {} as User[],
            selectedUsers: new Dictionary(),
            selectorIds: ["0"],
            loading: true,
            isUserSelected: false,
            isAllowed: new Date() > new Date("2024-06-14 21:00")
        }
    }

    public componentDidMount() {
        this.loadData();
    }

    public render() {
        return this.state.loading
            ? (<Loader />)
            : !this.state.isUserSelected
                ? this.renderUserSelector()
                : this.renderAllBets()
    }

    private async loadData() {
        const users = await getApi().getUsers(true);
        this.setState({ users: users, loading: false });
    }

    private renderUserSelector() {
        return this.state.isAllowed 
            ? (
                <React.Fragment>
                    {this.renderUserSelectors()}
                    <button className="btn btn-link" onClick={() => this.addUserSelector()}><img src={process.env.PUBLIC_URL + 'icons/add.svg'} width="25" height="25" /></button> 
                </React.Fragment>)
            : (<React.Fragment>
                    <WarningNotification text="Sázky ostatních se otevřou s uzavřením sázek. Takže 14.6 v 21:00 " type={WarningTypes.error} />
                    {this.renderUserSelectors()}
                </React.Fragment>)
    }

    private renderAllBets() {
        return (
            <React.Fragment>
                {this.renderUserSelectors()}    
                <button className="btn btn-link" onClick={() => this.addUserSelector()}><img src={process.env.PUBLIC_URL + 'icons/add.svg'} width="25" height="25" /></button>
                <Bets key={this.getCombineId()} users={this.state.selectedUsers?.getValues()} status={BetsStageStatus.Done} />
            </React.Fragment>
            );
    }

    private userSelected(event: any, id: string) {
        let user = this.state.users.find(u => u.id == event.target.value);
        let selectedUsers = this.state.selectedUsers;
        if (!!user) {
            selectedUsers.put(id, user);
        }
        this.setState({ selectedUsers: selectedUsers, loading: false, isUserSelected: true })
    }

    private renderUserSelectors() {
        return (<React.Fragment>
            {this.state.selectorIds.map((key) => {
                return <UserSelector key={this.getKey(key)} id={key} users={this.state.users} onUserSelect={this.userSelected.bind(this)} onSelectorRemove={this.removeUserSelector.bind(this)} value={!!this.state.selectedUsers.get(key) ? this.state.selectedUsers.get(key).id : 'default'} disabled={!this.state.isAllowed} />
            })}
        </React.Fragment>
        )
    }

    private addUserSelector() {
        let selectorIds = this.state.selectorIds;
        const maxStr = selectorIds.reduce((acc, cur) => {
            let accInt = parseInt(acc);
            let curInt = parseInt(cur);

            return accInt > curInt
                ? acc
                : cur;
        }, "0")

        const newIndex = parseInt(maxStr) + 1;
        selectorIds.push(newIndex.toString());
        this.setState({ selectorIds: selectorIds })
    }

    private removeUserSelector(event: any, id: string) {
        let selectedUsers = this.state.selectedUsers;
        if (selectedUsers.contains(id)) {
            selectedUsers.remove(id);
        }

        let selectorIds = this.state.selectorIds;
        const index = selectorIds.indexOf(id);
        selectorIds.splice(index, 1);

        this.setState({ selectedUsers: selectedUsers, selectorIds: selectorIds});
    }

    private getCombineId(): string {
        return this.state.selectedUsers.getValues().reduce((acc, cur) => {
            return acc += cur?.id;
        }, "CombineId-");
    }

    private getKey(id: string): string {
        return "UserSelectorKey-" + id;
    }
}

