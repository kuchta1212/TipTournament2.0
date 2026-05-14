import React, { Component, Fragment } from 'react';
import { Route } from 'react-router';
import { Login } from './Login'
import { Logout } from './Logout'
import { ApplicationPaths, LoginActions, LogoutActions } from './ApiAuthorizationConstants';

export default class ApiAuthorizationRoutes extends Component {

  render () {
    return(
      <Fragment>
          <Route path={ApplicationPaths.Login} render={() => loginAction(LoginActions.Login)} />
          <Route path={ApplicationPaths.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)} />
          <Route path={ApplicationPaths.Register} render={() => loginAction(LoginActions.Register)} />
          <Route path={ApplicationPaths.Recovery} render={() => loginAction(LoginActions.Recovery)} />
          <Route path={ApplicationPaths.LogOut} render={() => logoutAction(LogoutActions.Logout)} />
          <Route path={ApplicationPaths.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)} />
      </Fragment>);
  }
}

function loginAction(name){
    return (<Login action={name}></Login>);
}

function logoutAction(name) {
    return (<Logout action={name}></Logout>);
}
