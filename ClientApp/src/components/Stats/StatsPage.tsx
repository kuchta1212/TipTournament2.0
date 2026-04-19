import * as React from 'react';
import { Api } from '../api/Api';
import { StatsResponse } from '../../typings';
import { RankingChart } from './RankingChart';
import './../../custom.css';

interface StatsPageState {
    loading: boolean;
    stats: StatsResponse | null;
}

export class StatsPage extends React.Component<{}, StatsPageState> {
    private api = new Api();

    constructor(props: {}) {
        super(props);
        this.state = { loading: true, stats: null };
    }

    componentDidMount() {
        this.api.getStats().then(stats => {
            this.setState({ stats, loading: false });
        }).catch(() => {
            this.setState({ loading: false });
        });
    }

    public render() {
        const { loading, stats } = this.state;

        if (loading) {
            return (
                <div className="stats-page">
                    <div className="stats-hero">
                        <h1>Statistiky</h1>
                    </div>
                    <div className="skeleton-card">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                    </div>
                </div>
            );
        }

        if (!stats) {
            return (
                <div className="stats-page">
                    <div className="stats-hero">
                        <h1>Statistiky</h1>
                    </div>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nepodařilo se načíst statistiky.</p>
                </div>
            );
        }

        return (
            <div className="stats-page">
                <div className="stats-hero">
                    <h1>Statistiky</h1>
                    <p className="stats-subtitle">Zajímavá čísla z turnaje</p>
                </div>

                {/* Ranking over time - full width */}
                <div className="stats-card stats-card-full">
                    <h2>Vývoj pořadí</h2>
                    <RankingChart data={stats.rankingOverTime} />
                </div>

                {/* 2-column grid */}
                <div className="stats-grid">
                    {/* Dixit legends */}
                    <div className="stats-card">
                        <h2>Dixit legendy</h2>
                        {stats.dixitLegends.length === 0
                            ? <p className="stats-empty">Zatím žádné dixity</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Hráč</th><th>Počet</th></tr>
                                </thead>
                                <tbody>
                                    {stats.dixitLegends.map((d, i) => (
                                        <tr key={i}><td>{d.userName}</td><td className="stats-value">{d.count}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Match no one guessed */}
                    <div className="stats-card">
                        <h2>Nikdo netrefil</h2>
                        {stats.matchNoOneGuessed.length === 0
                            ? <p className="stats-empty">Všechny zápasy někdo trefil</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Zápas</th><th>Výsledek</th></tr>
                                </thead>
                                <tbody>
                                    {stats.matchNoOneGuessed.map((m, i) => (
                                        <tr key={i}>
                                            <td>
                                                {m.homeIcon && <img src={m.homeIcon} alt="" width="16" height="16" style={{ marginRight: 4 }} />}
                                                {m.home} - {m.away}
                                                {m.awayIcon && <img src={m.awayIcon} alt="" width="16" height="16" style={{ marginLeft: 4 }} />}
                                            </td>
                                            <td className="stats-value">{m.result}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Biggest upsets */}
                    <div className="stats-card">
                        <h2>Největší překvapení</h2>
                        {stats.biggestUpsets.length === 0
                            ? <p className="stats-empty">Zatím žádná data</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Zápas</th><th>Výsledek</th><th>Trefilo</th></tr>
                                </thead>
                                <tbody>
                                    {stats.biggestUpsets.map((m, i) => (
                                        <tr key={i}>
                                            <td>
                                                {m.homeIcon && <img src={m.homeIcon} alt="" width="16" height="16" style={{ marginRight: 4 }} />}
                                                {m.home} - {m.away}
                                            </td>
                                            <td className="stats-value">{m.result}</td>
                                            <td className="stats-value">{m.correctPercentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Most predictable */}
                    <div className="stats-card">
                        <h2>Nejpředvídatelnější</h2>
                        {stats.mostPredictableMatches.length === 0
                            ? <p className="stats-empty">Zatím žádná data</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Zápas</th><th>Výsledek</th><th>Trefilo</th></tr>
                                </thead>
                                <tbody>
                                    {stats.mostPredictableMatches.map((m, i) => (
                                        <tr key={i}>
                                            <td>
                                                {m.homeIcon && <img src={m.homeIcon} alt="" width="16" height="16" style={{ marginRight: 4 }} />}
                                                {m.home} - {m.away}
                                            </td>
                                            <td className="stats-value">{m.result}</td>
                                            <td className="stats-value">{m.correctPercentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Joker efficiency */}
                    <div className="stats-card" style={{ gridColumn: '1 / -1' }}>
                        <h2>Efektivita jokeru</h2>
                        {stats.jokerEfficiency.length === 0
                            ? <p className="stats-empty">Zatím žádné jokery</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Hráč</th><th>Použito</th><th>Úspěšnost</th><th>Extra body</th></tr>
                                </thead>
                                <tbody>
                                    {stats.jokerEfficiency.map((j, i) => (
                                        <tr key={i}>
                                            <td>{j.userName}</td>
                                            <td className="stats-value">{j.jokersUsed}</td>
                                            <td className="stats-value">{j.successRate}%</td>
                                            <td className="stats-value">{j.totalExtraPoints}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Exact score heroes */}
                    <div className="stats-card">
                        <h2>Přesné výsledky</h2>
                        {stats.exactScoreHeroes.length === 0
                            ? <p className="stats-empty">Zatím žádné přesné výsledky</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Hráč</th><th>Počet</th></tr>
                                </thead>
                                <tbody>
                                    {stats.exactScoreHeroes.map((h, i) => (
                                        <tr key={i}><td>{h.userName}</td><td className="stats-value">{h.count}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>

                    {/* Average points per match */}
                    <div className="stats-card">
                        <h2>Průměr bodů na zápas</h2>
                        {stats.averagePointsPerMatch.length === 0
                            ? <p className="stats-empty">Zatím žádná data</p>
                            : <table className="stats-table">
                                <thead>
                                    <tr><th>Hráč</th><th>Body</th><th>Zápasů</th><th>Průměr</th></tr>
                                </thead>
                                <tbody>
                                    {stats.averagePointsPerMatch.map((a, i) => (
                                        <tr key={i}>
                                            <td>{a.userName}</td>
                                            <td className="stats-value">{a.totalAlfaPoints}</td>
                                            <td className="stats-value">{a.matchesBetOn}</td>
                                            <td className="stats-value">{a.average}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
