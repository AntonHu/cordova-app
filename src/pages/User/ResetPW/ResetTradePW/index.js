import React from 'react';
import { PageWithHeader, GreenButton, Countdown } from '../../../../components';
import {testCode, testPhoneNumber, clearSpace, testPassword} from '../../../../utils/methods';
import {reqSendCode, reqResetTradePassword} from '../../../../stores/user/request';
import { InputItem, Modal } from 'antd-mobile';
import './style.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};

/**
 * 重置交易密码
 */
class Comp extends React.PureComponent {
  state = {
    firstStep: true,
    secondStep: false,
    phone: '',
    code: '',
    tradePassword: '',
    confirmTradePassword: ''
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

  nextStep = () => {
    const {phone, code} = this.state;
    if (!testPhoneNumber(clearSpace(phone))) {
      showError('请输入正确的手机号');
      return false;
    }
    if (!testCode(code)) {
      showError('请输入正确的验证码');
      return false;
    }
    this.setState({
      firstStep: false,
      secondStep: true
    });
  };

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

  validateBeforeSendCode = () => {
    const {phone} = this.state;
    if (!testPhoneNumber(clearSpace(phone))) {
      showError('请输入正确的手机号');
      return false;
    }
    return true;
  };

  onSubmit = () => {
    const self = this;
    if (this.validateBeforeSubmit()) {
      const {tradePassword, phone, code} = this.state;
      reqResetTradePassword({
        phoneNumber: clearSpace(phone),
        newPassword: tradePassword,
        verificationCode: code
      })
        .then(res => {
          const data = res.data;
          if (data.code === 200) {
            alert('成功', '您重置交易密码成功', [{
              text: '确定', onPress: function () {
                self.props.history.goBack()
              }
            }])
          }
        })
    }
  };

  validateBeforeSubmit = () => {
    const {tradePassword, confirmTradePassword} = this.state;
    if (!testPassword(tradePassword)) {
      showError('请输入正确的交易密码');
      return false;
    }
    if (tradePassword !== confirmTradePassword) {
      showError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  render() {
    const {
      phone,
      code,
      tradePassword,
      confirmTradePassword
    } = this.state;
    return (
      <div className={'page-reset-trade-pw'}>
        <PageWithHeader title={'重置交易密码'}>
          <div className="progress-prompt">
            <div
              className={
                this.state.firstStep ? 'progress' : 'progress progress-no'
              }
            >
              <div className="number">1</div>
              <div>身份验证</div>
            </div>
            <div className="line" />
            <div
              className={
                this.state.secondStep ? 'progress' : 'progress progress-no'
              }
            >
              <div className="number">2</div>
              <div>重置密码</div>
            </div>
          </div>
          <div className={this.state.firstStep ? '' : 'step-hide'}>
            <InputItem
              type="phone"
              clear
              placeholder="请输入手机号"
              value={phone}
              onChange={this.changeState('phone')}
            >
              手机号码
            </InputItem>
            <InputItem
              placeholder="验证码"
              extra={<Countdown
                ref={ref => this.countdown = ref}
                status={'able'}
                nums={60}
                sendCode={this.sendCode}
                sendingClick={'正在发送中，请稍候'}
              />
              }
              clear
              value={code}
              onChange={this.changeState('code')}
            />
            <GreenButton onClick={this.nextStep} size={'big'}>
              确认
            </GreenButton>
          </div>
          <div className={this.state.secondStep ? '' : 'step-hide'}>
            <InputItem
              clear
              placeholder="请输入交易密码"
              value={tradePassword}
              onChange={this.changeState('tradePassword')}
            />
            <InputItem
              clear
              placeholder="确认交易密码"
              value={confirmTradePassword}
              onChange={this.changeState('confirmTradePassword')}
            />
            <GreenButton size={'big'} onClick={this.onSubmit}>确认</GreenButton>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
