import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
  VerifyID,
  MsgDetail
} from '../pages/User';
import MyPowerStation from '../pages/SunCity/MyPowerStation';
import EquipmentInfo from '../pages/SunCity/EquipmentInfo';
import AddInverter from '../pages/SunCity/AddInverter';
import SunIntegral from '../pages/Mining/SunIntegral';
import { Modal, Toast } from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import { reqUpdateGeolocation } from '../stores/user/request';

const alert = Modal.alert;
// 获取当前城市天气信息
global.getWeather = function(res) {
  if (res.status === 'success') {
    global.weather = res.results[0].weather_data[0];
  }
};

// 动态创建script获取跨域天气数据
function createScript(city) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  const url = `http://api.map.baidu.com/telematics/v3/weather?access_token=8d5bc2ec001fb54d149674d68f3acab4&location=${city}&output=json&ak=IiFwStYYfy07Fu4L3wSI6qFLVzxulkNH&callback=getWeather`;
  script.src = url;
  document.body.appendChild(script);
}

// 获取城市地址
function getAddress(longitude, latitude) {
  let city;
  var point = new window.BMap.Point(longitude, latitude);
  var gc = new window.BMap.Geocoder();
  gc.getLocation(point, rs => {
    const addComp = rs.addressComponents;
    city = addComp.city;
    createScript(city);
  });
}

function onSuccess(publicKey) {
  return function(position) {
    Toast.show('获取坐标成功');
    getAddress(position.coords.longitude, position.coords.latitude);
    reqUpdateGeolocation({
      rectangle: position.coords.latitude + ',' + position.coords.longitude,
      publicKey
    })
      .then(res => {
        console.log(res);
        Toast.show('上传坐标成功');
      })
      .catch(err => {
        console.log('上传坐标失败');
        console.log(JSON.stringify(err.response));
        Toast.show('上传坐标失败');
      });
  };
}

function onError(error) {
  Toast.show('获取坐标失败');
}

@inject('keyPair')
@observer
class PrimaryRoute extends React.Component {
  constructor(props) {
    super(props);
    const hasKey = props.keyPair.checkKeyPairExist();
    if (!hasKey) {
      alert('该账号没有私钥', '这将导致app大部分功能不可用。是否现在去生成？', [
        { text: '再等等' },
        {
          text: '马上去',
          onPress: () => {
            props.history.push('/user/myData');
          }
        }
      ]);
    }
  }

  componentDidMount() {
    getAddress(116, 40);
    if (this.props.keyPair.hasKey) {
      this.uploadUserLocation(this.props.keyPair.publicKey);
    }
  }

  /**
   * 每次app唤醒时，更新用户坐标
   */
  uploadUserLocation = publicKey => {
    if (window.cordova) {
      navigator.geolocation.getCurrentPosition(onSuccess(publicKey), onError, {
        maximumAge: 300000,
        timeout: 5000,
        enableHighAccuracy: true
      });
    }
  };

  render() {
    return (
      <Switch>
        <Route exact path={'/'} component={Home} />
        <Route exact path={'/sunCity'} component={Home} />
        <Route exact path={'/mining'} component={Home} />
        <Route exact path={'/user'} component={Home} />
        <Route exact path={'/apply'} component={Home} />
        {/* 太阳城 */}
        <Route exact path="/sunCity/powerStation" component={MyPowerStation} />
        <Route
          exact
          path="/sunCity/equipmentInfo/:id"
          component={EquipmentInfo}
        />
        <Route exact path="/sunCity/addInverter" component={AddInverter} />

        {/* 挖宝 */}
        <Route exact path="/mining/sunIntegral" component={SunIntegral} />

        {/* 用户 */}

        <Route exact path={'/user/about'} component={About} />
        <Route exact path={`/user/accountSetting`} component={AccountSetting} />
        <Route exact path={'/user/msgCenter'} component={MsgCenter} />
        <Route
          exact
          path={'/user/msgDetail/:messageId'}
          component={MsgDetail}
        />
        <Route exact path={'/user/myData'} component={MyData} />
        <Route exact path={'/user/myStation'} component={MyStation} />
        <Route exact path={'/user/personalInfo'} component={PersonalInfo} />
        <Route
          exact
          path={'/user/personalNickname/:id'}
          component={PersonalNickname}
        />
        <Route exact path={'/user/resetPW'} component={ResetPW} />
        <Route exact path={'/user/resetTradePW'} component={ResetTradePW} />
        <Route exact path={'/user/resetLoginPW'} component={ResetLoginPW} />
        <Route exact path={'/user/verifyID/:id'} component={VerifyID} />
      </Switch>
    );
  }
}

export default PrimaryRoute;
