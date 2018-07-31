import React from 'react';
import {BlueBox, PeakBox, GreenButton, Countdown, Picture} from '../../../components';
import {InputItem, Flex, Button, Modal} from 'antd-mobile';
import './style.less';
import {reqLogin, reqRegisterCA, reqIsRegisterCA} from '../../../stores/user/request';
import User from '../../../utils/user';

const alert = Modal.alert;

/**
 * 登录
 */
class Login extends React.PureComponent {
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

  validateBeforeLogin = () => {
    if (!this.state.phone) {
      alert('错误', '请输入手机号', [{text: '确定'}]);
      return false;
    }
    if (!this.state.password) {
      alert('错误', '请输入密码', [{text: '确定'}]);
      return false;
    }
    return true;
  };

  onLogin = (e) => {
    e.preventDefault();
    if (this.validateBeforeLogin()) {
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
            reqIsRegisterCA().then(res => {
              if (res.data && !res.data.msg) {
                reqRegisterCA({password});
              }
            });
            this.jpushLoginEvent(true, {phone});
            this.props.history.replace('/');
          } else {

          }
        })
        .catch(err => {
          const data = err.data;
          let msg = '登录失败';
          this.jpushLoginEvent(false, {data, phone});
          if (data.error_description) {
            if (data.error_description === 'Bad credentials') {
              msg = '用户名或密码错误'
            } else {
              msg = data.error_description
            }
          }
          alert('错误', msg, [{text: '确定'}]);
        })
    }
  };

  toRegister = () => {
    this.props.history.push('/register')
  };

  toForgetLoginPW = () => {
    this.props.history.push('/forgetLoginPW')
  };

  jpushLoginEvent = (success, extras = {}) => {
    if (window.JAnalytics) {
      window.JAnalytics.addLoginEvent({
        loginMethod: 'app',
        isLoginSuccess: success,
        extras
      })
    }
  };

  render() {
    return (
      <div className={'page-login'}>
        <BlueBox>
          <div className={'title-box'}>
            <img src={require('../../../images/login_title.png')} className="login-title"/>
          </div>
        </BlueBox>
        <PeakBox showPeak={true}>

            <div className="body">
              <InputItem
                placeholder="请输入手机号"
                clear
                type="text"
                onChange={this.changeState('phone')}
                value={this.state.phone}
                labelNumber={3}
              >
                <span className='h3'>+86</span>
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
                  <div className="forget-btn" onClick={this.toForgetLoginPW}>忘记密码</div>
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

export default Login;
