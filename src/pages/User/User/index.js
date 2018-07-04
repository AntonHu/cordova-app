import React from 'react';
import { PageWithHeader, Picture } from '../../../components';
import { List, Icon } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '我的数据',
    extra: 'avatar',
    path: 'myData',
    unicode: '\ue68d'
  },
  {
    text: '我的电站',
    extra: '华',
    path: 'myStation',
    unicode: '\ue609'
  },
  {
    text: '消息中心',
    extra: '女',
    path: 'msgCenter',
    unicode: '\ue624'
  },
  {
    text: '账号设置',
    horizontal: true,
    path: 'accountSetting',
    unicode: '\ue60e'
  }
];

/**
 * 我的
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.PureComponent {

  componentDidMount() {
    this.props.userStore.fetchUserInfo();
  }

  render() {
    const {userInfo} = this.props.userStore;
    const {username, avatar, nickName} = userInfo;
    return (
      <div className={'page-user'}>
        <PageWithHeader leftComponent={null} title={'个人中心'}>
          {/* <BlueBox>

          </BlueBox> */}
          <div className="user-wrap">
            <div className="user-info">
              <Picture size={120} src={avatar} />

              <div className="user-name">{nickName || username || '未知'}</div>
            </div>
            <div className="to-detial">
              <Link to="/user/personalInfo">
                完善信息<Icon type="right" />
              </Link>
            </div>
          </div>

          <List>
            {ListData.map((v, i) => (
              <Item key={i} arrow={'horizontal'}>
                <Link to={`/user/${v.path}`}>
                  <i className="iconfont">{v.unicode}</i>
                  {v.text}
                </Link>
              </Item>
            ))}
          </List>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
