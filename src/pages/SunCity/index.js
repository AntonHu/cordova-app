import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Title } from '../../components';
import { NoticeBar, Icon, ActivityIndicator } from 'antd-mobile';
import { TEST_PUBLIC_KEY, TEST_PRIVATE_KEY } from '../../utils/variable';
import { setSessionStorage, getSessionStorage } from '../../utils/storage';
import './style.less';

import { JSRsasign } from '../../jssign';
import SM2Cipher from '../../jssign/SM2Cipher';

const BigInteger = JSRsasign.BigInteger;

/**
 * 太阳城-首页
 */
const sunDistanceX = 50; // 小太阳x轴之间的距离
const sunDistanceY = 70; // 小太阳y轴之间的距离
const initialCoordinates = { left: 40, top: 40 };
// 将小太阳区域划分为24份,放入数组
const sunIntegralCoordinatesArr = [];
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 4; j++) {
    sunIntegralCoordinatesArr.push({
      left: initialCoordinates.left + sunDistanceX * i,
      top: initialCoordinates.top + sunDistanceY * j
    });
  }
}
const pickNumber = 0;
@inject('sunCityStore', 'userStore', 'miningStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    equipmentList: null,
    sunCoordinateArr: null,
    power: 0, // 功率
    dayPower: 0, // 日发电量
    sumPower: 0 // 总发电量
  };
  sunIntegralArr = [];
  selectSunNode = null;
  timeoutID = null;
  sunArea = null; // 大图形
  async componentDidMount() {
    // 获取最新公告,条件固定
    this.props.sunCityStore.fetchSCNews({
      page: 0,
      pageSize: 10
    });
    // 获取我的太阳积分
    this.props.miningStore.fetchBalance({ publicKey: TEST_PUBLIC_KEY });
    // 获取排行
    this.props.miningStore.fetchBalanceRanking({ publicKey: TEST_PUBLIC_KEY });
    // 获取用户信息
    this.props.userStore.fetchUserInfo();
    // 获取积分列表
    await this.props.sunCityStore.fetchSCSunIntegral({
      publicKey: TEST_PUBLIC_KEY
    });
    let equipmentList = {};
    // 储存设备列表整理后的数据
    if (!getSessionStorage('equipmentList')) {
      // 获取设备列表
      await this.props.sunCityStore.fetchSCEquipmentList({
        userPubKey: TEST_PUBLIC_KEY
      });
      equipmentList = toJS(this.props.sunCityStore.equipmentList) || {};
      // 添加各个设备的功率和日电量
      this.addEquipmentPower(equipmentList, 1);
    } else {
      equipmentList = JSON.parse(getSessionStorage('equipmentList'));
      this.setState({
        equipmentList
      });
    }

    // 分割积分数组
    this.spliceArr(
      toJS(this.props.sunCityStore.sunIntegral),
      this.sunIntegralArr
    );
    // 获取坐标数组
    this.sunIntegralArr.length > 0 &&
      this.setState({
        sunCoordinateArr: this.getSunCoordinateArr(this.sunIntegralArr[0])
      });

    // 储存电站数据
    if (!getSessionStorage('dayStationData')) {
      const dayStationData = await this.equipmentDataIntegrate(
        equipmentList,
        1
      );
      setSessionStorage('dayStationData', JSON.stringify(dayStationData)); // 本地储存电站每天发电数据
    }

    if (!getSessionStorage('monthStationData')) {
      const monthStationData = await this.equipmentDataIntegrate(
        equipmentList,
        2
      );
      setSessionStorage('monthStationData', JSON.stringify(monthStationData)); // 本地储存电站每月发电数据
    }

    if (!getSessionStorage('yearStationData')) {
      const yearStationData = await this.equipmentDataIntegrate(
        equipmentList,
        2
      );
      setSessionStorage('yearStationData', JSON.stringify(yearStationData)); // 本地储存电站每年发电数据
    }

    if (!getSessionStorage('allStationData')) {
      const equipmentDataArr = await this.getAllEquipmentData(equipmentList, 4);
      const allStationData = this.allEquipmentDataIntegrate(equipmentDataArr);
      setSessionStorage('allStationData', JSON.stringify(allStationData)); // 本地储存电站所有发电数据
    }
  }

  // 为每个添加设备的功率和日电量
  async addEquipmentPower(equipmentList, dateType) {
    let currentStationPower = 0; // 当前电站功率
    let totalStationElectric = 0; // 电站累计发电量
    // 遍历每个设备，并添加功率和日电量
    for (let i = 0; i < Object.keys(equipmentList).length; ++i) {
      const name = Object.keys(equipmentList)[i];
      const info = equipmentList[name];
      const sourceData = info.source;
      const deviceNo = info.deviceNo;
      const sortData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      const currentPower =
        (sortData &&
          sortData[sortData.length - 1] &&
          sortData[sortData.length - 1].power.toFixed(2)) ||
        0;

      let dayElectric = 0;
      sortData.forEach(item => {
        dayElectric += item.number;
      });
      const maxValue =
        (sortData[sortData.length - 1] &&
          sortData[sortData.length - 1].maxValue) ||
        0;
      equipmentList[name].currentPower = currentPower || 0; // 设备功率
      equipmentList[name].dayElectric = dayElectric.toFixed(2) || 0; // 设备日电量
      currentStationPower += Number(currentPower); // 当前电站功率
      totalStationElectric += Number(maxValue); // 当前电站发电量
    }
    setSessionStorage('currentStationPower', currentStationPower); // 本地储存当前电站功率
    setSessionStorage('totalStationElectric', totalStationElectric); // 本地储存电站总发电量
    setSessionStorage('equipmentList', JSON.stringify(equipmentList)); // 本地储存所有设备状态
    this.setState({ equipmentList });
  }

  // 合并多个设备的数据
  mergeEquipmentData = equipmentDataArr => {
    const mergeEquipmentDataArr = [];
    const timeList = equipmentDataArr.map(item => item.time);
    var uniqueTimeArr = [];
    for (var i = 0, len = timeList.length; i < len; i++) {
      var current = timeList[i];
      if (uniqueTimeArr.indexOf(current) === -1) {
        uniqueTimeArr.push(current);
      }
    }
    uniqueTimeArr.forEach(time => {
      let sum = 0;
      equipmentDataArr
        .filter(info => info.time === time)
        .forEach(item => (sum += item.number));
      mergeEquipmentDataArr.push({
        time,
        number: sum && sum.toFixed(2)
      });
    });
    return mergeEquipmentDataArr;
  };

  // 整合天，月，年数据
  async equipmentDataIntegrate(equipmentList, type) {
    const equipmentDataArr = await this.getAllEquipmentData(
      equipmentList,
      type
    );
    const stationData = this.mergeEquipmentData(equipmentDataArr);
    return stationData;
  }

  // 整合电站所有的数据
  allEquipmentDataIntegrate = allEquipmentData => {
    allEquipmentData.map(item => {
      item.time = item.time.substring(0, 4);
      return item;
    });
    const dataIntegrate = this.mergeEquipmentData(allEquipmentData);
    return dataIntegrate;
  };

  // 请求所有设备数据
  async getAllEquipmentData(equipmentList, dateType) {
    let equipmentDataArr = [];
    let dayStationElectric = 0;
    // 遍历每个设备，并累计总电量
    for (let i = 0; i < Object.keys(equipmentList).length; ++i) {
      const name = Object.keys(equipmentList)[i];
      const info = equipmentList[name];
      const sourceData = info.source;
      const deviceNo = info.deviceNo;
      const sortData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      sortData.forEach(item => {
        dayStationElectric += item.number;
      });
      equipmentDataArr = equipmentDataArr.concat(sortData);
    }
    setSessionStorage('dayStationElectric', dayStationElectric.toFixed(2)); // 本地储存当前电站今日发电量
    return equipmentDataArr;
  }

  // 获取并处理每个设备数据
  async handleEquipmentData(name, sourceData, deviceNo, dateType) {
    await this.props.sunCityStore.fetchSCEquipmentPower({
      sourceData,
      deviceNo,
      userPubKey: TEST_PUBLIC_KEY,
      dateType
    });
    const receiveData = toJS(this.props.sunCityStore.equipmentPower);
    const sortData = this.handleData(receiveData);
    return sortData;
  }

  // 处理获取的解密数据
  handleData = receiveData => {
    const data = [];
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
        data.push({
          time: item,
          number: value,
          maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
          power: powerInfo.power || ''
        });
      }
    });
    const sortData = data.sort((pre, cur) => {
      if (pre.time.indexOf('-') > 0 && cur.time.indexOf('-') > 0) {
        return Date.parse(pre.time) - Date.parse(cur.time);
      } else {
        return pre.time - cur.time;
      }
    });
    return sortData;
  };

  // 数据解密
  doDecrypt = data => {
    const privBI = new BigInteger(TEST_PRIVATE_KEY, 16);
    let cipherMode = '1'; // C1C3C2
    const cipher = new SM2Cipher(cipherMode);

    const decryptedMsg = cipher.Decrypt(privBI, data);
    return decryptedMsg;
  };

  componentWillUnmount() {
    this.timeoutID = null;
  }

  // 将获取的积分数组，分割成每10个一组,preArr为原始数组，newArr为新数组
  spliceArr = (preArr, newArr) => {
    for (var i = 0, len = preArr && preArr.length; i < len; i += 10) {
      newArr.push(preArr.slice(i, i + 10));
    }
  };

  // 获取小太阳的坐标数组
  getSunCoordinateArr = sunIntegralArr => {
    // 从坐标中选取任意 sunIntegralArr.length 个位置
    const sunCoordinateArr = [];
    const group = sunIntegralArr.length;
    let count = sunIntegralCoordinatesArr.length;
    for (let i = 0; i < group; i++) {
      const index = ~~(Math.random() * count) + i;
      sunCoordinateArr[i] = sunIntegralCoordinatesArr[index];
      sunIntegralCoordinatesArr[index] = sunIntegralCoordinatesArr[i];
      count--;
    }

    sunCoordinateArr.map((item, index) => {
      item.info = sunIntegralArr[index];
      // 小太阳随机上下左右浮动5个像素
      item.left = item.left + Math.floor(Math.random() * 10) - 5;
      item.top = item.top + Math.floor(Math.random() * 10) - 5;
      return item;
    });
    return sunCoordinateArr;
  };
  // 收取太阳积分
  selectSunIntegral = (e, sunIntegralInfo) => {
    this.selectSunNode = e.target.parentNode;
    this.props.sunCityStore
      .fetchSCGetSunIntegral({
        tokenId: sunIntegralInfo.id,
        value: sunIntegralInfo.amount,
        publicKey: TEST_PUBLIC_KEY
      })
      .then(result => {
        if (result.code === 200) {
          pickNumber += 1;
          this.selectSunNode.classList.add('remove');
          // 每删除10个，重置一次，并进入下一个
          if (pickNumber && pickNumber % 10 === 0) {
            this.timeoutID = setTimeout(() => {
              document
                .querySelectorAll('.remove')
                .forEach(item => item.classList.remove('remove'));
              this.setState({
                sunCoordinateArr: this.getSunCoordinateArr(
                  this.sunIntegralArr[pickNumber / 10]
                )
              });
            }, 1000);
          }
        }
      });
  };
  render() {
    const userInfo = toJS(this.props.userStore.userInfo);
    const { avatar, nickName } = userInfo;
    const { balance, balanceRanking } = this.props.miningStore;
    const { equipmentList } = this.state;
    const lastNews = toJS(this.props.sunCityStore.lastNews);
    const equipmentNameList =
      (equipmentList && Object.keys(equipmentList)) || [];
    return (
      <div className={'page-sunCity-info'}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          {`${lastNews && lastNews.title}：${lastNews && lastNews.content}`}
        </NoticeBar>
        <div className="sun-content">
          <div className="info">
            <div className="detail">
              <div
                className="person-info"
                onClick={() => this.props.history.replace('/mining')}
              >
                <img
                  className="person-pic"
                  src={
                    avatar ||
                    'http://ku.90sjimg.com/element_origin_min_pic/01/48/89/075744458690810.jpg'
                  }
                  alt=""
                />
                <span className="nick-name">{nickName}</span>
                <Icon type="right" />
              </div>
              <div>
                <span>当前排行：</span>
                {balanceRanking}
              </div>
              <div>
                <span>太阳积分：</span>
                {balance.toFixed(2)}
              </div>
            </div>
            <div
              className="powerStation"
              onClick={() => this.props.history.push('/sunCity/powerStation')}
            >
              <i className="iconfont powerStation-pic">&#xe609;</i>
              电站
            </div>
          </div>
          <div className="sun-items" ref={el => (this.sunArea = el)}>
            {this.state.sunCoordinateArr &&
              this.state.sunCoordinateArr.map((item, index) => {
                return (
                  <div
                    className="sun"
                    key={index}
                    style={{
                      left: `${item.left}px`,
                      top: `${item.top}px`
                    }}
                    ref={ele => (this.currentEle = ele)}
                    // onClick={() => this.selectSunIntegral(item.number)}
                    onClick={e => this.selectSunIntegral(e, item.info)}
                  >
                    <span className="sun-pic" />
                    <span className="sun-number">{item.info.amount}</span>
                  </div>
                );
              })}
          </div>
          <div className="news">
            <span>最新动态：</span>雷神刚刚挖宝10个太阳积分~
          </div>
          <div className="promote">
            <div>区块链达人季</div>
            <div>
              答题赢<span>一亿WT糖果</span>
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
                          equipmentList[equipment].deviceNo
                        }?source=${
                          equipmentList[equipment].source
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
                          {`功率：${equipmentList[equipment].currentPower}w`}{' '}
                        </span>
                        <span>{`日电量：${
                          equipmentList[equipment].dayElectric
                        }kw/h`}</span>
                      </div>
                    </div>
                    <Icon type="right" />
                  </div>
                );
              })
            ) : (
              <div className="loading">
                <ActivityIndicator text="加载中..." />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Comp);
