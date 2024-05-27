import * as React from 'react';
import { Match, Bet } from "../../typings/index";
import { MatchRow } from "./MatchRow";
import { UserBetRow } from "./UserBetRow";

interface MainRowProps {
    match: Match;
    bet: Bet | undefined;
}

export class MainRow extends React.Component<MainRowProps> {
    constructor(props: MainRowProps) {
        super(props);
    }

    public render() {
        return (
            <>
                <MatchRow match={this.props.match} />
                {!!this.props.bet && <UserBetRow bet={this.props.bet} />}
            </>
        );
    }
}
