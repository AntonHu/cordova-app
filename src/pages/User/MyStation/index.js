import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '备案号',
    extra: '去提交'
  },
  {
    text: '电费清单',
    extra: '审核中'
  },
  {
    text: '组件编号',
    extra: '审核通过'
  }
];

class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-my-station'}>
        <PageWithHeader title={'我的电站'}>
          <WhiteSpace/>

          <BlueBox type={'pure'}>
            <div className={'h3 white-text'}>完善以下资料提升算力值</div>
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
