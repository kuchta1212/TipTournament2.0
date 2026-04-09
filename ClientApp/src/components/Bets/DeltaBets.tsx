import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, TournamentStage } from "../../typings/index"
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader'

interface DeltaBetsState {
    matches: Match[],
    loading: boolean,
}

interface DeltaBetsProps {
    stage: TournamentStage,
    isReadOnly: boolean
}

export class DeltaBets extends React.Component<DeltaBetsProps, DeltaBetsState> {

    constructor(props: DeltaBetsProps) {
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
                        return <DeltaBetRow key={match.id} match={match} isReadOnly={this.props.isReadOnly} showResult={false} />
                    })}
                </div>
            </div>
        );
    }
}
