import * as React from 'react';
import authService from './../api-authorization/AuthorizeService';
import { MainInnerPage } from './MainPageInner';
import { Ranking } from './Ranking';
import './../../custom.css';
import { TournamentStage, User } from '../../typings';
import { getApi } from '../api/ApiFactory';
import { TournamentCelebrationModal } from './TournamentCelebrationModal';

const CELEBRATION_DISMISSED_KEY = 'tt_celebration_dismissed_v1';

interface MainPageState {
    currentUser: string;
    activeStage: TournamentStage;
    tournamentFinished: boolean;
    celebrationUsers: User[];
    showCelebration: boolean;
}

interface MainPageProps { }

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            currentUser: "",
            activeStage: this.getActiveStage(),
            tournamentFinished: false,
            celebrationUsers: [],
            showCelebration: false
        };
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        return (
            <div className="container-fluid body-content" style={{ maxWidth: '1400px' }}>
                <div className="row">
                    <div className="col-lg-9">
                        <MainInnerPage activeStage={this.state.activeStage} user={undefined} />
                    </div>
                    <div className="col-lg-3">
                        <Ranking currentUser={this.state.currentUser} />
                    </div>
                </div>

                {this.state.tournamentFinished && !this.state.showCelebration && (
                    <button
                        className="celebration-fab"
                        onClick={this.openCelebration}
                        title="Zobrazit konečné pořadí"
                        aria-label="Zobrazit konečné pořadí"
                    >
                        🏆
                    </button>
                )}

                {this.state.showCelebration && (
                    <TournamentCelebrationModal
                        users={this.state.celebrationUsers}
                        currentUserId={this.state.currentUser}
                        onClose={this.dismissCelebration}
                    />
                )}
            </div>
        );
    }

    private async getData() {
        const currentUser = await authService.getUser();
        this.setState({ currentUser: currentUser ? currentUser["sub"] : "" });

        try {
            const [matches, users] = await Promise.all([
                getApi().getAllMatches(),
                getApi().getUsers(true)
            ]);

            const finished = matches.some(m => m.stage === TournamentStage.Final && m.ended);
            const dismissed = this.isCelebrationDismissed();

            this.setState({
                tournamentFinished: finished,
                celebrationUsers: users,
                showCelebration: finished && !dismissed
            });
        } catch {
            /* the celebration is non-critical — ignore load failures */
        }
    }

    private openCelebration = () => {
        this.setState({ showCelebration: true });
    }

    private dismissCelebration = () => {
        try {
            window.localStorage.setItem(CELEBRATION_DISMISSED_KEY, 'true');
        } catch {
            /* localStorage may be unavailable — ignore */
        }
        this.setState({ showCelebration: false });
    }

    private isCelebrationDismissed(): boolean {
        try {
            return window.localStorage.getItem(CELEBRATION_DISMISSED_KEY) === 'true';
        } catch {
            return false;
        }
    }

    private getActiveStage(): TournamentStage {
        const today = new Date();
        if (today < new Date(2022, 12, 3)) {
            return TournamentStage.Group;
        }

        if (today < new Date(2022, 12, 9)) {
            return TournamentStage.RoundOf16;
        }

        if (today < new Date(2022, 12, 13)) {
            return TournamentStage.Quarterfinal;
        }

        if (today < new Date(2022, 12, 18)) {
            return TournamentStage.Semifinal;
        }

        return TournamentStage.Final;
    }
}
