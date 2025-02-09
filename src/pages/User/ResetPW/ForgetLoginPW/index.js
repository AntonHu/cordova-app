import React from 'react';
import {BlueBox, PeakBox, Header} from '../../../../components';
import {Modal} from 'antd-mobile';
import {reqSendCode, reqForgetLoginPW} from '../../../../stores/user/request';
import BasicPhoneCodePWForm from '../../component/BasicPhoneCodePWForm';
import './style.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};

/**
 * 忘记密码
 */
class ForgetLoginPW extends React.PureComponent {

  /**
   * 忘记密码
   */
  onSubmit = async ({mobile, password, verificationCode, showModal, hideModal}) => {
    const res = await reqForgetLoginPW({
      mobile,
      password,
      verificationCode
    });
    const data = res.data;
    this.isRegistering = false;
    if (data && data.code === 20000) {
      this.registerSuccess(showModal);
    } else {
      this.registerFail(data.msg)
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
    showError(errorMsg || '重置登录密码失败')
  };

  /**
   * 发送验证码
   */
  sendCode = ({mobile}) => {
    reqSendCode({mobile, type: reqSendCode.MODIFY_TYPE})
      .then(res => {
        console.log(res)
      });
    return true;
  };

  render() {
    return (
      <div className={'page-forget-login-pw'}>
        <BlueBox>
          <Header title="忘记密码" transparent/>
        </BlueBox>
        <PeakBox showPeak={true} top={180}>
          <div className="body">
            <BasicPhoneCodePWForm
              submitMethod={this.onSubmit}
              sendCodeMethod={this.sendCode}
              popupProps={{
                title: '重置登录密码成功',
                subTitle: '现在就去登录吧',
                buttonText: '去登录',
                onPress: () => this.props.history.replace('/login')
              }}
              placeholder={{
                phone: '请输入手机号',
                code: '验证码',
                password: '6-16位新密码',
                confirmPassword: '确认新密码'
              }}
            />
          </div>
        </PeakBox>
      </div>
    );
  }
}

export default ForgetLoginPW;
