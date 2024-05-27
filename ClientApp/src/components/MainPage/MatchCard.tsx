import * as React from 'react';
import { TournamentStage } from "../../typings/index";
import './../../custom.css';

interface MatchCardState { }

interface MatchCardProps {
    component: any;
    text: string;
    stage: TournamentStage;
}

export class MatchCard extends React.Component<MatchCardProps, MatchCardState> {
    constructor(props: MatchCardProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div className="card opacity-card mb-3">
                <div className="card-header" id={this.getId()}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target={this.getCollapseId(true)} aria-expanded="false" aria-controls={this.getCollapseId(false)}>
                                {this.props.text}
                            </button>
                        </h5>
                    </div>
                </div>
                <div id={this.getCollapseId(false)} className="collapse" aria-labelledby={this.getId()} data-parent="#accordionExample">
                    <div className="card-body">
                        {this.props.component}
                    </div>
                </div>
            </div>
        );
    }

    private getId(): string {
        return `heading-${this.props.stage}-${this.props.text}`;
    }

    private getCollapseId(withHash: boolean): string {
        return withHash ? `#collapse${this.props.stage}-${this.props.text}` : `collapse${this.props.stage}-${this.props.text}`;
    }
}
