import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import ResetPW from './pages/User/ResetPW';
import VerifyID from './pages/User/VerifyID';
import MyData from './pages/User/MyData';
import PersonalInfo from './pages/User/PersonalInfo';
import User from './pages/User/User';
import About from './pages/User/About';
import AccountSetting from './pages/User/AccountSetting';
import MyStation from './pages/User/MyStation';
import MsgCenter from './pages/User/MsgCenter';

import Apply from './pages/Apply/Apply';

import EquipmentInfo from './pages/Equipment/EquipmentInfo';

class App extends React.Component {
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="App">
        <EquipmentInfo></EquipmentInfo>
      </div>
    );
  }
}

export default App;
