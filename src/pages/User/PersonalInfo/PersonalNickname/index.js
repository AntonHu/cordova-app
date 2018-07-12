import React from 'react';
import { PageWithHeader } from '../../../../components';
import { InputItem, Modal } from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import { reqUpdateUser, reqUpdateNickName }from '../../../../stores/user/request';
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
@inject('userStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: props.userStore.userInfo.nickName || ''
    }
  }

  /**
   * 发请求，更新昵称
   */
  updateNickName = () => {
    const {nickName} = this.state;
    reqUpdateUser({
      header: this.props.userStore.userInfo.avatar || '',
      nickName
    })
      .then(res => {
        console.log(res);
        const data = res.data || {};
        if (data.success) {
          this.onUpdateSuccess();
        } else {
          this.onUpdateFail()
        }
      })
      .catch(err => {
        console.log(err);
        this.onUpdateFail()
      })
  };

  onUpdateSuccess = () => {
    const self = this;
    if (this.props.keyPair.hasKey) {
      reqUpdateNickName({publicKey: this.props.keyPair.publicKey});
    }
    this.props.userStore.fetchUserInfo();
    alert('更新成功', '您的昵称已更新', [
      {text: '确定', onPress: () => {
        self.props.history.goBack()
      }}
    ]);
  };

  onUpdateFail = () => {
    showMsg('更新昵称失败');
  };

  render() {
    return (
      <div className={'page-personal-nick-name'}>
        <PageWithHeader title={'昵称'} rightComponent={<div onClick={this.updateNickName} className="h3">保存</div>}>
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
