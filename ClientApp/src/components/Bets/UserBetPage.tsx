import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { User, TournamentStage } from "../../typings/index"
import { Matches } from "../MainPage/Matches"
import { UserBets } from "../MainPage/UserBets"
import { Loader } from './../Loader'
import './../../custom.css'
import authService from './../api-authorization/AuthorizeService'
import { MainInnerPage } from '../MainPage/MainPageInner';
import { RouteComponentProps } from 'react-router-dom'

interface UserBetPageState {
    currentUser: User;
    isLoading: boolean
}

interface UserBetPageProps {
    userId: string
}

export class UserBetPage extends React.Component<RouteComponentProps<UserBetPageProps>, UserBetPageState> {

    constructor(props: RouteComponentProps<UserBetPageProps>) {
        super(props);
        this.state = {
            currentUser: {} as User,
            isLoading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    private async getData() {
        const users = await getApi().getUsers(true);
        const user = users.filter(u => u.id === this.props.match.params.userId)[0]
        this.setState({ currentUser: user, isLoading: false });
    }

    public render() {
        let contents = this.renderDataTable();

        return (
            <div>
                {contents}
            </div>
        );
    }


    private renderDataTable() {
        return (
            <div className="container body-content">
                <MainInnerPage activeStage={TournamentStage.Group} user={this.state.currentUser} />
            </div>
        );
    }
}

