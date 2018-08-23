import React from 'react';
import { observer, inject } from 'mobx-react';
import {
  PageWithHeader,
  GreenButton,
  ToastNoMask,
  Popup
} from '../../../components';
import {
  Picker,
  List,
  WhiteSpace,
  InputItem,
  ActivityIndicator
} from 'antd-mobile';
import { toJS } from 'mobx';
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage
} from '../../../utils/storage';
import { fetchAddInverterAT } from '../../../stores/sunCity/request';
import { EQUIPMENT_DATA_TYPE } from '../../../utils/variable';
import './style.less';

const JINLANG = 'jl';
const JL_ACCOUNT_TYPE = [
  {
    value: '0',
    label: '普通账号'
  },
  {
    value: '1',
    label: '代理商账号'
  },
];
let isScanning = false;

/**
 * 添加逆变器
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class AddInverter extends React.Component {
  state = {
    inverterType: '',
    barcodeValue: '',
    successModal: false,
    showLoading: false,
    username: '',
    password: '',
    accountType: ''
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

  accountTypeChange = value => {
    this.setState({
      accountType: value[0]
    })
  };

  onSubmit = () => {
    this.addInverterAT();
  };

  /**
   * 添加奥泰、顾得威的逆变器
   */
  addInverterAT = () => {
    const { username, password, accountType } = this.state;
    const sourceData = this.state.inverterType;
    if (this.props.keyPair.showHasKey(this.props)) {
      if (!username) {
        ToastNoMask('请输入用户名');
        return;
      }
      if (!password) {
        ToastNoMask('请输入密码');
        return;
      }
      if (this.state.inverterType === JINLANG && !this.state.accountType) {
        ToastNoMask('请选择账号类型');
        return;
      }

      this.setState({
        showLoading: true
      });
      fetchAddInverterAT({
        userPubKey: this.props.keyPair.publicKey,
        username: username.trim(),
        password,
        source: sourceData,
        type: accountType
      })
        .then(result => {
          this.setState({
            showLoading: false
          });
          if (result.code === 200) {
            this.setState({
              successModal: true
            });
            Object.keys(result.data || {}).forEach(deviceNo => {
              if (result.data[deviceNo] === 'success') {
                this.addInverterDetail({
                  sourceData,
                  deviceNo,
                  dateType: EQUIPMENT_DATA_TYPE.DAY
                });
              }
            });
          } else {
            ToastNoMask('添加逆变器失败。' + (result.msg || ''));
          }
        })
        .catch(err => {
          this.setState({
            showLoading: false
          });
        });
    }
  };

  /**
   * 添加成功后，把新的逆变器加入到equipmentListObj中
   * @param sourceData
   * @param deviceNo
   * @param dateType
   * @returns {Promise.<void>}
   */
  addInverterDetail = async ({ sourceData, deviceNo, dateType }) => {
    if (this.props.keyPair.hasKey) {
      await this.props.sunCityStore.fetchSCEquipmentPower({
        sourceData,
        deviceNo,
        userPubKey: this.props.keyPair.publicKey,
        dateType
      });

      const receiveData = toJS(this.props.sunCityStore.equipmentPower) || [];
      // 设备当前功率
      let currentPower = 0;
      // 设备日电量
      let dayElectric = 0;
      if (receiveData.length > 0 && receiveData[receiveData.length - 1]) {
        const equipmentData = receiveData[receiveData.length - 1];
        currentPower = equipmentData.totalPower;
        dayElectric = equipmentData.todayEnergy;
      }
      let equipmentListObj = getLocalStorage('equipmentListObj');
      if (equipmentListObj !== null) {
        equipmentListObj = JSON.parse(equipmentListObj);
      } else {
        equipmentListObj = {};
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

        <PageWithHeader title={'添加逆变器'} id="page-add-inverter">
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
            <div>
              <InputItem
                placeholder="请输入账号"
                clear
                onChange={value => this.setState({ username: value })}
                value={this.state.username}
              />
              <InputItem
                placeholder="请输入密码"
                clear
                type="password"
                onChange={value => this.setState({ password: value })}
                value={this.state.password}
              />
              {
                inverterType === JINLANG
                &&
                <Picker
                  data={JL_ACCOUNT_TYPE}
                  cols={1}
                  className="account-type"
                  value={[this.state.accountType]}
                  onChange={this.accountTypeChange}
                >
                  <List.Item arrow="horizontal">账号类型</List.Item>
                </Picker>
              }
            </div>



            <GreenButton size={'big'} onClick={this.onSubmit}>
              确认
            </GreenButton>
            <Popup
              title="添加成功"
              subTitle=""
              buttonText="确定"
              visible={this.state.successModal}
              onPress={this.onModalPress}
              onClose={() => this.setState({successModal: false})}
            />
            <ActivityIndicator
              toast
              text="正在添加逆变器，请稍候..."
              animating={this.state.showLoading}
            />
          </div>
        </PageWithHeader>

    );
  }
}

export default AddInverter;
