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
                <td className={className}>{this.props.index + 1}. {this.props.user.userName}</td>
                <td>{this.props.user.points}</td>
            </React.Fragment>
        );

    }
}

