import React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { LoginActions, QueryParameterNames, ApplicationPaths } from './ApiAuthorizationConstants';
import { Loader } from './../Loader'

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined,
            email: '',
            password: '',
            isLoading: false,
            action: props.action
        };
    }

    componentDidMount() {
        const action = this.props.action;
        if (action === LoginActions.Login) {
            // Show login form
        } else if (action === LoginActions.Register) {
            this.setState({ action: LoginActions.Register });
        } else if (action === LoginActions.LoginFailed) {
            const params = new URLSearchParams(window.location.search);
            const error = params.get(QueryParameterNames.Message);
            this.setState({ message: error });
        }
    }

    render() {
        const { message, action } = this.state;

        if (!!message) {
            return <div>{message}</div>
        }

        if (action === LoginActions.Register) {
            return this.renderRegisterForm();
        }

        return this.renderLoginForm();
    }

    renderLoginForm() {
        const { email, password, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="justify-content-center">
                    <p className="display-4">Chvilku, přihlašuju!</p>
                    <Loader />
                </div>
            );
        }

        return (
            <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                <h2 className="text-light mb-4">Přihlášení</h2>
                <form onSubmit={(e) => this.handleLogin(e)}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Uživatelské jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Přihlásit se</button>
                </form>
            </div>
        );
    }

    renderRegisterForm() {
        const { email, password, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="justify-content-center">
                    <p className="display-4">Registruji...</p>
                    <Loader />
                </div>
            );
        }

        return (
            <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                <h2 className="text-light mb-4">Registrace</h2>
                <form onSubmit={(e) => this.handleRegister(e)}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrovat se</button>
                </form>
            </div>
        );
    }

    async handleLogin(e) {
        e.preventDefault();
        this.setState({ isLoading: true, message: undefined });

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ userName: this.state.email, password: this.state.password })
            });

            if (response.ok) {
                authService._user = null;
                authService.notifySubscribers();
                const returnUrl = this.getReturnUrl();
                window.location.replace(returnUrl);
            } else {
                const data = await response.json();
                this.setState({ message: data.message || 'Přihlášení se nezdařilo.', isLoading: false });
            }
        } catch (error) {
            this.setState({ message: 'Chyba při přihlašování.', isLoading: false });
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        this.setState({ isLoading: true, message: undefined });

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ email: this.state.email, password: this.state.password })
            });

            if (response.ok) {
                authService._user = null;
                authService.notifySubscribers();
                window.location.replace('/');
            } else {
                const data = await response.json();
                const errorMsg = data.errors
                    ? data.errors.map(e => e.description).join(' ')
                    : 'Registrace se nezdařila.';
                this.setState({ message: errorMsg, isLoading: false });
            }
        } catch (error) {
            this.setState({ message: 'Chyba při registraci.', isLoading: false });
        }
    }

    getReturnUrl() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
        }
        return fromQuery || `${window.location.origin}/`;
    }
}
