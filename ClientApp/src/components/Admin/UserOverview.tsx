import * as React from 'react';
import { User } from "../../typings/index"
import { Table } from 'reactstrap';
import { getApi } from '../api/ApiFactory';
import { UserRow } from './UserRow'


interface UserOverviewState {
    loading: boolean,
    users: User[]
}

interface UserOverviewProps {

}

export class UserOverview extends React.Component<UserOverviewProps, UserOverviewState> {

    constructor(props: UserOverviewProps) {
        super(props);

        this.state = {
            loading: true, users: {} as User[]}
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUsersTable(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel" >Hráči</h1>
                {contents}
            </div>
        );
    }

    private async getData() {
        const users = await getApi().getUsers(false);
        this.setState({ users: users, loading: false });
    }

    private renderUsersTable(users: User[]) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <UserRow user={user} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }
}

