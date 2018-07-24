import React from 'react';
import {observer, inject} from 'mobx-react';
import {
  PageWithHeader,
  GreenButton,
  ToastNoMask,
  Popup
} from '../../../components';
import {Picker, List, WhiteSpace, InputItem, ActivityIndicator} from 'antd-mobile';
import {toJS} from 'mobx';
import {deleteLocalStorage, getLocalStorage, setLocalStorage} from '../../../utils/storage';
import {fetchAddInverterAT} from '../../../stores/sunCity/request';
import {EQUIPMENT_DATA_TYPE} from '../../../utils/variable';
import {decrypt} from '../../../utils/methods';
import './style.less';

const AOTAI = 'at';
let isScanning = false;

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
    showLoading: false,
    username: '',
    password: ''
  };

  evtbackButton = () => {
    if (!isScanning) {
      this.props.history.goBack();
    }
    // alert(isScanning);
  };

  componentDidMount() {
    document.addEventListener('backbutton', this.evtbackButton, false);
    // 请求所有逆变器类型
    this.props.sunCityStore.fetchSCInverters();
  }

  componentWillUnmount() {
    document.removeEventListener('backbutton', this.evtbackButton, false);
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
      isScanning = true;
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          setTimeout(() => {
            isScanning = false;
          }, 200);
          // if (result.cancelled) {
          //   isScanning = true;
          // }
          this.setState({
            barcodeValue: result.text
          });
        },
        error => {
          setTimeout(() => {
            isScanning = false;
          }, 200);
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

  onSubmit = () => {
    if (this.state.inverterType === AOTAI) {
      this.addInverterAT();
    } else {
      this.addInverter();
    }
  };

  /**
   * 添加奥泰的逆变器
   */
  addInverterAT = () => {
    const {username, password} = this.state;
    const sourceData = this.state.inverterType;
    if (this.props.keyPair.showHasKey(this.props)) {
      if (!username) {
        ToastNoMask('请输入用户名');
        return;
      }
      if (!password) {
        ToastNoMask('请输入密码');
      }
      this.setState({
        showLoading: true
      });
      fetchAddInverterAT({
        userPubKey: this.props.keyPair.publicKey,
        username,
        password
      })
        .then(result => {
          this.setState({
            showLoading: false
          });
          if (result.code === 200) {
            Object.keys(result.data).forEach(deviceNo => {
              if (result.data[deviceNo] === 'success') {
                this.addInverterDetail({sourceData, deviceNo, dateType: EQUIPMENT_DATA_TYPE.DAY});
              }
            });
            ToastNoMask('添加逆变器成功');
          } else {
            ToastNoMask('添加逆变器失败。' + (result.msg || ''));
          }
        })
        .catch(err => {
          this.setState({
            showLoading: false
          });
        })
    }
  };

  // 添加逆变器
  addInverter = () => {
    const deviceNo = this.state.barcodeValue;
    const sourceData = this.state.inverterType;
    if (this.props.keyPair.showHasKey(this.props)) {
      if (!sourceData) {
        ToastNoMask('请选择逆变器品牌');
        return;
      } else if (!deviceNo) {
        ToastNoMask('请输入逆变器条码');
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
            // deleteLocalStorage('stationExpireTime');
            // deleteLocalStorage('equipmentListObj');
            this.addInverterDetail({sourceData, deviceNo, dateType: EQUIPMENT_DATA_TYPE.DAY});
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

  /**
   * 添加成功后，把新的逆变器加入到equipmentListObj中
   * @param sourceData
   * @param deviceNo
   * @param dateType
   * @returns {Promise.<void>}
   */
  addInverterDetail = async ({sourceData, deviceNo, dateType}) => {
    if (this.props.keyPair.hasKey) {
      await this.props.sunCityStore.fetchSCEquipmentPower({
        sourceData,
        deviceNo,
        userPubKey: this.props.keyPair.publicKey,
        dateType
      });

      const receiveData = toJS(this.props.sunCityStore.equipmentPower) || [];
      // 设备功率
      const currentPower =
        (receiveData.length > 0 &&
          decryptData[receiveData.length - 1].power &&
          decryptData[receiveData.length - 1].power.toFixed(2)) ||
        0;
      // 设备日电量
      let dayElectric = 0;
      decryptData.forEach(item => {
        dayElectric += item.number;
      });
      let equipmentListObj = getLocalStorage('equipmentListObj');
      if (equipmentListObj !== null) {
        equipmentListObj = JSON.parse(equipmentListObj);
      } else {
        equipmentListObj = {}
      }
      const name = `${sourceData}_${deviceNo}`;
      equipmentListObj[name] = {};
      equipmentListObj[name].publicKey = this.props.keyPair.publicKey;
      equipmentListObj[name].source = sourceData;
      equipmentListObj[name].deviceNo = deviceNo;
      equipmentListObj[name].currentPower = currentPower || 0;
      equipmentListObj[name].dayElectric = dayElectric.toFixed(2) || 0;
      setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj));
    }
  };

  // 处理获取的解密数据
  handleDecryptData = async receiveData => {
    const decryptData = [];
    if (this.props.keyPair.hasKey) {
      Object.keys(receiveData).forEach(async item => {
        let powerInfo;
        try {
          const decryptedItem = await decrypt(
            this.props.keyPair.privateKey,
            receiveData[item]
          );
          powerInfo = decryptedItem && JSON.parse(decryptedItem);
        } catch (err) {
          console.log(err);
        }
        if (powerInfo) {
          const value = +(powerInfo.maxEnergy - powerInfo.minEnergy).toFixed(2);
          decryptData.push({
            time: item,
            number: value,
            maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
            power: powerInfo.power || ''
          });
        }
      });
    }
    return decryptData;
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
    const { inverterType } = this.state;
    return (
      <div className={'page-add-inverter'}>
        <PageWithHeader title={'添加逆变器'}>
          <WhiteSpace/>
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
            {
              inverterType === AOTAI
              ?
                <div>
                  <InputItem
                    placeholder="请输入账号"
                    clear
                    onChange={value => this.setState({username: value})}
                    value={this.state.username}
                  />
                  <InputItem
                    placeholder="请输入密码"
                    clear
                    type="password"
                    onChange={value => this.setState({password: value})}
                    value={this.state.password}
                  />
                </div>
                :
                <div>
                  <InputItem
                    placeholder="请输入条码"
                    clear
                    onChange={this.barcodeChange}
                    value={this.state.barcodeValue}
                  >
                    <i className="iconfont">&#xe654;</i>
                  </InputItem>
                  <div className="scan" onClick={this.barcodeScanner}>
                    <i className="iconfont">&#xe66c;</i>切换扫描条形码
                  </div>
                </div>
            }

            <GreenButton size={'big'} onClick={this.onSubmit}>
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
