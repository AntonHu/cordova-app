import React from 'react';
import { Link } from 'react-router-dom';
import { PageWithHeader, GreenButton } from '../../../../components';
import { InputItem } from 'antd-mobile';
import './style.less';

/**
 * 重置密码
 */
class Comp extends React.PureComponent {
  render() {
    //TODO: 加上验证码插件
    return (
      <div className={'page-reset-login-pw'}>
        <PageWithHeader title={'重置登陆密码'}>
          <div className="login-title">您已登录，可直接重置登陆密码</div>
          <div className="reset-login-pw">
            <InputItem
              clear
              placeholder="请输入新密码"
              ref={el => (this.nickname = el)}
            />
            <InputItem
              clear
              placeholder="再次确认新密码"
              ref={el => (this.nickname = el)}
            />
            <GreenButton>确认</GreenButton>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
