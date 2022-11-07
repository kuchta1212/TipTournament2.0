import * as React from 'react';
import { Match, Bet, Group, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import { GroupTable } from '../Bets/GroupTable';
import { DeltaBetRow } from '../Bets/DeltaBetRow';

interface DeltaViewState {
    matches: Match[]
    loading: boolean,
}

interface DeltaViewProps {
    stage: TournamentStage;
}

export class DeltaView extends React.Component<DeltaViewProps, DeltaViewState> {

    constructor(props: DeltaViewProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            loading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderBetsTable();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(this.props.stage);
        this.setState({ matches: matches, loading: false });
    }

    private renderBetsTable() {
        return (
            <div>
                <div className="groupList">
                    {this.state.matches.map((match, index) => {
                        return <DeltaBetRow key={match.id} match={match} isReadOnly={true} showResult={true} />
                    })}
                </div>
            </div>
        );
    }
}