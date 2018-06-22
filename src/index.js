import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import 'babel-polyfill'; // 添加async函数支持
import './index.css';
import App from './App';
import MyPowerStation from './pages/SunCity/MyPowerStation';
import EquipmentInfo from './pages/SunCity/EquipmentInfo';
import SunIntegral from './pages/Mining/SunIntegral';
import registerServiceWorker from './registerServiceWorker';
import MyRoutes from './router';

const device = window.device;

const startJAnalytics = () => {
  const JAnalytics = window.JAnalytics;
  try {
    JAnalytics.init();
    JAnalytics.setDebugMode();
  } catch (err) {
    // navigator.notification.alert(err);
  }
};

const startJPush = () => {
  const JPush = window.JPush;
  try {
    JPush.init();
    JPush.setDebugMode(true);
    if (device.platform != 'Android') {
      JPush.setApplicationIconBadgeNumber(0);
    }
  } catch (err) {
    // navigator.notification.alert(err);
  }
};

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  startJAnalytics();
  startJPush();
  // registerServiceWorker();
};

const startSimpleApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
};

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startSimpleApp();
}
