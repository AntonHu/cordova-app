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
  VerifyID,
  MsgDetail,
  Introduction,
  Agreement,
  InviteFriends,
  InviteDetail
} from '../pages/User';
import MyPowerStation from '../pages/SunCity/MyPowerStation';
import EquipmentInfo from '../pages/SunCity/EquipmentInfo';
import AddInverter from '../pages/SunCity/AddInverter';
import SunIntegral from '../pages/Mining/SunIntegral';
import PointRule from '../pages/Mining/PointRule';
import {Modal} from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import {reqUpdateGeolocation} from '../stores/user/request';
import {ToastNoMask} from '../components';
import {setLocalStorage} from '../utils/storage';

const alert = Modal.alert;

// 获取城市地址
function getAddress(longitude, latitude) {
  let city;
  var point = new window.BMap.Point(longitude, latitude);
  var gc = new window.BMap.Geocoder();
  gc.getLocation(point, rs => {
    const addComp = rs.addressComponents;
    city = addComp.city && addComp.city.replace('市', '');
    // 保存当前城市
    setLocalStorage('city', city);
  });
}

function onSuccess(publicKey) {
  return function (position) {
    // ToastNoMask('获取坐标成功');
    getAddress(position.coords.longitude, position.coords.latitude);
    reqUpdateGeolocation({
      rectangle: position.coords.latitude + ',' + position.coords.longitude,
      publicKey
    })
      .then(res => {
        console.log(res);
        // ToastNoMask('上传坐标成功');
      })
      .catch(err => {
        // console.log('上传坐标失败');
        console.log(JSON.stringify(err.response));
        // ToastNoMask('上传坐标失败');
      });
  };
}

function onError(error) {
  // ToastNoMask('获取坐标失败');
}

function syncCallback(syncStatus) {
  const SyncStatus = window.SyncStatus;
  switch (syncStatus) {
    case SyncStatus.UP_TO_DATE:
      console.log('您的应用是最新的。');
      break;
    case SyncStatus.UPDATE_INSTALLED:
      console.log('已经更新完成，重启APP生效。');
      // alert('更新', 'app已安装更新，即将重启。', [{text: '确定', onPress: () => {
      //   window.codePush.restartApplication();
      // }}]);
      break;
    case SyncStatus.UPDATE_IGNORED:
      console.log('您取消了更新');
      break;
    case SyncStatus.IN_PROGRESS:
      console.log('正在更新，请稍候...');
      break;
    case SyncStatus.ERROR:
      console.log('发生错误');
      break;
    case SyncStatus.CHECKING_FOR_UPDATE:
      console.log('检查更新状态，请稍候...');
      break;
    case SyncStatus.AWAITING_USER_ACTION:
      console.log('等待用户操作');
      break;
    case SyncStatus.DOWNLOADING_PACKAGE:
      console.log('正在下载更新，请稍候...');
      break;
    case SyncStatus.INSTALLING_UPDATE:
      console.log('正在安装更新，请稍候...');
      break;
  }
}


@inject('keyPair')
@observer
class PrimaryRoute extends React.Component {
  constructor(props) {
    super(props);
    const hasKey = props.keyPair.checkKeyPairExist();
    if (!hasKey) {
      alert(
        '该账号没有私钥',
        '这将导致app大部分功能不可用，如查看逆变器、添加逆变器、收取太阳积分、查看太阳积分等。是否现在去生成？',
        [
          {
            text: '再等等'
          },
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
    if (this.props.keyPair.hasKey) {
      this.uploadUserLocation(this.props.keyPair.publicKey);
    }
    this.checkCodePush();
  }

  /**
   * 判断在app内，且在wifi环境下
   * @returns {boolean}
   */
  isAppUsingWifi = () => {
    if (navigator.connection && window.Connection) {
      if (navigator.connection.type === window.Connection.WIFI) {
        return true;
      }
    }
    return false;
  };

  /**
   * 检查codePush更新
   */
  checkCodePush = () => {
    if (window.codePush && this.isAppUsingWifi()) {
      const InstallMode = window.InstallMode;
      window.codePush.sync(syncCallback, {
        installMode: InstallMode.ON_NEXT_RESUME
      })
    }
  };

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
        <Route exact path={'/'} component={Home}/>
        <Route exact path={'/sunCity'} component={Home}/>
        <Route exact path={'/mining'} component={Home}/>
        <Route exact path={'/user'} component={Home}/>
        <Route exact path={'/apply'} component={Home}/>
        {/* 太阳城 */}
        <Route exact path="/sunCity/powerStation" component={MyPowerStation}/>
        <Route
          exact
          path="/sunCity/equipmentInfo/:id"
          component={EquipmentInfo}
        />
        <Route exact path="/sunCity/addInverter" component={AddInverter}/>

        {/* 挖宝 */}
        <Route exact path="/mining/sunIntegral" component={SunIntegral}/>
        <Route exact path="/mining/pointRule" component={PointRule}/>

        {/* 用户 */}

        <Route exact path={'/user/about'} component={About}/>
        <Route exact path={`/user/accountSetting`} component={AccountSetting}/>
        <Route exact path={'/user/msgCenter'} component={MsgCenter}/>
        <Route
          exact
          path={'/user/msgDetail/:messageId'}
          component={MsgDetail}
        />
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
        <Route exact path={'/user/introduction'} component={Introduction}/>
        <Route exact path={'/user/agreement'} component={Agreement}/>
        <Route exact path={'/user/inviteFriends'} component={InviteFriends}/>
        <Route exact path={'/user/inviteDetail'} component={InviteDetail}/>
      </Switch>
    );
  }
}

export default PrimaryRoute;
