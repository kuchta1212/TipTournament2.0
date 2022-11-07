import * as React from 'react';
import { Match, Bet } from "../../typings/index";
import { MatchRow } from "./MatchRow"
import { UserBetRow } from "./UserBetRow"

interface MatchRowProps {
    match: Match,
    bet: Bet | undefined
}

export class MainRow extends React.Component<MatchRowProps> {

    constructor(props: MatchRowProps) {
        super(props);
    }

    public render() {


        return !!this.props.bet
            ? (
                <React.Fragment>
                    <MatchRow match={this.props.match} />
                    <UserBetRow bet={this.props.bet} />
                </React.Fragment>
            )
            : (<React.Fragment>
                    <MatchRow match={this.props.match} />
                </React.Fragment >);
    }
}

