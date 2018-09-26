import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn, ToastNoMask } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button, TextareaItem, Toast, ActionSheet, Modal, ActivityIndicator } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { isIPhone } from "../../../utils/validate";
import { FileMethods } from "../../../utils/methods";
import { uploadContractPrivateFile } from "../../../stores/contract/request";

let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}


function onFail(message) {
};

/**
 * 拍照的逻辑
 * this就是下面组件的this
 * @param updateMethod
 */
function capturePhoto(updateMethod) {
  const destinationType = navigator.camera.DestinationType;
  onFail = onFail.bind(this);
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture((imageURI) => updateMethod([imageURI]), onFail, {
    quality: 25,
    destinationType: destinationType.FILE_URI,
    correctOrientation: true
  });
}

/**
 * 选相片的逻辑
 * this就是下面组件的this
 * @param source
 * @param updateMethod
 */
function getPhoto(source, updateMethod) {
  // Retrieve image file location from specified source
  onFail = onFail.bind(this);
  const destinationType = navigator.camera.DestinationType;
  navigator.camera.getPicture((imageURI) => {
    if (imageURI.substring(0, 21) === "content://com.android") {
      const photo_split = imageURI.split("%3A");
      imageURI = "content://media/external/images/media/" + photo_split[1];
    }
    updateMethod([imageURI])
  }, onFail, {
    quality: 25,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}


const actionData = [
  {
    text: '拍照',
    onPress: function (updateMethod) {
      if (window.cordova) {
        // this是组件的this
        capturePhoto.call(this, updateMethod)
      }
    }
  },
  {
    text: '相册选取',
    onPress: function (updateMethod) {
      if (window.cordova) {
        const pictureSource = navigator.camera.PictureSourceType;
        // this是组件的this
        getPhoto.call(this, pictureSource.PHOTOLIBRARY, updateMethod)
      }
    }
  },
  {
    text: '取消',
    onPress: function () {
    }
  }
];

// 我要申诉页面
@inject('contractStore')
@observer
class Appeal extends React.Component {

  componentWillUnmount() {
    const { appeal } = this.props.contractStore;
    appeal.reset();
  }

  onSubmit = async () => {
    const { appeal } = this.props.contractStore;
    const { content, fileList } = appeal;
    const { projectId, purchaseId } = this.props.match.params;
    if (this.validateBeforeSubmit()) {
      let imageBlob = null;
      if (fileList.length > 0) {
        imageBlob = await this.getImageBlobFromURI(fileList[0]);
      }

      const result = await appeal.uploadData({ projectId, purchaseId, content, imageBlob });
      if (result.success) {
        Modal.alert('申诉', '上传申诉成功，即将返回上一页', [
          { text: '好的', onPress: () => this.props.history.goBack() }
        ])
      }
    }
  };

  onPhoneCall = () => {
  };

  validateBeforeSubmit = () => {
    const { appeal } = this.props.contractStore;
    const { content } = appeal;
    if (!content) {
      Toast.info('请输入申诉内容');
      return false;
    }
    return true;
  };

  onClick = (updateMethod) => {
    ActionSheet.showActionSheetWithOptions({
        options: actionData.map(item => item.text),
        maskClosable: true,
        wrapProps
      },
      (i) => {
        if (actionData[i]) {
          actionData[i].onPress.call(this, updateMethod)
        }
      }
    )
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

  render() {
    const { appeal } = this.props.contractStore;
    const { updateContent, updateFileList, content, fileList, loading, loadingText } = appeal;
    console.log(loading);
    console.log(loadingText);

    return (
      <PageWithHeader title="我要申诉" id="page-appeal">
        <div className="input-box">
          <TextareaItem
            placeholder="请输入申诉内容..."
            value={ content }
            onChange={ opinion => updateContent(opinion) }
          />
        </div>

        <div className="pic-wrap">
          <div className="pic-title">申诉凭证</div>
          <div className="pic-box">
            {
              fileList.length > 0
              &&
              <img src={ fileList[0] } className="pic-item"/>
            }
            <Button className="pic-item upload-btn" onClick={ () => this.onClick(updateFileList) }>
              <i className="iconfont">&#xe872;</i>
            </Button>
          </div>
        </div>


        <div className="btn-wrap">
          <a href="tel:0571-26270118" className="am-button">
            <i className="iconfont">&#xe61f;</i>
          </a>
          <OrangeGradientBtn onClick={ this.onSubmit }>提交</OrangeGradientBtn>
        </div>
        <ActivityIndicator
          toast
          text={ loadingText }
          animating={ loading }
        />
      </PageWithHeader>
    )
  }
}

export default Appeal;
