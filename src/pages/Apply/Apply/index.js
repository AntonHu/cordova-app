import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace, Grid} from 'antd-mobile';
import './style.less';

const Item = List.Item;

const Apps = [
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  }
];

const Recommends = [
  {
    title: '得力双层保温盒',
    subTitle: '150积分',
    icon: 'icon'
  },
  {
    title: '得力双层保温盒',
    subTitle: '150积分',
    icon: 'icon'
  },
  {
    title: '得力双层保温盒',
    subTitle: '150积分',
    icon: 'icon'
  }
];

/**
 * 应用
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-apply'}>
        <PageWithHeader title={'应用'}>

          <BlueBox>

          </BlueBox>

          <Grid data={Apps} columnNum={3}/>
          <Grid data={Recommends} columnNum={3}/>

        </PageWithHeader>
      </div>
    )
  }
}

export default Comp;
