import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, User } from "../../typings/index"
import { Table } from 'reactstrap';
import { Bets } from './Bets';
import { UserSelector } from './UserSelector';
import { WarningNotification } from '../WarningNotification';

interface AllBetsState {
    users: User[];
    selectedUser: User;
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
            selectedUser: {} as User,
            loading: true,
            isUserSelected: false,
            isAllowed: new Date() > new Date("2021-06-11 18:00")
        }
    }

    public componentDidMount() {
        this.loadData();
    }

    public render() {
        return this.state.loading
            ? (<p><em>Loading...</em></p>)
            : !this.state.isUserSelected
                ? this.renderUserSelector()
                : this.renderAllBets()
    }

    private async loadData() {
        const users = await getApi().getUsers();
        this.setState({ users: users, selectedUser: undefined, loading: false, isUserSelected: false });
    }

    private renderUserSelector() {
        return this.state.isAllowed 
            ? (<UserSelector users={this.state.users} onUserSelect={this.userSelected.bind(this)} disabled={false} />)
            : (<React.Fragment> 
                    <WarningNotification text="Ještě ne! Až bude konec sázek." />
                <UserSelector users={this.state.users} onUserSelect={this.userSelected.bind(this)} disabled={true} />
                </React.Fragment>)
    }

    private renderAllBets() {
        return (
            <React.Fragment>
                <UserSelector users={this.state.users} onUserSelect={this.userSelected.bind(this)} disabled={false} />
                <Bets user={this.state.selectedUser} />
            </React.Fragment>
            );
    }

    private userSelected(event: any) {
        let user = this.state.users.find(u => u.id == event.target.value);
        this.setState({ users: this.state.users, selectedUser: user, loading: false, isUserSelected: true })
    }

}

