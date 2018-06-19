import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import F2 from '@antv/f2';
import {getDeviceWidth, px} from '../../../utils/getDevice';
import './style.less';

/**
 * 太阳城-首页
 */
class Comp extends React.PureComponent {

  render() {
    return (
      <div className={'page-equipment-info'}>
        <BlueBox type={'pure'}>
          <div>太阳城首页</div>
        </BlueBox>
      </div>
    )
  }
}

export default Comp;
