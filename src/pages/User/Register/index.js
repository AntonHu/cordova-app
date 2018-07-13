import React from 'react';
import {BlueBox, PeakBox, Header} from '../../../components';
import {Modal} from 'antd-mobile';
import {reqSendCode, reqRegister} from '../../../stores/user/request';
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
class Comp extends React.PureComponent {

  /**
   * 注册方法
   */
  onRegister = async ({mobile, password, verificationCode, showModal, hideModal}) => {
    const res = await reqRegister({
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

  /**
   * 发送验证码
   */
  sendCode = ({mobile}) => {
    reqSendCode({mobile, type: reqSendCode.REGISTER_TYPE})
      .then(res => {
        console.log(res)
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
            />
          </div>
        </PeakBox>
      </div>
    );
  }
}

export default Comp;
