import * as React from 'react';
import { Group } from "../../typings/index";
import { Loader } from '../Loader';
import { getApi } from '../api/ApiFactory';
import { GroupTable } from '../Bets/GroupTable';

interface GammaViewState {
    groups: Group[];
    loading: boolean;
}

interface GammaViewProps { }

export class GammaView extends React.Component<GammaViewProps, GammaViewState> {
    constructor(props: GammaViewProps) {
        super(props);
        this.state = {
            groups: [],
            loading: true,
        };
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
                {this.state.groups.map((group) => (
                    <GroupTable key={group.id} group={group} isReadOnly={true} showResult={true} />
                ))}
            </div>
        );
    }
}
