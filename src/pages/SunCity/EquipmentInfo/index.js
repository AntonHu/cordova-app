import React from 'react';
import { observer, inject } from 'mobx-react';
import { PageWithHeader } from '../../../components';
import F2 from '@antv/f2';
import { px } from '../../../utils/getDevice';
import { setLocalStorage, getLocalStorage } from '../../../utils/storage';
import { decrypt } from '../../../utils/methods';
import { EQUIPMENT_DATA_TYPE } from '../../../utils/variable';
import './style.less';

import { toJS } from 'mobx';

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
    chartTitle: '日功率走势图(w)',
    sourceData: '', // 数据来源
    deviceNo: '', //设备编码
    count: 0 // 日电量
  };
  pieChart = null;
  curveChart = null;
  chartTitleObj = {
    day: '日功率走势图(w)',
    month: '月发电量(kwh)',
    year: '年发电量(kwh)',
    all: '全部发电量(kwh)'
  };
  async componentDidMount() {
    const deviceNo = this.props.match.params.id;
    const params = this.props.location.search.substring(1);
    const sourceData = params.split('&')[0].split('=')[1];

    let dayEquipmentData = [];
    // 当时间过期或者设备号更换，重新获取并缓存数据
    if (this.isExpire() || getLocalStorage('equipmentNumber') !== deviceNo) {
      dayEquipmentData = await this.getPowerData(
        sourceData,
        deviceNo,
        EQUIPMENT_DATA_TYPE.DAY
      );
      setLocalStorage('dayEquipmentData', JSON.stringify(dayEquipmentData)); // 本地储存天设备发电数据
    } else {
      dayEquipmentData = JSON.parse(getLocalStorage('dayEquipmentData'));
    }
    if (dayEquipmentData.length > 0) {
      this.renderCurve(dayEquipmentData);
    } else {
      // 默认显示数据
      this.renderCurve([{ time: '00', number: 0 }]);
    }

    // 设备当前功率
    const currentPower =
      dayEquipmentData.length > 0 &&
      dayEquipmentData[dayEquipmentData.length - 1] &&
      dayEquipmentData[dayEquipmentData.length - 1].power;
    // 设备日电量
    let dayElectric = 0;
    dayEquipmentData.forEach(item => {
      dayElectric += item.electric;
    });
    // 当前电站发电量
    const maxValue =
      (dayEquipmentData.length > 0 &&
        dayEquipmentData[dayEquipmentData.length - 1] &&
        dayEquipmentData[dayEquipmentData.length - 1].maxValue) ||
      0;
    this.setState({
      deviceNo,
      sourceData,
      dayElectric,
      maxValue
    });
    this.renderPieBar(currentPower);

    // 本地储存设备月，年，所有数据
    this.cacheEquipmentData(sourceData, deviceNo);
  }

  // 本地储存设备月，年，所有数据
  async cacheEquipmentData(sourceData, deviceNo) {
    // 当时间过期或者设备号更换，重新获取并缓存数据
    if (this.isExpire() || getLocalStorage('equipmentNumber') !== deviceNo) {
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
      const yearEquipmentData = await this.getPowerData(
        sourceData,
        deviceNo,
        EQUIPMENT_DATA_TYPE.YEAR
      );
      setLocalStorage('yearEquipmentData', JSON.stringify(yearEquipmentData));

      // 请求设备所有发电数据，本地储存
      const allEquipmentData = await this.getPowerData(
        sourceData,
        deviceNo,
        EQUIPMENT_DATA_TYPE.ALL
      );
      setLocalStorage('allEquipmentData', JSON.stringify(allEquipmentData));
      setLocalStorage('equipmentNumber', deviceNo); // 本地储存设备号
      setLocalStorage('equipmentExpireTime', new Date().getTime()); // 本地储存设备数据过期时间
    }
  }

  // 检测设备数据是否过期
  isExpire = () => {
    return (
      new Date().getTime() - Number(getLocalStorage('equipmentExpireTime')) >
      3 * 60 * 60 * 1000
    ); // 设置三个小时的过期时间
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
    const decryptData =
      (receiveData && this.handleDecryptData(receiveData, dateType)) || [];
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = (receiveData, dateType) => {
    const data = [];
    if (this.props.keyPair.hasKey) {
      Object.keys(receiveData).forEach(item => {
        // 后端数据可能有问题，加一层处理
        let powerInfo;
        try {
          let decryptedItem = decrypt(
            this.props.keyPair.privateKey,
            receiveData[item]
          );
          // 处理解密后的异常数据
          if (decryptedItem.indexOf('#') > 0) {
            decryptedItem = decryptedItem.replace('#', '"');
          } else if (decryptedItem.indexOf('/') > 0) {
            decryptedItem = decryptedItem.replace('/', '.');
          }
          powerInfo = decryptedItem && JSON.parse(decryptedItem);
        } catch (err) {
          console.log(err);
        }
        if (powerInfo) {
          const value = +(powerInfo.maxEnergy - powerInfo.minEnergy).toFixed(2);
          data.push({
            time: item,
            number:
              dateType === EQUIPMENT_DATA_TYPE.DAY
                ? powerInfo.power || 0
                : value,
            electric: value || 0,
            maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
            power: powerInfo.power || 0
          });
        }
      });
    }
    const sortData = data.sort((pre, cur) => {
      if (pre.time.indexOf('-') > 0 && cur.time.indexOf('-') > 0) {
        return Date.parse(pre.time) - Date.parse(cur.time);
      } else {
        return pre.time - cur.time;
      }
    });
    return sortData;
  };

  // 绘制发电环图
  renderPieBar = currentPower => {
    // 创建渐变对象
    const canvas = document.getElementById('pie-bar-chart');
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 140, 0);
    grd.addColorStop(0, '#fa5a21');
    grd.addColorStop(1, '#5bd121');

    this.pieChart = new F2.Chart({
      id: 'pie-bar-chart',
      width: px(340),
      height: px(340),
      padding: 0,
      pixelRatio: window.devicePixelRatio
    });
    const data = [
      {
        x: '1',
        y: 85
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
      position: ['110%', '55%'],
      html: `<div style="width: 250px;height: 40px;text-align: center;"><div style="font-size: 20px;font-weight:bold">${(currentPower &&
        currentPower.toFixed(2)) ||
        0}w</div><div style="font-size: 14px;margin-top: 5px">当前功率</div></div>`
    });
    this.pieChart
      .interval()
      .position('x*y')
      .color(grd)
      .size(15)
      .animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      });
    this.pieChart.render();

    return this.pieChart;
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
        tickCount: data.length === 1 ? 2 : 5,
        min: 0,
        alias: '功率'
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
        var items = ev.items;
        items[0].name = null;
        items[0].value = items[0].value;
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
    this.renderCurve(equipmentData);
  };
  render() {
    return (
      <div className={'page-equipment-info'}>
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
              <div className="survey-item-number">
                {this.state.dayElectric && this.state.dayElectric.toFixed(2)}
              </div>
              <div className="survey-item-type">日电量</div>
            </div>
            <canvas id="pie-bar-chart" />
            <div className="survey-item">
              <div className="survey-item-number">{this.state.maxValue}</div>
              <div className="survey-item-type">总电量</div>
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
