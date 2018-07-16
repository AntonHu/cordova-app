import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill'; // 添加async函数支持
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

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
    if (device.platform !== 'Android') {
      JPush.setApplicationIconBadgeNumber(0);
    }
  } catch (err) {
    // navigator.notification.alert(err);
  }
};

const setStatusBar = () => {
  if (window.StatusBar) {
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.styleDefault();
  }
};

/**
 * app环境
 */
const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  startJAnalytics();
  startJPush();
  setStatusBar();
  // registerServiceWorker();
};

/**
 * 浏览器环境
 */
const startSimpleApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
};

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startSimpleApp();
}
