import React from 'react';
import { BlueBox, PeakBox, GreenButton } from '../../../components';
import { InputItem, Flex, Button } from 'antd-mobile';
import './style.less';
import {reqLogin} from '../../../stores/user/request';
import User from '../../../utils/user'

/**
 * 登录
 */
class Comp extends React.PureComponent {
  state = {
    phone: '',
    password: ''
  };

  changeState = (stateName) => {
    function _setState(value) {
      this.setState({
        [stateName]: value
      })
    }
    _setState = _setState.bind(this);
    return _setState;
  };

  onLogin = (e) => {
    e.preventDefault();
    const {phone, password} = this.state;
    const trimPhone = phone.replace(/\s+/g, '');
    reqLogin({
      username: trimPhone,
      password
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        const data = res.data;
        const user = new User();
        user.login(data.access_token);
        this.props.history.push('/app');
      } else {

      }
    });
  };

  render() {
    return (
      <div className={'page-login'}>
        <BlueBox>
          <div className={'h1 bolder white-text title'}>EC新能源</div>
        </BlueBox>
        <PeakBox showPeak={true}>
          <div className="body">
            <InputItem
              placeholder="请输入手机号"
              clear
              type="text"
              onChange={this.changeState('phone')}
              value={this.state.phone}
            >
              +86
            </InputItem>
            <InputItem
              placeholder="请输入密码"
              clear
              type="password"
              onChange={this.changeState('password')}
              value={this.state.password}
            />
            <Flex direction="row">
              <Flex.Item>
                <Button>忘记密码？</Button>
              </Flex.Item>
              <Flex.Item>
                <Button>注册账号</Button>
              </Flex.Item>
            </Flex>
            <GreenButton size={'big'} onClick={this.onLogin}>登录</GreenButton>
          </div>
        </PeakBox>
      </div>
    );
  }
}

export default Comp;
