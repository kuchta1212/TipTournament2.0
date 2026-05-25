import * as React from 'react';
import { TournamentStage, User } from "../../typings/index";
import { MatchCard } from "./MatchCard";
import { AlfaMatches } from "./AlfaMatches";
import { GammaView } from './GammaView';
import { TeamPlaceBet } from '../Bets/TeamPlaceBet';
import { BestShooterBet } from '../Bets/BestShooterBet';
import { TournamentBracket } from '../Bets/TournamentBracket';
import { CountdownBanner } from './CountdownBanner';
import authService from './../api-authorization/AuthorizeService';
import './../../custom.css';

interface MainPageInnerState {
    currentUser: string;
}

interface MainPageInnerProps {
    activeStage: TournamentStage;
    user: User | undefined;
}

export class MainInnerPage extends React.Component<MainPageInnerProps, MainPageInnerState> {
    private data = [
        { text: "Alfa + Beta - Skupinová fáze", component: <AlfaMatches />, stage: TournamentStage.Group },
        { text: "Gamma - Skupiny", component: <GammaView />, stage: TournamentStage.Group },
        { text: "Delta - Pavouk", component: <TournamentBracket isReadOnly={true} showResult={true} />, stage: TournamentStage.RoundOf16 },
        { text: "Delta - Vítěz", component: <TeamPlaceBet isWinnerBet={true} isReadOnly={true} showResult={true} />, stage: TournamentStage.Winner },
        { text: "Lambda - Nejlepší střelec", component: <BestShooterBet isReadOnly={true} showResult={true} />, stage: TournamentStage.Winner },
        { text: "Omikron - Sázka na tým", component: <TeamPlaceBet isWinnerBet={false} isReadOnly={true} showResult={true} />, stage: TournamentStage.Omikron },
    ];

    constructor(props: MainPageInnerProps) {
        super(props);
        this.state = {
            currentUser: "",
        };
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        return (
            <div>
                <h1 id="tabelLabel" className="header">{
                    !!this.props.user ? this.props.user.userName : "Zápasy, sázky, výsledky"
                }</h1>
                {!this.props.user && <CountdownBanner />}
                {this.renderDataTable()}
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
                {this.data.map(d => <MatchCard key={d.text} component={d.component} stage={d.stage} text={d.text} />)}
            </div>
        );
    }
}
