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
            ? ( <div className="alert alert-danger" role="alert">
                {this.props.text}
                </div>)
            : (<div className="alert alert-warning" role="alert">
                {this.props.text}
            </div>)
    }
}