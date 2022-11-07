import * as React from 'react';
import { Bets } from './Bets';
import { GamaBets } from './GamaBets'
import { DeltaBets } from './DeltaBets' 
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { BetsStageStatus, BetsStatus, TournamentStage } from '../../typings';
import { CardBet } from './CardBet';
import { Loader } from '../Loader'
import { getApi } from "../api/ApiFactory"
import { TeamPlaceBet } from './TeamPlaceBet';
import { BestShooterBet } from './BestShooterBet';

interface BetsMainPageState {
    afterLimit: boolean,
    status: BetsStatus,
    loading: boolean
}

interface BetsMainPageProps {
}

export class BetsMainPage extends React.Component<BetsMainPageProps, BetsMainPageState> {

    constructor(props: BetsMainPageProps) {
        super(props);
        this.state = {
            afterLimit: new Date() > new Date("2022-11-20 19:00"),
            status: {} as BetsStatus,
            loading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderBets();

        return (
            <div>
                <h1 id="tabelLabel" >Sázky</h1>
                {this.showWarningMessage()}
                {contents}
            </div>
        );
    }

    private async getData() {
        const status = await getApi().getBetsStatus();
        this.setState({ loading: false, status: status });
    }

    private renderBets() {
        return (
            <div className="accordion" id="accordionExample">
                <div className="card opacity-card" >
                    <CardBet component={<Bets users={undefined} status={this.getStageStatus(TournamentStage.Group)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Group} status={this.getStageStatus(TournamentStage.Group)} text="Alfa + Beta - Skupinová fáze" hideConfirmButton={true} />
                </div>

                <div className="card opacity-card">
                    <CardBet component={<GamaBets isReadOnly={this.getStageStatus(TournamentStage.Group) == BetsStageStatus.Done} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Group} status={this.getStageStatus(TournamentStage.Group)} text="Gama - Skupiny" showGenerateButton={true} hideConfirmButton={this.state.afterLimit} />
                </div>

                <div className="card opacity-card">
                    <CardBet component={<DeltaBets stage={TournamentStage.FirstRound} status={BetsStageStatus.Done} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.FirstRound} status={this.getStageStatus(TournamentStage.FirstRound)} text="Delta - Osmifinále" hideConfirmButton={true} />
                </div>

                <div className="card opacity-card">
                    <CardBet component={<DeltaBets stage={TournamentStage.Quarterfinal} status={this.getStageStatus(TournamentStage.Quarterfinal)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Quarterfinal} status={this.getStageStatus(TournamentStage.Quarterfinal)} text="Delta - Čtvrtfinále" hideConfirmButton={this.state.afterLimit} />
                </div>

                <div className="card opacity-card">
                    <CardBet component={<DeltaBets stage={TournamentStage.Semifinal} status={this.getStageStatus(TournamentStage.Semifinal)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Semifinal} status={this.getStageStatus(TournamentStage.Semifinal)} text="Delta - Semifinále" hideConfirmButton={this.state.afterLimit} />
                </div>

                <div className="card opacity-card">
                    <CardBet component={<DeltaBets stage={TournamentStage.Final} status={this.getStageStatus(TournamentStage.Final)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Final} status={this.getStageStatus(TournamentStage.Final)} text="Delta - Finále" hideConfirmButton={this.state.afterLimit} />
                </div>
                <div className="card opacity-card">
                    <CardBet component={<TeamPlaceBet isWinnerBet={true} status={this.getStageStatus(TournamentStage.Winner)} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Winner} status={this.getStageStatus(TournamentStage.Winner)} text="Delta - Vítěz" hideConfirmButton={this.state.afterLimit} />
                </div>
                <div className="card opacity-card">
                    <CardBet component={<BestShooterBet isReadOnly={this.getStageStatus(TournamentStage.Lambda) == BetsStageStatus.Done} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Lambda} status={this.getStageStatus(TournamentStage.Lambda)} text="Lambda - Nejlepší střelec" hideConfirmButton={this.state.afterLimit} />
                </div>
                <div className="card opacity-card">
                    <CardBet component={<TeamPlaceBet isWinnerBet={false} status={this.getStageStatus(TournamentStage.Omikron)} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Omikron} status={this.getStageStatus(TournamentStage.Omikron)} text="Omikron - Sázka na tým" hideConfirmButton={this.state.afterLimit} />
                </div>
            </div>
        );
    }

    private getStageStatus(stage: TournamentStage): BetsStageStatus {
        if (this.state.afterLimit) {
            return BetsStageStatus.Done;
        }
        switch (stage) {
            case TournamentStage.Group:
                return this.state.status.matchesInGroupsDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
            case TournamentStage.FirstRound:
                return this.state.status.groupStagesDone ? BetsStageStatus.Done : BetsStageStatus.NotReady;
            case TournamentStage.Quarterfinal:
                return this.state.status.groupStagesDone ? this.state.status.querterfinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Semifinal:
                return this.state.status.querterfinalStageDone ? this.state.status.semifinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Final:
                return this.state.status.semifinalStageDone ? this.state.status.finalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Winner:
                return this.state.status.finalStageDone ? this.state.status.winnerStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Lambda:
                return this.state.status.lambdaStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
            case TournamentStage.Omikron:
                return this.state.status.omikronStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
            default:
                return BetsStageStatus.NotReady;

        }
    }

    private async confirm(stage: TournamentStage): Promise<void> {
        document.body.style.cursor = "wait";
        const betsStatus = await getApi().confirmStageBets(stage);
        document.body.style.cursor = "pointer";
        if (!!betsStatus.id) {
            this.setState({ status: betsStatus });
        } else {
            alert("Nejsou vyplněny všechny výsledky");
        }
    }

    private async modify(stage: TournamentStage): Promise<void> {
        document.body.style.cursor = "wait";
        const betsStatus = await getApi().modifyStageBet(stage);
        document.body.style.cursor = "pointer";
        if (!!betsStatus.id) {
            this.setState({ status: betsStatus });
        } else {
            alert("To si udělal něco divného ne?");
        }
    }

    private showWarningMessage() {
        return this.state.afterLimit
                ? <WarningNotification text="Prošvihl si to! Sázkám, už je konec." type={WarningTypes.error} />
                : <WarningNotification text="Sázky se uzavřou s prvním zápasem. Takže 20.11 v 19:00." type={WarningTypes.warning} />
    }
}

