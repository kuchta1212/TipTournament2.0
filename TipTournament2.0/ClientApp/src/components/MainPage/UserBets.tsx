import * as React from 'react';
import { Bet } from "../../typings/index"
import { UserBetRow } from "./UserBetRow"
import { Table } from 'reactstrap';

interface UserBetsProps {
    bets: Bet[]
}

export class UserBets extends React.Component<UserBetsProps> {

    constructor(props: UserBetsProps) {
        super(props);
    }

    public render() {
        let contents = this.renderBetsTable(this.props.bets)

        return (
            <div>
                <h1 id="tabelLabel" >Sázky</h1>
                {contents}
            </div>
        );
    }

    private renderBetsTable(data: Bet[]) {
        return (
            <Table>
                <thead>
                </thead>
                <tbody>
                    {data.map((bet, index) => (
                        <tr key={bet.id}>
                            <UserBetRow bet={bet} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }
}

