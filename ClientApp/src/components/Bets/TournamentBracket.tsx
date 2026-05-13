import * as React from 'react';
import { Match, TournamentStage } from "../../typings/index";
import { DeltaBetRow } from './DeltaBetRow';
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import './../../custom.css';

// Bracket match ordering (derived from appsettings DeltaStage.Next config)
// Top-to-bottom order ensures connected matches are adjacent
const R32_ORDER = ['match_77', 'match_78', 'match_76', 'match_73', 'match_74', 'match_75', 'match_79', 'match_80', 'match_88', 'match_86', 'match_82', 'match_81', 'match_83', 'match_84', 'match_85', 'match_87'];
const R16_ORDER = ['match_89', 'match_90', 'match_91', 'match_92', 'match_93', 'match_94', 'match_95', 'match_96'];
const QF_ORDER = ['match_97', 'match_98', 'match_99', 'match_100'];
const SF_ORDER = ['match_101', 'match_102'];
const FINAL_ORDER = ['match_104'];

interface TournamentBracketProps {
    isReadOnly: boolean;
    showResult: boolean;
}

interface TournamentBracketState {
    loading: boolean;
    r32Matches: Match[];
    r16Matches: Match[];
    qfMatches: Match[];
    sfMatches: Match[];
    finalMatches: Match[];
    refreshKey: number;
    mobileExpanded: { [key: string]: boolean };
}

export class TournamentBracket extends React.Component<TournamentBracketProps, TournamentBracketState> {
    constructor(props: TournamentBracketProps) {
        super(props);
        this.state = {
            loading: true,
            r32Matches: [],
            r16Matches: [],
            qfMatches: [],
            sfMatches: [],
            finalMatches: [],
            refreshKey: 0,
            mobileExpanded: { r32: false, r16: true, qf: false, sf: false, final: false }
        };
    }

    private toggleMobile(key: string) {
        this.setState(prev => ({
            mobileExpanded: { ...prev.mobileExpanded, [key]: !prev.mobileExpanded[key] }
        }));
    }

    public componentDidMount() {
        this.getData();
    }

    private async getData() {
        const [r32, r16, qf, sf, final_] = await Promise.all([
            getApi().getMatches(TournamentStage.RoundOf32),
            getApi().getMatches(TournamentStage.FirstRound),
            getApi().getMatches(TournamentStage.Quarterfinal),
            getApi().getMatches(TournamentStage.Semifinal),
            getApi().getMatches(TournamentStage.Final)
        ]);

        this.setState({
            loading: false,
            r32Matches: this.sortMatches(r32, R32_ORDER),
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
                        {this.renderRound('1. kolo playoff', this.state.r32Matches, 'r32', undefined, true)}
                        <div className="bracket-connector-col bracket-connector-r32">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                                <div key={i} className="bracket-connector-pair">
                                    <div className="bracket-connector-top"></div>
                                    <div className="bracket-connector-bottom"></div>
                                </div>
                            ))}
                        </div>
                        {this.renderRound('Osmifinále', this.state.r16Matches, 'r16', this.state.refreshKey)}
                        <div className="bracket-connector-col bracket-connector-r16">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="bracket-connector-pair">
                                    <div className="bracket-connector-top"></div>
                                    <div className="bracket-connector-bottom"></div>
                                </div>
                            ))}
                        </div>
                        {this.renderRound('Čtvrtfinále', this.state.qfMatches, 'qf', this.state.refreshKey)}
                        <div className="bracket-connector-col bracket-connector-qf">
                            {[0, 1].map(i => (
                                <div key={i} className="bracket-connector-pair">
                                    <div className="bracket-connector-top"></div>
                                    <div className="bracket-connector-bottom"></div>
                                </div>
                            ))}
                        </div>
                        {this.renderRound('Semifinále', this.state.sfMatches, 'sf', this.state.refreshKey)}
                        <div className="bracket-connector-col bracket-connector-sf">
                            <div className="bracket-connector-pair">
                                <div className="bracket-connector-top"></div>
                                <div className="bracket-connector-bottom"></div>
                            </div>
                        </div>
                        {this.renderRound('Finále', this.state.finalMatches, 'final', this.state.refreshKey)}
                    </div>
                </div>

                {/* Mobile stacked view - collapsible per round */}
                <div className="bracket-mobile">
                    {this.renderMobileRound('1. kolo playoff', 'r32', this.state.r32Matches, undefined, true)}
                    {this.renderMobileRound('Osmifinále', 'r16', this.state.r16Matches, this.state.refreshKey)}
                    {this.renderMobileRound('Čtvrtfinále', 'qf', this.state.qfMatches, this.state.refreshKey)}
                    {this.renderMobileRound('Semifinále', 'sf', this.state.sfMatches, this.state.refreshKey)}
                    {this.renderMobileRound('Finále', 'final', this.state.finalMatches, this.state.refreshKey)}
                </div>
            </div>
        );
    }

    private onBetConfirmed = () => {
        this.setState(prev => ({ refreshKey: prev.refreshKey + 1 }));
    }

    private renderRound(title: string, matches: Match[], roundClass: string, refreshKey?: number, displayOnly?: boolean) {
        return (
            <div className={`bracket-round bracket-round-${roundClass}`}>
                <div className="bracket-round-title">{title}</div>
                <div className="bracket-round-matches">
                    {matches.map(match => (
                        <div key={refreshKey != null ? `${match.id}-${refreshKey}` : match.id} className="bracket-match-slot">
                            <DeltaBetRow
                                match={match}
                                isReadOnly={displayOnly ? true : this.props.isReadOnly}
                                showResult={displayOnly ? false : this.props.showResult}
                                compact={true}
                                displayOnly={displayOnly}
                                onBetConfirmed={displayOnly ? undefined : this.onBetConfirmed}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    private renderMobileRound(title: string, key: string, matches: Match[], refreshKey?: number, displayOnly?: boolean) {
        const expanded = !!this.state.mobileExpanded[key];
        return (
            <div className="bracket-mobile-round">
                <button
                    type="button"
                    className={`bracket-mobile-toggle ${expanded ? 'open' : ''}`}
                    onClick={() => this.toggleMobile(key)}
                    aria-expanded={expanded}
                >
                    <span>{title}</span>
                    <span className="bracket-mobile-toggle-icon">{'▾'}</span>
                </button>
                {expanded && (
                    <div className="groupList">
                        {matches.map(match => (
                            <DeltaBetRow
                                key={refreshKey != null ? `${match.id}-${refreshKey}` : match.id}
                                match={match}
                                isReadOnly={displayOnly ? true : this.props.isReadOnly}
                                showResult={displayOnly ? false : this.props.showResult}
                                displayOnly={displayOnly}
                                onBetConfirmed={displayOnly ? undefined : this.onBetConfirmed}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}
