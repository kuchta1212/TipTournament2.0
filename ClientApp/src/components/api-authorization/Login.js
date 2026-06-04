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
            userName: '',
            email: '',
            password: '',
            recoveryCode: '',
            isLoading: false,
            action: props.action,
            generatedRecoveryCode: undefined,
            redirectAfterSave: '/'
        };
    }

    componentDidMount() {
        const action = this.props.action;
        if (action === LoginActions.LoginFailed) {
            const params = new URLSearchParams(window.location.search);
            const error = params.get(QueryParameterNames.Message);
            this.setState({ message: error });
        }
    }

    render() {
        const { message, action, generatedRecoveryCode } = this.state;

        if (generatedRecoveryCode) {
            return this.renderRecoveryCodeSavePrompt();
        }

        if (!!message && action !== LoginActions.Login && action !== LoginActions.Register && action !== LoginActions.Recovery) {
            return <div>{message}</div>
        }

        if (action === LoginActions.Register) {
            return this.renderRegisterForm();
        }

        if (action === LoginActions.Recovery) {
            return this.renderRecoveryForm();
        }

        return this.renderLoginForm();
    }

    renderLoginForm() {
        const { email, password, isLoading, message } = this.state;

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
                <h2 className="mb-4">Přihlášení</h2>
                {message && <div className="alert alert-danger" role="alert">{message}</div>}
                <form onSubmit={(e) => this.handleLogin(e)}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Uživatelské jméno nebo email</label>
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
                <div className="mt-3 text-center">
                    <a href={ApplicationPaths.Recovery}>Zapomněl jsi heslo? Použij záchranný kód</a>
                </div>
            </div>
        );
    }

    renderRegisterForm() {
        const { userName, email, password, isLoading, message } = this.state;

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
                <h2 className="mb-4">Registrace</h2>
                {message && <div className="alert alert-danger" role="alert">{message}</div>}
                <form onSubmit={(e) => this.handleRegister(e)}>
                    <div className="form-group mb-3">
                        <label htmlFor="userName">Uživatelské jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userName"
                            value={userName}
                            onChange={(e) => this.setState({ userName: e.target.value })}
                            autoComplete="username"
                            required
                        />
                    </div>
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

    renderRecoveryForm() {
        const { email, recoveryCode, password, isLoading, message } = this.state;

        if (isLoading) {
            return (
                <div className="justify-content-center">
                    <p className="display-4">Obnovuju heslo...</p>
                    <Loader />
                </div>
            );
        }

        return (
            <div className="container" style={{ maxWidth: '440px', marginTop: '50px' }}>
                <h2 className="mb-2">Obnova hesla</h2>
                <p className="text-muted mb-4">
                    Zadej svůj email (nebo uživatelské jméno), záchranný kód a nové heslo. Záchranný kód jsi dostal mailem od admina (nebo při registraci).
                </p>
                {message && <div className="alert alert-danger" role="alert">{message}</div>}
                <form onSubmit={(e) => this.handleRecovery(e)}>
                    <div className="form-group mb-3">
                        <label htmlFor="rec-email">Email nebo uživatelské jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            id="rec-email"
                            value={email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="rec-code">Záchranný kód</label>
                        <input
                            type="text"
                            className="form-control"
                            id="rec-code"
                            placeholder="tip-XXXX-XXXX-XXXX"
                            value={recoveryCode}
                            onChange={(e) => this.setState({ recoveryCode: e.target.value.trim() })}
                            autoComplete="off"
                            spellCheck="false"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="rec-new-password">Nové heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            id="rec-new-password"
                            value={password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Nastavit nové heslo</button>
                </form>
                <div className="mt-3 text-center">
                    <a href={ApplicationPaths.Login}>Zpátky na přihlášení</a>
                </div>
            </div>
        );
    }

    renderRecoveryCodeSavePrompt() {
        const { generatedRecoveryCode, redirectAfterSave } = this.state;
        return (
            <div className="container" style={{ maxWidth: '480px', marginTop: '50px' }}>
                <h2 className="mb-3">Záchranný kód</h2>
                <div className="alert alert-warning" role="alert">
                    <strong>Ulož si tento kód!</strong> Pokud zapomeneš heslo, pomocí tohoto kódu si ho budeš moct obnovit. Bez něj ztratíš účet. Nikomu ho nedávej.
                </div>
                <div className="form-control mb-3" style={{
                    fontFamily: 'monospace',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    fontWeight: 700,
                    padding: '0.85rem',
                    letterSpacing: '0.05em',
                    cursor: 'text'
                }}>
                    {generatedRecoveryCode}
                </div>
                <div className="d-flex" style={{ gap: '0.5rem' }}>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            navigator.clipboard?.writeText(generatedRecoveryCode);
                        }}
                    >
                        Zkopírovat
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary flex-grow-1"
                        onClick={() => window.location.replace(redirectAfterSave)}
                    >
                        Mám to uložené, pokračovat
                    </button>
                </div>
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
                body: JSON.stringify({ userName: this.state.userName, email: this.state.email, password: this.state.password })
            });

            if (response.ok) {
                const data = await response.json();
                authService._user = null;
                authService.notifySubscribers();
                // Show recovery code first; the "continue" button redirects.
                this.setState({
                    isLoading: false,
                    generatedRecoveryCode: data.recoveryCode,
                    redirectAfterSave: '/'
                });
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

    async handleRecovery(e) {
        e.preventDefault();
        this.setState({ isLoading: true, message: undefined });

        try {
            const response = await fetch('/api/auth/recovery/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    email: this.state.email,
                    recoveryCode: this.state.recoveryCode,
                    newPassword: this.state.password
                })
            });

            if (response.ok) {
                authService._user = null;
                authService.notifySubscribers();
                const returnUrl = this.getReturnUrl();
                window.location.replace(returnUrl);
            } else {
                const data = await response.json();
                const errorMsg = data.errors
                    ? data.errors.map(e => e.description).join(' ')
                    : (data.message || 'Obnova hesla se nezdařila.');
                this.setState({ message: errorMsg, isLoading: false });
            }
        } catch (error) {
            this.setState({ message: 'Chyba při obnově hesla.', isLoading: false });
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
