import React from 'react';
import { Link } from 'react-router-dom';
import { PageWithHeader, PlainButton } from '../../../components';
import { List } from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '当前账号',
    horizontal: false
  },
  {
    text: '密码设置',
    path: 'resetPW',
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
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-account-setting'}>
        <PageWithHeader title={'账号设置'}>
          <List>
            {ListData.map((v, i) => (
              <Link key={i} to={`/user/${v.path}`}>
                <Item arrow={v.horizontal && 'horizontal'}>{v.text}</Item>
              </Link>
            ))}
          </List>

          <PlainButton>退出登录</PlainButton>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
