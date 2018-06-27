import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, Countdown} from '../../../components';
import {InputItem, Modal} from 'antd-mobile';
import {clearSpace, testPhoneNumber, testCode, testPassword} from '../../../utils/methods';
import {reqSendCode, reqRegister} from '../../../stores/user/request';
import './style.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};



/**
 * 注册
 */
class Comp extends React.PureComponent {
  state = {
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    status: 'able'
  };

  isRegistering = false;

  componentWillUnmount() {
    this.countdown = undefined;
  }

  changeState = (stateName) => {
    function _setState(value) {
      this.setState({
        [stateName]: value
      })
    }

    _setState = _setState.bind(this);
    return _setState;
  };

  /**
   * 注册
   */
  onRegister = async () => {
    if (this.isRegistering) {
      showError('正在注册中，请稍候...');
      return;
    }

    if (this.validateBeforeRegister()) {
      const {phone, code, password} = this.state;
      this.isRegistering = true;
      const res = await reqRegister({
        mobile: clearSpace(phone),
        password,
        verificationCode: code
      });
      const data = res.data;
      this.isRegistering = false;
      if (data && data.code === 2000) {
        this.registerSuccess();
      } else {
        this.registerFail(data.msg)
      }
    }
  };

  registerSuccess = () => {
    alert('注册成功', '点击"确认"按钮去登录', [
      {text: '确认', onPress: () => {
        this.props.history.replace('/login');
      }}
    ]);
  };

  registerFail = (msg) => {
    showError(msg || '注册失败')
  };

  /**
   * 注册前验证
   * @returns {boolean}
   */
  validateBeforeRegister = () => {
    const {phone, code, password, confirmPassword} = this.state;
    if (!testPhoneNumber(clearSpace(phone))) {
      showError('请输入正确手机号！');
      return false;
    }
    if (!testCode(code)) {
      showError('请输入六位验证码！');
      return false;
    }
    if (!testPassword(password)) {
      showError('请输入密码！');
      return false;
    }
    if (password !== confirmPassword) {
      showError('两次输入密码不一致！');
      return false
    }
    return true;
  };

  /**
   * 发送验证码
   */
  sendCode = () => {
    if (this.validateBeforeSendCode()) {
      const {phone} = this.state;
      this.countdown.startCounting();
      reqSendCode({mobile: clearSpace(phone)})
        .then(res => {
          console.log(res)
        })
    }
  };

  /**
   * 发送验证码前验证
   * @returns {boolean}
   */
  validateBeforeSendCode = () => {
    const {phone} = this.state;
    if (!testPhoneNumber(clearSpace(phone))) {
      showError('请输入正确手机号！');
      return false
    }
    return true;
  };

  countdownCallBack = (str) => {

    // showError(str)
  };


  render() {
    const {phone, code, password, confirmPassword} = this.state;
    return (
      <div className={'page-register'}>
        <BlueBox>
          <Header title="注册" transparent/>
        </BlueBox>
        <PeakBox showPeak={true} top={140}>
          <div className="body">
            <InputItem
              placeholder="请输入手机号"
              clear
              type="phone"
              value={phone}
              onChange={this.changeState('phone')}
            />

            <InputItem
              placeholder="验证码"
              clear
              value={code}
              onChange={this.changeState('code')}
              extra={
                <Countdown
                  ref={ref => this.countdown = ref}
                  status={this.state.status}
                  nums={60}
                  sendCode={this.sendCode}
                  callback={this.countdownCallBack}
                  sendingClick={'正在发送中，请稍候'}
                />
              }
            />

            <InputItem
              placeholder="6-16位密码"
              clear
              value={password}
              onChange={this.changeState('password')}
            />
            <InputItem
              placeholder="确认密码"
              clear
              value={confirmPassword}
              onChange={this.changeState('confirmPassword')}
            />

            <GreenButton size={'big'} onClick={this.onRegister}>确认</GreenButton>
          </div>
        </PeakBox>
      </div>
    );
  }
}

export default Comp;
