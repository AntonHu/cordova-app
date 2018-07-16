import React from 'react';
import { observer, inject } from 'mobx-react';
import {
  PageWithHeader,
  GreenButton,
  ToastNoMask,
  Popup
} from '../../../components';
import { Picker, List, WhiteSpace, InputItem, ActivityIndicator } from 'antd-mobile';
import { toJS } from 'mobx';
import { deleteLocalStorage } from '../../../utils/storage';
import './style.less';

/**
 * 添加逆变器
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    inverterType: '',
    barcodeValue: '',
    successModal: false,
    showLoading: false
  };
  componentDidMount() {
    // 请求所有逆变器类型
    this.props.sunCityStore.fetchSCInverters();
  }

  // 逆变器类型更改
  inverterTypeChange = value => {
    this.setState({
      inverterType: value[0]
    });
  };

  // 条形码输入
  barcodeChange = value => {
    this.setState({
      barcodeValue: value
    });
  };

  // 扫描条形码
  barcodeScanner = () => {
    if (window.cordova) {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          this.setState({
            barcodeValue: result.text
          });
        },
        error => {
          //扫码失败
          ToastNoMask(`扫码失败${error}`);
        },
        {
          preferFrontCamera: false, // iOS and Android 设置前置摄像头
          showFlipCameraButton: true, // iOS and Android 显示旋转摄像头按钮
          showTorchButton: true, // iOS and Android 显示打开闪光灯按钮
          torchOn: false, // Android, launch with the torch switched on (if available)打开手电筒
          prompt: '在扫描区域内放置二维码', // Android提示语
          resultDisplayDuration: 500, // Android, display scanned text for X ms设置扫码时间的参数default 1500.
          formats: 'CODE_128', // 二维码格式可设置多种类型,QR_CODE：二维码，CODE_128：条形码
          orientation: 'portrait', // Android only (portrait|landscape),default unset so it rotates with the device在安卓上 landscape 是横屏状态
          disableAnimations: true, // iOS     是否禁止动画
          disableSuccessBeep: false // iOS      禁止成功后提示声音 “滴”
        }
      );
    }
  };

  // 添加逆变器
  addInverter = () => {
    const deviceNo = this.state.barcodeValue;
    const sourceData = this.state.inverterType;
    if (this.props.keyPair.hasKey) {
      if (!deviceNo) {
        ToastNoMask.show('请输入逆变器条码');
        return;
      } else if (!sourceData) {
        ToastNoMask.show('请选择逆变器品牌');
        return;
      }
      this.setState({
        showLoading: true
      });
      this.props.sunCityStore
        .fetchSCAddInverter({
          userPubKey: this.props.keyPair.publicKey,
          sourceData,
          deviceNo
        })
        .then(result => {
          this.setState({
            showLoading: false
          });
          if (result.code === 200) {
            // 添加成功后，删除缓存设备数据，重新请求所有设备数据
            deleteLocalStorage('stationExpireTime');
            deleteLocalStorage('equipmentListObj');
            this.setState({
              successModal: true
            });
          } else {
            ToastNoMask(`添加逆变器失败。${result.msg || '' }`);
          }
        })
        .catch(err => {
          this.setState({
            showLoading: false
          });
        });
    } else {
      ToastNoMask('该账号没有私钥,请到个人中心添加！');
    }
  };

  onModalPress = () => {
    this.setState({
      successModal: false
    });
    this.props.history.goBack();
  };
  render() {
    const inverterList = toJS(this.props.sunCityStore.inverterList);
    inverterList &&
      inverterList.map(item => {
        item.value = item.id;
        item.label = item.name;
        return item;
      });
    return (
      <div className={'page-add-inverter'}>
        <PageWithHeader title={'添加逆变器'}>
          <WhiteSpace />
          <div className="add-inverter">
            <Picker
              data={inverterList}
              cols={1}
              className="inverter"
              value={[this.state.inverterType]}
              onChange={this.inverterTypeChange}
            >
              <List.Item arrow="horizontal">逆变器品牌</List.Item>
            </Picker>
            <InputItem
              placeholder="请输入条码"
              onChange={this.barcodeChange}
              value={this.state.barcodeValue}
            >
              <i className="iconfont">&#xe654;</i>
            </InputItem>
            <div className="scan" onClick={this.barcodeScanner}>
              <i className="iconfont">&#xe66c;</i>切换扫描条形码
            </div>
            <GreenButton size={'big'} onClick={this.addInverter}>
              确认
            </GreenButton>
            <Popup
              title="添加成功"
              subTitle=""
              buttonText="确定"
              visible={this.state.successModal}
              onPress={this.onModalPress}
              onClose={null}
            />
            <ActivityIndicator
              toast
              text="正在添加逆变器，请稍候..."
              animating={this.state.showLoading}
            />
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
