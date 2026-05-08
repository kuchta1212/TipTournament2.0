import * as React from 'react';
import { AdminMatchView } from './AdminMatchView';
import { UserOverview } from './UserOverview';

interface AdminPageState {
}

interface AdminPageProps {
}

export class AdminPage extends React.Component<AdminPageProps, AdminPageState> {

    constructor(props: AdminPageProps) {
        super(props);
    }

    public render() {
        return (
            <div className="admin-page">
                <div className="admin-hero">
                    <h1>Administrace</h1>
                    <p className="admin-subtitle">Sprava turnaje, uzivatelu a vysledku</p>
                </div>

                <div className="admin-section">
                    <h2 className="admin-section-header">Vysledky</h2>
                    <AdminMatchView />
                </div>

                <div className="admin-section">
                    <h2 className="admin-section-header">Uzivatele</h2>
                    <UserOverview />
                </div>
            </div>
        );
    }
}
