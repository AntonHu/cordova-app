import React from 'react';
import {Link} from 'react-router-dom';
import {PageWithHeader, PlainButton} from '../../../components';
import {List} from 'antd-mobile';
import User from '../../../utils/user';
import {maskIfPhone} from '../../../utils/methods';
import {KEY_PAIR_LOCAL_STORAGE} from '../../../utils/variable';
import {deleteLocalStorage} from '../../../utils/storage';
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
@inject('userStore', 'keyPair')
@observer
class Comp extends React.Component {

  /**
   * 删除token
   * 删除公私钥对
   * @param e
   */
  onLogout = (e) => {
    e.preventDefault();
    const user = new User();
    user.logout();
    this.props.keyPair.clearKeyPair();
    this.props.userStore.deleteIsKycInChain();
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
      <div className={'page-account-setting'}>
        <PageWithHeader title={'账号设置'}>
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
      </div>
    );
  }
}

export default Comp;
