import React from 'react';
import {withRouter} from 'react-router-dom';
import {BlueBox, PageWithHeader, Picture, ToastNoMask} from '../../../components';
import {List, Picker, Icon, Modal, Button, ActionSheet} from 'antd-mobile';
import {observer, inject} from 'mobx-react';
import {FileMethods} from '../../../utils/methods';
import {VERIFY_STATUS} from '../../../utils/variable';
import {isIPhone} from '../../../utils/validate';
import {reqUploadAvatar, reqUpdateUser} from '../../../stores/user/request';
import './style.less';

let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

function onUploadFail() {
  ToastNoMask('上传头像失败');
}

function onFail(message) {
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
async function onPhotoDataSuccess(imageURI) {
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
async function onPhotoURISuccess(imageURI) {
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
 * @param nickName
 */
const updateAvatar = (imgBlob, nickName) => {
  reqUploadAvatar(imgBlob)
    .then(res => {
      console.log(JSON.stringify(res));
      // Toast.show('上传头像成功');
      const data = res.data;
      if (data && data.code === 200) {
        reqUpdateUser({
          header: data.data.imgUrl,
          nickName
        }).then(updateRes => {
          if (updateRes.data && updateRes.data.code === 20000) {
            ToastNoMask('更新头像成功');
          } else {
            ToastNoMask('更新头像失败');
          }
        })
      } else {
        ToastNoMask('上传头像失败');
      }
    })
    .catch(err => {
      onUploadFail();
    });
};

function capturePhoto() {
  const destinationType = navigator.camera.DestinationType;
  onPhotoDataSuccess = onPhotoDataSuccess.bind(this);
  onFail = onFail.bind(this);
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 25,
    destinationType: destinationType.FILE_URI,
    correctOrientation: true
  });
};

function getPhoto(source) {
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
@inject('userStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class PersonalInfo extends React.Component {
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

  /**
   * 去实名认证
   * 前置条件是存在公钥。
   */
  goAuthentication = () => {
    if (this.props.keyPair.showHasKey(this.props)) {
      this.props.history.push(`/user/verifyID`)
    }
  };

  getVerifyStatusCN = (verifyStatus) => {
    switch (verifyStatus) {
      case VERIFY_STATUS.UNAUTHORIZED:
        return '未实名认证';
      case VERIFY_STATUS.AUTHENTICATING:
        return '认证审核中，请稍候';
      case VERIFY_STATUS.AUTHORIZED:
        return '您已实名认证成功！';
      default:
        return ''
    }
  };

  render() {
    const {userInfo, isKycInChain} = this.props.userStore;
    const {avatar, nickName} = userInfo;
    return (

        <PageWithHeader title={'个人信息'} id="page-personal-info">
          <BlueBox type="pic" picType={isKycInChain === VERIFY_STATUS.AUTHORIZED ? 'blue' : 'grey'}>
            <div className="personal-info">
              <Picture size={120} src={avatar} showBorder={true}/>
              <div className="personal-prompt">
                {this.getVerifyStatusCN(isKycInChain)}
              </div>
            </div>
            <div className="personal-name">{nickName || '未知'}</div>
            {/*<div className="personal-id">31232245678</div>*/}
            {
              !isKycInChain && <div
                className="go-authentication"
                onClick={this.goAuthentication}
              >
                去认证<Icon type="right"/>
              </div>
            }
          </BlueBox>

          <div className="personal-list">
            <div className="personal-item" onClick={this.picChange}>
              <div className="item-title">头像</div>
              <Picture size={70} src={avatar} showBorder={true} />
            </div>
            <div
              className="personal-item"
              onClick={() =>
                this.props.history.push(`/user/personalNickname/${1}`)
              }
            >
              <div className="item-title">昵称</div>
              {
                !!nickName ?
                  <div>{nickName}</div>
                  :
                  <div className="help-text">请输入昵称</div>
              }
            </div>
          </div>
        </PageWithHeader>

    );
  }
}

export default withRouter(PersonalInfo);
