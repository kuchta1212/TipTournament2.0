import * as React from 'react';
import { Bets } from './Bets';
import { GamaBets } from './GamaBets'
import { DeltaBets } from './DeltaBets'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { BetsStageStatus, BetsStatus, DeadlineInfo, TournamentStage } from '../../typings';
import { CardBet } from './CardBet';
import { Loader } from '../Loader'
import { getApi } from "../api/ApiFactory"
import { TeamPlaceBet } from './TeamPlaceBet';
import { BestShooterBet } from './BestShooterBet';
import authService from './../api-authorization/AuthorizeService'


interface BetsMainPageState {
    deadlines: DeadlineInfo | null,
    status: BetsStatus,
    loading: boolean
}

interface BetsMainPageProps {
}

export class BetsMainPage extends React.Component<BetsMainPageProps, BetsMainPageState> {

    constructor(props: BetsMainPageProps) {
        super(props);
        this.state = {
            deadlines: null,
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
                {!this.state.loading && this.showWarningMessage()}
                {contents}
            </div>
        );
    }

    private async getData() {
        const currentUser = await authService.getUser();
        const [status, deadlines] = await Promise.all([
            getApi().getBetsStatus(),
            getApi().getDeadlines()
        ]);
        this.setState({ loading: false, status: status, deadlines: deadlines });
    }

    private isStageDeadlinePassed(stage: TournamentStage): boolean {
        if (!this.state.deadlines) return false;
        const deadline = this.state.deadlines.stageDeadlines[stage];
        if (!deadline) return false;
        return new Date() > new Date(deadline);
    }

    private isTournamentStarted(): boolean {
        if (!this.state.deadlines) return false;
        return new Date() > new Date(this.state.deadlines.tournamentStart);
    }

    private getDeadlineText(stage: TournamentStage): string | undefined {
        if (!this.state.deadlines) return undefined;
        const deadline = this.state.deadlines.stageDeadlines[stage];
        if (!deadline) return undefined;
        const date = new Date(deadline);
        return `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    private renderBets() {
        const tournamentStarted = this.isTournamentStarted();
        return (
            <div className="accordion" id="accordionExample">
                    <CardBet component={<Bets users={undefined} status={this.getStageStatus(TournamentStage.Group)} deadlines={this.state.deadlines} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Group} status={this.getStageStatus(TournamentStage.Group)} text="Alfa + Beta - Skupinová fáze" hideConfirmButton={true} tooltip="Alfa: Jeden bod za správně určeného vítěze (1,0,2). Beta: Další 3 body za přesně trefený výsledek (tedy celkem 4 body za přesně trefený výsledek)" deadlineText={this.getDeadlineText(TournamentStage.Group)} />
                    <CardBet component={<GamaBets isReadOnly={this.getStageStatus(TournamentStage.Group) == BetsStageStatus.Done || tournamentStarted} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Group} status={this.getStageStatus(TournamentStage.Group)} text="Gama - Skupiny" showGenerateButton={true} hideConfirmButton={tournamentStarted} tooltip="OKRUH GAMA: Pořadí ve skupinách - 1 bod za každé přesně trefené umístění" deadlineText={this.getDeadlineText(TournamentStage.Group)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.FirstRound} status={this.getStageStatus(TournamentStage.FirstRound)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.FirstRound} status={this.getStageStatus(TournamentStage.FirstRound)} text="Delta - Osmifinále" hideConfirmButton={this.isStageDeadlinePassed(TournamentStage.FirstRound)} tooltip="Osmifinále se nehodnotí, větsina je automaticky generované na základě okruhu Gamma. Nicméně je nutné dotipovat postupující ze 3tích míst. Pravidla pro postup ze třetích míst je popsáno v pravidlech." deadlineText={this.getDeadlineText(TournamentStage.FirstRound)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Quarterfinal} status={this.getStageStatus(TournamentStage.Quarterfinal)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Quarterfinal} status={this.getStageStatus(TournamentStage.Quarterfinal)} text="Delta - Čtvrtfinále" hideConfirmButton={this.isStageDeadlinePassed(TournamentStage.Quarterfinal)} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného čtvrtfinalistu, další 2 body za každého trefeného semifinalistu, další 2 body za trefené semifinalisty a další 3 body za trefeného vítěze (za vítěze tedy celkem 9 bodů: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Quarterfinal)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Semifinal} status={this.getStageStatus(TournamentStage.Semifinal)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Semifinal} status={this.getStageStatus(TournamentStage.Semifinal)} text="Delta - Semifinále" hideConfirmButton={this.isStageDeadlinePassed(TournamentStage.Semifinal)} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného čtvrtfinalistu, další 2 body za každého trefeného semifinalistu, další 2 body za trefené semifinalisty a další 3 body za trefeného vítěze (za vítěze tedy celkem 9 bodů: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Semifinal)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Final} status={this.getStageStatus(TournamentStage.Final)} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Final} status={this.getStageStatus(TournamentStage.Final)} text="Delta - Finále" hideConfirmButton={this.isStageDeadlinePassed(TournamentStage.Final)} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného čtvrtfinalistu, další 2 body za každého trefeného semifinalistu, další 2 body za trefené semifinalisty a další 3 body za trefeného vítěze (za vítěze tedy celkem 9 bodů: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Final)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={true} status={this.getStageStatus(TournamentStage.Winner)} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Winner} status={this.getStageStatus(TournamentStage.Winner)} text="Delta - Vítěz" hideConfirmButton={tournamentStarted} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného čtvrtfinalistu, další 2 body za každého trefeného semifinalistu, další 2 body za trefené semifinalisty a další 3 body za trefeného vítěze (za vítěze tedy celkem 9 bodů: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Winner)} />
                    <CardBet component={<BestShooterBet isReadOnly={this.getStageStatus(TournamentStage.Lambda) == BetsStageStatus.Done || tournamentStarted} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Lambda} status={this.getStageStatus(TournamentStage.Lambda)} text="Lambda - Nejlepší střelec" hideConfirmButton={tournamentStarted} tooltip="OKRUH LAMBDA: Nejlepší střelec turnaje za 7 bodů. Pouze přijímení! Na špatně napsané přijímení nebude brán zřetel." deadlineText={this.getDeadlineText(TournamentStage.Lambda)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={false} status={this.getStageStatus(TournamentStage.Omikron)} showResult={false} />} confirm={this.confirm.bind(this)} modify={this.modify.bind(this)} stage={TournamentStage.Omikron} status={this.getStageStatus(TournamentStage.Omikron)} text="Omikron - Sázka na tým" hideConfirmButton={tournamentStarted} tooltip="OKRUH OMIKRON: Konečné umístění jednoho z dvojice Česko, Slovensko. Skupinové fáze a osmifinále je za 3b, čtvrtfinále za 5b, semifinále za 8b, finále za 12b a vítězství za 15b." deadlineText={this.getDeadlineText(TournamentStage.Omikron)} />
            </div>
        );
    }

    private getStageStatus(stage: TournamentStage): BetsStageStatus {
        // Check deadline-based lockout
        if (stage === TournamentStage.Group || stage === TournamentStage.Winner ||
            stage === TournamentStage.Lambda || stage === TournamentStage.Omikron) {
            if (this.isTournamentStarted() && this.state.status.matchesInGroupsDone) {
                return BetsStageStatus.Done;
            }
        } else if (this.isStageDeadlinePassed(stage)) {
            return BetsStageStatus.Done;
        }

        switch (stage) {
            case TournamentStage.Group:
                return this.state.status.matchesInGroupsDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
            case TournamentStage.FirstRound:
                return this.state.status.groupStagesDone ? this.state.status.firstStagesDones ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Quarterfinal:
                return this.state.status.firstStagesDones ? this.state.status.querterfinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Semifinal:
                return this.state.status.querterfinalStageDone ? this.state.status.semifinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Final:
                return this.state.status.semifinalStageDone ? this.state.status.finalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
            case TournamentStage.Winner:
                return this.state.status.winnerStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
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
            if (betsStatus.finalStageDone
                && betsStatus.firstStagesDones
                && betsStatus.groupStagesDone
                && betsStatus.lambdaStageDone
                && betsStatus.matchesInGroupsDone
                && betsStatus.omikronStageDone
                && betsStatus.querterfinalStageDone
                && betsStatus.semifinalStageDone
                && betsStatus.winnerStageDone) {
                    alert("Zvládnul si to, všechny sázky byly zadány!")
                }
            this.setState({ status: betsStatus });
        } else {
            alert("Nejsou vyplněny všechny výsledky, nebo jsou některé týmy vybrány vícekrát");
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
        if (!this.state.deadlines) {
            return null;
        }

        if (this.isTournamentStarted()) {
            // Find the next upcoming stage deadline
            const now = new Date();
            let nextDeadline: Date | null = null;
            let nextStageName = "";

            const stageNames: { [key: number]: string } = {
                [TournamentStage.FirstRound]: "osmifinále",
                [TournamentStage.Quarterfinal]: "čtvrtfinále",
                [TournamentStage.Semifinal]: "semifinále",
                [TournamentStage.Final]: "finále"
            };

            for (const stageKey of [TournamentStage.FirstRound, TournamentStage.Quarterfinal, TournamentStage.Semifinal, TournamentStage.Final]) {
                const deadline = this.state.deadlines.stageDeadlines[stageKey];
                if (deadline) {
                    const deadlineDate = new Date(deadline);
                    if (deadlineDate > now && (!nextDeadline || deadlineDate < nextDeadline)) {
                        nextDeadline = deadlineDate;
                        nextStageName = stageNames[stageKey];
                    }
                }
            }

            if (nextDeadline) {
                const text = `Sázky na skupiny, vítěze, střelce a umístění jsou uzavřeny. Další uzávěrka: ${nextStageName} ${nextDeadline.getDate()}.${nextDeadline.getMonth() + 1}. v ${nextDeadline.getHours().toString().padStart(2, '0')}:${nextDeadline.getMinutes().toString().padStart(2, '0')}.`;
                return <WarningNotification text={text} type={WarningTypes.warning} />;
            }

            return <WarningNotification text="Všechny sázky jsou uzavřeny." type={WarningTypes.error} />;
        }

        const tournamentStart = new Date(this.state.deadlines.tournamentStart);
        const text = `Sázky na skupiny, vítěze, střelce a umístění se uzavřou ${tournamentStart.getDate()}.${tournamentStart.getMonth() + 1}. v ${tournamentStart.getHours().toString().padStart(2, '0')}:${tournamentStart.getMinutes().toString().padStart(2, '0')}. Sázky na zápasy se uzavírají se začátkem každého zápasu.`;
        return <WarningNotification text={text} type={WarningTypes.warning} />;
    }
}
