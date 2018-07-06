import React from 'react';
import { PageWithHeader, GreenButton } from '../../../../components';
import { InputItem, Modal } from 'antd-mobile';
import {modifyLoginPassword} from '../../../../stores/user/request';
import User from '../../../../utils/user';
import './style.less';

const alert = Modal.alert;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};

/**
 * 重置密码
 */
class Comp extends React.PureComponent {
  state = {
    newPassword: '',
    oldPassword: '',
    confirmNewPassword: ''
  };

  validate = () => {
    const { newPassword, oldPassword, confirmNewPassword} = this.state;
    if (!oldPassword) {
      showError('请输入旧密码！');
      return false;
    }
    if (!newPassword) {
      showError('请输入新密码！');
      return false;
    }
    if (oldPassword === newPassword) {
      showError('新旧密码不能相同');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      showError('两次新密码不一致，请重新输入！');
      return false;
    }
    return true;
  };

  onChange = (stateName) => {
    function _setState(value) {
      this.setState({
        [stateName]: value
      })
    }
    _setState = _setState.bind(this);
    return _setState
  };

  onClick = (e) => {
    e.preventDefault();
    const { newPassword, oldPassword } = this.state;
    if (this.validate()) {
      modifyLoginPassword({newPassword, oldPassword})
        .then(res => {
          const data = res.data;
          if (data.success) {
            this.onModifySuccess();
          } else {
            this.onModifyFail();
          }
        })
    }
  };

  onModifySuccess = () => {
    alert('修改登录密码成功', '点击"确认"后重新登录', [
      {text: '确认', onPress: () => {
        const user = new User();
        user.logout();
        this.props.history.replace('/');
      }}
    ])
  };

  onModifyFail = () => {
    showError('修改登录密码失败，请稍候重试');
  };

  render() {
    const { newPassword, oldPassword, confirmNewPassword} = this.state;
    return (
      <div className={'page-reset-login-pw'}>
        <PageWithHeader title={'重置登录密码'}>
          <div className="login-title">您已登录，可直接重置登陆密码</div>
          <div className="reset-login-pw">
            <InputItem
              clear
              placeholder="请输入旧密码"
              ref={el => (this.nickname = el)}
              onChange={this.onChange('oldPassword')}
              value={oldPassword}
            />
            <InputItem
              clear
              placeholder="请输入新密码"
              ref={el => (this.nickname = el)}
              onChange={this.onChange('newPassword')}
              value={newPassword}
            />
            <InputItem
              clear
              placeholder="确认新密码"
              ref={el => (this.nickname = el)}
              onChange={this.onChange('confirmNewPassword')}
              value={confirmNewPassword}
            />
            <GreenButton onClick={this.onClick}>确认</GreenButton>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
