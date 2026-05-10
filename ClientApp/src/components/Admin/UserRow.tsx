import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { ConfirmModal } from './ConfirmModal';
import { MedalIcon, getMedalLabel } from '../MedalIcon';
import { MedalTournament, MedalPlace, UserMedal } from '../../typings';

interface AdminUser {
    id: string;
    userName: string;
    payed: boolean;
    isAdmin: boolean;
    medals: UserMedal[];
}

interface UserRowState {
    showPayConfirm: boolean;
    showAdminConfirm: boolean;
    showMedalConfirm: boolean;
    pendingPayValue: boolean;
    pendingAdminValue: boolean;
    pendingMedal: { tournament: MedalTournament; place: MedalPlace; willAssign: boolean } | null;
}

interface UserRowProps {
    user: AdminUser;
    onPaymentChange: (payed: boolean) => void;
    onAdminChange: (isAdmin: boolean) => void;
    onMedalsChange: (medals: UserMedal[]) => void;
}

const ALL_MEDALS: { tournament: MedalTournament; place: MedalPlace }[] = [
    { tournament: MedalTournament.E20, place: MedalPlace.Gold },
    { tournament: MedalTournament.E20, place: MedalPlace.Silver },
    { tournament: MedalTournament.E20, place: MedalPlace.Bronze },
    { tournament: MedalTournament.E24, place: MedalPlace.Gold },
    { tournament: MedalTournament.E24, place: MedalPlace.Silver },
    { tournament: MedalTournament.E24, place: MedalPlace.Bronze },
    { tournament: MedalTournament.WC22, place: MedalPlace.Gold },
    { tournament: MedalTournament.WC22, place: MedalPlace.Silver },
    { tournament: MedalTournament.WC22, place: MedalPlace.Bronze },
];

export class UserRow extends React.Component<UserRowProps, UserRowState> {
    constructor(props: UserRowProps) {
        super(props);
        this.state = {
            showPayConfirm: false,
            showAdminConfirm: false,
            showMedalConfirm: false,
            pendingPayValue: false,
            pendingAdminValue: false,
            pendingMedal: null,
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
                <div className="admin-user-medals">
                    {ALL_MEDALS.map(m => {
                        const isAssigned = this.hasMedal(m.tournament, m.place);
                        return (
                            <button
                                key={`${m.tournament}-${m.place}`}
                                type="button"
                                className={`admin-medal-chip ${isAssigned ? 'admin-medal-chip-on' : 'admin-medal-chip-off'}`}
                                title={getMedalLabel(m.tournament, m.place) + (isAssigned ? ' (kliknutim odebrat)' : ' (kliknutim pridat)')}
                                onClick={() => this.requestMedalToggle(m.tournament, m.place, !isAssigned)}
                            >
                                <MedalIcon tournament={m.tournament} place={m.place} size={22} />
                            </button>
                        );
                    })}
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
                {this.state.showMedalConfirm && this.state.pendingMedal &&
                    <ConfirmModal
                        title="Zmena medaile"
                        message={this.state.pendingMedal.willAssign
                            ? `Pridat medaili "${getMedalLabel(this.state.pendingMedal.tournament, this.state.pendingMedal.place)}" uzivateli "${user.userName}"?`
                            : `Odebrat medaili "${getMedalLabel(this.state.pendingMedal.tournament, this.state.pendingMedal.place)}" uzivateli "${user.userName}"?`}
                        variant={this.state.pendingMedal.willAssign ? 'warning' : 'danger'}
                        confirmText={this.state.pendingMedal.willAssign ? 'Pridat' : 'Odebrat'}
                        onConfirm={() => this.confirmMedalToggle()}
                        onCancel={() => this.setState({ showMedalConfirm: false, pendingMedal: null })}
                    />
                }
            </div>
        );
    }

    private hasMedal(tournament: MedalTournament, place: MedalPlace): boolean {
        return (this.props.user.medals || []).some(m => m.tournament === tournament && m.place === place);
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

    private requestMedalToggle(tournament: MedalTournament, place: MedalPlace, willAssign: boolean) {
        this.setState({ showMedalConfirm: true, pendingMedal: { tournament, place, willAssign } });
    }

    private async confirmMedalToggle() {
        const pending = this.state.pendingMedal;
        if (!pending) return;
        this.setState({ showMedalConfirm: false, pendingMedal: null });
        const result = await getAdminApi().toggleMedal(this.props.user.id, pending.tournament, pending.place);
        const current = this.props.user.medals || [];
        const updated = result.assigned
            ? [...current, { tournament: pending.tournament, place: pending.place }]
            : current.filter(m => !(m.tournament === pending.tournament && m.place === pending.place));
        this.props.onMedalsChange(updated);
    }
}
