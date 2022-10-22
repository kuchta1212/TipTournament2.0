import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, Team, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"

interface WinnerBetState {
    isReady: boolean,
    loading: boolean,
    isEditable: boolean,
    bet: Team;
}

interface WinnerBetProps {
    matchId: string
}

export class WinnerBet extends React.Component<WinnerBetProps, WinnerBetState> {

    constructor(props: WinnerBetProps) {
        super(props);
        this.state = {
            isReady: false,
            loading: true,
            isEditable: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.isReady
                ? this.renderBetsTable()
                : this.renderMessage();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const bet = await getApi().getWinnerBet();
        const teams = await getApi().getTeamsForDeltaBet("match_64", TournamentStage.Final)
        const isReady = !teams;
        const isEditable = !bet;

        this.setState({ loading: false, isReady: isReady, isEditable: isReady });
    }

    private renderBetsTable() {
        return (
            {
                this.state.isEditable
                    ? <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Týmy</label>
                        </div>
                        <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.homeId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                            <option key="default-id" value="default" >Vyber tým</option>
                            {this.state.teams.possibleHomeTeams.map((team, index) => {
                                return <option key={team.id} value={team.id}>{team.name}</option>
                            })}
                        </select>
                    </div>
                    : <TeamCell team={this.state.bet.homeTeamBet} />
            }
        );
    }

    private renderMessage() {
        return (
            <div>
                Prosím nejdříve vyplň sázky z dřívějšího kola.
                V případě, že jsou všechny vyplněny, zkus obnovit stránku.
            </div>
            )
    }
}

