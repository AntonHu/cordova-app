import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { InputItem } from 'antd-mobile';
import './style.less';

/**
 * 实名认证
 */
class Comp extends React.PureComponent {
  render() {
    // TODO: 字体的组件抽象
    return (
      <div className={'page-verifyID'}>
        <PageWithHeader title={'实名认证'}>
          <BlueBox>
            <div className={'title-of-blue h2 white-text'}>身份认证</div>
          </BlueBox>
          <InputItem placeholder="请输入真实姓名" clear />
          <InputItem placeholder="请输入你的身份证号" clear />
          <GreenButton size={'big'}>提交认证</GreenButton>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
