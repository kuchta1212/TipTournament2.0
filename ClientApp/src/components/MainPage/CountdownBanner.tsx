import * as React from 'react';
import { Api } from '../api/Api';
import { Match } from '../../typings';
import { Countdown } from './Countdown';

interface CountdownBannerState {
    tournamentStart: Date | null;
    nextUnsetMatch: Match | null;
    loaded: boolean;
}

export class CountdownBanner extends React.Component<{}, CountdownBannerState> {
    private api = new Api();

    constructor(props: {}) {
        super(props);
        this.state = { tournamentStart: null, nextUnsetMatch: null, loaded: false };
    }

    public componentDidMount() {
        this.load();
    }

    private async load() {
        try {
            const [deadlines, nextMatch] = await Promise.all([
                this.api.getDeadlines(),
                this.api.getNextUnsetMatch().catch(() => null)
            ]);
            const start = deadlines?.tournamentStart ? new Date(deadlines.tournamentStart) : null;
            this.setState({
                tournamentStart: start,
                nextUnsetMatch: nextMatch,
                loaded: true
            });
        } catch {
            this.setState({ loaded: true });
        }
    }

    public render() {
        const { tournamentStart, nextUnsetMatch, loaded } = this.state;
        if (!loaded) {
            return null;
        }

        const now = Date.now();
        const kickoffFuture = tournamentStart && tournamentStart.getTime() > now;
        const nextStart = nextUnsetMatch ? new Date(nextUnsetMatch.startTime) : null;
        const nextFuture = nextStart && nextStart.getTime() > now;

        if (!kickoffFuture && !nextFuture) {
            return null;
        }

        const matchLabel = nextUnsetMatch
            ? `${nextUnsetMatch.home?.name ?? '?'} – ${nextUnsetMatch.away?.name ?? '?'}`
            : '';

        return (
            <div className="countdown-banner">
                {kickoffFuture && (
                    <Countdown
                        target={tournamentStart!}
                        variant="hero"
                        label="Do výkopu turnaje"
                    />
                )}
                {nextFuture && (
                    <Countdown
                        target={nextStart!}
                        variant="inline"
                        label="Tvůj nejbližší netipnutý zápas"
                        subLabel={matchLabel}
                    />
                )}
            </div>
        );
    }
}
