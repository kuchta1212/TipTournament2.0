import * as React from 'react';
import { User } from "../../typings/index"
import { UserRow } from "./UserRow"
import { Table } from 'reactstrap';
import { getApi } from "../api/ApiFactory"
import { Loader } from './../Loader'

enum SortBy {
    Total,
    AlfaBeta,
    Gamma,
    Delta,
    Lambda,
    Omikron
}

interface RankingProps {
    currentUser: string
}

interface RankingState {
    ranking: User[],
    loading: boolean,
    sortBy: SortBy;

}

export class Ranking extends React.Component<RankingProps, RankingState> {

    constructor(props: RankingProps) {
        super(props);
        this.state = {
            ranking: {} as User[],
            loading: true,
            sortBy: SortBy.Total
        };
    }


    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderRanking();

        return (
            <div className="col-4">
                <h1 id="tabelLabel" >Pořadí</h1>
                {contents}
            </div>
        );
    }

    private async getData() {
        const users = await getApi().getUsers(true);
        this.setState({ ranking: users, loading: false });
    }

    private renderRanking() {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                    <td>Jméno</td>
                    <td><a href="#" onClick={(event) => this.sortingClick(SortBy.AlfaBeta)}>α+β</a></td>
                    <td><a href="#" onClick={(event) => this.sortingClick(SortBy.Gamma)}>γ</a></td>
                    <td><a href="#" onClick={(event) => this.sortingClick(SortBy.Delta)}>δ</a></td>
                    <td><a href="#" onClick={(event) => this.sortingClick(SortBy.Lambda)}>λ</a></td>
                    <td><a href="#" onClick={(event) => this.sortingClick(SortBy.Omikron)}>ο</a></td>
                    <td className="font-weight-bold"><a href="#" onClick={(event) => this.sortingClick(SortBy.Omikron)}>Σ</a></td>
                </thead>
                <tbody>
                    {this.getSortedData().map((user, index) => (
                        <tr key={user.userName}>
                            <UserRow user={user} index={index} currentUser={this.props.currentUser} />
                        </tr>)
                    )}
                </tbody>
                </Table>
        );
    }

    private sortingClick(sortBy: SortBy) {
        this.setState({ sortBy: sortBy });
    }

    private getSortedData(): User[] {
        switch (this.state.sortBy) {
            case SortBy.Total:
                return this.state.ranking.sort((u1, u2) => { return u1.totalPoints >= u2.totalPoints ? -1 : 1 });
            case SortBy.AlfaBeta:
                return this.state.ranking.sort((u1, u2) => { return u1.alfaPoints >= u2.alfaPoints ? -1 : 1 });
            case SortBy.Gamma:
                return this.state.ranking.sort((u1, u2) => { return u1.gamaPoints >= u2.gamaPoints ? -1 : 1 });
            case SortBy.Delta:
                return this.state.ranking.sort((u1, u2) => { return u1.deltaPoints >= u2.deltaPoints ? -1 : 1 });
            case SortBy.Lambda:
                return this.state.ranking.sort((u1, u2) => { return u1.lambdaPoints >= u2.lambdaPoints ? -1 : 1 });
            case SortBy.Omikron:
                return this.state.ranking.sort((u1, u2) => { return u1.omikronPoints >= u2.omikronPoints ? -1 : 1 });
            default:
                return this.state.ranking;
        }
    }
}

