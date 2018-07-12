import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, Countdown, Popup} from '../../../components';
import {InputItem, Modal} from 'antd-mobile';
import {clearSpace, testPhoneNumber, testCode, testPassword} from '../../../utils/methods';
import PropTypes from 'prop-types';
import './BasicPhoneCodePWForm.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};



/**
 * 注册和忘记密码的共用部分
 *
 * 相同：
 * state
 * changeState方法
 * 发送验证码前校验
 * 发送最终请求前校验
 *
 * 不同：
 * 发送验证码的方法
 * 发送最终请求的方法
 * Popup的一些属性
 */
class Comp extends React.PureComponent {
  static propTypes = {
    // 发送验证码的方法
    sendCodeMethod: PropTypes.func.isRequired,
    // 最终提交的方法
    submitMethod: PropTypes.func.isRequired,
    // popup的属性
    popupProps: PropTypes.shape({
      title: PropTypes.string,
      subTitle: PropTypes.string,
      buttonText: PropTypes.string,
      onPress: PropTypes.func
    })
  };

  static defaultProps = {
    popupProps: {
      title: 'title',
      subTitle: 'subTitle',
      buttonText: 'buttonText',
    }
  };


  state = {
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    status: 'able',
    successModal: false
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
      const {submitMethod} = this.props;
      this.isRegistering = true;
      if (submitMethod) {
        submitMethod({
          mobile: clearSpace(phone),
          password,
          verificationCode: code,
          showModal: this.showModal,
          hideModal: this.hideModal
        })
      }
    }
  };

  showModal = () => {
    this.setState({
      successModal: true
    })
  };

  hideModal = () => {
    this.setState({
      successModal: false
    })
  };

  registerSuccess = () => {
    this.showModal();
  };

  registerFail = (msg) => {
    let errorMsg = msg;
    if (msg === 'username exist') {
      errorMsg = '用户名已存在';
    }
    if (msg === 'verification code not exist') {
      errorMsg = '错误的验证码';
    }
    showError(errorMsg || '注册失败')
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
      showError('请输入6-16位密码！(只包含大小写字母、数字、下划线)');
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
    const {sendCodeMethod} = this.props;
    if (this.validateBeforeSendCode()) {
      const {phone} = this.state;
      this.countdown.startCounting();
      if (sendCodeMethod) {
        sendCodeMethod({mobile: clearSpace(phone)})
      }
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

  countdownCallBack = (str) => {};


  onModalPress = () => {
    this.hideModal();
    const {popupProps} = this.props;
    if (popupProps.onPress) {
      popupProps.onPress()
    }
  };

  render() {
    const {phone, code, password, confirmPassword} = this.state;
    const {popupProps} = this.props;
    return (
      <div className="basic-phone-code-pw-body">
        <InputItem
          placeholder="请输入手机号"
          clear
          type="phone"
          value={phone}
          onChange={this.changeState('phone')}
          labelNumber={3}
        >
          <span className="h3">+86</span>
        </InputItem>

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
          type="password"
          value={password}
          onChange={this.changeState('password')}
        />
        <InputItem
          placeholder="确认密码"
          clear
          type="password"
          value={confirmPassword}
          onChange={this.changeState('confirmPassword')}
        />

        <GreenButton size={'big'} onClick={this.onRegister}>确认</GreenButton>

        <Popup
          title={popupProps.title}
          subTitle={popupProps.subTitle}
          buttonText={popupProps.buttonText}
          visible={this.state.successModal}
          onPress={this.onModalPress}
          onClose={this.hideModal}
        />
      </div>
    );
  }
}

export default Comp;
