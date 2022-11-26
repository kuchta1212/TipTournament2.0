import * as React from 'react';
import { Match, Bet, Group, TournamentStage, User, GroupBet } from "../../typings/index"
import { Table } from 'reactstrap';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import { GroupTable } from '../Bets/GroupTable';
import { Dictionary, IDictionary } from '../../typings/Dictionary';

interface GroupBetsViewState {
    groups: IDictionary<IDictionary<GroupBet>>,
    loading: boolean,
}

interface GroupBetsViewProps {
    users: User[] | undefined
}

export class GroupBetsView extends React.Component<GroupBetsViewProps, GroupBetsViewState> {

    constructor(props: GroupBetsViewProps) {
        super(props);
        this.state = {
            groups: {} as IDictionary<IDictionary<GroupBet>>,
            loading: true,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderGroupsBets();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const groups = await getApi().getGroupBetsForUsers(this.props.users);
        this.setState({ groups: groups, loading: false });
    }

    private renderGroupsBets() {
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
                            <MatchBetRow match={match} bets={this.getBetsRow(userBets, match)} isReadOnly={!!this.props.users} />
                        </tr>)
                    )}
                </tbody>
            </Table>
        );
    }
}