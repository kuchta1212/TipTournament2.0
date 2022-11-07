import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"

enum UpdateState {
    notStarted,
    loading,
    loaded
}

interface UpdateCheckerState {
    state: UpdateState,
    amount: number
}

interface UpdateCheckerProps {

}

export class UpdateChecker extends React.Component<UpdateCheckerProps, UpdateCheckerState> {

    constructor(props: UpdateCheckerProps) {
        super(props);

        this.state = { state: UpdateState.notStarted, amount: 0 }
    }


    public render() {
        switch (this.state.state) {
            case UpdateState.notStarted:
                return (<button onClick={() => this.onLoadButtonClick()}>Zkontrolovat výsledky</button>)
            case UpdateState.loading:
                return (<p><em>Loading...</em></p>);
            case UpdateState.loaded:
                return (<React.Fragment><button onClick={() => this.onLoadButtonClick()}>Nacíst zápasy</button> <p>{this.state.amount} results were loaded</p> </React.Fragment>)
        }
    }

    private onLoadButtonClick() {
        this.setState({ state: UpdateState.loading, amount: 0 });
        this.getData();
    }

    private async getData() {
        const amount = await getAdminApi().checkForUpdates();
        this.setState({ state: UpdateState.loaded, amount: amount });
    }

}

