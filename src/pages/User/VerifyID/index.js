import React from 'react';
import {BlueBox, GreenButton, PageWithHeader, Picture, VerifyIdEmptyElement} from '../../../components';
import {InputItem, Modal, Button, ActionSheet, Flex} from 'antd-mobile';
import {reqVerifyId, reqUploadVerifyId} from '../../../stores/user/request';
import {FileMethods} from '../../../utils/methods';
import './style.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const alert = Modal.alert;
const PICTURE_SIZE = 160;

const showError = (text) => {
  alert('错误', text, [
    {text: '好的'}
  ]);
};

function onFail(message) {
};

/**
 * 把组件的setState传进来
 * @param _setState
 * @returns {Function}
 */
function setStateOnPhotoData(_setState) {
  return function (imageURI) {
    // _setState("data:image/jpeg;base64," + imageData)
    _setState(imageURI)
  }
}

/**
 * 拍照的逻辑
 * this就是下面组件的this
 * @param stateName
 */
function capturePhoto(stateName) {
  const destinationType = navigator.camera.DestinationType;
  onFail = onFail.bind(this);
  const _setState = this.changeState(stateName);
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(setStateOnPhotoData(_setState), onFail, {
    quality: 1,
    destinationType: destinationType.FILE_URI
  });
};

/**
 * 选相片的逻辑
 * this就是下面组件的this
 * @param source
 * @param stateName
 */
function getPhoto(source, stateName) {
  // Retrieve image file location from specified source
  onFail = onFail.bind(this);
  const _setState = this.changeState(stateName);
  const destinationType = navigator.camera.DestinationType;
  navigator.camera.getPicture(setStateOnPhotoData(_setState), onFail, {
    quality: 1,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
};


const avatarModalData = [
  {
    text: '拍照',
    onPress: function (stateName) {
      if (window.cordova) {
        // this是组件的this
        capturePhoto.call(this, stateName)
      }
    }
  },
  {
    text: '相册选取',
    onPress: function (stateName) {
      if (window.cordova) {
        const pictureSource = navigator.camera.PictureSourceType;
        // this是组件的this
        getPhoto.call(this, pictureSource.PHOTOLIBRARY, stateName)
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
 * 实名认证
 */
class Comp extends React.PureComponent {
  state = {
    username: '',
    idPositive: '',
    idNegative: '',
    idHandheld: ''
  };

  validateBeforeSend = () => {
    const {username, idPositive, idNegative, idHandheld} = this.state;
    if (username === '') {
      showError('请输入真实姓名');
      return false;
    }
    if (idPositive === '') {
      showError('请选择身份证正面照片');
      return false;
    }
    if (idNegative === '') {
      showError('请选择身份证背面照片');
      return false;
    }
    if (idHandheld === '') {
      showError('请选择手持身份证照片');
      return false;
    }
    return true
  };

  changeState = (stateName) => {
    function _setState(value) {
      this.setState({
        [stateName]: value
      })
    }

    _setState = _setState.bind(this);
    return _setState;
  };

  /**
   * 获取uri对应的图片的blob
   */
  getImageBlobFromURI = async (uri) => {
    try {
      const fileEntry = await FileMethods.getFileEntryFromURL(uri);
      const file = await FileMethods.getFileFromFileEntry(fileEntry);
      const result = await FileMethods.readFileAsBuffer(file);
      return FileMethods.turnJpegIntoBlob(result);

    } catch (err) {
      console.log('getImageBlobFromURI 错误');
      console.log(err);
      return null
    }
  };

  /**
   * 点击确定发送认证请求
   * 1、发送前校验
   * 2、从state里的uri中，取到uri对应的图片的blob
   * 3、把需要的参数传给发送方法，发送请求
   */
  onSubmit = async () => {
    const self = this;
    if (this.validateBeforeSend()) {

      const idPositive = await this.getImageBlobFromURI(this.state.idPositive);
      const idNegative = await this.getImageBlobFromURI(this.state.idNegative);
      const idHandheld = await this.getImageBlobFromURI(this.state.idHandheld);

      reqUploadVerifyId({
        publicKey: '',
        username: this.state.username,
        idPositive,
        idNegative,
        idHandheld
      })
        .then(res => {
          const data = res.data;
          console.log('reqVerifyId success');
          console.log(JSON.stringify(res));
          if (data.code === 200) {
            alert('成功', '您已成功验证', [{
              text: '确定', onPress: function () {
                self.props.history.goBack();
              }
            }])
          }
        })
        .catch(err => {
          console.log('reqVerifyId fali');
          console.log(JSON.stringify(err));
          showError('认证失败');
        })
    }
  };

  onClick = (stateName) => {
    ActionSheet.showActionSheetWithOptions({
        options: avatarModalData.map(item => item.text),
        maskClosable: true,
        wrapProps
      },
      (i) => {
        if (avatarModalData[i]) {
          avatarModalData[i].onPress.call(this, stateName)
        }
      }
    )
  };


  render() {
    const {username, idPositive, idNegative, idHandheld} = this.state;
    return (
      <div className={'page-verifyID'}>
        <PageWithHeader title={'实名认证'}>
          <BlueBox>
            <div className={'title-of-blue h2 white-text'}>身份认证</div>
          </BlueBox>
          <div className="white-area">
            <InputItem
              placeholder="请输入真实姓名"
              clear
              onChange={this.changeState('username')}
              value={username}
            />
            <div className="tips-box">
              <div className="title">* 上传证件材料</div>
              您的照片仅用于审核，我们将为您严格保密，请注意证件上的信息无遮挡，清晰可识别
            </div>
            <Flex justify="between">
              <Flex.Item>
                <div onClick={() => this.onClick('idPositive')} className="click-picture">
                  <Picture
                    circle={false}
                    src={idPositive}
                    size={PICTURE_SIZE}
                    emptyElement={(props) => <VerifyIdEmptyElement size={PICTURE_SIZE} text={'身份证正面上传'}/>}
                  />
                </div>
              </Flex.Item>
              <Flex.Item>
                <div onClick={() => this.onClick('idNegative')} className="click-picture">
                  <Picture
                    circle={false}
                    src={idNegative}
                    size={PICTURE_SIZE}
                    emptyElement={(props) => <VerifyIdEmptyElement size={PICTURE_SIZE} text={'身份证背面上传'}/>}
                  />
                </div>
              </Flex.Item>
            </Flex>
            <Flex justify="between">
              <Flex.Item>
                <div onClick={() => this.onClick('idHandheld')} className="click-picture">
                  <Picture
                    circle={false}
                    src={idHandheld}
                    size={PICTURE_SIZE}
                    emptyElement={(props) => <VerifyIdEmptyElement size={PICTURE_SIZE} text={'本人手持身份证'}/>}
                  />
                </div>
              </Flex.Item>
              <Flex.Item/>
            </Flex>
          </div>


          <GreenButton size={'big'} onClick={this.onSubmit}>提交认证</GreenButton>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
