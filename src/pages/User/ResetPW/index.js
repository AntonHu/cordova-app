import React from 'react';
import { Link } from 'react-router-dom';
import { PageWithHeader } from '../../../components';
import { List } from 'antd-mobile';
import './style.less';

const Item = List.Item;
const ListData = [
  {
    text: '重置交易密码',
    path: 'resetTradePW'
  },
  {
    text: '重置登陆密码',
    path: 'resetLoginPW'
  }
];
/**
 * 重置密码
 */
class Comp extends React.PureComponent {
  render() {
    //TODO: 加上验证码插件
    return (
      <div className={'page-reset-pw'}>
        <PageWithHeader title={'密码设置'}>
          <List>
            {ListData.map((v, i) => (
              <Link key={i} to={`/user/${v.path}`}>
                <Item arrow={'horizontal'}>{v.text}</Item>
              </Link>
            ))}
          </List>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
