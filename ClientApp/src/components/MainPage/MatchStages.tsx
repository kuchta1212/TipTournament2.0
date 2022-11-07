import * as React from 'react';
import { Match, Bet, UpdateStatus, TournamentStage } from "../../typings/index"
import { Table } from 'reactstrap';
import { MainRow } from './MainRow';
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'


interface MatchStagesProps {
    stage: TournamentStage;
    isActive: boolean
}

interface MatchStagesState {
    matches: Match[],
    bets: Bet[];
    loading: boolean;
}

export class MatchStages extends React.Component<MatchStagesProps, MatchStagesState> {

    constructor(props: MatchStagesProps) {
        super(props);
        this.state = {
            matches: [],
            bets: [],
            loading: true,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.state.matches.every(m => !!m.home && !!m.away)
                ? this.renderMatchTable()
                : this.renderMesage();

        return (
            <div className="col">
                {contents}
            </div>
        );
    }

    private async getData() {
        const matches = await getApi().getMatches(this.props.stage);
        const bets = await getApi().getBets(undefined);
        this.setState({ matches: matches, bets: bets, loading: false });
    }

    private renderMatchTable() {
        return (
                <Table className="table table-striped opacity-table">
                <thead>
                </thead>
                <tbody>
                    {this.state.matches.map((match, index) => (
                        <tr key={match.id}>
                            <MainRow match={match} bet={this.getBet(match)} />
                        </tr>)
                    )}
                </tbody>
                </Table>
        );
    }

    private renderMesage() {
        return (
            <div>
                Zatím zde nejsou žádné zápasy. 
            </div>
        );
    }

    private getBet(match: Match): Bet | undefined {
       return this.state.bets.find(b => b.match.id == match.id);
    }
}

