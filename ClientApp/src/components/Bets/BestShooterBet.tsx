import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { TopShooterBet } from "../../typings/index"
import { Loader } from '../Loader'

interface BetSelection {
    name: string
}

interface BestShooterBetState {
    bet: TopShooterBet;
    loading: boolean;
    isEditable: boolean;
    selection: BetSelection;
}

interface BestShooterBetProps {
    isReadOnly: boolean;
    showResult: boolean;
}

export class BestShooterBet extends React.Component<BestShooterBetProps, BestShooterBetState> {

    constructor(props: BestShooterBetProps) {
        super(props);
        this.state = {
            bet: {} as TopShooterBet,
            loading: true,
            isEditable: !this.props.isReadOnly,
            selection: {} as BetSelection
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.props.isReadOnly && !this.state.bet.id
                ? <div>Ještě sis nevsadil!</div>
                : this.renderBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        let userId = window.location.pathname.startsWith('/user/') ? window.location.pathname.substring(6) : undefined;
        const bet = await getApi().getShooterBet(userId);
        if (!bet.id) {
            this.setState({ loading: false });
        } else {
            this.setState({ bet: bet, loading: false, isEditable: false });
        }
    }

    private renderBet() {
        return (
            <div className="special-bet-card">
                <div className="special-bet-content">
                    {this.state.isEditable
                        ? <div className="special-bet-input-group">
                            <label className="special-bet-label" htmlFor="shootername">Příjmení hráče</label>
                            <input
                                type="text"
                                className="form-control"
                                id="shootername"
                                placeholder="Lewandowski / Mbappe / Messi..."
                                onChange={(event) => this.onChange(event.target)}
                            />
                          </div>
                        : <div className={`special-bet-value ${this.getClass()}`}>
                            {this.state.bet.shoterName}
                          </div>
                    }
                </div>
                <div className="special-bet-footer">
                    {this.props.showResult
                        ? <span className={`special-bet-result ${this.getResultClass()}`}>
                            Body: {this.state.bet.isCorrect ? this.state.bet.points : 0}
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

    private getResultClass(): string {
        if (!this.props.showResult) return "";
        return this.state.bet.isCorrect ? "special-bet-result-success" : "special-bet-result-fail";
    }

    private getClass(): string {
        if (!this.props.showResult) return "";
        return this.state.bet.isCorrect ? "border-success" : "border-fail";
    }

    private onChange(event: any) {
        const selection = this.state.selection;
        selection.name = event.value
        this.setState({ selection: selection})
    }

    private modify() {
        this.setState({ isEditable: true })
    }

    private async confirm(): Promise<void> {
        if (!this.state.selection.name) {
            alert("Něco není vyplněné");
            return;
        }
        const bet = await getApi().uploadShooterBet(this.state.selection.name);
        this.setState({ bet: bet, isEditable: false})
    }
}
