import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
  BlueBox,
  Title,
  PageWithHeader,
  Picture,
  EquipmentItem,
  ToastNoMask
} from '../../../components';
import {
  Popover,
  ActivityIndicator,
  InputItem,
  Picker,
  Modal,
  List
} from 'antd-mobile';
import { decrypt, handleAbnormalData } from '../../../utils/methods';
import { EQUIPMENT_DATA_TYPE } from '../../../utils/variable';

import F2 from '@antv/f2';
import './style.less';

import {
  setLocalStorage,
  getLocalStorage,
  deleteLocalStorage
} from '../../../utils/storage';
import { POWER_TYPE } from '../../../utils/variable';
import PullToRefresh from 'pulltorefreshjs';

const Item = Popover.Item;
const prompt = Modal.prompt;

/**
 * 我的电站信息
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    selected: {
      // day: true,
      month: true,
      year: false,
      all: false
    },
    barcodeVisible: false,
    equipmentListObj: JSON.parse(getLocalStorage('equipmentListObj')) || {},
    dayStationData: [],
    monthStationData: [],
    yearStationData: [],
    allStationData: [],
    loading: true,
    popoverVisible: false,
    priceModalVisible: false,
    addressModalVisible: false,
    electricityPrice: '',
    address: ''
  };
  barChart = null;

  async componentDidMount() {
    this.initPullToRefresh();
    const { keyPair } = this.props;
    this.getOtherInfo(keyPair);

    let equipmentListObj = this.state.equipmentListObj;
    if (keyPair.hasKey) {
      // 获取设备列表
      if (!getLocalStorage('equipmentListObj')) {
        equipmentListObj = await this.getEquipmentList(keyPair);
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
        // 显示默认数据
        cacheEquipmentData.monthStationData.length < 1 &&
          cacheEquipmentData.monthStationData.push({
            number: 0,
            time: '00'
          });
        this.renderBarChart(cacheEquipmentData.monthStationData);
      }
    } else {
      this.setState({
        loading: false
      });
    }
  }
  componentWillUnmount() {
    // 清除监听事件，重要。
    PullToRefresh.destroyAll();
  }
  pullToRefresh = async () => {
    this.barChart && this.barChart.clear();
    // 删除缓存
    deleteLocalStorage('equipmentListObj');
    const { keyPair } = this.props;
    this.getOtherInfo(keyPair);

    // 如果有私钥
    if (keyPair.hasKey) {
      const equipmentListObj = await this.getEquipmentList(keyPair);
      const selected = Object.assign({}, this.state.selected);
      Object.keys(selected).forEach(item => {
        selected[item] = false;
      });
      selected.month = true;

      // 获取本地储存的 （天，月，年，所有） 的数据
      const cacheEquipmentData = this.getCacheEquipmentData();
      this.setState({
        selected,
        equipmentListObj,
        ...cacheEquipmentData
      });
      if (Object.keys(equipmentListObj).length > 0) {
        // 显示默认数据
        cacheEquipmentData.monthStationData.length < 1 &&
          cacheEquipmentData.monthStationData.push({
            number: 0,
            time: '00'
          });
        this.renderBarChart(cacheEquipmentData.monthStationData);
      }
    }
  };
  // 获取其他信息
  getOtherInfo = keyPair => {
    // 获取地址信息
    this.props.sunCityStore.fetchSCGetAddress();
    // 获取天气信息
    const city = getLocalStorage('city') || '北京';
    this.props.sunCityStore.fetchSCGetWeather({
      cityName: city
    });
    // 获取电价
    this.props.sunCityStore
      .fetchSCGetElectricityPrice({
        userPubKey: keyPair.publicKey
      })
      .then(result => {
        if (result.code === 200 && !result.data.fee) {
          this.setState({
            popoverVisible: true
          });
        }
      });
  };
  // 获取设备列表，并添加发电量和功率
  getEquipmentList = async keyPair => {
    // 获取设备列表
    await this.props.sunCityStore.fetchSCEquipmentList({
      userPubKey: keyPair.publicKey
    });
    let equipmentListObj = toJS(this.props.sunCityStore.equipmentListObj);
    // 各个设备添加功率和日电量,本地储存
    equipmentListObj =
      equipmentListObj &&
      (await this.addEquipmentPower(equipmentListObj, EQUIPMENT_DATA_TYPE.DAY));
    setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj || {})); // 本地储存所有设备状态
    return equipmentListObj;
  };
  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = (deviceNo, sourceData) => {
    PullToRefresh.init({
      mainElement: 'body', // "下拉刷新"把哪个部分包住
      triggerElement: 'body', // "下拉刷新"把哪个部分包住
      onRefresh: this.pullToRefresh, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        const ele = document.getElementById('page-powerStation-info');
        if (ele === null) {
          return false;
        }
        return ele.scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };
  // 获取本地储存的 （天，月，年，所有） 的数据
  getCacheEquipmentData = () => {
    const dayStationData = JSON.parse(getLocalStorage('dayStationData')) || []; // 获取本地储存每天发电数据
    const monthStationData =
      (JSON.parse(getLocalStorage('monthStationData')).length > 0 &&
        JSON.parse(getLocalStorage('monthStationData')).map(item => {
          item.time = item.time.substring(item.time.length - 2);
          return item;
        })) ||
      []; // 获取本地储存每月发电数据
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
    let dayStationElectric = 0; // 电站今日发电量
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
      // 设备当前功率
      let currentPower = 0;
      // 设备日电量
      let dayElectric = 0;
      if (decryptData.length > 0 && decryptData[decryptData.length - 1]) {
        const equipmentData = decryptData[decryptData.length - 1];
        currentPower =
          (equipmentData.totalPower && equipmentData.totalPower.toFixed(2)) ||
          '0.00';
        dayElectric =
          (equipmentData.todayEnergy && equipmentData.todayEnergy.toFixed(2)) ||
          '0.00';
      }
      // 电站日电量
      dayStationElectric += +dayElectric;
      equipmentListObj[name].currentPower = currentPower || 0; // 设备功率
      equipmentListObj[name].dayElectric = dayElectric || 0; // 设备日电量
    }
    this.props.sunCityStore.updateDayStationElectric(dayStationElectric);
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
    if (dateType === EQUIPMENT_DATA_TYPE.DAY) {
      return receiveData || [];
    }
    const decryptData = await this.handleDecryptData(receiveData);
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = async receiveData => {
    if (this.props.keyPair.hasKey) {
      const decryptData = [];
      for (let i = 0; i < Object.keys(receiveData).length; i++) {
        let powerInfo;
        try {
          let decryptedItem = await decrypt(
            this.props.keyPair.privateKey,
            receiveData[Object.keys(receiveData)[i]]
          );
          // 处理解密后的异常数据
          powerInfo = decryptedItem && handleAbnormalData(decryptedItem);
        } catch (err) {
          console.log(err);
        }
        if (powerInfo) {
          const value = powerInfo.maxEnergy - powerInfo.minEnergy;
          decryptData.push({
            time: Object.keys(receiveData)[i],
            number: value,
            maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
            power: powerInfo.power || ''
          });
        }
      }
      const decryptDataSort = decryptData.sort((pre, cur) => {
        if (pre.time.indexOf('-') > 0 && cur.time.indexOf('-') > 0) {
          return Date.parse(pre.time) - Date.parse(cur.time);
        } else {
          return pre.time - cur.time;
        }
      });
      return decryptDataSort;
    }
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
    const defs = {
      time: {
        tickCount: data.length > 20 ? Math.round(data.length / 3) + 1 : 4
      },
      number: {
        min: 0,
        formatter: function formatter(val) {
          return `${val}kWh`;
        }
      }
    };
    this.barChart.source(data, defs);
    this.barChart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = items[0].title;
        items[0].value =
          items[0].value &&
          `${Number(
            items[0].value.substring(0, items[0].value.length - 3)
          ).toFixed(2)}kWh`;
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
        // barData = this.state.dayStationData;
        break;
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
  addressModalHide = () => {
    this.setState({
      addressModalVisible: false
    });
  };
  addressModalShow = () => {
    this.setState({
      addressModalVisible: true
    });
  };
  addressChange = value => {
    this.setState({
      address: value[0]
    });
  };
  modifyAddress = () => {
    this.setState(
      {
        addressModalVisible: false
      },
      () => {
        this.props.sunCityStore.fetchSCGetWeather({
          cityName: this.state.address
        });
      }
    );
  };
  // 气泡显隐
  popoverShow = () => {
    this.setState({
      popoverVisible: !this.state.popoverVisible
    });
  };
  priceModalHide = () => {
    this.setState({
      priceModalVisible: false
    });
  };
  priceModalShow = () => {
    this.setState({
      popoverVisible: false,
      priceModalVisible: true
    });
  };
  priceChange = value => {
    this.setState({
      electricityPrice: value
    });
  };
  // 电价更改
  modifyElectricityPrice = () => {
    const { keyPair } = this.props;
    const price = this.state.electricityPrice;
    if (price.trim()) {
      this.props.sunCityStore
        .fetchSCModifyElectricityPrice({
          userPubKey: keyPair.publicKey,
          electricityFee: price.trim()
        })
        .then(result => {
          if (result.code === 200) {
            ToastNoMask('更改成功');
            this.setState(
              {
                priceModalVisible: false
              },
              () =>
                this.props.sunCityStore.fetchSCGetElectricityPrice({
                  userPubKey: keyPair.publicKey
                })
            );
          } else {
            ToastNoMask(`更改失败${result.msg}`);
            this.setState({
              priceModalVisible: false
            });
          }
        });
    } else {
      ToastNoMask('请输入电价');
    }
  };
  render() {
    const dayStationElectric = this.props.sunCityStore.dayStationElectric;

    const currentStationPower = getLocalStorage('currentStationPower') || 0; // 获取本地储存当前电站功率
    const totalStationElectric =
      Number(getLocalStorage('totalStationElectric')) ||
      Number(getLocalStorage('monthTotalStationElectric')) ||
      Number(getLocalStorage('yearTotalStationElectric')) ||
      Number(getLocalStorage('allTotalStationElectric')); // 获取本地储存电站总发电量
    const { equipmentListObj } = this.state;
    const equipmentNameList = Object.keys(equipmentListObj);
    const {
      weatherInfo,
      electricityPrice,
      addressInfo
    } = this.props.sunCityStore;
    let weatherEle = <i className="iconfont">&#xe631;</i>;
    if (weatherInfo) {
      if (weatherInfo.type.indexOf('雨') > 0) {
        weatherEle = <i className="iconfont">&#xe622;</i>;
      } else if (weatherInfo.type.indexOf('云') > 0) {
        weatherEle = <i className="iconfont">&#xe61a;</i>;
      }
    }
    return (
      <div className={'page-powerStation-info'} id="page-powerStation-info">
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
              <div className="weather" onClick={this.addressModalShow}>
                {weatherEle}
                {(weatherInfo && weatherInfo.type) || '晴'}
              </div>
              <Modal
                transparent
                title="坐标地址"
                visible={this.state.addressModalVisible}
                onClose={this.addressModalHide}
                footer={[{ text: '确定', onPress: this.modifyAddress }]}
              >
                <Picker
                  data={addressInfo}
                  cols={1}
                  value={[this.state.address]}
                  onChange={this.addressChange}
                >
                  <List.Item arrow="horizontal">坐标地址</List.Item>
                </Picker>
              </Modal>
              <div className="screen" onClick={this.screenChange}>
                {/* <div
                  data-class="day"
                  className={this.state.selected.day ? 'selected' : ''}
                >
                  日
                </div> */}
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
            <Popover
              overlayClassName="fortest"
              overlay={[
                <Item style={{ fontSize: '12px' }}>填写电价计算收益</Item>
              ]}
              placement="topLeft"
              visible={this.state.popoverVisible}
              onSelect={this.priceModalShow}
            >
              <div className="type-item profit" onClick={this.popoverShow}>
                收益<i className="iconfont">&#xe767;</i>
              </div>
            </Popover>
            <Modal
              transparent
              title="填写电价"
              visible={this.state.priceModalVisible}
              onClose={this.priceModalHide}
              footer={[{ text: '确定', onPress: this.modifyElectricityPrice }]}
            >
              <InputItem
                placeholder="请输入电价"
                clear
                onChange={this.priceChange}
              >
                电价（元/kWh）
              </InputItem>
            </Modal>
          </div>
          <div className="detail">
            <div className="detail-row">
              <div className="detail-item">
                <div className="number">
                  {`${currentStationPower}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">当前(W)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${dayStationElectric.toFixed(2)}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">今日(kWh)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${dayStationElectric &&
                    (dayStationElectric * electricityPrice).toFixed(2)}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">今日(￥)</div>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <div className="number">
                  0.00<span className="h5" />
                </div>
                <div className="detail-type">逆变器容量(kW)</div>
              </div>
              <div className="detail-item">
                <div className="number">
                  {`${totalStationElectric && totalStationElectric.toFixed(2)}`}
                  <span className="h5" />
                </div>
                <div className="detail-type">累计(kWh)</div>
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
