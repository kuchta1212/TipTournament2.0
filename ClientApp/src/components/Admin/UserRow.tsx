import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { ConfirmModal } from './ConfirmModal';

interface AdminUser {
    id: string;
    userName: string;
    payed: boolean;
    isAdmin: boolean;
}

interface UserRowState {
    showPayConfirm: boolean;
    showAdminConfirm: boolean;
    pendingPayValue: boolean;
    pendingAdminValue: boolean;
}

interface UserRowProps {
    user: AdminUser;
    onPaymentChange: (payed: boolean) => void;
    onAdminChange: (isAdmin: boolean) => void;
}

export class UserRow extends React.Component<UserRowProps, UserRowState> {
    constructor(props: UserRowProps) {
        super(props);
        this.state = {
            showPayConfirm: false,
            showAdminConfirm: false,
            pendingPayValue: false,
            pendingAdminValue: false,
        }
    }

    public render() {
        const { user } = this.props;

        return (
            <div className="admin-user-row">
                <div className="admin-user-name">{user.userName}</div>
                <div className="admin-user-badges">
                    <span className={`payment-badge ${user.payed ? 'payment-badge-paid' : 'payment-badge-unpaid'}`}>
                        {user.payed ? 'Zaplaceno' : 'Nezaplaceno'}
                    </span>
                    <span className={`admin-role-badge ${user.isAdmin ? 'admin-role-badge-admin' : 'admin-role-badge-user'}`}>
                        {user.isAdmin ? 'Admin' : 'Uzivatel'}
                    </span>
                </div>
                <div className="admin-user-actions">
                    {user.payed
                        ? <button className="btn btn-sm btn-outline-danger" onClick={() => this.requestPayChange(false)}>Zrusit platbu</button>
                        : <button className="btn btn-sm btn-success" onClick={() => this.requestPayChange(true)}>Zaplatil</button>
                    }
                    {user.isAdmin
                        ? <button className="btn btn-sm btn-outline-danger" onClick={() => this.requestAdminChange(false)}>Odebrat admina</button>
                        : <button className="btn btn-sm btn-outline-primary" onClick={() => this.requestAdminChange(true)}>Pridat admina</button>
                    }
                </div>
                {this.state.showPayConfirm &&
                    <ConfirmModal
                        title="Zmena platby"
                        message={this.state.pendingPayValue
                            ? `Oznacit uzivatele "${user.userName}" jako zaplatil?`
                            : `Zrusit platbu uzivatele "${user.userName}"?`}
                        variant={this.state.pendingPayValue ? 'primary' : 'danger'}
                        confirmText={this.state.pendingPayValue ? 'Zaplatil' : 'Zrusit platbu'}
                        onConfirm={() => this.confirmPayChange()}
                        onCancel={() => this.setState({ showPayConfirm: false })}
                    />
                }
                {this.state.showAdminConfirm &&
                    <ConfirmModal
                        title="Zmena role"
                        message={this.state.pendingAdminValue
                            ? `Pridat uzivatele "${user.userName}" jako admina?`
                            : `Odebrat admin roli uzivateli "${user.userName}"?`}
                        variant={this.state.pendingAdminValue ? 'warning' : 'danger'}
                        confirmText={this.state.pendingAdminValue ? 'Pridat' : 'Odebrat'}
                        onConfirm={() => this.confirmAdminChange()}
                        onCancel={() => this.setState({ showAdminConfirm: false })}
                    />
                }
            </div>
        );
    }

    private requestPayChange(payed: boolean) {
        this.setState({ showPayConfirm: true, pendingPayValue: payed });
    }

    private async confirmPayChange() {
        const payed = this.state.pendingPayValue;
        this.setState({ showPayConfirm: false });
        await getAdminApi().payed(this.props.user.id, payed);
        this.props.onPaymentChange(payed);
    }

    private requestAdminChange(isAdmin: boolean) {
        this.setState({ showAdminConfirm: true, pendingAdminValue: isAdmin });
    }

    private async confirmAdminChange() {
        const isAdmin = this.state.pendingAdminValue;
        this.setState({ showAdminConfirm: false });
        await getAdminApi().setAdmin(this.props.user.id, isAdmin);
        this.props.onAdminChange(isAdmin);
    }
}
