import React from 'react';
import {GreenButton, Countdown, Popup} from '../../../components';
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
class BasicPhoneCodePWForm extends React.PureComponent {
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
    }),
    // 四个placeholder的属性
    placeholder: PropTypes.shape({
      phone: PropTypes.string,
      code: PropTypes.string,
      password: PropTypes.string,
      confirmPassword: PropTypes.string
    }),
    // 除了那4个之外，如果还要加input
    // 比如邀请码
    extraInputs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        placeholder: PropTypes.string,
        clear: PropTypes.bool,
        type: PropTypes.string,
        validate: PropTypes.func
      })
    )
  };

  static defaultProps = {
    popupProps: {
      title: 'title',
      subTitle: 'subTitle',
      buttonText: 'buttonText',
    },
    placeholder: {
      phone: '请输入手机号',
      code: '验证码',
      password: '6-16位密码',
      confirmPassword: '确认密码'
    },
    extraInputs: []
  };


  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
      status: 'able',
      successModal: false
    };
    props.extraInputs.forEach(inputProps => {
      this.state[inputProps.name] = '';
    })
  }

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

  onRegister = async () => {
    if (this.isRegistering) {
      alert('请耐心等待', '正在发送请求，请稍候...', [{text: '确定'}]);
      return;
    }

    if (this.validateBeforeRegister()) {
      const {phone, code, password} = this.state;
      const {submitMethod, extraInputs} = this.props;
      this.isRegistering = true;
      if (submitMethod) {
        const params = {
          mobile: clearSpace(phone),
          password,
          verificationCode: code,
          showModal: this.showModal,
          hideModal: this.hideModal
        };
        extraInputs.forEach(inputProps => {
          params[inputProps.name] = this.state[inputProps.name]
        });
        submitMethod(params)
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

  /**
   * 注册前验证
   * @returns {boolean}
   */
  validateBeforeRegister = () => {
    const {phone, code, password, confirmPassword} = this.state;
    const {extraInputs} = this.props;
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

    // 做extraInputs的校验
    if (extraInputs.length > 0) {
      const extraInputsValidations = extraInputs.map(inputProps => {
        let validateMethod = () => true;
        if (inputProps.validate) {
          validateMethod = inputProps.validate;
        }
        return validateMethod(this.state[inputProps.name]);
      });
      if (extraInputsValidations.some(valid => !valid)) {
        return false
      }
    }

    return true;
  };

  /**
   * 发送验证码
   * 如果sendCodeMethod返回的是一个promise，那么promise.then里面开始计时
   * 如果sendCodeMethod返回的是非false，那么开始计时
   * 如果sendCodeMethod返回的是undefined或者false，那么不计时
   */
  sendCode = () => {
    const {sendCodeMethod} = this.props;
    if (this.validateBeforeSendCode()) {
      const {phone} = this.state;
      if (sendCodeMethod) {
        const res = sendCodeMethod({mobile: clearSpace(phone)});
        if (res.then) {
          res.then(() => {
            this.countdown.startCounting();
          })
        } else if (res) {
          this.countdown.startCounting();
        }

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

  onModalPress = () => {
    this.hideModal();
    const {popupProps} = this.props;
    if (popupProps.onPress) {
      popupProps.onPress()
    }
  };

  render() {
    const {phone, code, password, confirmPassword} = this.state;
    const {popupProps, placeholder, extraInputs} = this.props;
    return (
      <div className="basic-phone-code-pw-body">
        <InputItem
          placeholder={placeholder.phone}
          clear
          type="phone"
          value={phone}
          onChange={this.changeState('phone')}
          labelNumber={3}
        >
          <span className="h3">+86</span>
        </InputItem>

        <InputItem
          placeholder={placeholder.code}
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
          placeholder={placeholder.password}
          clear
          type="password"
          value={password}
          onChange={this.changeState('password')}
        />
        <InputItem
          placeholder={placeholder.confirmPassword}
          clear
          type="password"
          value={confirmPassword}
          onChange={this.changeState('confirmPassword')}
        />
        {
          extraInputs.map(inputProps => (
            <InputItem
              key={inputProps.name}
              placeholder={inputProps.placeholder}
              clear={inputProps.clear}
              type={inputProps.type || 'text'}
              value={this.state[inputProps.name]}
              onChange={this.changeState(inputProps.name)}
            />
          ))
        }

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

export default BasicPhoneCodePWForm;
