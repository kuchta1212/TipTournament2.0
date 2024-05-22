import * as React from 'react';
import { User } from "../../typings/index"
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
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
        className += this.props.currentUser === this.props.user.id ? " bg-secondary" : "";
        let beforeLimit = new Date() <= new Date("2024-06-14 21:00");
        return (
            <React.Fragment>
                <td className={className}>
                    {beforeLimit ? <div className={this.getTextClassName()}>{this.getContent()}</div> : <NavLink tag={Link} className={this.getTextClassName()} to={this.getLink()}>{this.getContent()}</NavLink>}
                </td>
                <td>{this.props.user.alfaPoints}</td>
                <td>{this.props.user.gamaPoints}</td>
                <td>{this.props.user.deltaPoints}</td>
                <td>{this.props.user.lambdaPoints}</td>
                <td>{this.props.user.omikronPoints}</td>
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
                : "";
    }
}

