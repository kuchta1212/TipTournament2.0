import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Team, TournamentStage, PlaceTeamBet } from "../../typings/index"
import { Loader } from '../Loader'
import { TeamCell } from '../TeamCell';

interface BetSelection {
    teamId: string;
    stage: TournamentStage;
}

interface TeamPlaceBetState {
    loading: boolean,
    isEditable: boolean,
    bet: PlaceTeamBet;
    possible: Team[],
    selection: BetSelection
}

interface TeamPlaceBetProps {
    isWinnerBet: boolean,
    isReadOnly: boolean,
    showResult: boolean
}

export class TeamPlaceBet extends React.Component<TeamPlaceBetProps, TeamPlaceBetState> {

    constructor(props: TeamPlaceBetProps) {
        super(props);
        this.state = {
            loading: true,
            isEditable: true,
            bet: {} as PlaceTeamBet,
            possible: {} as Team[],
            selection: {} as BetSelection
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.props.isReadOnly && this.state.isEditable
                ? <div> Jeste sis nevsadil! </div>
                : this.renderBet()

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bet = this.props.isWinnerBet
            ? await getApi().getWinnerBet(userId)
            : await getApi().getTeamPlaceBet(userId)

        const teams = await getApi().getTeamsForTeamPlaceBet(this.props.isWinnerBet);
        if (!bet.id) {
            this.setState({ loading: false, isEditable: true, possible: teams })
        } else {
            this.setState({ loading: false, isEditable: false, bet: bet, possible: teams });
        }
    }

    private renderBet() {
        return (
            <div className="special-bet-card">
                <div className="special-bet-content">
                    {this.state.isEditable
                        ? this.renderEditForm()
                        : this.renderConfirmedBet()
                    }
                </div>
                <div className="special-bet-footer">
                    {this.props.showResult
                        ? <span className={`special-bet-result ${this.getResultClass()}`}>
                            Body: {this.state.bet.isCorrect ? 3 : 0}
                          </span>
                        : this.props.isReadOnly
                            ? null
                            : this.state.isEditable
                                ? <button className="btn btn-primary" onClick={() => this.confirm()}>Potvrdit</button>
                                : <button className="btn btn-secondary" onClick={() => this.modify()}>Upravit</button>
                    }
                </div>
            </div>
        );
    }

    private renderEditForm() {
        return (
            <div className="special-bet-fields">
                <div className="special-bet-input-group">
                    <label className="special-bet-label" htmlFor="inputFirstTeamSelect">Tým</label>
                    <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.teamId ?? "default"} onChange={(event) => this.onTeamSelect(event.target)}>
                        <option key="default-id" value="default">Vyber tým</option>
                        {this.state.possible.map((team, index) => {
                            return <option key={team.id} value={team.id}>{team.name}</option>
                        })}
                    </select>
                </div>
                {!this.props.isWinnerBet && (
                    <div className="special-bet-input-group">
                        <label className="special-bet-label" htmlFor="inputStageSelect">Fáze</label>
                        <select className="custom-select" id="inputStageSelect" defaultValue={!!this.state.selection.stage ? this.state.selection.stage.toString() : "default"} onChange={(event) => this.onStageChange(event.target)}>
                            <option key="default-id" value="default">Vyber fázi turnaje</option>
                            <option key={TournamentStage.Group.toString()} value={TournamentStage.Group.toString()}>{this.stageToString(TournamentStage.Group)}</option>
                            <option key={TournamentStage.FirstRound.toString()} value={TournamentStage.FirstRound.toString()}>{this.stageToString(TournamentStage.FirstRound)}</option>
                            <option key={TournamentStage.Quarterfinal.toString()} value={TournamentStage.Quarterfinal.toString()}>{this.stageToString(TournamentStage.Quarterfinal)}</option>
                            <option key={TournamentStage.Semifinal.toString()} value={TournamentStage.Semifinal.toString()}>{this.stageToString(TournamentStage.Semifinal)}</option>
                            <option key={TournamentStage.Final.toString()} value={TournamentStage.Final.toString()}>{this.stageToString(TournamentStage.Final)}</option>
                            <option key={TournamentStage.Winner.toString()} value={TournamentStage.Winner.toString()}>{this.stageToString(TournamentStage.Winner)}</option>
                        </select>
                    </div>
                )}
            </div>
        );
    }

    private renderConfirmedBet() {
        return (
            <div className="special-bet-confirmed">
                <div className={`special-bet-value ${this.getClass()}`}>
                    <TeamCell team={this.state.bet.team} />
                </div>
                {!this.props.isWinnerBet && (
                    <div className="special-bet-value">
                        {this.stageToString(this.state.bet.stageBet)}
                    </div>
                )}
            </div>
        );
    }

    private getResultClass(): string {
        if (!this.props.showResult) return "";
        return this.state.bet.isCorrect ? "special-bet-result-success" : "special-bet-result-fail";
    }

    private getClass(): string {
        if (!this.props.showResult) return "";
        return this.state.bet.isCorrect ? "border-success" : "border-fail";
    }

    private stageToString(stage: TournamentStage) {
        switch (stage) {
            case TournamentStage.Group: return "Skupina";
            case TournamentStage.FirstRound: return "Osmifinále";
            case TournamentStage.Quarterfinal: return "Čtvrtfinále";
            case TournamentStage.Semifinal: return "Semifinále";
            case TournamentStage.Final: return "Finále";
            case TournamentStage.Winner: return "Vítěz";
        }
    }


    private onTeamSelect(event: any) {
        let selection = this.state.selection;
        selection.teamId = event.value;
        this.setState({ selection: selection });
    }

    private onStageChange(event: any) {
        let selection = this.state.selection;
        selection.stage = parseInt(event.value);
        this.setState({ selection: selection });
    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm(): Promise<void> {
        if (!this.state.selection.teamId || this.state.selection.teamId == 'default' || (this.state.selection.stage == undefined && !this.props.isWinnerBet)) {
            alert("Něco není vyplněné");
        } else {
            const bet = await getApi().uploadTeamPlaceBet(this.props.isWinnerBet ? TournamentStage.Winner : this.state.selection.stage, this.state.selection.teamId, this.props.isWinnerBet);
            this.setState({ isEditable: false, bet: bet })
        }

    }
}
