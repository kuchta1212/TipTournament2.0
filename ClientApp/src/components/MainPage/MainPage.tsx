import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { MainData, TournamentStage } from "../../typings/index"
import { Matches } from "./Matches"
import { UserBets } from "./UserBets"
import { Ranking } from "./Ranking"
import { Loader } from './../Loader'
import './../../custom.css'
import authService from './../api-authorization/AuthorizeService'
import { MainInnerPage } from './MainPageInner';

interface MainPageState {
    currentUser: string;
    activeStage: TournamentStage
}

interface MainPageProps {

}

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            currentUser: "",
            activeStage: this.getActiveStage()
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.renderDataTable();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const currentUser = await authService.getUser();
        this.setState({ currentUser: currentUser["sub"] });
    }

    private renderDataTable() {
        return (
            <div className="container body-content">
                <div className="row">
                    <div className="col">
                        <MainInnerPage activeStage={this.state.activeStage} />
                    </div>
                    <div className="col col-lg-2">
                        <Ranking currentUser={this.state.currentUser} />
                    </div>
                </div>
            </div>
        );
    }

    private getActiveStage(): TournamentStage {
        const today = new Date();
        if (today < new Date(2022, 12, 3)) {
            return TournamentStage.Group;
        }

        if (today < new Date(2022, 12, 9)) {
            return TournamentStage.FirstRound;
        }

        if (today < new Date(2022, 12, 13)) {
            return TournamentStage.Quarterfinal;
        }

        if (today < new Date(2022, 12, 18)) {
            return TournamentStage.Semifinal;
        }

        return TournamentStage.Final;
    }
}

