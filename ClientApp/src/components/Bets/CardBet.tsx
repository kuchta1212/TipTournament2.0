import * as React from 'react';
import ReactTooltip from "react-tooltip";
import { TournamentStage } from "../../typings/index"
import './../../custom.css';

interface CardBetProps {
    component: any,
    text: string,
    stage: TournamentStage,
    tooltip: string;
    deadlineText?: string;
    deadlinePassed?: boolean;
}

export class CardBet extends React.Component<CardBetProps> {

    public render() {
        return (
            <div className="card opacity-card mb-3">
                <div className="card-header" id={this.getId()}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" data-tip data-for={this.getCollapseId(false)+"_dataId"} type="button" data-toggle="collapse" data-target={this.getCollapseId(true)} aria-expanded="false" aria-controls={this.getCollapseId(false)}>
                                {this.props.text}
                            </button>
                            {this.renderDeadlineInfo()}
                       </h5>
                    </div>
                </div>

                <div id={this.getCollapseId(false)} className="collapse" aria-labelledby={this.getId()} data-parent="#accordionExample">
                    <div className="card-body">
                        {this.props.component}
                    </div>
                </div>

                <ReactTooltip id={this.getCollapseId(false) + "_dataId"} place="right" effect="solid">
                    {this.props.tooltip}
                </ReactTooltip>
            </div>
        );
    }

    private renderDeadlineInfo() {
        if (!this.props.deadlineText) return null;

        if (this.props.deadlinePassed) {
            return <small className="text-danger ml-2">Sazky uzavreny</small>;
        }

        return <small className="text-muted ml-2">Uzavreni: {this.props.deadlineText}</small>;
    }

    private getId(): string {
        return `heading-${this.props.stage}-${this.props.text}`;
    }

    private getCollapseId(withHash: boolean): string {
        return withHash ? `#collapse${this.props.stage}-${this.props.text}` : `collapse${this.props.stage}-${this.props.text}`;
    }
}
