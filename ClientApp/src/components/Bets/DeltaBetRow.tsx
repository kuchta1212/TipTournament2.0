import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, DeltaBet, DeltaBetTeams } from "../../typings/index"
import './../../custom.css';
import { Loader } from '../Loader'
import { TeamDisplay } from '../TeamCell';

interface BetSelection {
    homeId: string;
    awayId: string;
}

interface DeltaBetState {
    bet: DeltaBet;
    loading: boolean;
    isEditable: boolean;
    teams: DeltaBetTeams,
    selection: BetSelection
}

interface DeltaBetProps {
    match: Match;
    isReadOnly: boolean;
    showResult: boolean;
    compact?: boolean;
    displayOnly?: boolean;
    onBetConfirmed?: () => void;
}

export class DeltaBetRow extends React.Component<DeltaBetProps, DeltaBetState> {

    constructor(props: DeltaBetProps) {
        super(props);
        this.state = {
            bet: {} as DeltaBet,
            loading: true,
            isEditable: !this.props.isReadOnly,
            teams: {} as DeltaBetTeams,
            selection: {} as BetSelection
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        if (this.props.displayOnly) {
            return <div>{this.renderDisplayOnly()}</div>;
        }

        let contents = this.state.loading
            ? <Loader />
            : this.props.isReadOnly && !this.state.bet.homeTeamBet
                ? <div className="delta-bet-card delta-bet-empty">Ještě sis nevsadil!</div>
                : this.renderDeltaBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private renderDisplayOnly() {
        const home = this.props.match.home;
        const away = this.props.match.away;
        const hasTeams = !!home && !!away;

        if (this.props.compact) {
            return (
                <div className="delta-bet-compact">
                    {hasTeams ? (
                        <>
                            <div className="delta-compact-team">
                                <img src={process.env.PUBLIC_URL + home.iconPath} width="18" height="18" alt={home.name} />
                                <span>{home.name}</span>
                            </div>
                            <div className="delta-compact-team">
                                <img src={process.env.PUBLIC_URL + away.iconPath} width="18" height="18" alt={away.name} />
                                <span>{away.name}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="delta-compact-team delta-compact-tbd">TBD</div>
                            <div className="delta-compact-team delta-compact-tbd">TBD</div>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="delta-bet-card">
                <div className="delta-bet-teams">
                    <div className="delta-bet-team-slot">
                        {home ? <TeamDisplay team={home} /> : <span>TBD</span>}
                    </div>
                    <span className="delta-bet-vs">vs</span>
                    <div className="delta-bet-team-slot">
                        {away ? <TeamDisplay team={away} /> : <span>TBD</span>}
                    </div>
                </div>
            </div>
        );
    }

    private async getData() {
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        // Call getTeamsForDeltaBet first — it triggers backend autofill for R32
        const teams = await getApi().getTeamsForDeltaBet(this.props.match.id, this.props.match.stage, userId);
        // Re-fetch bet AFTER autofill may have created/updated it
        const bet = await getApi().getDeltaBet(this.props.match.id, userId);
        const hasTeams = teams.possibleHomeTeams?.some((t: any) => !!t.id) && teams.possibleAwayTeams?.some((t: any) => !!t.id);
        if (!bet.id || (!bet.homeTeamBet || !bet.awayTeamBet)) {
            this.setState({ loading: false, teams: teams, isEditable: !this.props.isReadOnly && hasTeams });
        } else {
            this.setState({ bet: bet, loading: false, isEditable: false, teams: teams});
        }
    }

    private renderDeltaBet() {
        if (this.props.compact) {
            return this.renderCompact();
        }
        return this.renderFull();
    }

    private renderCompact() {
        const hasBet = !!this.state.bet.homeTeamBet && !!this.state.bet.awayTeamBet;
        if (!hasBet && this.state.isEditable) {
            return this.renderCompactEditable();
        }
        return (
            <div className={`delta-bet-compact ${this.getCompactResultClass()}`}
                onClick={hasBet && this.state.isEditable === false && !this.props.showResult && !this.props.isReadOnly ? () => this.modify() : undefined}
                style={hasBet && !this.state.isEditable && !this.props.showResult && !this.props.isReadOnly ? { cursor: 'pointer' } : undefined}
            >
                {hasBet ? (
                    <>
                        <div className={`delta-compact-team ${this.getTeamClass(1)}`}>
                            <img src={process.env.PUBLIC_URL + this.state.bet.homeTeamBet.iconPath} width="18" height="18" alt={this.state.bet.homeTeamBet.name} />
                            <span>{this.state.bet.homeTeamBet.name}</span>
                        </div>
                        <div className={`delta-compact-team ${this.getTeamClass(2)}`}>
                            <img src={process.env.PUBLIC_URL + this.state.bet.awayTeamBet.iconPath} width="18" height="18" alt={this.state.bet.awayTeamBet.name} />
                            <span>{this.state.bet.awayTeamBet.name}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="delta-compact-team delta-compact-tbd">TBD</div>
                        <div className="delta-compact-team delta-compact-tbd">TBD</div>
                    </>
                )}
                {this.props.showResult && hasBet && (
                    <div className={`delta-compact-points ${this.getPointsBadgeClass()}`}>
                        {this.getTotalPointsWithBonus()}b
                    </div>
                )}
            </div>
        );
    }

    private renderCompactEditable() {
        const hasTeams = this.state.teams.possibleHomeTeams?.some((t: any) => !!t.id);
        return (
            <div className="delta-bet-compact delta-compact-editable">
                {hasTeams ? (
                    <>
                        <select
                            className="delta-compact-select"
                            defaultValue="default"
                            onChange={(e) => this.onSelect(e.target as any)}
                            id="inputFirstTeamSelect"
                        >
                            <option value="default">Tým 1</option>
                            {this.state.teams.possibleHomeTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                        <select
                            className="delta-compact-select"
                            defaultValue="default"
                            onChange={(e) => this.onSelect(e.target as any)}
                            id="inputSecondTeamSelect"
                        >
                            <option value="default">Tým 2</option>
                            {this.state.teams.possibleAwayTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary btn-sm delta-compact-confirm" onClick={() => this.confirm()}>OK</button>
                    </>
                ) : (
                    <>
                        <div className="delta-compact-team delta-compact-tbd">TBD</div>
                        <div className="delta-compact-team delta-compact-tbd">TBD</div>
                    </>
                )}
            </div>
        );
    }

    private renderFull() {
        return (
            <div className="delta-bet-card">
                <div className="delta-bet-teams">
                    <div className={`delta-bet-team-slot ${this.getTeamClass(1)}`}>
                        {this.state.isEditable
                            ? <div className="special-bet-input-group">
                                <label className="special-bet-label">Tým 1</label>
                                <select className="custom-select" id="inputFirstTeamSelect" defaultValue={this.state.selection.homeId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                    <option key="default-id" value="default">Vyber tým</option>
                                    {this.state.teams.possibleHomeTeams.map((team, index) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </select>
                              </div>
                            : (this.state.bet.homeTeamBet && <TeamDisplay team={this.state.bet.homeTeamBet} />)
                        }
                    </div>
                    <span className="delta-bet-vs">vs</span>
                    <div className={`delta-bet-team-slot ${this.getTeamClass(2)}`}>
                        {this.state.isEditable
                            ? <div className="special-bet-input-group">
                                <label className="special-bet-label">Tým 2</label>
                                <select className="custom-select" id="inputSecondTeamSelect" defaultValue={this.state.selection.awayId ?? "default"} onChange={(event) => this.onSelect(event.target)}>
                                    <option key="default-id" value="default">Vyber tým</option>
                                    {this.state.teams.possibleAwayTeams.map((team, index) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </select>
                              </div>
                            : (this.state.bet.awayTeamBet && <TeamDisplay team={this.state.bet.awayTeamBet} />)
                        }
                    </div>
                </div>
                {(this.state.bet.result?.additionalResult && (
                    <div className="delta-bet-additional">
                        {this.state.bet.result?.additionalResult?.isHomeTeamCorrect && (
                            <span className="delta-additional-badge">Dodatečné body za postup přes jinou část pavouka</span>
                        )}
                        {this.state.bet.result?.additionalResult?.isAwayTeamCorrect && (
                            <span className="delta-additional-badge">Dodatečné body za postup přes jinou část pavouka</span>
                        )}
                    </div>
                ))}
                <div className="delta-bet-footer">
                    {this.props.showResult
                        ? <span className={`special-bet-result ${this.getResultBadgeClass()}`}>
                            Body: {this.getTotalPointsWithBonus()}
                            {this.state.bet.dixitBonus > 0 && <span className="dixit-bonus"> (dixit +{this.state.bet.dixitBonus})</span>}
                          </span>
                        : this.props.isReadOnly
                            ? null
                            : this.state.isEditable
                                ? <button className="btn btn-primary" onClick={() => this.confirm()}>Potvrdit</button>
                                : this.state.bet.homeTeamBet
                                    ? <button className="btn btn-secondary" onClick={() => this.modify()}>Upravit</button>
                                    : null
                    }
                </div>
            </div>
        );
    }

    private getTotalPoints(): number {
        return (this.state.bet.result?.points ?? 0) + (this.state.bet.result?.additionalResult?.points ?? 0);
    }

    private getTotalPointsWithBonus(): number {
        return this.getTotalPoints() + (this.state.bet.dixitBonus ?? 0);
    }

    private getCompactResultClass(): string {
        if (!this.props.showResult || !this.state.bet.result) return "";
        const points = this.getTotalPoints();
        if (points >= 4) return "delta-compact-success";
        if (points > 0) return "delta-compact-partial";
        return "delta-compact-fail";
    }

    private getPointsBadgeClass(): string {
        if (!this.props.showResult || !this.state.bet.result) return "";
        const points = this.getTotalPoints();
        if (points >= 4) return "special-bet-result-success";
        if (points > 0) return "delta-points-partial";
        return "special-bet-result-fail";
    }

    private getResultBadgeClass(): string {
        if (!this.props.showResult || !this.state.bet.result) return "";
        const points = this.getTotalPoints();
        if (points >= 4) return "special-bet-result-success";
        if (points > 0) return "delta-points-partial";
        return "special-bet-result-fail";
    }

    private getTeamClass(order: number): string {
        if (!this.props.showResult || !this.state.bet.result) return "";
        switch (order) {
            case 1:
                return this.state.bet.result.isHomeTeamCorrect ? "border-success" : "border-fail";
            case 2:
                return this.state.bet.result.isAwayTeamCorrect ? "border-success" : "border-fail";
        }
        return "";
    }

    private onSelect(event: any) {
        let selection = this.state.selection;
        let correct = false;
        switch (event.id) {
            case "inputFirstTeamSelect":
                if (event.value !== selection.awayId) {
                    selection.homeId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;

            case "inputSecondTeamSelect":
                if (event.value !== selection.homeId) {
                    selection.awayId = event.value;
                    correct = true;
                } else {
                    correct = false;
                }
                break;
        }

        if (correct) {
            this.setState({ selection: selection });
        } else {
            event.value = "default";
        }

    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm() : Promise<void> {
        if (this.validateSelection(this.state.selection)) {
            const bet = this.toBet(this.state.selection);

            await getApi().uploadDeltaBet(bet, this.props.match.id);

            this.setState({ isEditable: false, bet: bet });
            this.props.onBetConfirmed?.();
        }
    }

    private validateSelection(selection: BetSelection): boolean {
        if (!!selection.homeId && !!selection.awayId) {
            return true;
        }

        alert("Něco není vyplněné");
        return false;
    }

    private toBet(selection: BetSelection): DeltaBet {
        let db = this.state.bet;
        db.homeTeamBet = this.state.teams.possibleHomeTeams.filter(t => t.id == selection.homeId)[0];
        db.awayTeamBet = this.state.teams.possibleAwayTeams.filter(t => t.id == selection.awayId)[0];
        return db;
    }
}
