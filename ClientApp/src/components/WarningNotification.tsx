import * as React from 'react';

export enum WarningTypes {
    error,
    warning
}

interface WarningProps {
    text: string;
    type: WarningTypes
}

export class WarningNotification extends React.Component<WarningProps> {

    constructor(props: WarningProps) {
        super(props);
    }

    public render() {

        return this.props.type == WarningTypes.error
            ? ( <div className="app-notification app-notification-error" role="alert">
                {this.props.text}
                </div>)
            : (<div className="app-notification app-notification-warning" role="alert">
                {this.props.text}
            </div>)
    }
}
