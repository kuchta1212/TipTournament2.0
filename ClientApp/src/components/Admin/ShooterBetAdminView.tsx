import * as React from 'react';
import { getAdminApi, getApi } from "../api/ApiFactory"
import { Match, Bet, Team, TournamentStage, PlaceTeamBet, BetsStageStatus } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import { TeamCell } from '../TeamCell';

interface ShooterBetAdminViewState {
    evaluated: boolean,
    name: string
}

interface ShooterBetAdminViewProps {
}

export class ShooterBetAdminView extends React.Component<ShooterBetAdminViewProps, ShooterBetAdminViewState> {

    constructor(props: ShooterBetAdminViewProps) {
        super(props);
        this.state = {
            evaluated: false,
            name: ""
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
                <button onClick={() => this.onTopShooterEvaluation()}>Vyhodnotit top strelce</button>
                <td> <input type="text" className="form-control" id="shootername" aria-describedby="basic-addon3" placeholder="Lewandowski/Mbappe/Messi...." onChange={(event) => this.onChange(event.target)} /></td>
                { this.state.evaluated ? <p>Vyhodnoceno</p> : <p>Nevyhodnoceno</p>}
            </div>
        );
    }

    public async onTopShooterEvaluation() {
        await getAdminApi().evaluateTopShooter(this.state.name);
        this.setState({ evaluated: true });
    }

    private onChange(event: any) {
        this.setState({name: event.value})
    }
}