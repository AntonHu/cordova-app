import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BlueBox, Title, PageWithHeader } from '../../../components';
import { Icon, Popover, Toast } from 'antd-mobile';
import F2 from '@antv/f2';
import './style.less';

import { getLocalStorage } from '../../../utils/storage';
import { POWER_TYPE } from '../../../utils/variable';

const Item = Popover.Item;

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
    allStationData: []
  };
  componentDidMount() {
    const equipmentListObj =
      JSON.parse(getLocalStorage('equipmentListObj')) || {}; // 获取本地储存的设备列表
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

  // 添加逆变器
  addInverter = () => {
    if (window.cordova) {
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          // 暂时保存
          if (this.props.keyPair.hasKey) {
            // this.props.sunCityStore
            //   .fetchSCAddInverter({
            //     userPubKey: this.props.keyPair.publicKey,
            //     sourceData: sourceData,
            //     deviceNo: deviceNo
            //   })
            //   .then(result => {
            //     if (result.code === 200) {
            //       Toast.show('添加逆变器成功');
            //     }
            //   });
          }

          // 测试代码，接口和参数还没定
          alert(
            '收到一个二维码\n' +
              '扫码文字结果: ' +
              result.text +
              '\n' +
              '格式: ' +
              result.format +
              '\n' +
              '是否在扫码页面取消扫码: ' +
              result.cancelled
          );
        },
        error => {
          //扫码失败
          Toast.show(`扫码失败${error}`);
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
            <Popover
              overlayClassName="fortest"
              visible={this.state.barcodeVisible}
              overlay={[
                <Item key="1">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/tOtXhkIWzwotgGSeptou.svg"
                    className="am-icon"
                    alt=""
                  />添加逆变器
                </Item>
              ]}
              onSelect={this.addInverter}
            >
              <i className="iconfont">&#xe650;</i>
            </Popover>
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
            {equipmentNameList.map((equipment, index) => {
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
                      <span>
                        {`日电量：${
                          equipmentListObj[equipment].dayElectric
                        }kw/h`}
                      </span>
                    </div>
                  </div>
                  <Icon type="right" />
                </div>
              );
            })}
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
