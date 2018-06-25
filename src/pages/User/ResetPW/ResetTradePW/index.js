import React from 'react';
import { Link } from 'react-router-dom';
import { PageWithHeader } from '../../../../components';
import { InputItem } from 'antd-mobile';
import './style.less';

/**
 * 重置密码
 */
class Comp extends React.PureComponent {
  render() {
    //TODO: 加上验证码插件
    return (
      <div className={'page-reset-pw'}>
        <PageWithHeader title={'重置交易密码'}>
          <InputItem placeholder="请输入手机号" clear type="phone" />
          <InputItem placeholder="验证码" clear />
        </PageWithHeader>

        {/* <PeakBox showPeak={true} top={140}>
          <div className="body">
            <InputItem placeholder="请输入手机号" clear type="phone"/>
            <InputItem placeholder="验证码" clear />
            <InputItem placeholder="请输入新密码" clear />
            <InputItem placeholder="确认新密码" clear />
            <GreenButton size={'big'}>确认</GreenButton>
          </div>
        </PeakBox> */}
      </div>
    );
  }
}

export default Comp;
