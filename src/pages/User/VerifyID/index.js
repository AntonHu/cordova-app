import React from 'react';
import {BlueBox, GreenButton, PageWithHeader, Picture, VerifyIdEmptyElement} from '../../../components';
import {InputItem, Modal, ActionSheet, Flex, ActivityIndicator} from 'antd-mobile';
import {reqUploadVerifyId} from '../../../stores/user/request';
import {FileMethods} from '../../../utils/methods';
import {isIPhone} from '../../../utils/validate';
import {VERIFY_STATUS} from '../../../utils/variable';
import {observer, inject} from 'mobx-react';
import IdCard from 'idcard';
import './style.less';

let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const alert = Modal.alert;
const PICTURE_SIZE = 320;

const showError = (text) => {
  alert('错误', text, [
    {text: '确认'}
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
    quality: 25,
    destinationType: destinationType.FILE_URI,
    correctOrientation: true
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
    quality: 25,
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
@inject('keyPair', 'userStore') // 如果注入多个store，用数组表示
@observer
class VerifyID extends React.Component {
  state = {
    username: '',
    id: '',
    contractorCode: '',
    idPositive: '',
    idNegative: '',
    idHandheld: '',
    showLoading: false
  };

  validateBeforeSend = () => {
    const {username, idPositive, idNegative, idHandheld, id} = this.state;
    if (username === '') {
      showError('请输入真实姓名');
      return false;
    }
    if (username.length > 10) {
      showError('姓名最多输入10个字符');
      return false;
    }
    if (!IdCard.info(id).valid) {
      showError('身份证号格式错误');
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

    const {keyPair} = this.props;
    // if (!keyPair.showHasKey(this.props)) {
    //   return
    // }
    if (this.validateBeforeSend()) {

      const idPositive = await this.getImageBlobFromURI(this.state.idPositive);
      const idNegative = await this.getImageBlobFromURI(this.state.idNegative);
      const idHandheld = await this.getImageBlobFromURI(this.state.idHandheld);

      this.uploadVerifyId({
        publicKey: keyPair.publicKey,
        username: this.state.username,
        idPositive,
        idNegative,
        idHandheld,
        id: this.state.id,
        contractorCode: this.state.contractorCode
      });
    }
  };

  uploadVerifyId = ({publicKey, username, idPositive, idNegative, idHandheld, id, contractorCode}) => {
    const self = this;
    this.setState({
      showLoading: true
    });
    reqUploadVerifyId({
      publicKey,
      username,
      idPositive,
      idNegative,
      idHandheld,
      id,
      contractorCode
    })
      .then(res => {
        const data = res.data;
        this.setState({
          showLoading: false
        });
        if (data.code === 200) {
          this.props.userStore.updateIsKycInChain(VERIFY_STATUS.AUTHENTICATING);
          alert('成功', '您已成功验证', [{
            text: '确定', onPress: function () {
              self.props.history.goBack();
            }
          }])
        } else {
          this.jpushSetFailEvent({
            msg: {data, type: '实名认证失败'}
          });
          showError('认证失败');
        }
      })
      .catch(err => {
        this.setState({
          showLoading: false
        });
        if (err.data && err.data.code === 0) {
          showError('认证请求超时');
          return;
        }
        this.jpushSetFailEvent({
          msg: {data: err.data || {}, type: '实名认证失败'}
        });
        showError('认证失败');
      })
  };

  jpushSetFailEvent = (data) => {
    if  (window.JAnalytics) {
      window.JAnalytics.addBrowseEvent({
        browseId: 'verify_id_fail',       // 浏览内容 id
        browseName: '身份验证失败',     // 内容名称
        browseType: '报错',     // 内容类型
        browseDuration: 1, // 浏览时长，单位秒
        extras: data          // Optional. 扩展参数，类似 {'key1': 'value1'}
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
    const {username, idPositive, idNegative, idHandheld, id, contractorCode} = this.state;
    return (

        <PageWithHeader title={'实名认证'} id="page-verifyID">
          <BlueBox>
            <div className={'title-of-blue h2 white-text'}>身份认证</div>
          </BlueBox>
          <div className="white-area">
            <InputItem
              placeholder="请输入真实姓名"
              clear
              onChange={this.changeState('username')}
              value={username}
              labelNumber={4}
            >
              <span className="h3 main-text">真实姓名</span>
            </InputItem>
            <InputItem
              placeholder="请输入身份证号"
              clear
              onChange={this.changeState('id')}
              value={id}
              labelNumber={4}
            >
              <span className="h3 main-text">身份证号</span>
            </InputItem>
            <InputItem
              placeholder="没有可不填"
              clear
              onChange={this.changeState('contractorCode')}
              value={contractorCode}
              labelNumber={5}
            >
              <span className="h3 main-text">代理商编码</span>
            </InputItem>
            <div className="tips-box">
              <div className="title">* 上传证件材料</div>
              您的照片仅用于审核，我们将为您严格保密，请注意证件上的信息无遮挡，清晰可识别
            </div>
            <Flex justify="center">
              <div onClick={() => this.onClick('idPositive')} className="click-picture first">
                <Picture
                  circle={false}
                  src={idPositive}
                  size={PICTURE_SIZE}
                  emptyElement={(props) => <VerifyIdEmptyElement style={{...props.style, display: 'flex'}}
                                                                 text={'身份证正面上传'}/>}
                />
              </div>
              <div onClick={() => this.onClick('idNegative')} className="click-picture second">
                <Picture
                  circle={false}
                  src={idNegative}
                  size={PICTURE_SIZE}
                  emptyElement={(props) => <VerifyIdEmptyElement style={{...props.style, display: 'flex'}}
                                                                 text={'身份证背面上传'}/>}
                />
              </div>
            </Flex>
            <Flex justify="center">
              <div onClick={() => this.onClick('idHandheld')} className="click-picture first">
                <Picture
                  circle={false}
                  src={idHandheld}
                  size={PICTURE_SIZE}
                  emptyElement={(props) => <VerifyIdEmptyElement style={{...props.style, display: 'flex'}}
                                                                 text={'本人手持身份证'}/>}
                />
              </div>
              <div className="click-picture second"/>
            </Flex>

            <GreenButton size={'big'} onClick={this.onSubmit}>提交认证</GreenButton>
          </div>
          <ActivityIndicator
            toast
            text="正在提交认证，请稍候..."
            animating={this.state.showLoading}
          />
        </PageWithHeader>


    );
  }
}

export default VerifyID;
