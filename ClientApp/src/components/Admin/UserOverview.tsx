import * as React from 'react';
import { getAdminApi } from '../api/ApiFactory';
import { UserRow } from './UserRow'
import { UserMedal } from '../../typings';
import { ConfirmModal } from './ConfirmModal';

interface AdminUser {
    id: string;
    userName: string;
    payed: boolean;
    isAdmin: boolean;
    medals: UserMedal[];
    recoveryCode?: string | null;
}

interface UserOverviewState {
    loading: boolean;
    users: AdminUser[];
    showBulkConfirm: boolean;
    bulkResult: { userName: string; email: string; recoveryCode: string }[] | null;
}

interface UserOverviewProps {
}

export class UserOverview extends React.Component<UserOverviewProps, UserOverviewState> {

    constructor(props: UserOverviewProps) {
        super(props);
        this.state = { loading: true, users: [], showBulkConfirm: false, bulkResult: null }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        if (this.state.loading) {
            return <p style={{ color: 'var(--text-muted)' }}>Nacitam uzivatele...</p>;
        }

        const missingCount = this.state.users.filter(u => !u.recoveryCode).length;

        return (
            <div>
                {missingCount > 0 && (
                    <div className="admin-bulk-bar">
                        <span>{missingCount} uzivatelu bez zachranneho kodu.</span>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => this.setState({ showBulkConfirm: true })}
                        >
                            Vygenerovat chybejici kody
                        </button>
                    </div>
                )}
                {this.state.bulkResult && this.renderBulkResult()}
                <div className="admin-user-list">
                    {this.state.users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onPaymentChange={(payed) => this.handlePaymentChange(user.id, payed)}
                            onAdminChange={(isAdmin) => this.handleAdminChange(user.id, isAdmin)}
                            onMedalsChange={(medals) => this.handleMedalsChange(user.id, medals)}
                            onRecoveryCodeChange={(code) => this.handleRecoveryCodeChange(user.id, code)}
                        />
                    ))}
                </div>
                {this.state.showBulkConfirm && (
                    <ConfirmModal
                        title="Vygenerovat chybejici zachranne kody"
                        message={`Vygenerovat zachranny kod pro vsechny uzivatele, kteri zadny nemaji (${missingCount})? Po vygenerovani je uvidis tady a pak je rozeslej mailem.`}
                        variant="warning"
                        confirmText="Vygenerovat"
                        onConfirm={() => this.confirmBulk()}
                        onCancel={() => this.setState({ showBulkConfirm: false })}
                    />
                )}
            </div>
        );
    }

    private renderBulkResult() {
        if (!this.state.bulkResult) return null;
        return (
            <div className="admin-bulk-result">
                <div className="admin-bulk-result-header">
                    <strong>{this.state.bulkResult.length} kodu vygenerovano</strong>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                            const text = (this.state.bulkResult || []).map(r => `${r.userName}\t${r.email}\t${r.recoveryCode}`).join('\n');
                            navigator.clipboard?.writeText(text);
                        }}
                    >
                        Zkopirovat vse (TSV)
                    </button>
                    <button
                        className="btn btn-sm btn-link"
                        onClick={() => this.setState({ bulkResult: null })}
                    >
                        Zavrit
                    </button>
                </div>
                <table className="admin-bulk-table">
                    <thead>
                        <tr><th>Uzivatel</th><th>Email</th><th>Kod</th></tr>
                    </thead>
                    <tbody>
                        {this.state.bulkResult.map(r => (
                            <tr key={r.userName}>
                                <td>{r.userName}</td>
                                <td>{r.email}</td>
                                <td><code>{r.recoveryCode}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

    private async confirmBulk() {
        this.setState({ showBulkConfirm: false });
        const generated = await getAdminApi().generateMissingRecoveryCodes();
        // Fold the new codes into the user list state
        this.setState(prev => ({
            users: prev.users.map(u => {
                const match = generated.find(g => g.userName === u.userName);
                return match ? { ...u, recoveryCode: match.recoveryCode } : u;
            }),
            bulkResult: generated
        }));
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

    private handleRecoveryCodeChange(userId: string, code: string) {
        this.setState(prev => ({
            users: prev.users.map(u => u.id === userId ? { ...u, recoveryCode: code } : u)
        }));
    }
}
