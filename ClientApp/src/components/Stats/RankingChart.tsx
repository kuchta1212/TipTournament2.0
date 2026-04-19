import * as React from 'react';
import { RankingOverTimeEntry } from '../../typings';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface RankingChartProps {
    data: RankingOverTimeEntry[];
}

const COLORS = [
    '#2b6cb0', '#e53e3e', '#38a169', '#d69e2e', '#805ad5',
    '#dd6b20', '#319795', '#d53f8c', '#3182ce', '#c53030',
    '#2f855a', '#b7791f', '#6b46c1', '#c05621', '#2c7a7b',
    '#b83280', '#4299e1', '#e53e3e', '#48bb78', '#ecc94b'
];

interface RankingChartState {
    hiddenPlayers: Set<string>;
}

export class RankingChart extends React.Component<RankingChartProps, RankingChartState> {
    constructor(props: RankingChartProps) {
        super(props);
        this.state = { hiddenPlayers: new Set() };
    }

    private getColorMap(): Map<string, string> {
        const playerNames = this.props.data[0].playerPoints.map(p => p.userName);
        const map = new Map<string, string>();
        playerNames.forEach((name, i) => map.set(name, COLORS[i % COLORS.length]));
        return map;
    }

    private handleInvert = () => {
        const playerNames = this.props.data[0].playerPoints.map(p => p.userName);
        const next = new Set<string>();
        playerNames.forEach(name => {
            if (!this.state.hiddenPlayers.has(name)) {
                next.add(name);
            }
        });
        this.setState({ hiddenPlayers: next });
    }

    render() {
        const { data } = this.props;
        if (!data || data.length === 0) {
            return <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Zatím žádná data</p>;
        }

        const playerNames = data[0].playerPoints.map(p => p.userName);
        const totalPlayers = playerNames.length;
        const colorMap = this.getColorMap();

        // Convert cumulative points to ranks at each match
        // Track phase label positions for X-axis dedup
        const phaseMidpoints: { [label: string]: { sum: number; count: number } } = {};
        const chartData = data.map((entry, idx) => {
            const sorted = [...entry.playerPoints].sort((a, b) => b.cumulativePoints - a.cumulativePoints);
            const rankMap: { [name: string]: number } = {};
            sorted.forEach((p, i) => {
                rankMap[p.userName] = i + 1;
            });

            const label = entry.matchLabel;
            if (!phaseMidpoints[label]) {
                phaseMidpoints[label] = { sum: 0, count: 0 };
            }
            phaseMidpoints[label].sum += idx;
            phaseMidpoints[label].count += 1;

            const point: any = {
                name: label,
                _index: idx
            };
            playerNames.forEach(name => {
                point[name] = rankMap[name];
            });
            return point;
        });

        // Calculate midpoint index for each phase label
        const labelAtIndex: { [idx: number]: string } = {};
        Object.keys(phaseMidpoints).forEach(label => {
            const mid = Math.round(phaseMidpoints[label].sum / phaseMidpoints[label].count);
            labelAtIndex[mid] = label;
        });

        return (
            <div>
                <div style={{ textAlign: 'right', marginBottom: 'var(--space-sm)' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ fontSize: 'var(--font-xs)', padding: '0.25rem 0.75rem' }}
                        onClick={this.handleInvert}
                    >
                        Invertovat výběr
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis
                            dataKey="_index"
                            tick={(tickProps: any) => {
                                const label = labelAtIndex[tickProps.payload.value];
                                if (!label) return <g />;
                                return (
                                    <text
                                        x={tickProps.x} y={tickProps.y + 12}
                                        textAnchor="middle"
                                        fontSize={11} fill="var(--text-secondary)"
                                    >
                                        {label}
                                    </text>
                                );
                            }}
                            interval={0}
                            type="number"
                            domain={[0, chartData.length - 1]}
                            tickCount={chartData.length}
                        />
                        <YAxis
                            reversed
                            domain={[1, totalPlayers]}
                            tickCount={totalPlayers}
                            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                            label={{ value: 'Pořadí', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'var(--text-secondary)' } }}
                        />
                        <Tooltip
                            content={({ active, payload }: any) => {
                                if (!active || !payload || payload.length === 0) return null;
                                const phaseName = payload[0]?.payload?.name || '';
                                const items = payload
                                    .filter((p: any) => p.value != null)
                                    .sort((a: any, b: any) => a.value - b.value);
                                return (
                                    <div style={{
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: 'var(--font-xs)'
                                    }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{phaseName}</div>
                                        {items.map((item: any) => (
                                            <div key={item.dataKey} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '1px 0' }}>
                                                <span style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    background: item.color, display: 'inline-block', flexShrink: 0
                                                }}></span>
                                                <span style={{ flex: 1 }}>{item.dataKey}</span>
                                                <span style={{ fontWeight: 600 }}>{item.value}.</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        />
                        {playerNames.map((name) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={colorMap.get(name)}
                                strokeWidth={2}
                                dot={false}
                                hide={this.state.hiddenPlayers.has(name)}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                {/* Inline legend with clickable names */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.75rem',
                    justifyContent: 'center', marginTop: 'var(--space-sm)', fontSize: 'var(--font-xs)'
                }}>
                    {playerNames.map((name) => {
                        const hidden = this.state.hiddenPlayers.has(name);
                        return (
                            <span
                                key={name}
                                onClick={() => {
                                    const next = new Set(this.state.hiddenPlayers);
                                    if (next.has(name)) { next.delete(name); } else { next.add(name); }
                                    this.setState({ hiddenPlayers: next });
                                }}
                                style={{
                                    cursor: 'pointer',
                                    opacity: hidden ? 0.35 : 1,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    textDecoration: hidden ? 'line-through' : 'none'
                                }}
                            >
                                <span style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: colorMap.get(name), display: 'inline-block'
                                }}></span>
                                {name}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }

}
