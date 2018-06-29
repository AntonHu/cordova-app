import React from 'react';
import {withRouter} from 'react-router-dom';
import {BlueBox, PageWithHeader} from '../../../components';
import {List, Picker, Icon, Modal, Button, ActionSheet} from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import './style.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

function onFail(message) {
  alert('Failed because: ' + message);
}

function onPhotoDataSuccess(imageData) {
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoURISuccess(imageURI) {
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

function capturePhoto() {
  const destinationType = navigator.camera.DestinationType;
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 50,
    destinationType: destinationType.DATA_URL
  });
}

function getPhoto(source) {
  // Retrieve image file location from specified source
  const destinationType = navigator.camera.DestinationType;
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}

const avatarModalData = [
  {
    text: '拍照',
    onPress: function () {
      if (window.cordova) {
        capturePhoto()
      }
    }
  },
  {
    text: '相册选取',
    onPress: function () {
      if (window.cordova) {
        const pictureSource = navigator.camera.PictureSourceType;
        getPhoto(pictureSource.PHOTOLIBRARY)
      }
    }
  },
  {
    text: '取消',
    onPress: function () {
    }
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
  };
  // 头像更改
  picChange = () => {

    ActionSheet.showActionSheetWithOptions({
        options: avatarModalData.map(item => item.text),
        maskClosable: true,
        wrapProps
      },
      (i) => {
        avatarModalData[i].onPress.call(this)
      }
    )
  };

  onChange = (files, type, index) => {
    console.log(files, type, index);
  };

  render() {
    const {userInfo} = this.props.userStore;
    const {avatar, nickName} = userInfo;
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
              去认证<Icon type="right"/>
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
          <img id="smallImage" src=""/>
          <img id="largeImage" src=""/>
        </PageWithHeader>

      </div>
    );
  }
}

export default withRouter(Comp);
