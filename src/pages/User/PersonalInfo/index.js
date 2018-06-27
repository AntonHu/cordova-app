import React from 'react';
import { withRouter } from 'react-router-dom';
import { BlueBox, PageWithHeader } from '../../../components';
import { List, Picker, Icon, Modal, Button } from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import './style.less';

const avatarModalData = [
  {
    text: '拍照',
    onPress: function () {

    }
  },
  {
    text: '相册选取',
    onPress: function () {

    }
  },
  {
    text: '取消',
    onPress: function () {
      this.setState({
        modal1Visible: false
      })
    },
    color: ''
  }
];

/**
 * 个人信息
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    sexArr: ['男'],
    modal1Visible: false
  };
  // 头像更改
  picChange = () => {
    this.setState({
      modal1Visible: true
    })
  };

  onChange = (files, type, index) => {
    console.log(files, type, index);
  };

  render() {
    const {userInfo} = this.props.userStore;
    const {username, avatar, nickName} = userInfo;
    return (
      <div className={'page-personal-info'}>
        <PageWithHeader title={'个人信息'}>
          <BlueBox>
            <div className="personal-info">
              <img
                className="personal-pic"
                src={avatar}
                alt=""
              />
              <div className="personal-prompt">您已实名认证成功!</div>
            </div>
            <div className="personal-name">{nickName || '未知'}</div>
            {/*<div className="personal-id">31232245678</div>*/}
            <div
              className="go-authentication"
              onClick={() => this.props.history.push(`/user/verifyID/${1}`)}
            >
              去认证<Icon type="right" />
            </div>
          </BlueBox>

          <div className="personal-list" onClick={this.picChange}>
            <div className="personal-item">
              <div className="item-title">头像</div>
              <img
                className="personal-pic"
                src={avatar}
                alt=""
              />
            </div>
            <div
              className="personal-item"
              onClick={() =>
                this.props.history.push(`/user/personalNickname/${1}`)
              }
            >
              <div className="item-title">昵称</div>
              <div>{nickName || ''}</div>
            </div>
          </div>
        </PageWithHeader>

        <Modal
          popup
          visible={this.state.modal1Visible}
          onClose={() => this.setState({ modal1Visible: false })}
          animationType="slide-up"
        >
          <List>
            {avatarModalData.map((i, index) => (
              <Button
                onClick={(e) => {
                  // i.onPress.bind(this);
                  i.onPress.call(this);
                }}
              >
                <List.Item key={index}>{i.text}</List.Item>
              </Button>
            ))}
          </List>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Comp);
