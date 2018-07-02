import React from 'react';
import {withRouter} from 'react-router-dom';
import {BlueBox, PageWithHeader, Picture} from '../../../components';
import {List, Picker, Icon, Modal, Button, ActionSheet, Toast} from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import {FileMethods} from '../../../utils/methods';
import {reqUploadAvatar, reqUpdateUser} from '../../../stores/user/request';
import './style.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

function onUploadFail() {
  Toast.show('上传头像失败');
}

function onFail (message) {
};

/**
 * 拍照上传流程：
 *
 * 拍照之后获得照片在手机中的地址imageURI
 * 然后去读取这个imageURI对应的file
 * 把file转成blob，传给reqUploadAvatar
 * reqUploadAvatar用formData上传图像，返回oss地址
 * 调用reqUpdateUser更新昵称、头像oss地址
 * @param imageURI
 */
async function onPhotoDataSuccess (imageURI) {
  const nickName = this.props.userStore.userInfo.nickName || '';
  const fileEntry = await FileMethods.getFileEntryFromURL(imageURI);
  const file = await FileMethods.getFileFromFileEntry(fileEntry);
  const result = await FileMethods.readFileAsBuffer(file);
  const imgBlob = FileMethods.turnJpegIntoBlob(result);

  updateAvatar(imgBlob, nickName);

  this.props.userStore.updateAvatar(imageURI);
};

/**
 * 选取相册上传流程：
 *
 * 选择之后获得照片在手机中的地址imageURI
 * 然后去读取这个imageURI对应的file
 * 把file转成blob，传给reqUploadAvatar
 * reqUploadAvatar用formData上传图像，返回oss地址
 * 调用reqUpdateUser更新昵称、头像oss地址
 * @param imageURI
 */
async function onPhotoURISuccess (imageURI) {
  const nickName = this.props.userStore.userInfo.nickName || '';
  const fileEntry = await FileMethods.getFileEntryFromURL(imageURI);
  const file = await FileMethods.getFileFromFileEntry(fileEntry);
  const result = await FileMethods.readFileAsBuffer(file);
  const imgBlob = FileMethods.turnJpegIntoBlob(result);

  updateAvatar(imgBlob, nickName);

  this.props.userStore.updateAvatar(imageURI);
};

/**
 * 上传头像，并且更新用户头像地址
 * @param imgBlob
 */
const updateAvatar = (imgBlob, nickName) => {
  reqUploadAvatar(imgBlob)
    .then(res => {
      console.log(JSON.stringify(res));
      // Toast.show('上传头像成功');
      const data = res.data;
      if (data && data.code === 200) {
        reqUpdateUser({
          header: data.data.imgSssKey,
          nickName
        }).then(updateRes => {
          if (updateRes.data && updateRes.data.code ===  20000) {
            Toast.show('更新头像成功');
          } else {
            Toast.show('更新头像失败');
          }
        })
      }
    })
    .catch(err => {
      onUploadFail();
    });
};

function capturePhoto () {
  const destinationType = navigator.camera.DestinationType;
  onPhotoDataSuccess = onPhotoDataSuccess.bind(this);
  onFail = onFail.bind(this);
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 25,
    destinationType: destinationType.FILE_URI
  });
};

function getPhoto(source)  {
  // Retrieve image file location from specified source
  onPhotoURISuccess = onPhotoURISuccess.bind(this);
  onFail = onFail.bind(this);
  const destinationType = navigator.camera.DestinationType;
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 100,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
};

const avatarModalData = [
  {
    text: '拍照',
    onPress: function () {
      if (window.cordova) {
        capturePhoto.call(this)
      }
    }
  },
  {
    text: '相册选取',
    onPress: function () {
      if (window.cordova) {
        const pictureSource = navigator.camera.PictureSourceType;
        getPhoto.call(this, pictureSource.PHOTOLIBRARY)
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
        if (avatarModalData[i]) {
          avatarModalData[i].onPress.call(this)
        }
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
              <Picture size={120} src={avatar} />
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

          <div className="personal-list">
            <div className="personal-item" onClick={this.picChange}>
              <div className="item-title">头像</div>
              <Picture size={60} src={avatar} alt='' showEmptyElement={false} />
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

      </div>
    );
  }
}

export default withRouter(Comp);
