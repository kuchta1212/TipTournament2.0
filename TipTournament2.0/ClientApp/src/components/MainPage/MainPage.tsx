import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { MainData } from "../../typings/index"
import { Matches } from "./Matches"
import { UserBets } from "./UserBets"
import { Ranking } from "./Ranking"
import { css } from "@emotion/react";
//import { PacmanLoader } from "react-spinners/PacmanLoader";
import './../../custom.css'


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

interface MainPageState {
    data: MainData,
    loading: boolean
}

interface MainPageProps {

}

export class MainPage extends React.Component<MainPageProps, MainPageState> {

    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            data: {} as MainData,
            loading: true
        }
    }

    public componentDidMount() {
        this.getData();
    }

    public render() {
        let contents = this.state.loading
                ? <p>Kurva</p>//<PacmanLoader css={override} size={150} color={"#123abc"} loading={this.state.loading} speedMultiplier={1.5} />
                : this.renderDataTable(this.state.data);

        return (
            <div>
                {contents}
            </div>
        );
    }

    private async getData() {
        const data = await getApi().getData();
        this.setState({ data: data, loading: false });
    }

    private renderDataTable(data: MainData) {
        return (
            <div className="container body-content">
                <div className="row">
                    <Matches matches={ data.matches } />
                    <UserBets bets={data.bets} />
                    <Ranking ranking={data.users} />
                </div>
            </div>
        );
    }
}

