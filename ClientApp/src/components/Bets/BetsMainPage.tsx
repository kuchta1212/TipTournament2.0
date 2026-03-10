import * as React from 'react';
import { Bets } from './Bets';
import { GamaBets } from './GamaBets'
import { DeltaBets } from './DeltaBets'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { DeadlineInfo, TournamentStage } from '../../typings';
import { CardBet } from './CardBet';
import { Loader } from '../Loader'
import { getApi } from "../api/ApiFactory"
import { TeamPlaceBet } from './TeamPlaceBet';
import { BestShooterBet } from './BestShooterBet';


interface BetsMainPageState {
    deadlines: DeadlineInfo | null,
    loading: boolean
}

interface BetsMainPageProps {
}

export class BetsMainPage extends React.Component<BetsMainPageProps, BetsMainPageState> {

    constructor(props: BetsMainPageProps) {
        super(props);
        this.state = {
            deadlines: null,
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
                <h1 id="tabelLabel" >Sazky</h1>
                {!this.state.loading && this.showWarningMessage()}
                {contents}
            </div>
        );
    }

    private async getData() {
        const deadlines = await getApi().getDeadlines();
        this.setState({ loading: false, deadlines: deadlines });
    }

    private isStageDeadlinePassed(stage: TournamentStage): boolean {
        if (!this.state.deadlines) return false;
        const deadline = this.state.deadlines.stageDeadlines[TournamentStage[stage]];
        if (!deadline) return false;
        return new Date() > new Date(deadline);
    }

    private isTournamentStarted(): boolean {
        if (!this.state.deadlines) return false;
        return new Date() > new Date(this.state.deadlines.tournamentStart);
    }

    private getDeadlineText(stage: TournamentStage): string | undefined {
        if (!this.state.deadlines) return undefined;
        const deadline = this.state.deadlines.stageDeadlines[TournamentStage[stage]];
        if (!deadline) return undefined;
        const date = new Date(deadline);
        return `${date.getDate()}.${date.getMonth() + 1}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    private renderBets() {
        const tournamentStarted = this.isTournamentStarted();
        const knockoutLocked = this.isStageDeadlinePassed(TournamentStage.FirstRound);
        return (
            <div className="accordion" id="accordionExample">
                    <CardBet component={<Bets users={undefined} deadlines={this.state.deadlines} />} stage={TournamentStage.Group} text="Alfa + Beta - Skupinova faze" tooltip="Alfa: Jeden bod za spravne urceneho viteze (1,0,2). Beta: Dalsi 3 body za presne trefeny vysledek (tedy celkem 4 body za presne trefeny vysledek)" />
                    <CardBet component={<GamaBets isReadOnly={tournamentStarted} />} stage={TournamentStage.Group} text="Gama - Skupiny" deadlinePassed={tournamentStarted} tooltip="OKRUH GAMA: Poradi ve skupinach - 1 bod za kazde presne trefene umisteni" deadlineText={this.getDeadlineText(TournamentStage.Group)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.FirstRound} isReadOnly={knockoutLocked} />} stage={TournamentStage.FirstRound} text="Delta - Osmifinale" deadlinePassed={knockoutLocked} tooltip="Osmifinale se nehodnoti, vetsina je automaticky generovane na zaklade okruhu Gamma. Nicmene je nutne dotipovat postupujici ze 3tich mist. Pravidla pro postup ze tretich mist je popsano v pravidlech." deadlineText={this.getDeadlineText(TournamentStage.FirstRound)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Quarterfinal} isReadOnly={knockoutLocked} />} stage={TournamentStage.Quarterfinal} text="Delta - Ctvrtfinale" deadlinePassed={knockoutLocked} tooltip="OKRUH DELTA: Poradi playoff - 2 body za kazdeho trefeneho ctvrtfinalistu, dalsi 2 body za kazdeho trefeneho semifinalistu, dalsi 2 body za trefene semifinalisty a dalsi 3 body za trefeneho viteze (za viteze tedy celkem 9 bodu: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Quarterfinal)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Semifinal} isReadOnly={knockoutLocked} />} stage={TournamentStage.Semifinal} text="Delta - Semifinale" deadlinePassed={knockoutLocked} tooltip="OKRUH DELTA: Poradi playoff - 2 body za kazdeho trefeneho ctvrtfinalistu, dalsi 2 body za kazdeho trefeneho semifinalistu, dalsi 2 body za trefene semifinalisty a dalsi 3 body za trefeneho viteze (za viteze tedy celkem 9 bodu: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Semifinal)} />
                    <CardBet component={<DeltaBets stage={TournamentStage.Final} isReadOnly={knockoutLocked} />} stage={TournamentStage.Final} text="Delta - Finale" deadlinePassed={knockoutLocked} tooltip="OKRUH DELTA: Poradi playoff - 2 body za kazdeho trefeneho ctvrtfinalistu, dalsi 2 body za kazdeho trefeneho semifinalistu, dalsi 2 body za trefene semifinalisty a dalsi 3 body za trefeneho viteze (za viteze tedy celkem 9 bodu: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Final)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={true} isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Winner} text="Delta - Vitez" deadlinePassed={tournamentStarted} tooltip="OKRUH DELTA: Poradi playoff - 2 body za kazdeho trefeneho ctvrtfinalistu, dalsi 2 body za kazdeho trefeneho semifinalistu, dalsi 2 body za trefene semifinalisty a dalsi 3 body za trefeneho viteze (za viteze tedy celkem 9 bodu: 2+2+2+3=9)" deadlineText={this.getDeadlineText(TournamentStage.Winner)} />
                    <CardBet component={<BestShooterBet isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Lambda} text="Lambda - Nejlepsi strelec" deadlinePassed={tournamentStarted} tooltip="OKRUH LAMBDA: Nejlepsi strelec turnaje za 7 bodu. Pouze prijimeni! Na spatne napsane prijimeni nebude bran zretel." deadlineText={this.getDeadlineText(TournamentStage.Lambda)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={false} isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Omikron} text="Omikron - Sazka na tym" deadlinePassed={tournamentStarted} tooltip="OKRUH OMIKRON: Konecne umisteni jednoho z dvojice Cesko, Slovensko. Skupinove faze a osmifinale je za 3b, ctvrtfinale za 5b, semifinale za 8b, finale za 12b a vitezstvi za 15b." deadlineText={this.getDeadlineText(TournamentStage.Omikron)} />
            </div>
        );
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
                [TournamentStage.FirstRound]: "osmifinale",
                [TournamentStage.Quarterfinal]: "ctvrtfinale",
                [TournamentStage.Semifinal]: "semifinale",
                [TournamentStage.Final]: "finale"
            };

            for (const stageKey of [TournamentStage.FirstRound, TournamentStage.Quarterfinal, TournamentStage.Semifinal, TournamentStage.Final]) {
                const deadline = this.state.deadlines.stageDeadlines[TournamentStage[stageKey]];
                if (deadline) {
                    const deadlineDate = new Date(deadline);
                    if (deadlineDate > now && (!nextDeadline || deadlineDate < nextDeadline)) {
                        nextDeadline = deadlineDate;
                        nextStageName = stageNames[stageKey];
                    }
                }
            }

            if (nextDeadline) {
                const text = `Sazky na skupiny, viteze, strelce a umisteni jsou uzavreny. Dalsi uzaverka: ${nextStageName} ${nextDeadline.getDate()}.${nextDeadline.getMonth() + 1}. v ${nextDeadline.getHours().toString().padStart(2, '0')}:${nextDeadline.getMinutes().toString().padStart(2, '0')}.`;
                return <WarningNotification text={text} type={WarningTypes.warning} />;
            }

            return <WarningNotification text="Vsechny sazky jsou uzavreny." type={WarningTypes.error} />;
        }

        const tournamentStart = new Date(this.state.deadlines.tournamentStart);
        const text = `Sazky na skupiny, viteze, strelce a umisteni se uzavrou ${tournamentStart.getDate()}.${tournamentStart.getMonth() + 1}. v ${tournamentStart.getHours().toString().padStart(2, '0')}:${tournamentStart.getMinutes().toString().padStart(2, '0')}. Sazky na zapasy se uzaviraji se zacatkem kazdeho zapasu.`;
        return <WarningNotification text={text} type={WarningTypes.warning} />;
    }
}
