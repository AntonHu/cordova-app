import React from 'react';
import { PageWithHeader, GreenButton } from '../../../../components';
import { InputItem } from 'antd-mobile';
import './style.less';

/**
 * 重置密码
 */
class Comp extends React.PureComponent {
  state = {
    firstStep: true,
    secondStep: false
  };
  nextStep = () => {
    this.setState({
      firstStep: false,
      secondStep: true
    });
  };
  render() {
    //TODO: 加上验证码插件
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
            <InputItem type="phone" clear placeholder="请输入手机号">
              手机号码
            </InputItem>
            <InputItem placeholder="验证码" extra="获取验证码" />
            <GreenButton onClick={this.nextStep} size={'big'}>
              确认
            </GreenButton>
          </div>
          <div className={this.state.secondStep ? '' : 'step-hide'}>
            <InputItem clear placeholder="请输入交易密码" />
            <InputItem clear placeholder="确认交易密码" />
            <GreenButton size={'big'}>确认</GreenButton>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
