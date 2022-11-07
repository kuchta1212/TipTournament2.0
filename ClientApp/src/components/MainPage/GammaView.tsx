import * as React from 'react';
import { Match, Bet, Group, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import { GroupTable } from '../Bets/GroupTable';

interface GammaViewState {
    groups: Group[]
    loading: boolean,
}

interface GammaViewProps {

}

export class GammaView extends React.Component<GammaViewProps, GammaViewState> {

    constructor(props: GammaViewProps) {
        super(props);
        this.state = {
            groups: {} as Group[],
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
        const groups = await getApi().getGroups();
        this.setState({ groups: groups, loading: false });
    }

    private renderGroupsBets() {
        return (
            <div className="groupList">
                {this.state.groups.map((group, index) => {
                    return <GroupTable key={group.id} group={group} isReadOnly={true} showResult={true} />
                })}
            </div>
        );
    }
}