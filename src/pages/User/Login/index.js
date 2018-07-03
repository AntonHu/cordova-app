import React from 'react';
import {BlueBox, PeakBox, GreenButton, Countdown} from '../../../components';
import {InputItem, Flex, Button, Modal} from 'antd-mobile';
import './style.less';
import {reqLogin} from '../../../stores/user/request';
import User from '../../../utils/user';

const alert = Modal.alert;

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
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          const data = res.data;
          const user = new User();
          user.login(data.access_token);
          this.props.history.replace('/');
        } else {

        }
      })
      .catch(err => {
        const data = err.response.data;
        let msg = '登录失败';
        if (data.error_description) {
          if (data.error_description === 'Bad credentials') {
            msg = '用户名或密码错误'
          } else {
            msg = data.error_description
          }
        }
        alert('错误', msg, [{ text: '确定'}]);
      })

  };

  toRegister = () => {
    this.props.history.push('/register')
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
                {/*<Button>忘记密码？</Button>*/}
              </Flex.Item>
              <Flex.Item>
                <div className="register-btn" onClick={this.toRegister}>注册账号</div>
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
