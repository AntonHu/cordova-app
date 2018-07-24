import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
  BlueBox,
  Title,
  PageWithHeader,
  Picture,
  EquipmentItem
} from '../../../components';
import { Icon, ActivityIndicator } from 'antd-mobile';
import { decrypt } from '../../../utils/methods';
import { EQUIPMENT_DATA_TYPE } from '../../../utils/variable';

import F2 from '@antv/f2';
import './style.less';

import { setLocalStorage, getLocalStorage } from '../../../utils/storage';
import { POWER_TYPE } from '../../../utils/variable';

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
    equipmentListObj: JSON.parse(getLocalStorage('equipmentListObj')) || {},
    dayStationData: [],
    monthStationData: [],
    yearStationData: [],
    allStationData: [],
    loading: true
  };
  barChart = null;

  async componentDidMount() {
    // 获取天气信息
    const city = getLocalStorage('city') || '北京';
    this.props.sunCityStore.fetchSCGetWeather({
      cityName: city
    });
    const { keyPair } = this.props;
    let equipmentListObj = this.state.equipmentListObj;
    if (keyPair.hasKey) {
      // 获取设备列表
      if (!getLocalStorage('equipmentListObj')) {
        // 获取设备列表
        await this.props.sunCityStore.fetchSCEquipmentList({
          userPubKey: keyPair.publicKey
        });
        equipmentListObj = toJS(this.props.sunCityStore.equipmentList);
        // 各个设备添加功率和日电量,本地储存
        equipmentListObj =
          equipmentListObj &&
          (await this.addEquipmentPower(
            equipmentListObj,
            EQUIPMENT_DATA_TYPE.DAY
          ));
        setLocalStorage(
          'equipmentListObj',
          JSON.stringify(equipmentListObj || {})
        ); // 本地储存所有设备状态
        this.setState({
          equipmentListObj
        });
      }

      // 获取本地储存的 （天，月，年，所有） 的数据
      const cacheEquipmentData = this.getCacheEquipmentData();
      this.setState({
        ...cacheEquipmentData,
        loading: false
      });
      if (Object.keys(equipmentListObj).length > 0) {
        this.renderBarChart(cacheEquipmentData.dayStationData);
      }
    } else {
      this.setState({
        loading: false
      });
    }
  }

  // 获取本地储存的 （天，月，年，所有） 的数据
  getCacheEquipmentData = () => {
    const dayStationData = JSON.parse(getLocalStorage('dayStationData')) || []; // 获取本地储存每天发电数据
    const monthStationData =
      JSON.parse(getLocalStorage('monthStationData')).map(item => {
        item.time = item.time.substring(item.time.length - 2);
        return item;
      }) || []; // 获取本地储存每月发电数据
    const yearStationData =
      JSON.parse(getLocalStorage('yearStationData')) || []; // 获取本地储存每年发电数据
    const allStationData = JSON.parse(getLocalStorage('allStationData')) || []; // 获取本地储存所有发电数据
    return {
      dayStationData,
      monthStationData,
      yearStationData,
      allStationData
    };
  };

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
        (decryptData.length > 0 &&
          decryptData[decryptData.length - 1].power &&
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
    return equipmentListObj;
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
    if (this.props.keyPair.hasKey) {
      Object.keys(receiveData).forEach(item => {
        let powerInfo;
        try {
          const decryptItem = decrypt(
            this.props.keyPair.privateKey,
            receiveData[item]
          );
          powerInfo = decryptItem && JSON.parse(decryptItem);
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
    this.barChart = new F2.Chart({
      id: 'pie-bar-chart',
      pixelRatio: window.devicePixelRatio
    });
    this.barChart.source(data);
    this.barChart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = null;
        items[0].value = `${items[0].value}kwh`;
      }
    });
    this.barChart.axis('time', {
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    this.barChart.axis('number', {
      grid: {
        lineDash: [0]
      },
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    this.barChart
      .interval()
      .position('time*number')
      .color(grd);
    this.barChart.render();
  };

  // 筛选条件更改
  screenChange = e => {
    const type = e.target.dataset.class;
    if (!type) {
      return;
    }
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
    // 显示默认数据
    barData.length < 1 &&
      barData.push({
        number: 0,
        time: '00'
      });
    this.barChart && this.barChart.clear();
    this.renderBarChart(barData);

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
    const equipmentNameList = Object.keys(equipmentListObj);
    const weatherInfo = this.props.sunCityStore.weatherInfo;
    let weatherEle = <i className="iconfont">&#xe631;</i>;
    if (weatherInfo) {
      if (weatherInfo.type.indexOf('雨') > 0) {
        weatherEle = <i className="iconfont">&#xe622;</i>;
      } else if (weatherInfo.type.indexOf('云') > 0) {
        weatherEle = <i className="iconfont">&#xe61a;</i>;
      }
    }
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
                {weatherEle}
                {(weatherInfo && weatherInfo.type) || '晴'}
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
            <canvas
              id="pie-bar-chart"
              style={equipmentNameList.length < 1 ? { zIndex: -10 } : null}
            />
            {equipmentNameList.length < 1 ? (
              <div
                className="pic-wrap special-one"
                onClick={() => this.props.history.push('/sunCity/addInverter')}
              >
                <Picture
                  src={require('../../../images/transparent_inverter.png')}
                  height={218}
                  width={264}
                />
                <span>还未添加逆变器，快去添加~</span>
              </div>
            ) : null}
          </BlueBox>
          <div className="type">
            <div className="type-item power">
              功率<i className="iconfont">&#xe643;</i>
            </div>
            <div className="type-item elec">
              发电量<i className="iconfont">&#xe677;</i>
            </div>
            <div className="type-item profit">
              收益<i className="iconfont">&#xe767;</i>
            </div>
          </div>
          <div className="detail">
            <div className="detail-row">
              <div className="detail-item">
                <div className="number">
                  {`${currentStationPower}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">当前(w)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${dayStationElectric}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">今日(kwh)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${dayStationElectric &&
                    (dayStationElectric * 0.8149).toFixed(2)}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">今日(￥)</div>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <div className="number">
                  0<span className="h5" />
                </div>
                <div className="detail-type">逆变器容量(kw)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${totalStationElectric}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">累计(kwh)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${totalStationElectric &&
                    (totalStationElectric * 0.8149).toFixed(2)}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">累计(￥)</div>
              </div>
            </div>
          </div>
          <div className="equipment">
            <Title title="太阳城蓄力装备" />
            {equipmentNameList.length > 0 ? (
              equipmentNameList.map((equipment, index) => {
                return (
                  <EquipmentItem
                    key={index}
                    onClick={() =>
                      this.props.history.push(
                        `/sunCity/equipmentInfo/${
                          equipmentListObj[equipment].deviceNo
                        }?source=${
                          equipmentListObj[equipment].source
                        }&name=${equipment}`
                      )
                    }
                    equipmentName={equipment}
                    dayElectric={equipmentListObj[equipment].dayElectric}
                    currentPower={equipmentListObj[equipment].currentPower}
                  />
                );
              })
            ) : (
              <div className="loading">
                {this.state.loading ? (
                  <ActivityIndicator text="加载中..." />
                ) : (
                  <div
                    className="pic-wrap"
                    onClick={() =>
                      this.props.history.push('/sunCity/addInverter')
                    }
                  >
                    <Picture
                      src={require('../../../images/no_inverter.png')}
                      height={218}
                      width={264}
                    />
                    <span>还未添加逆变器，快去添加~</span>
                  </div>
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
