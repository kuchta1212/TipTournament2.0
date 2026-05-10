import * as React from 'react';
import { getAdminApi } from '../api/ApiFactory';
import { UserRow } from './UserRow'
import { UserMedal } from '../../typings';

interface AdminUser {
    id: string;
    userName: string;
    payed: boolean;
    isAdmin: boolean;
    medals: UserMedal[];
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
                        onMedalsChange={(medals) => this.handleMedalsChange(user.id, medals)}
                    />
                ))}
            </div>
        );
    }

    private async getData() {
        const users = await getAdminApi().getUsersWithRoles();
        this.setState({
            users: users.map(u => ({ ...u, medals: u.medals || [] })),
            loading: false
        });
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

    private handleMedalsChange(userId: string, medals: UserMedal[]) {
        this.setState(prev => ({
            users: prev.users.map(u => u.id === userId ? { ...u, medals } : u)
        }));
    }
}
