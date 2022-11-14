import * as React from 'react';
import { getAdminApi, getApi } from "../api/ApiFactory"
import { Match, Bet, Team, TournamentStage, PlaceTeamBet, BetsStageStatus } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import { TeamCell } from '../TeamCell';

interface TeamPlaceBetAdminViewState {
    evaluated: boolean,
}

interface TeamPlaceBetAdminViewProps {
}

export class TeamPlaceBetAdminView extends React.Component<TeamPlaceBetAdminViewProps, TeamPlaceBetAdminViewState> {

    constructor(props: TeamPlaceBetAdminViewProps) {
        super(props);
        this.state = {
            evaluated: false,
        }
    }

    public render() {
        return (
            <div>
                {this.renderButton()}
            </div>
        );
    }

    private renderButton() {
        return (
            <div>
                <button onClick={() => this.onTeamPlaceBetEvaluation()}>Vyhodnotit tymy</button>
                { this.state.evaluated ? <p>Vyhodnoceno</p> : <p>Nevyhodnoceno</p>}
            </div>
        );
    }

    public async onTeamPlaceBetEvaluation() {
        await getAdminApi().evalateTeamPlaceBets();
        this.setState({ evaluated: true });
    }
}

