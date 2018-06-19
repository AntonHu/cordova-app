import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader, PlainButton} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '当前账号',
    horizontal: true
  },
  {
    text: 'Language',
    horizontal: true
  },
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
            {
              ListData.map((v, i) => (
                <Item key={i} arrow={v.horizontal && 'horizontal'} extra={v.extra}>
                  {v.text}
                </Item>
              ))
            }
          </List>

          <PlainButton>退出登录</PlainButton>

        </PageWithHeader>
      </div>
    )
  }
}

export default Comp;
