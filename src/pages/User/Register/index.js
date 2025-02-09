import React from 'react';
import {BlueBox, PeakBox, Header, ToastNoMask} from '../../../components';
import {Modal} from 'antd-mobile';
import {reqSendCode, reqRegister, reqExistInfo, bindInvitationCode} from '../../../stores/user/request';
import {testInvitationCode} from '../../../utils/validate';
import BasicPhoneCodePWForm from '../component/BasicPhoneCodePWForm';
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
class Register extends React.PureComponent {

  /**
   * 注册方法
   */
  onRegister = async ({mobile, password, verificationCode, showModal, hideModal, invitationCode}) => {
    const res = await reqRegister({
      mobile,
      password,
      verificationCode
    });
    const data = res.data;
    this.isRegistering = false;
    if (data && data.code === 20000) {
      if (invitationCode) {
        this.uploadInvitationCode(mobile, invitationCode)
      }
      this.registerSuccess(showModal);
      this.jpushRegisterEvent(true, {
        phone: mobile
      });
    } else {
      this.registerFail(data.msg);
      this.jpushRegisterEvent(false, {
        phone: mobile,
        response: data
      });
    }
    return res;
  };

  registerSuccess = (showModal) => {
    showModal();
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

  jpushRegisterEvent = (success, extras = {}) => {
    if (window.JAnalytics) {
      window.JAnalytics.addRegisterEvent({
        registerMethod: 'app',
        isRegisterSuccess: success,
        extras
      })
    }
  };

  /**
   * 发送验证码
   */
  sendCode = async ({mobile}) => {
    const self = this;
    return new Promise(async (resolve, reject) => {
      const isExist = await self.checkIfExist({mobile});
      if (!isExist) {
        reqSendCode({mobile, type: reqSendCode.REGISTER_TYPE})
          .then(res => {
            console.log(res)
          });
        resolve();
      } else {
        reject();
      }
    });
  };

  /**
   * 查询用户是否存在
   * @param mobile
   * @returns {Promise.<boolean>}
   */
  checkIfExist = async ({mobile}) => {
    const res = await reqExistInfo({username: mobile});
    const data = res.data || {};
    if (data.code === 20000) {
      if (data.result && !data.result.exist) {
        return false;
      } else {
        ToastNoMask('该用户已存在');
        return true
      }
    } else {
      ToastNoMask('查询用户是否注册出错');
      return true;
    }
  };

  validateInvitationCode = (code) => {
    if (code === '') return true;// 可以不输入邀请码
    if (!testInvitationCode(code)) {
      showError('邀请码为6位数字或字母');
      return false
    }
    return true
  };

  uploadInvitationCode = (username, invitationCode) => {
    bindInvitationCode({username, invitationCode}).then(res => {
      const data = res.data || {};
      if (data.code === '200') {
        ToastNoMask('邀请码激活成功');
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  };

  render() {
    return (
      <div className={'page-register'}>
        <BlueBox>
          <Header title="注册" transparent/>
        </BlueBox>
        <PeakBox showPeak={true} top={180}>
          <div className="body">
            <BasicPhoneCodePWForm
              submitMethod={this.onRegister}
              sendCodeMethod={this.sendCode}
              popupProps={{
                title: '恭喜注册成功！',
                subTitle: '完善个人信息可快速增加算力哦～',
                buttonText: '去登录',
                onPress: () => this.props.history.replace('/login')
              }}
              extraInputs={[
                {
                  name: 'invitationCode',
                  placeholder: '请输入邀请码，没有可不填',
                  clear: true,
                  validate: this.validateInvitationCode
                }
              ]}
            />
          </div>
        </PeakBox>
      </div>
    );
  }
}

export default Register;
