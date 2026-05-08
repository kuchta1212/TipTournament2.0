import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { ConfirmModal } from './ConfirmModal';

interface TeamPlaceBetAdminViewState {
    evaluated: boolean;
    showConfirm: boolean;
}

interface TeamPlaceBetAdminViewProps {
}

export class TeamPlaceBetAdminView extends React.Component<TeamPlaceBetAdminViewProps, TeamPlaceBetAdminViewState> {

    constructor(props: TeamPlaceBetAdminViewProps) {
        super(props);
        this.state = {
            evaluated: false,
            showConfirm: false
        }
    }

    public render() {
        return (
            <div className="groupItem">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => this.setState({ showConfirm: true })}
                    >
                        Vyhodnotit tymy
                    </button>
                    {this.state.evaluated &&
                        <span className="admin-action-status">Vyhodnoceno</span>
                    }
                </div>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Vyhodnotit umisteni tymu"
                        message="Opravdu chcete vyhodnotit sazky na umisteni tymu? Tato akce ovlivni bodovani."
                        variant="danger"
                        confirmText="Vyhodnotit"
                        onConfirm={() => this.onTeamPlaceBetEvaluation()}
                        onCancel={() => this.setState({ showConfirm: false })}
                    />
                }
            </div>
        );
    }

    private async onTeamPlaceBetEvaluation() {
        this.setState({ showConfirm: false });
        await getAdminApi().evalateTeamPlaceBets();
        this.setState({ evaluated: true });
    }
}
