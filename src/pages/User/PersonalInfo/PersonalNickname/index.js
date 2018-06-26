import React from 'react';
import { PageWithHeader } from '../../../../components';
import { InputItem } from 'antd-mobile';
import './style.less';

/**
 * 我的
 */
class Comp extends React.PureComponent {
  // TODO: Icon加上来
  // TODO: 头像的组件
  render() {
    return (
      <div className={'page-user'}>
        <PageWithHeader title={'昵称'} rightComponent={<div>确定</div>}>
          <div className="change-nickname">
            <InputItem
              clear
              placeholder="请输入昵称"
              ref={el => (this.nickname = el)}
            />
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
