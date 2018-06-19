import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  '什么是数据上链？',
  '为什么要数据上链？',
  '之前授权的数据保存在哪里？',
  '数据上链对个人来说有什么利益？',
  '为什么要分配Data-Key？',
  '丢失Data-Key会怎么样？如何备份',
];

class Comp extends React.PureComponent {
  render() {
    // TODO: 整个antd的字体设置
    return (
      <div className={'page-my-data'}>
        <PageWithHeader title={'我的数据'}>

          <WhiteSpace />

          <BlueBox>
            <div className={'h3 white-text title-of-blue'}>我的数据私钥</div>
            <GreenButton>一键生成</GreenButton>
          </BlueBox>

          <WhiteSpace />

          <div className={'info'}>
            EBC新能源
          </div>

          <WhiteSpace />

          <List>
            {
              ListData.map((v, i) => (
                <Item key={i} arrow="horizontal">
                  {v}
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
