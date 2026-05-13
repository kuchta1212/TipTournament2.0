import * as React from 'react';
import { User } from "../../typings/index"
import { UserRow } from "./UserRow"
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
            <div>
                <h1 id="tabelLabel" className="header">Pořadí</h1>
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
            <div className="ranking-table-scroll">
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th>Jméno</th>
                            <th className="detail-col"><a href="#" onClick={(event) => this.sortingClick(SortBy.AlfaBeta)}>α+β</a></th>
                            <th className="detail-col"><a href="#" onClick={(event) => this.sortingClick(SortBy.Gamma)}>γ</a></th>
                            <th className="detail-col"><a href="#" onClick={(event) => this.sortingClick(SortBy.Delta)}>δ</a></th>
                            <th className="detail-col"><a href="#" onClick={(event) => this.sortingClick(SortBy.Lambda)}>λ</a></th>
                            <th className="detail-col"><a href="#" onClick={(event) => this.sortingClick(SortBy.Omikron)}>ο</a></th>
                            <th><a href="#" onClick={(event) => this.sortingClick(SortBy.Total)}>Σ</a></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getSortedData().map((user, index) => (
                            <tr key={user.userName} className={this.props.currentUser === user.id ? 'ranking-current-user' : ''}>
                                <UserRow user={user} index={index} currentUser={this.props.currentUser} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    private sortingClick(sortBy: SortBy) {
        this.setState({ sortBy: sortBy });
    }

    private getSortedData(): User[] {
        switch (this.state.sortBy) {
            case SortBy.Total:
                return this.state.ranking.sort((u1, u2) => u2.totalPoints - u1.totalPoints);
            case SortBy.AlfaBeta:
                return this.state.ranking.sort((u1, u2) => u2.alfaPoints - u1.alfaPoints);
            case SortBy.Gamma:
                return this.state.ranking.sort((u1, u2) => u2.gamaPoints - u1.gamaPoints);
            case SortBy.Delta:
                return this.state.ranking.sort((u1, u2) => u2.deltaPoints - u1.deltaPoints);
            case SortBy.Lambda:
                return this.state.ranking.sort((u1, u2) => u2.lambdaPoints - u1.lambdaPoints);
            case SortBy.Omikron:
                return this.state.ranking.sort((u1, u2) => u2.omikronPoints - u1.omikronPoints);
            default:
                return this.state.ranking;
        }
    }
}
