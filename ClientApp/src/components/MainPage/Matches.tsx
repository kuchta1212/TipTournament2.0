import * as React from 'react';
import { Match, Bet, UpdateStatus, TournamentStage } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { MatchStages } from "./MatchStages"


interface MatchesProps {
    activeStage: TournamentStage;
}

interface MatchesSate {
    status: UpdateStatus;
}

export class Matches extends React.Component<MatchesProps, MatchesSate> {

    constructor(props: MatchesProps) {
        super(props);
        this.state = {
            status: {} as UpdateStatus,
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.renderMatchTable();

        return (
            <div className="col">
                <h1 id="tabelLabel" >Zápasy a sázky</h1>
                {contents}
                <p className="text-light font-weight-light">Naposledy updatováno:{new Date(this.state.status.date).toLocaleString('cs-CS')}</p>
            </div>
        );
    }

    private async getData() {
        const status = await getApi().getUpdateStatus();
        this.setState({ status: status });
    }

    private renderMatchTable() {
        return (
            <div className="accordion" id="accordionExample">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <h5 className="mb-0">
                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Skupinová fáze
                            </button>
                        </h5>
                    </div>

                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div className="card-body">
                            <MatchStages stage={TournamentStage.Group} isActive={TournamentStage.Group == this.props.activeStage} />
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
                            <MatchStages stage={TournamentStage.FirstRound} isActive={TournamentStage.Group == this.props.activeStage} />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingThree">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Čtvrtfinále
                            </button>
                        </h5>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                        <div className="card-body">
                            <MatchStages stage={TournamentStage.Quarterfinal} isActive={TournamentStage.Quarterfinal == this.props.activeStage} />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingFour">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Semifinále
                            </button>
                        </h5>
                    </div>
                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                        <div className="card-body">
                            <MatchStages stage={TournamentStage.Semifinal} isActive={TournamentStage.Semifinal == this.props.activeStage} />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingFive">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                Finále
                            </button>
                        </h5>
                    </div>
                    <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordionExample">
                        <div className="card-body">
                            <MatchStages stage={TournamentStage.Final} isActive={TournamentStage.Final == this.props.activeStage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

