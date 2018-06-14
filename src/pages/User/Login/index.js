import React from 'react';
import {BlueBox, PeakBox, GreenButton} from '../../../components';
import {List, InputItem, Flex, Button} from 'antd-mobile';
import './style.less';

class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-login'}>
        <BlueBox>
          <div className={'title'}>EC新能源</div>
        </BlueBox>
        <PeakBox showPeak={true}>
          <div className="body">
            <InputItem placeholder="请输入手机号" clear type="phone"/>
            <InputItem placeholder="请输入密码" clear type="password"/>
            <Flex direction="row">
              <Flex.Item>
                <Button>忘记密码？</Button>
              </Flex.Item>
              <Flex.Item>
                <Button>注册账号</Button>
              </Flex.Item>
            </Flex>
            <GreenButton size={'big'}>登录</GreenButton>
          </div>
        </PeakBox>
      </div>
    )
  }
}

export default Comp;
