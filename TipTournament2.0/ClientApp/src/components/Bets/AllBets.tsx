import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { User } from "../../typings/index"
import { Bets } from './Bets';
import { Loader } from './../Loader'
import { UserSelector } from './UserSelector';
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Button } from 'bootstrap';
import { Identifier } from 'typescript';

interface IDictionary {
    [key: number]: User
}

interface AllBetsState {
    users: User[];
    selectedUsers: IDictionary | undefined;
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
            selectedUsers: {0: {} as User },
            loading: true,
            isUserSelected: false,
            isAllowed: new Date() > new Date("2021-06-07 21:00")
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
        const users = await getApi().getUsers();
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
                    <WarningNotification text="Sázky ostatních se otevřou s uzavřením sázek. Takže 11.6 v 21:00 " type={WarningTypes.error} />
                    {this.renderUserSelectors()}
                    {/*<UserSelector id={0} users={this.state.users} onUserSelect={this.userSelected.bind(this)} value={'default'} disabled={true} />*/}
                </React.Fragment>)
    }

    private renderAllBets() {
        return (
            <React.Fragment>
                {this.renderUserSelectors()}    
                <button className="btn btn-link" onClick={() => this.addUserSelector()}><img src={process.env.PUBLIC_URL + 'icons/add.svg'} width="25" height="25" /></button> 
                <Bets key={this.getCombineId()} user={this.state.selectedUsers[0]} />
            </React.Fragment>
            );
    }

    private userSelected(event: any, id: number) {
        let user = this.state.users.find(u => u.id == event.target.value);
        let selectedUsers = !!this.state.selectedUsers
            ? this.state.selectedUsers
            : {} as IDictionary;
        selectedUsers[id] = user;
        this.setState({ selectedUsers: selectedUsers, loading: false, isUserSelected: true })
    }

    private renderUserSelectors() {
        console.log(this.state.selectedUsers);
        return (<React.Fragment>
            {Object.keys(this.state.selectedUsers).map((key, index) => {
                return <UserSelector key={this.getKey(parseInt(key))} id={parseInt(key)} users={this.state.users} onUserSelect={this.userSelected.bind(this)} onSelectorRemove={this.removeUserSelector.bind(this)} value={!!this.state.selectedUsers[key].id ? this.state.selectedUsers[key].id : 'default'} disabled={false} />
            })}
        </React.Fragment>
        )
    }

    private addUserSelector() {
        let selectedUsers = this.state.selectedUsers;
        const maxStr = Object.keys(selectedUsers).reduce((acc, cur) => {
            let accInt = parseInt(acc);
            let curInt = parseInt(cur);

            return accInt > curInt
                ? acc
                : cur;
        }, "-1")

        const newIndex = parseInt(maxStr) + 1;
        selectedUsers[newIndex] = {} as User;
        this.setState({ selectedUsers: selectedUsers })
    }

    private removeUserSelector(event: any, id: number) {
        console.log(id);
        let selectedUsers = this.state.selectedUsers;
        delete selectedUsers[id];

        console.log(selectedUsers);

        this.setState({ selectedUsers: selectedUsers });
    }

    private getCombineId(): string {
        return Object.keys(this.state.selectedUsers).reduce((acc, cur) => {
            return acc += this.state.selectedUsers[parseInt(cur)].id;
        }, "CombineId-");
    }

    private getKey(id: number): string {
        return "UserSelectorKey-" + id;
    }
}

