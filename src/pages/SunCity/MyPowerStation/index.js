import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BlueBox, Title, PageWithHeader } from '../../../components';
import { Icon, ActivityIndicator } from 'antd-mobile';
import { JSRsasign } from '../../../jssign';
import SM2Cipher from '../../../jssign/SM2Cipher';
import F2 from '@antv/f2';
import './style.less';

import { setLocalStorage, getLocalStorage } from '../../../utils/storage';
import { POWER_TYPE } from '../../../utils/variable';

const BigInteger = JSRsasign.BigInteger;

/**
 * 我的电站信息
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    selected: {
      day: true,
      month: false,
      year: false,
      all: false
    },
    barcodeVisible: false,
    equipmentListObj: {},
    dayStationData: [],
    monthStationData: [],
    yearStationData: [],
    allStationData: [],
    loading: true
  };
  async componentDidMount() {
    const { keyPair } = this.props;
    let equipmentListObj = {};
    // 获取本地储存的设备列表
    if (getLocalStorage('equipmentListObj')) {
      equipmentListObj = JSON.parse(getLocalStorage('equipmentListObj'));
      this.setState({
        loading: false
      });
    } else {
      if (keyPair.hasKey) {
        // 获取设备列表
        await this.props.sunCityStore.fetchSCEquipmentList({
          userPubKey: keyPair.publicKey
        });
        equipmentListObj = toJS(this.props.sunCityStore.equipmentList);
        if (!equipmentListObj) {
          this.setState({
            loading: false
          });
        }
        // 添加各个设备的功率和日电量
        equipmentListObj && this.addEquipmentPower(equipmentListObj, 1);
      }
    }
    const dayStationData = JSON.parse(getLocalStorage('dayStationData')) || []; // 获取本地储存每天发电数据
    const monthStationData =
      JSON.parse(getLocalStorage('monthStationData')) || []; // 获取本地储存每月发电数据
    const yearStationData =
      JSON.parse(getLocalStorage('yearStationData')) || []; // 获取本地储存每年发电数据
    const allStationData = JSON.parse(getLocalStorage('allStationData')) || []; // 获取本地储存所有发电数据

    this.setState({
      equipmentListObj,
      dayStationData,
      monthStationData,
      yearStationData,
      allStationData
    });
    this.barChart = this.renderBarChart(dayStationData);
  }
  // 为每个添加设备的功率和日电量
  async addEquipmentPower(equipmentListObj, dateType) {
    // 遍历每个设备，并添加功率和日电量
    for (let i = 0; i < Object.keys(equipmentListObj).length; ++i) {
      const name = Object.keys(equipmentListObj)[i];
      const info = equipmentListObj[name];
      const sourceData = info.source;
      const deviceNo = info.deviceNo;
      const decryptData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      // 设备功率
      const currentPower =
        (decryptData &&
          decryptData[decryptData.length - 1] &&
          decryptData[decryptData.length - 1].power.toFixed(2)) ||
        0;
      // 设备日电量
      let dayElectric = 0;
      decryptData.forEach(item => {
        dayElectric += item.number;
      });
      equipmentListObj[name].currentPower = currentPower || 0; // 设备功率
      equipmentListObj[name].dayElectric = dayElectric.toFixed(2) || 0; // 设备日电量
    }
    setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj)); // 本地储存所有设备状态
    this.setState({ equipmentListObj, loading: false });
  }

  // 获取并处理每个设备数据
  async handleEquipmentData(name, sourceData, deviceNo, dateType) {
    if (this.props.keyPair.hasKey) {
      await this.props.sunCityStore.fetchSCEquipmentPower({
        sourceData,
        deviceNo,
        userPubKey: this.props.keyPair.publicKey,
        dateType
      });
    }
    const receiveData = toJS(this.props.sunCityStore.equipmentPower);
    const decryptData = this.handleDecryptData(receiveData);
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = receiveData => {
    const decryptData = [];
    Object.keys(receiveData).forEach(item => {
      let powerInfo;
      try {
        powerInfo =
          this.doDecrypt(receiveData[item]) &&
          JSON.parse(this.doDecrypt(receiveData[item]));
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
    return decryptData;
  };

  // 数据解密
  doDecrypt = data => {
    let privBI = '';
    if (this.props.keyPair.hasKey) {
      privBI = new BigInteger(this.props.keyPair.privateKey, 16);
    }
    let cipherMode = '1'; // C1C3C2
    const cipher = new SM2Cipher(cipherMode);

    const decryptedMsg = cipher.Decrypt(privBI, data);
    return decryptedMsg;
  };

  componentWillUnmount() {
    this.timeoutID = null;
  }
  componentWillUnmount() {
    if (this.barChart) {
      this.barChart = undefined;
    }
  }

  // 初始化柱形图
  renderBarChart = data => {
    // 创建渐变对象
    const canvas = document.getElementById('pie-bar-chart');
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 200, 0, 0);
    grd.addColorStop(0, '#fff');
    grd.addColorStop(1, '#0082f6');

    F2.Global.setTheme({
      pixelRatio: 2
    }); // 设为双精度
    var chart = new F2.Chart({
      id: 'pie-bar-chart',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(data);
    chart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = `${items[0].value}kw/h`;
      }
    });
    chart.axis('time', {
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart.axis('number', {
      grid: {
        lineDash: [0]
      },
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart
      .interval()
      .position('time*number')
      .color(grd);
    chart.render();
  };

  // 筛选条件更改
  screenChange = e => {
    const type = e.target.dataset.class;
    let barData = [];
    switch (POWER_TYPE[type]) {
      case 2:
        barData = this.state.monthStationData;
        break;
      case 3:
        barData = this.state.yearStationData;
        break;
      case 4:
        barData = this.state.allStationData;
        break;
      default:
        barData = this.state.dayStationData;
    }
    this.barChart = this.renderBarChart(barData);
    const selected = Object.assign({}, this.state.selected);
    Object.keys(selected).forEach(item => {
      selected[item] = false;
    });
    selected[type] = true;
    this.setState({ selected });
  };

  render() {
    const dayStationElectric = getLocalStorage('dayStationElectric') || 0; // 获取本地储存今日发电量
    const currentStationPower = getLocalStorage('currentStationPower') || 0; // 获取本地储存当前电站功率
    const totalStationElectric =
      Number(getLocalStorage('totalStationElectric')) ||
      Number(getLocalStorage('monthTotalStationElectric')) ||
      Number(getLocalStorage('yearTotalStationElectric')) ||
      Number(getLocalStorage('allTotalStationElectric')); // 获取本地储存电站总发电量
    const { equipmentListObj } = this.state;
    const equipmentNameList =
      (equipmentListObj && Object.keys(equipmentListObj)) || [];
    return (
      <div className={'page-powerStation-info'}>
        <PageWithHeader
          title={'我的电站'}
          rightComponent={
            <i
              className="iconfont"
              onClick={() => this.props.history.push('/sunCity/addInverter')}
            >
              &#xe650;
            </i>
          }
        >
          <BlueBox type={'pure'}>
            <div className="title">
              <div className="weather">
                <i className="iconfont">&#xe636;</i>晴
              </div>
              <div className="screen" onClick={this.screenChange}>
                <div
                  data-class="day"
                  className={this.state.selected.day ? 'selected' : ''}
                >
                  日
                </div>
                <div
                  data-class="month"
                  className={this.state.selected.month ? 'selected' : ''}
                >
                  月
                </div>
                <div
                  data-class="year"
                  className={this.state.selected.year ? 'selected' : ''}
                >
                  年
                </div>
                <div
                  data-class="all"
                  className={this.state.selected.all ? 'selected' : ''}
                >
                  全部
                </div>
              </div>
            </div>
            <canvas id="pie-bar-chart" />
          </BlueBox>
          <div className="type">
            <div className="type-item power">
              功率<i className="iconfont">&#xe643;</i>
            </div>
            <div className="type-item elec">
              发电量<i className="iconfont">&#xe677;</i>
            </div>
          </div>
          <div className="detail">
            <div className="detail-item">
              <div className="number">{`${currentStationPower}kw`}</div>
              <div className="detail-type">当前</div>
            </div>
            <div className="detail-item">
              <div className="number">{`${dayStationElectric}kw`}</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">---kw</div>
              <div className="detail-type">逆变器容量</div>
            </div>
            <div className="detail-item">
              <div className="number">{`${totalStationElectric}kw`}</div>
              <div className="detail-type">累计</div>
            </div>
          </div>
          <div className="equipment">
            <Title title="太阳城蓄力装备" />
            {equipmentNameList.length > 0 ? (
              equipmentNameList.map((equipment, index) => {
                return (
                  <div
                    key={index}
                    className="item"
                    onClick={() =>
                      this.props.history.push(
                        `/sunCity/equipmentInfo/${
                          equipmentListObj[equipment].deviceNo
                        }?source=${
                          equipmentListObj[equipment].source
                        }&name=${equipment}`
                      )
                    }
                  >
                    <div className="item-pic">
                      <i className="iconfont">&#xea35;</i>
                    </div>
                    <div className="item-detail">
                      <div className="item-name">{equipment}</div>
                      <div className="item-info">
                        <span>
                          {`功率：${equipmentListObj[equipment].currentPower}w`}{' '}
                        </span>
                        <span>{`日电量：${
                          equipmentListObj[equipment].dayElectric
                        }kw/h`}</span>
                      </div>
                    </div>
                    <Icon type="right" />
                  </div>
                );
              })
            ) : (
              <div className="loading">
                {this.state.loading ? (
                  <ActivityIndicator text="加载中..." />
                ) : (
                  '暂无数据'
                )}
              </div>
            )}
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
