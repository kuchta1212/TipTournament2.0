import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { TopShooterBet } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { TeamCell } from '../TeamCell';

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
                : this.renderDeltaBet();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const bet = await getApi().getShooterBet();
        if (!bet.id) {
            this.setState({ loading: false });
        } else {
            this.setState({ bet: bet, loading: false, isEditable: false });
        }
    }

    private renderDeltaBet() {
        return (
            <div className="groupItem">
                <Table className="table table-striped opacity-table">
                    <tbody>
                        <tr>
                            <td>
                                {this.state.isEditable
                                    ?
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon3">Přijímení hráče</span>
                                        </div>
                                        <input type="text" className="form-control" id="shootername" aria-describedby="basic-addon3" placeholder="Lewandowski/Mbappe/Messi...." onChange={(event) => this.onChange(event.target)}/>
                                    </div>
                                    : <td className={this.getClass()}>{this.state.bet.shoterName}</td>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {
                                    this.props.showResult
                                        ? <tr className={this.getBackgroundClass()}><td>Body:</td><td>{this.state.bet.isCorrect ? this.state.bet.points : 0}</td></tr>
                                        : this.props.isReadOnly
                                            ? <div />
                                            : this.state.isEditable
                                                ? <button className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                                    : <button className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    private getBackgroundClass(): string {
        if (!this.props.showResult) {
            return "";
        }

        return this.state.bet.isCorrect
            ? "bg-success"
            : "bg-danger";
    }

    private getClass(): string {
        if (!this.props.showResult) {
            return "";
        }

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

