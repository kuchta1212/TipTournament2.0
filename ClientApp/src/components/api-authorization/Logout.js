import React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { LogoutActions, ApplicationPaths } from './ApiAuthorizationConstants';
import { Loader } from './../Loader'

export class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined,
            isReady: false
        };
    }

    componentDidMount() {
        const action = this.props.action;
        switch (action) {
            case LogoutActions.Logout:
                this.logout();
                break;
            case LogoutActions.LoggedOut:
                this.setState({ isReady: true, message: "Odhlásili jste se." });
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }

    render() {
        const { isReady, message } = this.state;
        if (!isReady) {
            return (
                <div className="justify-content-center">
                    <p className="display-4">Chvilku, odhlašuju!</p>
                    <Loader />
                </div>
            );
        }
        return (<div className="text-light">{message}</div>);
    }

    async logout() {
        const result = await authService.signOut();
        switch (result.status) {
            case AuthenticationResultStatus.Success:
                window.location.replace(`${window.location.origin}${ApplicationPaths.LoggedOut}`);
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ isReady: true, message: result.message });
                break;
            default:
                throw new Error("Invalid authentication result status.");
        }
    }
}
