import * as React from 'react';

interface WarningProps {
    text: string
}

export class WarningNotification extends React.Component<WarningProps> {

    constructor(props: WarningProps) {
        super(props);
    }

    public render() {
        return (
            <div className="alert alert-danger" role="alert">
                {this.props.text}
            </div>)
    }
}