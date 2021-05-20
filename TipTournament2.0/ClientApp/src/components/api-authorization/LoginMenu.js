import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { getApi } from '../api/ApiFactory';

export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            didPayed: false,
            userName: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        const didPayed = await getApi().getDidPayed();
        this.setState({
            isAuthenticated,
            didPayed,
            userName: user && user.name
        });
    }

    render() {
        const { isAuthenticated, didPayed, userName } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, didPayed, profilePath, logoutPath);
        }
    }

    authenticatedView(userName, didPayed, profilePath, logoutPath) {
        const didPayedLabel = didPayed ? "Zaplaceno" : "NEZAPLACENO";
        const didPayedClassName = didPayed ? "text-success" : "text-danger";
        return (<Fragment>
            <NavItem>
                <NavLink className="text-dark" >Nazdar {userName}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink className={didPayedClassName}>{didPayedLabel}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={logoutPath}>Odhlásit se</NavLink>
            </NavItem>
        </Fragment>);

    }

    anonymousView(registerPath, loginPath) {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={registerPath}>Registrovat se</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={loginPath}>Přihlásit se</NavLink>
            </NavItem>
        </Fragment>);
    }
}
