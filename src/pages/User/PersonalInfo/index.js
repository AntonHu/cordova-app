import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '头像',
    extra: 'avatar'
  },
  {
    text: '昵称',
    extra: '华'
  },
  {
    text: '性别',
    extra: '女'
  },
  {
    text: '修改密码',
    horizontal: true
  },
];

class Comp extends React.PureComponent {
  // TODO: 头像等组件
  render() {
    return (
      <div className={'page-personal-info'}>
        <PageWithHeader title={'我的数据'}>

          <BlueBox>

          </BlueBox>

          <List>
            {
              ListData.map((v, i) => (
                <Item key={i} arrow={v.horizontal && 'horizontal'} extra={v.extra}>
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
