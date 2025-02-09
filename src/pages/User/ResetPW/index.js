import React from 'react';
import {Link} from 'react-router-dom';
import {PageWithHeader} from '../../../components';
import {List} from 'antd-mobile';
import './style.less';

const Item = List.Item;
const ListData = [
  // {
  //   text: '重置交易密码',
  //   path: 'resetTradePW'
  // },
  {
    text: '重置登录密码',
    path: 'resetLoginPW'
  }
];

/**
 * 重置密码
 */
class ResetPW extends React.PureComponent {
  render() {
    return (

        <PageWithHeader title={'密码设置'} id="page-reset-pw">
          <List>
            {ListData.map((v, i) => (
              <Link key={i} to={`/user/${v.path}`}>
                <Item arrow={'horizontal'}>{v.text}</Item>
              </Link>
            ))}
          </List>
        </PageWithHeader>

    );
  }
}

export default ResetPW;
