import * as React from 'react';
import { getApi } from "../api/ApiFactory"
import { IApi} from "../api/IApi"
import { MainData } from "../../typings/index"
import authService from '../api-authorization/AuthorizeService'
import { Matches } from "./Matches"
import { UserBets } from "./UserBets"

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
            ? <p><em>Loading...</em></p>
            : this.renderDataTable(this.state.data);

        return (
            <div>
                <h1 id="tabelLabel" >Hlavní část</h1>
                {contents}
            </div>
        );
    }

    private async getData() {
        //const token = await authService.getAccessToken();
        const data = await getApi().getData();
        this.setState({ data: data, loading: false });
    }

    private renderDataTable(data: MainData) {
        return (
            <div className="container body-content">
                <div className="row">
                    <Matches matches={ data.matches } />
                    <UserBets bets={ data.userBets} />
                    {/*<Ranking />*/}
                </div>
            </div>
        );
    }
}

