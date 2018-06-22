import React from 'react';
import {
  HashRouter,
  Route,
  Link,
  Switch,
  BrowserRouter,
  withRouter
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import * as stores from '../stores';
import Home from '../pages/Home';
import {
  About,
  AccountSetting,
  Login,
  MsgCenter,
  MyData,
  MyStation,
  PersonalInfo,
  Register,
  ResetPW,
  User,
  VerifyID
} from '../pages/User';
import MyPowerStation from '../pages/SunCity/MyPowerStation';
import EquipmentInfo from '../pages/SunCity/EquipmentInfo';
import SunIntegral from '../pages/Mining/SunIntegral';

class AllRoutes extends React.PureComponent {
  render() {
    return (
      <Provider {...stores}>
        <HashRouter>
          <Switch>
            <Route exact path={'/'} component={Home} />
            {/* 太阳城 */}
            <Route exact path="/powerStation" component={MyPowerStation} />
            <Route exact path="/equipmentInfo/:id" component={EquipmentInfo} />

            {/* 挖宝 */}
            <Route exact path="/sunIntegral" component={SunIntegral} />

            {/* 用户 */}
            <Route exact path={'/user'} component={User} />
            <Route exact path={'/user/about'} component={About} />
            <Route
              exact
              path={'/user/accountSetting'}
              component={AccountSetting}
            />
            <Route exact path={'/user/login'} component={Login} />
            <Route exact path={'/user/msgCenter'} component={MsgCenter} />
            <Route exact path={'/user/myData'} component={MyData} />
            <Route exact path={'/user/myStation'} component={MyStation} />
            <Route exact path={'/user/personalInfo'} component={PersonalInfo} />
            <Route exact path={'/user/register'} component={Register} />
            <Route exact path={'/user/resetPW'} component={ResetPW} />
            <Route exact path={'/user/verifyID'} component={VerifyID} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default AllRoutes;
