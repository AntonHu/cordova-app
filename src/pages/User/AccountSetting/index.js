import React from 'react';
import {Link} from 'react-router-dom';
import {PageWithHeader, PlainButton} from '../../../components';
import {List} from 'antd-mobile';
import User from '../../../utils/user';
import {maskIfPhone} from '../../../utils/methods';
import onAllStoreLogout from '../../../stores/onLogout';
import {observer, inject} from 'mobx-react';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '当前账号',
    horizontal: false
  },
  {
    text: '重置登录密码',
    path: 'resetLoginPW',
    horizontal: true
  },
  {
    text: '关于我们',
    path: 'about',
    horizontal: true
  }
];

/**
 * 账号设置
 */
@inject('userStore', 'keyPair', 'miningStore', 'sunCityStore')
@observer
class AccountSetting extends React.Component {

  /**
   * 删除token
   * 删除公私钥对
   * @param e
   */
  onLogout = (e) => {
    e.preventDefault();
    const user = new User();
    user.logout();
    onAllStoreLogout();
    this.props.history.replace('/');
  };

  getNameFromUserInfo = (userInfo) => {
    let name = '无';
    if (userInfo.nickName) {
      name = userInfo.nickName
    }
    if (userInfo.cellPhone) {
      name = maskIfPhone(userInfo.cellPhone)
    }
    if (userInfo.username) {
      name = maskIfPhone(userInfo.username);
    }
    return name;
  };

  render() {
    return (

        <PageWithHeader title={'账号设置'} id="page-account-setting">
          <List>
            {
              ListData.map((v, i) => {
                if (v.text === '当前账号') {
                  return <Item
                    arrow={v.horizontal && 'horizontal'}
                    extra={this.getNameFromUserInfo(this.props.userStore.userInfo)}
                    key={i}>
                    {v.text}
                  </Item>
                }
                return (
                  <Link key={i} to={`/user/${v.path}`}>
                    <Item arrow={v.horizontal && 'horizontal'}>{v.text}</Item>
                  </Link>
                )
              })
            }
          </List>

          <PlainButton onClick={this.onLogout}>退出登录</PlainButton>
        </PageWithHeader>

    );
  }
}

export default AccountSetting;
