import * as React from 'react';

export class Loader extends React.Component {
    public render() {
        return (
            <div className="skeleton-card">
                <div className="skeleton-line" style={{ width: '80%' }}></div>
                <div className="skeleton-line" style={{ width: '100%' }}></div>
                <div className="skeleton-line" style={{ width: '60%' }}></div>
            </div>
        );
    }
}
