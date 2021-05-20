import * as React from 'react';
import { getAdminApi } from "../api/ApiFactory"
import { User } from "../../typings/index"

interface UserRowState {
    payed: boolean
}

interface UserRowProps {
    user: User,
}

export class UserRow extends React.Component<UserRowProps, UserRowState> {
    constructor(props: UserRowProps) {
        super(props);

        this.state = { payed: this.props.user.payed }
    }

    public render() {
        return this.state.payed
            ? this.renderPayed()
            : this.renderNotPayed()
    }

    private renderPayed() {
        return (<React.Fragment>
            <td>{this.props.user.userName}</td>
            <td className="text-success">Zaplaceno</td>
            <td><button onClick={() => this.cancelPayment()}>Zrušit placení</button></td>
        </React.Fragment>)
    }

    private renderNotPayed() {
        return (
            <React.Fragment>
                <td>{this.props.user.userName}</td>
                <td className="text-danger">NEZAPLACENO</td>
                <td><button onClick={() => this.payed()}>Zaplatil</button></td>
            </React.Fragment>
        );
    }

    private cancelPayment() {
        this.setState({ payed: false })
        getAdminApi().payed(this.props.user.id, false);
    }

    private payed() {
        this.setState({ payed: true })
        getAdminApi().payed(this.props.user.id, true);
    }
}

