import * as React from 'react';
import { User } from "../../typings/index"
import { UserRow } from "./UserRow"
import { Table } from 'reactstrap';

interface RankingProps {
    ranking: User[]
}

export class Ranking extends React.Component<RankingProps> {

    constructor(props: RankingProps) {
        super(props);
    }

    public render() {
        let contents = this.renderRanking(this.props.ranking)

        return (
            <div className="col-4">
                <h1 id="tabelLabel" >Pořadí</h1>
                {contents}
            </div>
        );
    }

    private renderRanking(data: User[]) {
        return (
            <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={user.userName}>
                            <UserRow user={user} index={index} />
                        </tr>)
                    )}
                </tbody>
                </Table>
        );
    }
}

