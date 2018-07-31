import React from 'react';
import {BlueBox, PageWithHeader} from '../../../components';
import {List, Modal, ActivityIndicator} from 'antd-mobile';
import {Link} from 'react-router-dom'
import './style.less';

const Item = List.Item;
const alert = Modal.alert;

function syncCallback(syncStatus) {
  console.log(syncStatus);
  const SyncStatus = window.SyncStatus;
  switch (syncStatus) {
    case SyncStatus.UP_TO_DATE:
      this.setState({checking: false});
      alert('检查更新', '您的应用是最新的。', [{text: '好的'}]);
      break;
    case SyncStatus.UPDATE_INSTALLED:
      this.setState({checking: false});
      alert('检查更新', '已经更新完成，重启APP生效。', [{text: '好的'}]);
      break;
    case SyncStatus.UPDATE_IGNORED:
      this.setState({checking: false});
      alert('检查更新', '您取消了更新', [{text: '好的'}]);
      break;
    case SyncStatus.IN_PROGRESS:
      this.setState({checkText: '正在更新，请稍候...'});
      break;
    case SyncStatus.ERROR:
      this.setState({checking: false});
      alert('检查更新', '发生错误', [{text: '好的'}]);
      break;
    case SyncStatus.CHECKING_FOR_UPDATE:
      this.setState({checkText: '检查更新状态，请稍候...'});
      break;
    case SyncStatus.AWAITING_USER_ACTION:
      this.setState({checkText: '等待用户操作'});
      break;
    case SyncStatus.DOWNLOADING_PACKAGE:
      this.setState({checkText: '正在下载更新，请稍候...'});
      break;
    case SyncStatus.INSTALLING_UPDATE:
      this.setState({checkText: '正在安装更新，请稍候...'});
      break;
  }
}

const ListData = [
  {
    text: '用户协议',
    horizontal: true,
    onClick: function () {
      this.props.history.push('/user/agreement');
    }
  },
  {
    text: '检查更新',
    horizontal: true,
    onClick: function () {
      if (window.codePush) {
        const _syncCallback = syncCallback.bind(this);
        const InstallMode = window.InstallMode;

        this.setState({
          checking: true
        });

        window.codePush.sync(
          _syncCallback,
          {
            updateDialog: {
              appendReleaseDescription: true,
              descriptionPrefix: '更新内容:',
              optionalIgnoreButtonLabel: '取消',
              optionalInstallButtonLabel: '立即更新',
              optionalUpdateMessage: '',
              updateTitle: '有更新可用'
            },
            installMode: InstallMode.IMMEDIATE
          }
        )
      } else {
        alert('注意', '检查更新必须在app环境下。', [{text: '好的'}])
      }

    }
  },
  {
    text: '客服电话',
    extra: '0571-26270118'
  }
];

/**
 * 关于
 */
class About extends React.PureComponent {

  state = {
    checking: false,
    checkText: '正在检查更新...',
    appVersion: '0.0.6'
  };

  onClick = (v) => {
    if (v.onClick) {
      v.onClick.call(this)
    }
  };

  componentDidMount() {
    // this.getPackageVersion();
  }

  getPackageVersion = () => {
    if (window.codePush) {
      const appVersion = window.LocalPackage.appVersion || '';
      this.setState({
        appVersion
      })
    }
  };

  render() {
    return (

        <PageWithHeader title={'关于我们'} id="page-about">
          <Link to="/user/introduction">
            <img src={require('../../../images/banner_1.png')} width="100%" className="banner"/>
          </Link>

          <List>
            {ListData.map((v, i) => {
              let extra = v.extra;
              if (v.text === '检查更新') {
                extra = this.state.appVersion
              }
              return (
                <Item
                  key={i}
                  arrow={v.horizontal && 'horizontal'}
                  extra={extra}
                  onClick={() => this.onClick(v)}
                >
                  {v.text}
                </Item>
              )
            })}
          </List>
          <ActivityIndicator
            toast
            text={this.state.checkText}
            animating={this.state.checking}
          />
        </PageWithHeader>


    );
  }
}

export default About;
