import * as React from 'react';
import { User } from "../../typings/index"
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

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
        let className = this.getTextClassName();
        let beforeLimit = new Date() <= new Date("2024-06-14T21:00:00Z");
        return (
            <React.Fragment>
                <td className={className}>
                    {beforeLimit ? <div className={this.getTextClassName()}>{this.getContent()}</div> : <NavLink tag={Link} className={this.getTextClassName()} to={this.getLink()}>{this.getContent()}</NavLink>}
                </td>
                <td className="detail-col">{this.props.user.alfaPoints}</td>
                <td className="detail-col">{this.props.user.gamaPoints}</td>
                <td className="detail-col">{this.props.user.deltaPoints}</td>
                <td className="detail-col">{this.props.user.lambdaPoints}</td>
                <td className="detail-col">{this.props.user.omikronPoints}</td>
                <td className="font-weight-bold">{this.props.user.totalPoints}</td>
            </React.Fragment>
        );
    }

    private getContent(): string {
        return `${this.props.index + 1}. ${this.props.user.userName}`;
    }

    private getLink(): string {
        return `/user/${this.props.user.id}`
    }

    private getTextClassName(): string {
        return this.props.index >= 0 && this.props.index <= 2
            ? "text-success"
            : this.props.index > 2 && this.props.index < 5
                ? "text-warning"
                : "text-dark";
    }
}
