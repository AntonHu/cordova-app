import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from '../pages/Home';
import {
  About,
  AccountSetting,
  MsgCenter,
  MyData,
  MyStation,
  PersonalInfo,
  PersonalNickname,
  ResetPW,
  ResetTradePW,
  ResetLoginPW,
  User,
  VerifyID
} from '../pages/User';
import MyPowerStation from '../pages/SunCity/MyPowerStation';
import EquipmentInfo from '../pages/SunCity/EquipmentInfo';
import SunIntegral from '../pages/Mining/SunIntegral';

class PrimaryRoute extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path={'/'} component={Home}/>
        <Route exact path={'/sunCity'} component={Home}/>
        <Route exact path={'/mining'} component={Home}/>
        <Route exact path={'/user'} component={Home}/>
        <Route exact path={'/apply'} component={Home}/>
        {/* 太阳城 */}
        <Route exact path="/sunCity/powerStation" component={MyPowerStation}/>
        <Route exact path="/sunCity/equipmentInfo/:id" component={EquipmentInfo}/>

        {/* 挖宝 */}
        <Route exact path="/mining/sunIntegral" component={SunIntegral}/>

        {/* 用户 */}

        <Route exact path={'/user/about'} component={About}/>
        <Route
          exact
          path={`/user/accountSetting`}
          component={AccountSetting}
        />
        <Route exact path={'/user/msgCenter'} component={MsgCenter}/>
        <Route exact path={'/user/myData'} component={MyData}/>
        <Route exact path={'/user/myStation'} component={MyStation}/>
        <Route exact path={'/user/personalInfo'} component={PersonalInfo}/>
        <Route
          exact
          path={'/user/personalNickname/:id'}
          component={PersonalNickname}
        />
        <Route exact path={'/user/resetPW'} component={ResetPW}/>
        <Route exact path={'/user/resetTradePW'} component={ResetTradePW}/>
        <Route exact path={'/user/resetLoginPW'} component={ResetLoginPW}/>
        <Route exact path={'/user/verifyID/:id'} component={VerifyID}/>
      </Switch>
    )
  }
}

export default PrimaryRoute;
