import * as React from 'react';
import authService from './../api-authorization/AuthorizeService';
import { MainInnerPage } from './MainPageInner';
import { Ranking } from './Ranking';
import './../../custom.css';
import { TournamentStage } from '../../typings';

interface MainPageState {
    currentUser: string;
    activeStage: TournamentStage;
}

interface MainPageProps { }

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            currentUser: "",
            activeStage: this.getActiveStage()
        };
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        return (
            <div className="container body-content">
                <div className="row">
                    <div className="col">
                        <MainInnerPage activeStage={this.state.activeStage} user={undefined} />
                    </div>
                    <div className="col-lg-3">
                        <Ranking currentUser={this.state.currentUser} />
                    </div>
                </div>
            </div>
        );
    }

    private async getData() {
        const currentUser = await authService.getUser();
        this.setState({ currentUser: currentUser["sub"] });
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
