import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { BetsStageStatus, MainData, TournamentStage, UpdateStatus } from "../../typings/index"
import { MatchCard } from "./MatchCard"
import { AlfaMatches } from "./AlfaMatches"
import { Ranking } from "./Ranking"
import { Loader } from './../Loader'
import './../../custom.css'
import authService from './../api-authorization/AuthorizeService'
import { GammaView } from './GammaView';
import { DeltaView } from './DeltaView';
import { TeamPlaceBet } from '../Bets/TeamPlaceBet';
import { BestShooterBet } from '../Bets/BestShooterBet';

interface MainPageInnerState {
    currentUser: string;
    status: UpdateStatus
}

interface MainPageInnerProps {
    activeStage: TournamentStage
}

export class MainInnerPage extends React.Component<MainPageInnerProps, MainPageInnerState> {

    private data = [
        { text: "Alfa + Beta - Skupinová fáze", component: <AlfaMatches />, stage: TournamentStage.Group },
        { text: "Gamma - Skupiny", component: <GammaView />, stage: TournamentStage.Group },
        { text: "Delta - Osmifinále", component: <DeltaView stage={TournamentStage.FirstRound} />, stage: TournamentStage.FirstRound },
        { text: "Delta - Čtvrtfinále", component: <DeltaView stage={TournamentStage.Quarterfinal} />, stage: TournamentStage.Quarterfinal },
        { text: "Delta - Semifinále", component: <DeltaView stage={TournamentStage.Semifinal} />, stage: TournamentStage.Semifinal },
        { text: "Delta - Finále", component: <DeltaView stage={TournamentStage.Final} />, stage: TournamentStage.Final },
        { text: "Delta - Vítěz", component: <TeamPlaceBet isWinnerBet={true} status={BetsStageStatus.Done} showResult={true} />, stage: TournamentStage.Winner },
        { text: "Lambda - Nejlepší střelec", component: <BestShooterBet isReadOnly={true} showResult={true} />, stage: TournamentStage.Winner },
        { text: "Omikron - Sázka na tým", component: <TeamPlaceBet isWinnerBet={false} status={BetsStageStatus.Done} showResult={true} />, stage: TournamentStage.Omikron },
    ]

    constructor(props: MainPageInnerProps) {
        super(props);
        this.state = {
            currentUser: "",
            status: {} as UpdateStatus
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.renderDataTable();

        return (
            <div>
                <h1 id="tabelLabel" >Zápasy, sázky, výsledky</h1>
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
            <div className="accordion" id="accordionExample">
                {
                    this.data.map(d => {
                         return <MatchCard component={d.component} stage={d.stage} text={d.text} />
                    })
                }

            </div>
        );
    }
}

