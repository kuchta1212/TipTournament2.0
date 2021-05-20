import * as React from 'react';
import { User } from "../../typings";
import { getAdminApi } from "../api/ApiFactory"

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
            </React.Fragment>
        );
    }
}

