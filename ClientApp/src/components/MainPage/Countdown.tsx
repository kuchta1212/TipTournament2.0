import * as React from 'react';

interface CountdownProps {
    target: Date;
    variant: 'hero' | 'inline';
    label: string;
    subLabel?: string;
}

interface CountdownState {
    remainingMs: number;
}

export class Countdown extends React.Component<CountdownProps, CountdownState> {
    private timer: number | undefined;

    constructor(props: CountdownProps) {
        super(props);
        this.state = { remainingMs: this.computeRemaining(props.target) };
    }

    public componentDidMount() {
        this.timer = window.setInterval(this.tick, 1000);
    }

    public componentWillUnmount() {
        if (this.timer !== undefined) {
            window.clearInterval(this.timer);
        }
    }

    public componentDidUpdate(prevProps: CountdownProps) {
        if (prevProps.target.getTime() !== this.props.target.getTime()) {
            this.setState({ remainingMs: this.computeRemaining(this.props.target) });
        }
    }

    private tick = () => {
        this.setState({ remainingMs: this.computeRemaining(this.props.target) });
    };

    private computeRemaining(target: Date): number {
        return Math.max(0, target.getTime() - Date.now());
    }

    public render() {
        const { variant, label, subLabel } = this.props;
        const ms = this.state.remainingMs;
        if (ms <= 0) {
            return null;
        }

        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        return (
            <div className={`countdown countdown-${variant}`}>
                <div className="countdown-label">{label}</div>
                <div className="countdown-values">
                    <div className="countdown-unit"><span className="countdown-num">{days}</span><span className="countdown-tag">dní</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{pad(hours)}</span><span className="countdown-tag">hod</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{pad(minutes)}</span><span className="countdown-tag">min</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{pad(seconds)}</span><span className="countdown-tag">s</span></div>
                </div>
                {subLabel && <div className="countdown-sublabel">{subLabel}</div>}
            </div>
        );
    }
}
