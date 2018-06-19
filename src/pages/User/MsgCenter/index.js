import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '消息1',
  },
  {
    text: '消息2',
  },
  {
    text: '消息3',
  }
];

/**
 * 消息中心
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-msg-center'}>
        <PageWithHeader title={'消息中心'}>
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
