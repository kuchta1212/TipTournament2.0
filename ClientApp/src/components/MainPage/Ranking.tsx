import * as React from 'react';
import { User } from "../../typings/index"
import { UserRow } from "./UserRow"
import { Table } from 'reactstrap';
import { getApi } from "../api/ApiFactory"
import { Loader } from './../Loader'

interface RankingProps {
    currentUser: string
}

interface RankingState {
    ranking: User[],
    loading: boolean

}

export class Ranking extends React.Component<RankingProps, RankingState> {

    constructor(props: RankingProps) {
        super(props);
        this.state = {
            ranking: {} as User[],
            loading: true
        };
    }


    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderRanking(this.state.ranking);

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

    private renderRanking(data: User[]) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                    <td>Jméno</td>
                    <td>α+β</td>
                    <td>γ</td>
                    <td>δ</td>
                    <td>λ</td>
                    <td>ο</td>
                    <td className="font-weight-bold">Σ</td>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={user.userName}>
                            <UserRow user={user} index={index} currentUser={this.props.currentUser} />
                        </tr>)
                    )}
                </tbody>
                </Table>
        );
    }
}

