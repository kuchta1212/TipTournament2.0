import * as React from 'react';
import { User } from "../../typings/index"


interface UserRowProps {
    user: User,
    index: number,
    currentUser: string
}

export class UserRow extends React.Component<UserRowProps> {

    constructor(props: UserRowProps) {
        super(props);
    }

    public render() {
        let className = this.props.index >= 0 && this.props.index <= 2
            ? "text-success"
            : this.props.index > 2 && this.props.index < 5
                ? "text-warning"
                : "";
        className += this.props.currentUser == this.props.user.id ? " bg-secondary" : "";
        return (
            <React.Fragment>
                <td className={className}>{this.props.index + 1}. {this.props.user.userName}  {this.didPay()}</td>
                <td>{this.props.user.alfaPoints}</td>
                <td>{this.props.user.gamaPoints}</td>
                <td>{this.props.user.deltaPoints}</td>
                <td>{this.props.user.lambdaPoints}</td>
                <td>{this.props.user.omikronPoints}</td>
                <td className="font-weight-bold">{this.props.user.totalPoints}</td>
            </React.Fragment>
        );

    }

    private didPay() {
        return !this.props.user.payed ? <p className="font-weight-light text-danger">NEZAPLACENO</p> : <p/>
    }
}

