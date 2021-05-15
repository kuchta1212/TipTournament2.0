import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';

interface AllBetsState {
}

interface AllBetsProps {

}

export class AllBets extends React.Component<AllBetsProps, AllBetsState> {

    constructor(props: AllBetsProps) {
        super(props);
    }

    public componentDidMount() {
    }

    public render() {
        return (<p><em>Loading...</em></p>)
    }
}

