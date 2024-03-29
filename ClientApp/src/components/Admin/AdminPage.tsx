﻿import * as React from 'react';
import { TournamentStage } from '../../typings';
import { MainInnerPage } from '../MainPage/MainPageInner';
import { AdminMatchView } from './AdminMatchView';
import { MatchLoader } from './MatchLoader';
import { UpdateChecker } from './UpdateChecker';
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
            <React.Fragment>
                <MatchLoader />
                <UpdateChecker />
                <UserOverview />
                <AdminMatchView />
            </React.Fragment>
        );
    }
}

