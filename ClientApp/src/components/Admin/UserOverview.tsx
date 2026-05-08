import * as React from 'react';
import { getAdminApi } from '../api/ApiFactory';
import { UserRow } from './UserRow'

interface AdminUser {
    id: string;
    userName: string;
    payed: boolean;
    isAdmin: boolean;
}

interface UserOverviewState {
    loading: boolean;
    users: AdminUser[];
}

interface UserOverviewProps {
}

export class UserOverview extends React.Component<UserOverviewProps, UserOverviewState> {

    constructor(props: UserOverviewProps) {
        super(props);
        this.state = { loading: true, users: [] }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        if (this.state.loading) {
            return <p style={{ color: 'var(--text-muted)' }}>Nacitam uzivatele...</p>;
        }

        return (
            <div className="admin-user-list">
                {this.state.users.map((user) => (
                    <UserRow
                        key={user.id}
                        user={user}
                        onPaymentChange={(payed) => this.handlePaymentChange(user.id, payed)}
                        onAdminChange={(isAdmin) => this.handleAdminChange(user.id, isAdmin)}
                    />
                ))}
            </div>
        );
    }

    private async getData() {
        const users = await getAdminApi().getUsersWithRoles();
        this.setState({ users: users, loading: false });
    }

    private handlePaymentChange(userId: string, payed: boolean) {
        this.setState(prev => ({
            users: prev.users.map(u => u.id === userId ? { ...u, payed } : u)
        }));
    }

    private handleAdminChange(userId: string, isAdmin: boolean) {
        this.setState(prev => ({
            users: prev.users.map(u => u.id === userId ? { ...u, isAdmin } : u)
        }));
    }
}
