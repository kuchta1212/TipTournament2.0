import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { MainPage } from './components/MainPage/MainPage';
import { Bets } from './components/Bets/Bets'
import { AllBets } from './components/Bets/AllBets'
import { AdminPage } from './components/Admin/AdminPage'
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import AdminAuthorizeRoute from './components/api-authorization/AdminAuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
       <Layout>
        <AuthorizeRoute exact path='/' component={MainPage} />
        <AuthorizeRoute exact path="/tips" component={Bets} />
        <AuthorizeRoute exact path="/bets/all" component={AllBets} />
        <AuthorizeRoute exact path="/admin" component={AdminPage} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
