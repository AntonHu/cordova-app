import React from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import * as stores from '../stores';
import {
  Login,
  Register,
  ForgetLoginPW
} from '../pages/User';
import AuthorizedRoute from './AuthorizedRoute';
import PrimaryRoute from './PrimaryRoute';
import './index.less'

const RouteFallback = props => {
  return (
    <Redirect
      to={{
        pathname: '/',
        from: props.location
      }}
    />
  );
};


class AllRoutes extends React.PureComponent {
  render() {
    return (
      <Provider {...stores}>
        <HashRouter>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/forgetLoginPW" component={ForgetLoginPW}/>
            <AuthorizedRoute path="/" component={PrimaryRoute} />
            <Route component={RouteFallback} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default AllRoutes;
