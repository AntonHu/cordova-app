import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header} from '../../../components';
import {List, InputItem, Flex, Button} from 'antd-mobile';
import './style.less';

/**
 * 注册
 */
class Comp extends React.PureComponent {
  render() {
    //TODO: 加上验证码插件
    return (
      <div className={'page-register'}>
        <BlueBox>
          <Header title="注册" transparent/>
        </BlueBox>
        <PeakBox showPeak={true} top={140}>
          <div className="body">
            <InputItem placeholder="请输入手机号" clear type="phone"/>
            <InputItem placeholder="验证码" clear />
            <InputItem placeholder="6-16位密码" clear />
            <InputItem placeholder="确认密码" clear />

            <GreenButton size={'big'}>确认</GreenButton>
          </div>
        </PeakBox>
      </div>
    )
  }
}

export default Comp;
