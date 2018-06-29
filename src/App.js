import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Routes from './router';
import {reqUpdateGeolocation} from './stores/user/request';
import {Toast} from 'antd-mobile'

function onSuccess(position) {
  Toast.show('获取坐标成功');
  reqUpdateGeolocation({
    rectangle: position.coords.latitude + ',' + position.coords.longitude
  })
    .then(res => {
      console.log(res);
      Toast.show('上传坐标成功');
    })
    .catch(err => {
      console.log(err.response);
      Toast.show('上传坐标失败');
    })
};

function onError(error) {
  Toast.show('获取坐标失败');
}


class App extends React.Component {
  componentDidMount() {
    this.uploadUserLocation();
  }

  /**
   * 每次app唤醒时，更新用户坐标
   */
  uploadUserLocation = () => {
    if (window.cordova) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        maximumAge: 300000,
        timeout: 5000,
        enableHighAccuracy: true
      });
    }
  };

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="App">
        <Routes/>
        {/*<SM2Demo />*/}
        {/*<Home/>*/}
      </div>
    );
  }
}

export default App;
