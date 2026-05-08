import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { ConfirmModal } from './ConfirmModal';

interface ShooterBetAdminViewState {
    evaluated: boolean;
    name: string;
    showConfirm: boolean;
}

interface ShooterBetAdminViewProps {
}

export class ShooterBetAdminView extends React.Component<ShooterBetAdminViewProps, ShooterBetAdminViewState> {

    constructor(props: ShooterBetAdminViewProps) {
        super(props);
        this.state = {
            evaluated: false,
            name: "",
            showConfirm: false
        }
    }

    public render() {
        return (
            <div className="groupItem">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <label className="input-group-text">Jmeno strelce</label>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Lewandowski / Mbappe / Messi..."
                            value={this.state.name}
                            onChange={(event) => this.setState({ name: event.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <button
                            className="btn btn-primary"
                            disabled={!this.state.name.trim()}
                            onClick={() => this.setState({ showConfirm: true })}
                        >
                            Vyhodnotit
                        </button>
                        {this.state.evaluated &&
                            <span className="admin-action-status">Vyhodnoceno</span>
                        }
                    </div>
                </div>
                {this.state.showConfirm &&
                    <ConfirmModal
                        title="Vyhodnotit nejlepsiho strelce"
                        message={`Opravdu chcete nastavit "${this.state.name}" jako nejlepsiho strelce? Tato akce ovlivni bodovani.`}
                        variant="danger"
                        confirmText="Vyhodnotit"
                        onConfirm={() => this.onTopShooterEvaluation()}
                        onCancel={() => this.setState({ showConfirm: false })}
                    />
                }
            </div>
        );
    }

    private async onTopShooterEvaluation() {
        this.setState({ showConfirm: false });
        await getAdminApi().evaluateTopShooter(this.state.name);
        this.setState({ evaluated: true });
    }
}
