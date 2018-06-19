import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '用户协议',
    horizontal: true
  },
  {
    text: '检查更新',
    horizontal: true
  },
  {
    text: '客服电话',
    extra: '402255652'
  }
];

/**
 * 关于
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-about'}>
        <PageWithHeader title={'关于'}>

          <BlueBox>
            <div className='h1 white-text'>EBC新能源</div>
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
