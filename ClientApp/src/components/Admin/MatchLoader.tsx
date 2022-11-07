import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"

enum LoadState {
    notStarted,
    loading,
    loaded
}

interface MatchLoaderState {
    state: LoadState,
    amount: number
}

interface MatchLoaderProps {

}

export class MatchLoader extends React.Component<MatchLoaderProps, MatchLoaderState> {

    constructor(props: MatchLoaderProps) {
        super(props);

        this.state = { state: LoadState.notStarted, amount: 0 }
    }


    public render() {
        switch (this.state.state) {
            case LoadState.notStarted:
                return (<button onClick={() => this.onLoadButtonClick()}>Nacíst zápasy</button>)
            case LoadState.loading:
                return (<p><em>Loading...</em></p>);
            case LoadState.loaded:
                return (<React.Fragment><button onClick={() => this.onLoadButtonClick()}>Nacíst zápasy</button> <p>{this.state.amount} matches were loaded</p> </React.Fragment>)
        }
    }

    private onLoadButtonClick() {
        this.setState({ state: LoadState.loading, amount: 0 });
        this.getData();
    }

    private async getData() {
        const amount = await getAdminApi().loadMatches();
        this.setState({ state: LoadState.loaded, amount: amount });
    }

}

