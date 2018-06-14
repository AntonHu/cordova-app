import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '我的数据',
    extra: 'avatar'
  },
  {
    text: '我的电站',
    extra: '华'
  },
  {
    text: '消息中心',
    extra: '女'
  },
  {
    text: '账号设置',
    horizontal: true
  },
];

class Comp extends React.PureComponent {
  // TODO: Icon加上来
  // TODO: 头像的组件
  render() {
    return (
      <div className={'page-user'}>
        <PageWithHeader title={'个人中心'}>

          <BlueBox>

          </BlueBox>

          <List>
            {
              ListData.map((v, i) => (
                <Item key={i} arrow={'horizontal'}>
                  {v.text}
                </Item>
              ))
            }
          </List>

        </PageWithHeader>
      </div>
    )
  }
}

export default Comp;
