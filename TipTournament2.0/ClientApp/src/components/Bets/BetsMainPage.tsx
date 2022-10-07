import * as React from 'react';
import { Bets } from './Bets';
import { GamaBets } from './GamaBets'
import { WarningNotification, WarningTypes } from '../WarningNotification';
import { TournamentStage } from '../../typings';

interface BetsMainPageState {
    afterLimit: boolean
}

interface BetsMainPageProps {
}

export class BetsMainPage extends React.Component<BetsMainPageProps, BetsMainPageState> {

    constructor(props: BetsMainPageProps) {
        super(props);
        this.state = {
            afterLimit: new Date() > new Date("2022-11-20 19:00")
        }
    }

    public render() {
        let contents = this.renderBets();

        return (
            <div>
                <h1 id="tabelLabel" >Sázky</h1>
                {this.showWarningMessage()}
                {contents}
            </div>
        );
    }

    private renderBets() {
        return (
            <div className="accordion" id="accordionExample">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <h5 className="mb-0">
                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Skupinová fáze
                            </button>
                        </h5>
                    </div>

                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                      <div className="card-body">
                          <Bets users={undefined} />
                       </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Skupiny
                            </button>
                        </h5>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            <GamaBets  />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Osmifinále
                            </button>
                        </h5>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            <DeltaBets stage={TournamentStage.FirstRound} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Čtvrtfinále
                            </button>
                        </h5>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            <DeltaBets stage={TournamentStage.Quarterfinal} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Semifinále
                            </button>
                        </h5>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            <DeltaBets stage={TournamentStage.Semifinal} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Finále
                            </button>
                        </h5>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            <DeltaBets stage={TournamentStage.Final} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private showWarningMessage() {
        return this.state.afterLimit
                ? <WarningNotification text="Prošvihl si to! Sázkám, už je konec." type={WarningTypes.error} />
                : <WarningNotification text="Sázky se uzavřou s prvním zápasem. Takže 20.11 v 19:00." type={WarningTypes.warning} />
    }
}

