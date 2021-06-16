import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { MainData } from "../../typings/index"
import { Matches } from "./Matches"
import { UserBets } from "./UserBets"
import { Ranking } from "./Ranking"
import { Loader } from './../Loader'
import './../../custom.css'
import authService from './../api-authorization/AuthorizeService'

interface MainPageState {
    data: MainData,
    loading: boolean,
    currentUser: string
}

interface MainPageProps {

}

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            data: {} as MainData,
            loading: true,
            currentUser: ""
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
                ? <Loader />
                : this.renderDataTable(this.state.data);

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const data = await getApi().getData();
        const currentUser = await authService.getUser();
        this.setState({ data: data, loading: false, currentUser: currentUser["sub"] });
    }

    private renderDataTable(data: MainData) {
        return (
            <div className="container body-content">
                <div className="row">
                    <Matches matches={data.matches} bets={data.bets} status={data.status} />
                    <Ranking ranking={data.users} currentUser={this.state.currentUser} />
                </div>
            </div>
        );
    }
}

