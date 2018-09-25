import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Routes from './router';
import SM2Demo from './pages/SM2Demo';
import Secp256k1 from './pages/Secp256k1';

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


class App extends React.Component {

  componentDidMount() {
    // this.checkCodePush();
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

  render() {
    return (
      <div className="App">
        <Routes/>
        {/*<SM2Demo />*/}
        {/*<Secp256k1 />*/}
        {/*<Home/>*/}
      </div>
    );
  }
}

export default App;
