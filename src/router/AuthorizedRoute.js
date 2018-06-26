//@flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import User from '../utils/user';

const user = new User();

const AuthorizedRoute = (props) => {
  const { component: Component, path } = props;
  return (
    <Route
      path={path}
      render={props =>
        user.isLogin() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AuthorizedRoute;
