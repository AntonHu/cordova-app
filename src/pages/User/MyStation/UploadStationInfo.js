import React from 'react';
import {BlueBox, GreenButton, PageWithHeader, Picture, VerifyIdEmptyElement} from '../../../components';
import {InputItem, Modal, ActionSheet, Flex, ActivityIndicator} from 'antd-mobile';
import {reqUploadStationInfo} from '../../../stores/station/request';
import {FileMethods} from '../../../utils/methods';
import {testContractorCode} from '../../../utils/validate';
import {STATION_VERIFY_STATUS} from '../../../utils/variable';
import {observer, inject} from 'mobx-react';
import StationVerifyMask from './StationVerifyMask';
import IdCard from 'idcard';
import './UploadStationInfo.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
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
 * 上传电站信息
 */
@inject('keyPair', 'userStore', 'stationStore') // 如果注入多个store，用数组表示
@observer
class UploadStationInfo extends React.Component {
  constructor(props) {
    super(props);
    const id = props.match.params.id || '';
    let recordStatus = STATION_VERIFY_STATUS.FAIL;
    let connectionStatus = STATION_VERIFY_STATUS.FAIL;
    let recordImg = '';
    let connectionImg = '';
    if (id) {
      let station = props.stationStore.stationRecords.find(item => item.id + '' === id);
      if (station) {
        // station = station[0];
        recordImg = station.recordImg;
        connectionImg = station.connectionImg;
        recordStatus = station.recordStatus;
        connectionStatus = station.connectionStatus;
      }
    }
    this.state = {
      id,
      recordImg,
      recordStatus,
      connectionImg,
      connectionStatus,
      showLoading: false
    }
  }

  validateBeforeSend = () => {
    const {recordImg, connectionImg} = this.state;
    if (recordImg === '') {
      showError('请选择备案资料图片');
      return false;
    }
    if (connectionImg === '') {
      showError('请选择并网成功文件图片');
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
      let recordImg = '';
      let connectionImg = '';
      if (this.state.recordStatus === STATION_VERIFY_STATUS.FAIL) {
        recordImg = await this.getImageBlobFromURI(this.state.recordImg);
      }
      if (this.state.connectionStatus === STATION_VERIFY_STATUS.FAIL) {
        connectionImg = await this.getImageBlobFromURI(this.state.connectionImg);
      }

      this.upload({
        id: this.state.id,
        username: this.props.userStore.userInfo.username,
        recordImg,
        connectionImg,
      });
    }
  };

  upload = ({id, username, recordImg, connectionImg}) => {
    const self = this;
    this.setState({
      showLoading: true
    });

    reqUploadStationInfo({
      id,
      username,
      recordImg,
      connectionImg
    })
      .then(res => {
        console.log(JSON.stringify(res));
        const data = res.data;
        this.setState({
          showLoading: false
        });
        if (data.code === 200) {

          alert('成功', '您已成功上传', [{
            text: '确定', onPress: function () {
              self.props.history.goBack();
            }
          }])
        } else {
          this.jpushSetFailEvent({
            msg: {data, type: '上传电站信息失败'}
          });
          showError('认证失败');
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        this.setState({
          showLoading: false
        });
        if (err.data && err.data.code === 0) {
          showError('认证请求超时');
          return;
        }
        this.jpushSetFailEvent({
          msg: {data: err.data || {}, type: '上传电站信息失败'}
        });
        showError('认证失败');
      })
  };

  jpushSetFailEvent = (data) => {
    if  (window.JAnalytics) {
      window.JAnalytics.addBrowseEvent({
        browseId: 'upload_station_info_fail',       // 浏览内容 id
        browseName: '上传电站资料失败',     // 内容名称
        browseType: '报错',     // 内容类型
        browseDuration: 1, // 浏览时长，单位秒
        extras: data          // Optional. 扩展参数，类似 {'key1': 'value1'}
      })
    }
  };

  onClick = (imgName, statusName) => {
    if (this.state[statusName] !== STATION_VERIFY_STATUS.FAIL) {
      alert('不需重新上传', '该图片未审核失败，不需要重新上传', [{text: '确定'}]);
      return;
    }
    ActionSheet.showActionSheetWithOptions({
        options: avatarModalData.map(item => item.text),
        maskClosable: true,
        wrapProps
      },
      (i) => {
        if (avatarModalData[i]) {
          avatarModalData[i].onPress.call(this, imgName)
        }
      }
    )
  };


  render() {
    const {recordImg, connectionImg} = this.state;
    const isModify = this.state.id;
    return (
      <PageWithHeader title={'电站信息'} id="page-upload-station-info">
        <div className="white-area">
          <div onClick={() => this.onClick('recordImg', 'recordStatus')} className="click-picture first">
            {
              isModify &&
              <StationVerifyMask status={this.state.recordStatus} text="备案资料" />
            }
            <Picture
              circle={false}
              src={recordImg}
              emptyElement={(props) => <VerifyIdEmptyElement text={'备案资料'} icon="&#xe650;" />}
            />
          </div>
          <div onClick={() => this.onClick('connectionImg', 'connectionStatus')} className="click-picture second">
            {
              isModify &&
              <StationVerifyMask status={this.state.connectionStatus} text="并网成功文件" />
            }
            <Picture
              circle={false}
              src={connectionImg}
              emptyElement={(props) => <VerifyIdEmptyElement text={'并网成功文件'} icon="&#xe650;"/>}
            />
          </div>

          <GreenButton size={'big'} onClick={this.onSubmit}>提交审核</GreenButton>
        </div>
        <ActivityIndicator
          toast
          text="正在提交审核，请稍候..."
          animating={this.state.showLoading}
        />
      </PageWithHeader>


    );
  }
}

export default UploadStationInfo;
