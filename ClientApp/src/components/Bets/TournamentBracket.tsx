import * as React from 'react';
import { Match, TournamentStage } from "../../typings/index";
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import './../../custom.css';

// Bracket match ordering (derived from appsettings DeltaStage.Next config)
// Top-to-bottom order ensures connected matches are adjacent
const R16_ORDER = ['match_39', 'match_37', 'match_41', 'match_42', 'match_43', 'match_44', 'match_40', 'match_38'];
const QF_ORDER = ['match_45', 'match_46', 'match_47', 'match_48'];
const SF_ORDER = ['match_49', 'match_50'];
const FINAL_ORDER = ['match_51'];

interface TournamentBracketProps {
    isReadOnly: boolean;
    showResult: boolean;
}

interface TournamentBracketState {
    loading: boolean;
    r16Matches: Match[];
    qfMatches: Match[];
    sfMatches: Match[];
    finalMatches: Match[];
}

export class TournamentBracket extends React.Component<TournamentBracketProps, TournamentBracketState> {
    constructor(props: TournamentBracketProps) {
        super(props);
        this.state = {
            loading: true,
            r16Matches: [],
            qfMatches: [],
            sfMatches: [],
            finalMatches: []
        };
    }

    public componentDidMount() {
        this.getData();
    }

    private async getData() {
        const [r16, qf, sf, final_] = await Promise.all([
            getApi().getMatches(TournamentStage.FirstRound),
            getApi().getMatches(TournamentStage.Quarterfinal),
            getApi().getMatches(TournamentStage.Semifinal),
            getApi().getMatches(TournamentStage.Final)
        ]);

        this.setState({
            loading: false,
            r16Matches: this.sortMatches(r16, R16_ORDER),
            qfMatches: this.sortMatches(qf, QF_ORDER),
            sfMatches: this.sortMatches(sf, SF_ORDER),
            finalMatches: this.sortMatches(final_, FINAL_ORDER)
        });
    }

    private sortMatches(matches: Match[], order: string[]): Match[] {
        const matchMap = new Map<string, Match>();
        matches.forEach(m => matchMap.set(m.id, m));
        return order.map(id => matchMap.get(id)).filter(Boolean) as Match[];
    }

    public render() {
        if (this.state.loading) {
            return <Loader />;
        }

        return (
            <div>
                {/* Desktop bracket */}
                <div className="bracket-container">
                    <div className="bracket">
                        {this.renderRound('Osmifinále', this.state.r16Matches, 'r16')}
                        <div className="bracket-connector-col bracket-connector-r16">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="bracket-connector-pair">
                                    <div className="bracket-connector-top"></div>
                                    <div className="bracket-connector-bottom"></div>
                                </div>
                            ))}
                        </div>
                        {this.renderRound('Čtvrtfinále', this.state.qfMatches, 'qf')}
                        <div className="bracket-connector-col bracket-connector-qf">
                            {[0, 1].map(i => (
                                <div key={i} className="bracket-connector-pair">
                                    <div className="bracket-connector-top"></div>
                                    <div className="bracket-connector-bottom"></div>
                                </div>
                            ))}
                        </div>
                        {this.renderRound('Semifinále', this.state.sfMatches, 'sf')}
                        <div className="bracket-connector-col bracket-connector-sf">
                            <div className="bracket-connector-pair">
                                <div className="bracket-connector-top"></div>
                                <div className="bracket-connector-bottom"></div>
                            </div>
                        </div>
                        {this.renderRound('Finále', this.state.finalMatches, 'final')}
                    </div>
                </div>

                {/* Mobile stacked view */}
                <div className="bracket-mobile">
                    {this.renderMobileRound('Osmifinále', this.state.r16Matches)}
                    {this.renderMobileRound('Čtvrtfinále', this.state.qfMatches)}
                    {this.renderMobileRound('Semifinále', this.state.sfMatches)}
                    {this.renderMobileRound('Finále', this.state.finalMatches)}
                </div>
            </div>
        );
    }

    private renderRound(title: string, matches: Match[], roundClass: string) {
        return (
            <div className={`bracket-round bracket-round-${roundClass}`}>
                <div className="bracket-round-title">{title}</div>
                <div className="bracket-round-matches">
                    {matches.map(match => (
                        <div key={match.id} className="bracket-match-slot">
                            <DeltaBetRow
                                match={match}
                                isReadOnly={this.props.isReadOnly}
                                showResult={this.props.showResult}
                                compact={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private renderMobileRound(title: string, matches: Match[]) {
        return (
            <div className="bracket-mobile-round">
                <h6 className="bracket-mobile-title">{title}</h6>
                <div className="groupList">
                    {matches.map(match => (
                        <DeltaBetRow
                            key={match.id}
                            match={match}
                            isReadOnly={this.props.isReadOnly}
                            showResult={this.props.showResult}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
