import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { BetsStageStatus, Match, TournamentStage, UpdateStatus } from "../../typings/index"
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
import { MatchBetRow } from '../Bets/MatchBetRow';

interface AdminMatchViewState {
    matches: Match[],
    loading: boolean
}

interface AdminMatchViewProps {

}

export class AdminMatchView extends React.Component<AdminMatchViewProps, AdminMatchViewState> {

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

    constructor(props: AdminMatchViewProps) {
        super(props);
        this.state = {
            loading: true,
            matches: {} as Match[]
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderData();

        return (
            <div>
                <h1 id="tabelLabel">Výsledky</h1>
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getAllMatches();
        this.setState({ matches: matches, loading: false });
    }


    private renderData() {
        return (
            <div className="accordion" id="accordionExample">
                <div className="card opacity-card">
                    <div className="card-header" id="matches-card">
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h5 className="mb-0">
                                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#matches-card" aria-expanded="false" aria-controls="matches-card">
                                    "Zápasy"
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div id="matches-card" className="collapse" aria-labelledby="matches-card" data-parent="#accordionExample">
                        <div className="card-body">
                            {
                                this.state.matches.map(m => {
                                    <MatchBetRow />
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

