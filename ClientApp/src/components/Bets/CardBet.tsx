import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { Match, Bet, User, Group, GroupBet, TournamentStage, BetsStageStatus } from "../../typings/index"
import { Table } from 'reactstrap';
import { MatchBetRow } from './MatchBetRow';
import { Loader } from '../Loader'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { Dictionary, IDictionary } from "../../typings/Dictionary"
import authService from '../api-authorization/AuthorizeService'
import { GroupTable } from './GroupTable';

interface CardBetState {
    status: BetsStageStatus,
    isLoading: boolean
}

interface CardBetProps {
    component: any,
    status: BetsStageStatus,
    text: string,
    stage: TournamentStage,
    confirm: (stage: TournamentStage) => Promise<void>,
    modify: (stage: TournamentStage) => Promise<void>,
    hideConfirmButton?: boolean,
    showGenerateButton?: boolean,
}

export class CardBet extends React.Component<CardBetProps, CardBetState> {

    constructor(props: CardBetProps) {
        super(props);
        this.state = {
            status: props.status,
            isLoading: false
        }
    }

    public async componentWillReceiveProps(nextProps: CardBetProps) {
        this.setState({ status: nextProps.status })
    }

    public render() {
        let contents = this.state.isLoading
            ? <Loader />
            : this.renderData();

        return contents;
    }

    private renderData() {
        return (
            <div>
                <div className="card-header" id={this.getId()}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target={this.getCollapseId(true)} aria-expanded="false" aria-controls={this.getCollapseId(false)}>
                                {this.props.text}
                            </button>
                        </h5>
                        <div>
                            {!!this.props.hideConfirmButton
                                ? <div />
                                :this.state.status == BetsStageStatus.Ready
                                    ? <button type="button" className="btn btn-primary" onClick={() => this.confirm()}> Potvrdit</button>
                                    : this.state.status == BetsStageStatus.Done
                                        ? <button type="button" className="btn btn-secondary" onClick={() => this.modify()}> Upravit</button>
                                        : <div />
                            }
                            {!!this.props.showGenerateButton && this.state.status == BetsStageStatus.Ready
                                ? <button type="button" className="btn btn-outline-secondary" onClick={() => this.generate()}> Vygenerovat na základě zápasů</button>
                                : <div />

                            }
                        </div>
                    </div>
                </div>

                <div id={this.getCollapseId(false)} className="collapse" aria-labelledby={this.getId()} data-parent="#accordionExample">
                    <div className="card-body">
                        {this.props.status == BetsStageStatus.NotReady
                            ? this.renderMessage()
                            : this.props.component}
                    </div>
                </div>
            </div>
        );
    }





    private modify() {
        this.props.modify(this.props.stage);
    }

    private async confirm(): Promise<void> {
        this.props.confirm(this.props.stage);
    }

    private async generate(): Promise<void> {
        document.body.style.cursor = "wait";
        getApi().generateGroupBets().then(this.generateCallback.bind(this));

        this.setState({isLoading: true})
    }

    private generateCallback(success: boolean) {
        document.body.style.cursor = "pointer";
        if (!success) {
            alert("Vytvoření skupinových sázek neproběhlo. Zkontroluj, zda jsou vyplěnny všechny zápasy ze skupin");
        }

        this.setState({ isLoading: false })
    }

    private getId(): string {
        return `heading-${this.props.stage}-${this.props.text}`;
    }

    private getCollapseId(withHash: boolean): string {
        return withHash ? `#collapse${this.props.stage}-${this.props.text}` : `collapse${this.props.stage}-${this.props.text}`;
    }

    private renderMessage() {
        return (
            <div>
                Prosím nejdříve vyplň sázky z dřívějšího kola.
                V případě, že jsou všechny vyplněny, zkus obnovit stránku.
            </div>
        )
    }
}

