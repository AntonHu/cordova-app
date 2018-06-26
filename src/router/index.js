import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'mobx-react';
import * as stores from '../stores';
import {
  Login,
} from '../pages/User';
import AuthorizedRoute from './AuthorizedRoute';
import PrimaryRoute from './PrimaryRoute';

const RouteFallback = props => {
  return (
    <Redirect
      to={{
        pathname: '/app',
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
            <AuthorizedRoute path="/app" component={PrimaryRoute} />
            <Route path="/login" component={Login}/>
            <Route component={RouteFallback} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default AllRoutes;
