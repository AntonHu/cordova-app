import React from 'react';
import { PageWithHeader } from '../../../../components';
import { InputItem, Modal } from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import { reqUpdateUser }from '../../../../stores/user/request';
import './style.less';

const alert = Modal.alert;

const showMsg = (text) => {
  alert('错误', text, [
    {text: '确定'}
  ]);
};


/**
 * 修改昵称
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nickName: props.userStore.userInfo.nickName || ''
    }
  }

  updateNickName = () => {
    const {nickName} = this.state;
    reqUpdateUser({
      header: this.props.userStore.userInfo.avatar || '',
      nickName
    })
      .then(res => {
        console.log(res);
        alert('更新成功', '您的昵称已更新', [
          {text: '确定', onPress: () => {
            this.props.userStore.fetchUserInfo();
            this.props.history.goBack()
          }}
        ]);
      })
      .catch(err => {
        const data = err.response.data;
        console.log(data);
        let msg = '更新失败'
        showMsg(msg)
      })
  };

  render() {
    return (
      <div className={'page-personal-nick-name'}>
        <PageWithHeader title={'昵称'} rightComponent={<div onClick={this.updateNickName}>确定</div>}>
          <div className="change-nickname">
            <InputItem
              clear
              placeholder="请输入昵称"
              ref={el => (this.nickname = el)}
              value={this.state.nickName}
              onChange={(nickName) => this.setState({nickName})}
            />
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
