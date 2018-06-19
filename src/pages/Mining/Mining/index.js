import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace, Grid} from 'antd-mobile';
import './style.less';

/**
 * 挖宝
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-mining'}>
        <PageWithHeader title={'挖宝池'}>

          <BlueBox>
            <div>挖宝首页</div>
          </BlueBox>

        </PageWithHeader>
      </div>
    )
  }
}

export default Comp;
