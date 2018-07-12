import React from 'react';
import { PageWithHeader, GreenButton, Countdown } from '../../../../components';
import {testCode, testPhoneNumber, clearSpace, testPassword} from '../../../../utils/methods';
import {reqSendCode, reqResetTradePassword, putUserIntoChain} from '../../../../stores/user/request';
import { InputItem, Modal, ActivityIndicator } from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import CryptoJS from 'crypto-js'
import './style.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};

/**
 * 设置交易密码
 */
@inject('keyPair')
@observer
class Comp extends React.Component {
  state = {
    firstStep: true,
    secondStep: false,
    phone: '',
    code: '',
    tradePassword: '',
    confirmTradePassword: '',
    showLoading: false
  };

  setSuccess = false;

  componentWillUnmount() {
    if (!this.setSuccess) {
      this.props.keyPair.clearKeyPair();
    }
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
   * 点击下一步
   * @returns {boolean}
   */
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

  /**
   * 发送请求，获取验证码
   */
  sendCode = () => {
    if (this.validateBeforeSendCode()) {
      const {phone} = this.state;
      this.countdown.startCounting();
      reqSendCode({mobile: clearSpace(phone), type: '1'})
        .then(res => {
          console.log(res)
        })
    }
  };

  /**
   * 获取验证码前校验
   * @returns {boolean}
   */
  validateBeforeSendCode = () => {
    const {phone} = this.state;
    if (!testPhoneNumber(clearSpace(phone))) {
      showError('请输入正确的手机号');
      return false;
    }
    return true;
  };

  /**
   * 提交，设置交易密码
   * 设置交易密码成功后，用交易密码加密私钥，并且向服务器上传公钥和加密私钥
   * 如果没有设置交易密码，在退出本页面时，清除localStorage里的公私钥
   */
  onSubmit = async () => {
    const self = this;
    if (this.validateBeforeSubmit()) {
      const {tradePassword, phone, code} = this.state;
      const setTradeRes = await reqResetTradePassword({
        phoneNumber: clearSpace(phone),
        newPassword: tradePassword,
        verificationCode: code
      });
      const data = setTradeRes.data || {};
      if (data.code === 200) {
        alert('成功', '设置交易密码成功。请一定备份您的交易密码，如果忘记，将导致账户资金无法取出', [{
          text: '确定', onPress: function () {
            self.encryptAndUpload({
              publicKey: self.props.keyPair.getPubFromLocalStorage(),
              privateKey: self.props.keyPair.getPrivFromLocalStorage(),
              password: tradePassword
            })
          }
        }])
      } else {
        alert('错误', '设置交易密码失败', [{
          text: '确定'
        }])
      }
    }
  };

  /**
   * 用交易密码加密私钥
   * 并且上传加密过的私钥和公钥
   * @param privateKey
   * @param password
   * @param publicKey
   */
  encryptAndUpload = ({privateKey, password, publicKey}) => {
    const self = this;
    const encryptPrivateKey = CryptoJS.AES.encrypt(privateKey, password);
    this.setState({
      showLoading: true
    });
    putUserIntoChain({publicKey, encryptPrivateKey: encryptPrivateKey.toString()})
      .then(res => {
        const data = res.data || {};
        if (data.code === 200) {
          this.setSuccess = true;
          this.props.keyPair.checkKeyPairExist();
          alert('成功', '上传公钥成功', [{text: '好的', onPress: () => {
            self.props.history.goBack();
          }}]);
        } else {
          alert('失败', '上传公钥失败', [{text: '好的', onPress: () => {}}]);
        }
        this.setState({
          showLoading: false
        });
      })
      .catch(err => {
        alert('失败', '上传公钥失败', [{text: '好的', onPress: () => {}}]);
        this.setState({
          showLoading: false
        });
      })
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
        <PageWithHeader title={'设置交易密码'}>
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
              <div>交易密码</div>
            </div>
          </div>
          <div className={this.state.firstStep ? 'step-show' : 'step-hide'}>
            <InputItem
              type="phone"
              clear
              placeholder="请输入手机号"
              value={phone}
              onChange={this.changeState('phone')}
              labelNumber={3}
            >
              <span className="h3">+86</span>
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
          <div className={this.state.secondStep ? 'step-show' : 'step-hide'}>
            <InputItem
              clear
              type="password"
              placeholder="请输入交易密码"
              value={tradePassword}
              onChange={this.changeState('tradePassword')}
            />
            <InputItem
              clear
              placeholder="确认交易密码"
              type="password"
              value={confirmTradePassword}
              onChange={this.changeState('confirmTradePassword')}
            />
            <GreenButton size={'big'} onClick={this.onSubmit}>确认</GreenButton>
          </div>
        </PageWithHeader>
        <ActivityIndicator
          toast
          text={'正在备份您的密钥...'}
          animating={this.state.showLoading}
        />
      </div>
    );
  }
}

export default Comp;
