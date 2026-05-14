export const ApplicationName = 'TipTournament2._0';

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const LogoutActions = {
  Logout: 'logout',
  LoggedOut: 'logged-out'
};

export const LoginActions = {
  Login: 'login',
  LoginFailed: 'login-failed',
  Register: 'register',
  Recovery: 'recovery'
};

const prefix = '/authentication';

export const ApplicationPaths = {
  DefaultLoginRedirectPath: '/',
  ApiAuthorizationPrefix: prefix,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  Register: `${prefix}/${LoginActions.Register}`,
  Recovery: `${prefix}/${LoginActions.Recovery}`,
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`
};
