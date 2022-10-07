import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User, Group, GroupBet } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { GroupTable } from './GroupTable';

interface GamaBetsState {
    groups: Group[]
    loading: boolean,
}

interface GamaBetsProps {
}

export class GamaBets extends React.Component<GamaBetsProps, GamaBetsState> {

    constructor(props: GamaBetsProps) {
        super(props);
        this.state = {
            groups: {} as Group[],
            loading: true,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderGroupsBets();

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const groups = await getApi().getGroups();
        this.setState({ groups: groups, loading: false });
    }

    private renderGroupsBets() {
        return (
            <div className="groupList">
                {this.state.groups.map((group, index) => {
                    return <GroupTable key={group.id} group={group} />
                })}
            </div>
        );
    }
}

