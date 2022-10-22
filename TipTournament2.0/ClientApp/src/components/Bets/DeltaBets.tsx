import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader'
import { Dictionary, IDictionary } from "../../typings/Dictionary"

interface DeltaBetsState {
    matches: Match[],
    isReady: boolean,
    loading: boolean,
}

interface DeltaBetsProps {
   stage: TournamentStage
}

export class DeltaBets extends React.Component<DeltaBetsProps, DeltaBetsState> {

    constructor(props: DeltaBetsProps) {
        super(props);
        this.state = {
            matches: {} as Match[],
            isReady: false,
            loading: true,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.isReady
                ? this.renderBetsTable()
                : this.renderMessage();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const isReady = await getApi().isReady(this.props.stage);
        const matches = await getApi().getMatches(this.props.stage);
        this.setState({ matches: matches, loading: false, isReady: isReady });
    }

    private renderBetsTable() {
        return (
            <div className="groupList">
                {this.state.matches.map((match, index) => {
                    return <DeltaBetRow key={match.id} match={match} />
                })}
            </div>
        );
    }

    private renderMessage() {
        return (
            <div>
                Prosím nejdříve vyplň sázky z dřívějšího kola.
                V případě, že jsou všechny vyplněny, zkus obnovit stránku.
            </div>
            )
    }
}

