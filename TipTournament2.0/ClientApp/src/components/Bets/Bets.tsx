import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from './../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from './../api-authorization/AuthorizeService'

interface BetsState {
    matches: Match[],
    bets: IDictionary<Bet[]>,
    loading: boolean,
    afterLimit: boolean
}

interface BetsProps {
    users: User[] | undefined,
}

export class Bets extends React.Component<BetsProps, BetsState> {

    constructor(props: BetsProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            bets: new Dictionary(),
            loading: true,
            afterLimit: new Date() > new Date("2021-06-11 21:00")
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderBetsTable(this.state.matches, this.state.bets);

        return (
            <div>
                <h1 id="tabelLabel" >Sázky</h1>
                {this.showWarningMessage()}
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches();
        let userBets: IDictionary<Bet[]> = !!this.props.users ? await this.getBetsForMultipleUsers(this.props.users) : await this.getBetsForCurrentUser();
        const currentUser = await authService.getUser();
        const isDad = currentUser["sub"] == "f99e0601-2b6e-449c-b640-16f15c28ae3b";
        this.setState({ matches: matches, bets: userBets, loading: false, afterLimit: !isDad});
    }

    private async getBetsForCurrentUser(): Promise<IDictionary<Bet[]>> {
        const bets = await getApi().getBets(undefined);
        let userBets = this.state.bets;
        userBets.put("current", bets)
        return userBets;
    }

    private async getBetsForMultipleUsers(users: User[]): Promise<IDictionary<Bet[]>> {
        let bets = await getApi().getBetsForUsers(users);

        return Dictionary.convert<Bet[]>(bets);
    }

    private renderBetsTable(matches: Match[], userBets: IDictionary<Bet[]>) {
        return !!this.props.users
            ? this.renderBetsTableForMultipleUsers(matches, userBets)
            : this.renderBetsTableForCurrentUser(matches, userBets);
    }

    private renderBetsTableForMultipleUsers(matches: Match[], userBets: IDictionary<Bet[]>) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {userBets.getKeys().map((userId) => {
                            return (<th key={userId}>{this.props.users?.find(u => u.id === userId)?.userName}</th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={match.id}>
                            <MatchBetRow match={match} bets={this.getBetsRow(userBets, match)} isReadOnly={!!this.props.users || this.state.afterLimit} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }

    private getBetsRow(userBets: IDictionary<Bet[]>, match: Match): Bet[] {
        let bets = userBets.getValues().reduce((acc, cur) => {
            let bet = cur.find(b => !!b.match && b.match.id == match.id)
            if (!!bet) {
                acc.push(bet);
            }
            return acc;
        },
        [] as Bet[]);

        return bets;
    }

    private renderBetsTableForCurrentUser(matches: Match[], userBets: IDictionary<Bet[]>) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={match.id}>
                            <MatchBetRow match={match} bets={this.getBetsRow(userBets, match)} isReadOnly={!!this.props.users || this.state.afterLimit} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }

    private showWarningMessage() {
        return !!this.props.users
            ? (<div />)
            : this.state.afterLimit
                ? <WarningNotification text="Prošvihl si to! Sázkám, už je konec." type={WarningTypes.error} />
                : <WarningNotification text="Sázky se uzavřou s prvním zápasem. Takže 11.6 v 21:00." type={WarningTypes.warning} />
    }
}

