import React from 'react';
import { observer, inject } from 'mobx-react';
import { PageWithHeader } from '../../../components';
import F2 from '@antv/f2';
import { px } from '../../../utils/getDevice';
import {
  setLocalStorage,
  getLocalStorage,
  deleteLocalStorage
} from '../../../utils/storage';
import {
  decrypt,
  handleAbnormalData,
  isExpire,
  getHour_Minute
} from '../../../utils/methods';
import { EQUIPMENT_DATA_TYPE } from '../../../utils/variable';
import './style.less';

import { toJS } from 'mobx';
import PullToRefresh from 'pulltorefreshjs';

/**
 * 电站设备信息
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
    dayElectric: 0,
    chartTitle: '日功率走势图(W)',
    sourceData: '', // 数据来源
    deviceNo: '', //设备编码
    maxValue: 0, // 设备发电量
    count: 0 // 日电量
  };
  pieChart = null;
  areaChart = null;
  curveChart = null;
  chartTitleObj = {
    day: '日功率走势图(W)',
    month: '月发电量(kWh)',
    year: '年发电量(kWh)',
    all: '全部发电量(kWh)'
  };
  async componentDidMount() {
    const deviceNo = this.props.match.params.id;
    const params = this.props.location.search.substring(1);
    const sourceData = params.split('&')[0].split('=')[1];
    this.initPullToRefresh(deviceNo, sourceData);

    let dayEquipmentData = [];
    // 当时间过期或者设备号更换，重新获取并缓存数据
    if (
      isExpire(1, 'equipmentExpireTime') ||
      getLocalStorage('equipmentNumber') !== deviceNo
      // TODO: 暂时先不缓存了，后面再弄回来
      // true
    ) {
      dayEquipmentData = await this.cacheDayEquipmentData(sourceData, deviceNo);
    } else {
      dayEquipmentData = JSON.parse(getLocalStorage('dayEquipmentData'));
    }
    this.renderCharts(dayEquipmentData);
    this.setState({
      deviceNo,
      sourceData
    });

    // 本地储存设备月，年，所有数据
    this.cacheEquipmentData(sourceData, deviceNo);
  }
  componentWillUnmount() {
    // 清除监听事件，重要。
    PullToRefresh.destroyAll();
  }
  pullToRefresh = async (deviceNo, sourceData) => {
    // 删除缓存
    deleteLocalStorage('equipmentExpireTime');
    const { keyPair } = this.props;
    const promiseArray = [];
    // 如果有私钥
    if (keyPair.hasKey) {
      const dayEquipmentData = await this.cacheDayEquipmentData(
        sourceData,
        deviceNo
      );
      const selected = Object.assign({}, this.state.selected);
      Object.keys(selected).forEach(item => {
        selected[item] = false;
      });
      selected.day = true;
      this.setState({
        selected,
        chartTitle: this.chartTitleObj.day
      });
      this.renderCharts(dayEquipmentData);
      // 本地储存设备月，年，所有数据
      this.cacheEquipmentData(sourceData, deviceNo);

      promiseArray.push(dayEquipmentData);
    }
    return Promise.all(promiseArray);
  };
  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = (deviceNo, sourceData) => {
    PullToRefresh.init({
      mainElement: 'body', // "下拉刷新"把哪个部分包住
      triggerElement: 'body', // "下拉刷新"把哪个部分包住
      onRefresh: () => this.pullToRefresh(deviceNo, sourceData), // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        const ele = document.getElementById('page-equipment-info');
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
  // 渲染可视化图
  renderCharts = dayEquipmentData => {
    // 设备当前功率
    let currentPower = 0;
    // 设备日电量
    let dayElectric = 0;
    // 当前电站发电量
    let maxValue = 0;
    if (dayEquipmentData.length > 0) {
      const equipmentData = dayEquipmentData[dayEquipmentData.length - 1];
      currentPower =
        (equipmentData.totalPower && equipmentData.totalPower.toFixed(2)) ||
        '0.00';
      dayElectric =
        (equipmentData.todayEnergy && equipmentData.todayEnergy.toFixed(2)) ||
        '0.00';
      maxValue =
        (equipmentData.totalEnergy && equipmentData.totalEnergy.toFixed(2)) ||
        '0.00';
    } else {
      // 默认显示数据
      dayEquipmentData.push({ time: '00', number: 0 });
    }
    this.pieChart && this.pieChart.clear();
    this.curveChart && this.curveChart.clear();
    this.areaChart && this.areaChart.clear();
    this.renderArea(dayEquipmentData);
    this.renderPieBar(currentPower);
    this.setState({
      dayElectric,
      maxValue
    });
  };
  // 本地储存设备天数据
  async cacheDayEquipmentData(sourceData, deviceNo) {
    const dayEquipmentData = await this.getPowerData(
      sourceData,
      deviceNo,
      EQUIPMENT_DATA_TYPE.DAY
    );
    dayEquipmentData.length > 0 &&
      dayEquipmentData.map(item => {
        item.time = getHour_Minute(item.latestTime);
        item.number = item.totalPower || 0;
        return item;
      });
    setLocalStorage('dayEquipmentData', JSON.stringify(dayEquipmentData)); // 本地储存天设备发电数据
    return dayEquipmentData;
  }

  pullToRefresh = async (deviceNo, sourceData) => {
    const { keyPair, userStore, history } = this.props;
    // this.props.sunCityStore.deleteAllCache();
    const promiseArray = [];

    // 如果有私钥
    if (keyPair.hasKey) {
      let dayEquipmentData = [];
      dayEquipmentData = await this.getPowerData(
        sourceData,
        deviceNo,
        EQUIPMENT_DATA_TYPE.DAY
      );
      dayEquipmentData.length > 0 &&
        dayEquipmentData.map(item => {
          item.time = getHour_Minute(item.latestTime);
          item.number = item.totalPower;
          return item;
        });
      setLocalStorage('dayEquipmentData', JSON.stringify(dayEquipmentData)); // 本地储存天设备发电数据
      // 设备当前功率
      let currentPower = 0;
      // 设备日电量
      let dayElectric = 0;
      // 当前电站发电量
      let maxValue = 0;
      const equipmentData = dayEquipmentData[dayEquipmentData.length - 1];
      currentPower = equipmentData.totalPower;
      dayElectric = equipmentData.todayEnergy;
      maxValue = equipmentData.totalEnergy;
      this.setState({
        deviceNo,
        sourceData,
        dayElectric,
        maxValue
      });
      this.pieChart && this.pieChart.clear();
      this.areaChart && this.areaChart.clear();
      this.renderPieBar(currentPower);
      // 本地储存设备月，年，所有数据
      this.cacheEquipmentData(sourceData, deviceNo);

      promiseArray.push(dayEquipmentData);
    }
    return Promise.all(promiseArray);
  };
  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = (deviceNo, sourceData) => {
    PullToRefresh.init({
      mainElement: '#page-equipment-info', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-equipment-info', // "下拉刷新"把哪个部分包住
      onRefresh: () => this.pullToRefresh(deviceNo, sourceData), // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        const ele = document.getElementById('page-equipment-info');
        if (ele === null) {
          return false;
        }
        return ele.parentNode.parentNode.scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };

  // 本地储存设备月，年，所有数据
  async cacheEquipmentData(sourceData, deviceNo) {
    // 当时间过期或者设备号更换，重新获取并缓存数据
    // if (
    //   isExpire(1, 'equipmentExpireTime') ||
    //   getLocalStorage('equipmentNumber') !== deviceNo
    // ) {
    // 请求设备月发电数据，本地储存
    const monthEquipmentData = await this.getPowerData(
      sourceData,
      deviceNo,
      EQUIPMENT_DATA_TYPE.MONTH
    );
    monthEquipmentData.length > 0 &&
      monthEquipmentData.map(item => {
        item.time = item.time.substring(item.time.length - 5);
        return item;
      });
    setLocalStorage('monthEquipmentData', JSON.stringify(monthEquipmentData));

    // 请求设备年发电数据，本地储存
    let yearEquipmentData = await this.getPowerData(
      sourceData,
      deviceNo,
      EQUIPMENT_DATA_TYPE.YEAR
    );
    yearEquipmentData = yearEquipmentData.map(item => {
      item.time = item.time.substring(5);
      return item;
    });
    setLocalStorage('yearEquipmentData', JSON.stringify(yearEquipmentData));
    this.cacheAllEquipmentData(sourceData, deviceNo);
    // }
  }
  // 请求设备所有发电数据，本地储存
  async cacheAllEquipmentData(sourceData, deviceNo) {
    // 请求设备所有发电数据，本地储存
    const allEquipmentData = await this.getPowerData(
      sourceData,
      deviceNo,
      EQUIPMENT_DATA_TYPE.ALL
    );
    const allEquipmentDataIntegrate = this.allEquipmentDataIntegrate(
      allEquipmentData
    );
    setLocalStorage(
      'allEquipmentData',
      JSON.stringify(allEquipmentDataIntegrate)
    );
    setLocalStorage('equipmentNumber', deviceNo); // 本地储存设备号
    setLocalStorage('equipmentExpireTime', new Date().getTime()); // 本地储存设备数据过期时间
  }
  // 整合设备所有的数据
  allEquipmentDataIntegrate = allEquipmentData => {
    allEquipmentData.map(item => {
      item.time = item && item.time.substring(0, 4);
      return item;
    });
    const dataIntegrate = this.mergeEquipmentData(allEquipmentData);
    return dataIntegrate;
  };

  // 合并所有的数据并排序
  mergeEquipmentData = equipmentDataArr => {
    const mergeEquipmentDataArr = [];
    const timeList = equipmentDataArr.map(item => item.time.substring(0, 4));
    var uniqueTimeArr = [];
    for (var i = 0, len = timeList.length; i < len; i++) {
      var current = timeList[i];
      if (uniqueTimeArr.indexOf(current) === -1) {
        uniqueTimeArr.push(current);
      }
    }
    uniqueTimeArr.forEach(year => {
      let sum = 0;
      equipmentDataArr
        .filter(info => info.time.indexOf(year) > -1)
        .forEach(item => (sum += item.number));
      mergeEquipmentDataArr.push({
        time: year,
        number: sum || 0
      });
    });
    const sortEquipmentDataArr = mergeEquipmentDataArr.sort((pre, cur) => {
      if (pre.time.indexOf('-') > 0 && cur.time.indexOf('-') > 0) {
        return Date.parse(pre.time) - Date.parse(cur.time);
      } else {
        return pre.time - cur.time;
      }
    });
    return sortEquipmentDataArr;
  };

  // 按照类型请求电量数据
  async getPowerData(sourceData, deviceNo, dateType) {
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
    const decryptData =
      (receiveData && (await this.handleDecryptData(receiveData, dateType))) ||
      [];
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = async (receiveData, dateType) => {
    if (this.props.keyPair.hasKey) {
      const data = [];
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
          data.push({
            time: Object.keys(receiveData)[i],
            number: value,
            maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
            power: powerInfo.power || ''
          });
        }
      }
      const sortData = data.sort((pre, cur) => {
        if (pre.time.indexOf('-') > 0 && cur.time.indexOf('-') > 0) {
          return Date.parse(pre.time) - Date.parse(cur.time);
        } else {
          return pre.time - cur.time;
        }
      });
      return sortData;
    }
  };

  // 绘制发电环图
  renderPieBar = currentPower => {
    this.pieChart = new F2.Chart({
      id: 'pie-bar-chart',
      width: px(340),
      height: px(340),
      padding: 0,
      pixelRatio: window.devicePixelRatio
    });
    this.pieChart.animate(false);
    const data = [
      {
        x: '1',
        y: 100
      }
    ];
    this.pieChart.source(data, {
      y: {
        max: 100,
        min: 0
      }
    });
    this.pieChart.axis(false);
    this.pieChart.tooltip(false);
    this.pieChart.coord('polar', {
      transposed: true,
      innerRadius: 0.8,
      radius: 0.9
    });
    this.pieChart.guide().arc({
      start: [0, 0],
      end: [1, 99.98],
      top: false,
      style: {
        lineWidth: 15,
        stroke: '#024dc8'
      }
    });
    this.pieChart.guide().html({
      position: ['110%', '57.5%'],
      html: `<div style="width: 250px;height: 40px;text-align: center;"><div style="font-size: 20px;font-weight:bold">${currentPower}</div><div style="font-size: 14px;margin-top: 5px">当前功率(W)</div></div>`
    });
    this.pieChart
      .interval()
      .position('x*y')
      .color('#8de837')
      .size(15)
      .animate(false);
    this.pieChart.render();

    return this.pieChart;
  };

  // 绘制功率图
  renderArea = data => {
    this.areaChart = new F2.Chart({
      id: 'curve-chart',
      pixelRatio: window.devicePixelRatio
    });
    const defs = {
      time: {
        tickCount: 5,
        range: [0, 1]
      },
      number: {
        tickCount: data.every(item => item.number === 0) ? 2 : 6,
        min: 0
      }
    };
    this.areaChart.source(data, defs);
    this.areaChart.tooltip({
      showCrosshairs: true
    });
    this.areaChart.tooltip({
      showCrosshairs: true,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = items[0].title;
        items[0].value =
          items[0].value && `${Number(items[0].value).toFixed(2)}W`;
      }
    });
    this.areaChart.axis('time', {
      label: (text, index, total) => {
        const cfg = {
          textAlign: 'center'
        };
        if (index === 0) {
          cfg.textAlign = 'start';
        }
        if (index > 0 && index === total - 1) {
          cfg.textAlign = 'end';
        }
        return cfg;
      }
    });
    this.areaChart.area().position('time*number');
    this.areaChart.line().position('time*number');
    this.areaChart.render();
  };
  // 绘制发电曲线图
  renderCurve = data => {
    this.curveChart = new F2.Chart({
      id: 'curve-chart',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      time: {
        tickCount: 4,
        range: [0, 1]
      },
      number: {
        tickCount: data.every(item => item.number === 0) ? 2 : 6,
        min: 0
      }
    };
    this.curveChart.source(data, defs);
    this.curveChart.axis('time', {
      label: (text, index, total) => {
        const cfg = {
          textAlign: 'center'
        };
        if (index === 0) {
          cfg.textAlign = 'start';
        }
        if (index > 0 && index === total - 1) {
          cfg.textAlign = 'end';
        }
        return cfg;
      }
    });
    this.curveChart.tooltip({
      showCrosshairs: true,
      onShow: function onShow(ev) {
        const items = ev.items;
        items[0].name = items[0].title;
        items[0].value =
          items[0].value && `${Number(items[0].value).toFixed(2)}kWh`;
      }
    });
    this.curveChart
      .line()
      .position('time*number')
      .shape('smooth');
    this.curveChart
      .point()
      .position('time*number')
      .shape('smooth')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });
    this.curveChart.render();
  };

  // 筛选条件更改
  screenChange = e => {
    const type = e.target.dataset.class;
    if (!type) {
      return;
    }
    const selected = Object.assign({}, this.state.selected);
    Object.keys(selected).forEach(item => {
      selected[item] = false;
    });
    selected[type] = true;
    this.setState({ selected, chartTitle: this.chartTitleObj[type] });

    let equipmentData = [];
    switch (type) {
      case 'day':
        equipmentData = JSON.parse(getLocalStorage('dayEquipmentData')); // 获取本地储存设备发电--天
        break;
      case 'month':
        equipmentData = JSON.parse(getLocalStorage('monthEquipmentData')); // 获取本地储存设备发电--月
        break;
      case 'year':
        equipmentData = JSON.parse(getLocalStorage('yearEquipmentData')); // 获取本地储存设备发电--年
        break;
      case 'all':
        equipmentData = JSON.parse(getLocalStorage('allEquipmentData')); // 获取本地储存设备发电--所有
        break;
      default:
        break;
    }
    // 显示默认数据
    equipmentData.length < 1 &&
      equipmentData.push({
        number: 0,
        time: '00'
      });
    this.curveChart && this.curveChart.clear();
    this.areaChart && this.areaChart.clear();
    if (type === 'day') {
      this.renderArea(equipmentData);
    } else {
      this.renderCurve(equipmentData);
    }
  };
  render() {
    return (
      <div className={'page-equipment-info'} id="page-equipment-info">
        <PageWithHeader
          title={
            this.props.location.search
              .substring(1)
              .split('&')[1]
              .split('=')[1]
          }
        >
          <div className="survey">
            <div className="survey-item">
              <div className="survey-item-number">{this.state.dayElectric}</div>
              <div className="survey-item-type">日电量(kWh)</div>
            </div>
            <canvas id="pie-bar-chart" />
            <div className="survey-item">
              <div className="survey-item-number">{this.state.maxValue}</div>
              <div className="survey-item-type">总电量(kWh)</div>
            </div>
          </div>
          <div className="equipment-content">
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
            <div className="curve-chart-title">{this.state.chartTitle}</div>
            <canvas id="curve-chart" />
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
