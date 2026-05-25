import * as React from 'react';
import { Bets } from './Bets';
import { GamaBets } from './GamaBets'
import { TournamentBracket } from './TournamentBracket'
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
                <h1 id="tabelLabel" >Sázky</h1>
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
        const knockoutLocked = this.isStageDeadlinePassed(TournamentStage.RoundOf32);
        return (
            <div className="accordion" id="accordionExample">
                    <CardBet component={<Bets users={undefined} deadlines={this.state.deadlines} />} stage={TournamentStage.Group} text="Alfa + Beta - Skupinová fáze" tooltip="Alfa: Jeden bod za správně určeného vítěze (1,0,2). Beta: Další 3 body za přesně trefený výsledek (tedy celkem 4 body za přesně trefený výsledek)" />
                    <CardBet component={<GamaBets isReadOnly={tournamentStarted} />} stage={TournamentStage.Group} text="Gama - Skupiny" deadlinePassed={tournamentStarted} tooltip="OKRUH GAMA: Pořadí ve skupinách - 1 bod za každé přesně trefené umístění" deadlineText={this.getDeadlineText(TournamentStage.Group)} />
                    <CardBet component={<TournamentBracket isReadOnly={knockoutLocked} showResult={false} />} stage={TournamentStage.RoundOf16} text="Delta - Pavouk" deadlinePassed={knockoutLocked} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného účastníka kola (osmifinále, čtvrtfinále, semifinále, finále) a další 3 body za trefeného vítěze (za vítěze tedy celkem 11 bodů: 2+2+2+2+3=11)" deadlineText={this.getDeadlineText(TournamentStage.RoundOf32)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={true} isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Winner} text="Delta - Vítěz" deadlinePassed={tournamentStarted} tooltip="OKRUH DELTA: Pořadí playoff - 2 body za každého trefeného účastníka kola (osmifinále, čtvrtfinále, semifinále, finále) a další 3 body za trefeného vítěze (za vítěze tedy celkem 11 bodů: 2+2+2+2+3=11)" deadlineText={this.getDeadlineText(TournamentStage.Winner)} />
                    <CardBet component={<BestShooterBet isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Lambda} text="Lambda - Nejlepší střelec" deadlinePassed={tournamentStarted} tooltip="OKRUH LAMBDA: Nejlepší střelec turnaje za 7 bodů. Pouze příjmení! Na špatně napsané příjmení nebude brán zřetel." deadlineText={this.getDeadlineText(TournamentStage.Lambda)} />
                    <CardBet component={<TeamPlaceBet isWinnerBet={false} isReadOnly={tournamentStarted} showResult={false} />} stage={TournamentStage.Omikron} text="Omikron - Sázka na tým" deadlinePassed={tournamentStarted} tooltip="OKRUH OMIKRON: Konečné umístění Česka. Skupinová fáze a 1. kolo playoff je za 3b, osmifinále za 5b, čtvrtfinále za 8b, semifinále za 12b, finále za 15b a vítězství za 18b." deadlineText={this.getDeadlineText(TournamentStage.Omikron)} />
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
                [TournamentStage.RoundOf32]: "1. kolo playoff",
                [TournamentStage.RoundOf16]: "osmifinále",
                [TournamentStage.Quarterfinal]: "čtvrtfinále",
                [TournamentStage.Semifinal]: "semifinále",
                [TournamentStage.Final]: "finále"
            };

            for (const stageKey of [TournamentStage.RoundOf32, TournamentStage.RoundOf16, TournamentStage.Quarterfinal, TournamentStage.Semifinal, TournamentStage.Final]) {
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
