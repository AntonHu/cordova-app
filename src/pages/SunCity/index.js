import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Title } from '../../components';
import { NoticeBar, Icon, ActivityIndicator } from 'antd-mobile';
import { setLocalStorage, getLocalStorage } from '../../utils/storage';
import './style.less';

import { JSRsasign } from '../../jssign';
import SM2Cipher from '../../jssign/SM2Cipher';

const BigInteger = JSRsasign.BigInteger;

/**
 * 太阳城-首页
 */
const sunDistanceX = 50; // 小太阳x轴之间的距离
const sunDistanceY = 70; // 小太阳y轴之间的距离
const initialCoordinates = { left: 15, top: 20 };
// 将小太阳区域划分为24份,放入数组
const sunIntegralCoordinatesArr = [];
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 4; j++) {
    sunIntegralCoordinatesArr.push({
      left: initialCoordinates.left + sunDistanceX * i,
      top: initialCoordinates.top + sunDistanceY * j
    });
  }
}
let pickNumber = 0;
@inject('sunCityStore', 'userStore', 'miningStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    equipmentListObj: null,
    loading: true,
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
    const { keyPair } = this.props;
    // 获取最新公告,条件固定
    this.props.sunCityStore.fetchSCNews({
      page: 0,
      pageSize: 10
    });

    // 获取用户信息
    this.props.userStore.fetchUserInfo();

    if (keyPair.hasKey) {
      // 获取我的太阳积分
      this.props.miningStore.fetchBalance({ publicKey: keyPair.publicKey });
      // 获取排行
      this.props.miningStore.fetchBalanceRanking({
        publicKey: keyPair.publicKey
      });
      // 获取积分列表
      await this.props.sunCityStore.fetchSCSunIntegral({
        publicKey: keyPair.publicKey
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

    let equipmentListObj = {};
    // 储存设备列表整理后的数据
    if (!getLocalStorage('equipmentListObj')) {
      if (keyPair.hasKey) {
        // 获取设备列表
        await this.props.sunCityStore.fetchSCEquipmentList({
          userPubKey: keyPair.publicKey
        });
        equipmentListObj = toJS(this.props.sunCityStore.equipmentList) || {};
        // 添加各个设备的功率和日电量
        this.addEquipmentPower(equipmentListObj, 1);
      }
    } else {
      equipmentListObj = JSON.parse(getLocalStorage('equipmentListObj'));
      this.setState({
        equipmentListObj,
        loading: false
      });
    }

    // 储存电站数据,2-月，3-年，4-全部
    if (!getLocalStorage('monthStationData')) {
      const monthStationData = await this.equipmentDataIntegrate(
        equipmentListObj,
        2
      );
      setLocalStorage('monthStationData', JSON.stringify(monthStationData)); // 本地储存电站每月发电数据
    }

    if (!getLocalStorage('yearStationData')) {
      const yearStationData = await this.equipmentDataIntegrate(
        equipmentListObj,
        3
      );
      setLocalStorage('yearStationData', JSON.stringify(yearStationData)); // 本地储存电站每年发电数据
    }

    if (!getLocalStorage('allStationData')) {
      const equipmentDataArr = await this.getAllEquipmentData(
        equipmentListObj,
        4
      );
      const allStationData = this.allEquipmentDataIntegrate(equipmentDataArr);
      setLocalStorage('allStationData', JSON.stringify(allStationData)); // 本地储存电站所有发电数据
    }
  }

  // 为每个添加设备的功率和日电量
  async addEquipmentPower(equipmentListObj, dateType) {
    let equipmentDataArr = []; // 设备数据
    let dayStationElectric = 0; // 电站今日发电量
    let currentStationPower = 0; // 当前电站功率
    let totalStationElectric = 0; // 电站累计发电量
    // 遍历每个设备，并添加功率和日电量
    for (let i = 0; i < Object.keys(equipmentListObj).length; ++i) {
      const name = Object.keys(equipmentListObj)[i];
      const info = equipmentListObj[name];
      const sourceData = info.source;
      const deviceNo = info.deviceNo;
      const sortData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      // 合并每天的设备数据为电站每天数据
      equipmentDataArr = equipmentDataArr.concat(sortData);
      const dayStationData = this.mergeEquipmentData(equipmentDataArr);
      setLocalStorage('dayStationData', JSON.stringify(dayStationData)); // 本地储存电站每天发电数据
      // 设备功率
      const currentPower =
        (sortData &&
          sortData[sortData.length - 1] &&
          sortData[sortData.length - 1].power.toFixed(2)) ||
        0;
      // 设备日电量
      let dayElectric = 0;
      sortData.forEach(item => {
        dayElectric += item.number;
      });
      // 电站日电量
      dayStationElectric += dayElectric;
      // 当前电站发电量
      const maxValue =
        (sortData[sortData.length - 1] &&
          sortData[sortData.length - 1].maxValue) ||
        0;
      equipmentListObj[name].currentPower = currentPower || 0; // 设备功率
      equipmentListObj[name].dayElectric = dayElectric.toFixed(2) || 0; // 设备日电量
      currentStationPower += Number(currentPower); // 当前电站功率
      totalStationElectric += Number(maxValue); // 当前电站发电量
    }
    setLocalStorage('dayStationElectric', dayStationElectric.toFixed(2)); // 本地储存当前电站今日发电量
    setLocalStorage('currentStationPower', currentStationPower); // 本地储存当前电站功率
    setLocalStorage('totalStationElectric', totalStationElectric); // 本地储存电站总发电量
    setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj)); // 本地储存所有设备状态
    this.setState({ equipmentListObj, loading: false });
  }

  // 合并多个设备的数据并排序,成为电站数据
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
        number: sum ? Number(sum.toFixed(2)) : 0
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

  // 整合月，年数据
  async equipmentDataIntegrate(equipmentListObj, type) {
    const equipmentDataArr = await this.getAllEquipmentData(
      equipmentListObj,
      type
    );
    const stationData = this.mergeEquipmentData(equipmentDataArr);
    return stationData;
  }

  // 整合电站所有的数据
  allEquipmentDataIntegrate = allEquipmentData => {
    allEquipmentData.map(item => {
      item.time = item && item.time.substring(0, 4);
      return item;
    });
    const dataIntegrate = this.mergeEquipmentData(allEquipmentData);
    return dataIntegrate;
  };

  // 请求所有设备数据
  async getAllEquipmentData(equipmentListObj, dateType) {
    let equipmentDataArr = [];
    let stationEnergy = 0;
    // 遍历每个设备，并累计总电量
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
      // 获取电站发电量
      const maxEnergy =
        decryptData.length > 0 &&
        Math.max.apply(Math, decryptData.map(item => item.maxValue));
      stationEnergy += maxEnergy;
      equipmentDataArr = equipmentDataArr.concat(decryptData);
    }
    switch (dateType) {
      case 2:
        setLocalStorage('monthTotalStationElectric', stationEnergy); // 本地储存电站总发电量--月
        break;
      case 3:
        setLocalStorage('yearTotalStationElectric', stationEnergy); // 本地储存电站总发电量--年
        break;
      case 4:
        setLocalStorage('allTotalStationElectric', stationEnergy); // 本地储存电站总发电量--所有
        break;
      default:
        break;
    }
    return equipmentDataArr;
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
        const decryptedItem = this.doDecrypt(receiveData[item]);
        powerInfo =
          decryptedItem &&
          JSON.parse(decryptedItem);
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
    const copySunIntegralCoordinatesArr = sunIntegralCoordinatesArr.concat();
    let count = copySunIntegralCoordinatesArr.length;
    for (let i = 0; i < group; i++) {
      const index = ~~(Math.random() * count) + i;
      sunCoordinateArr[i] = copySunIntegralCoordinatesArr[index];
      copySunIntegralCoordinatesArr[index] = copySunIntegralCoordinatesArr[i];
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
    const { keyPair } = this.props;
    if (keyPair.showHasKey(this.props)) {
      this.selectSunNode = e.target.parentNode;
      this.props.sunCityStore
        .fetchSCGetSunIntegral({
          tokenId: sunIntegralInfo.id,
          value: sunIntegralInfo.amount,
          publicKey: keyPair.publicKey
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
    }
  };
  render() {
    const userInfo = toJS(this.props.userStore.userInfo);
    const { avatar, nickName } = userInfo;
    const { balance, balanceRanking } = this.props.miningStore;
    const { equipmentListObj } = this.state;
    const lastNews = toJS(this.props.sunCityStore.lastNews);
    const equipmentNameList =
      (equipmentListObj && Object.keys(equipmentListObj)) || [];
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
        </div>
      </div>
    );
  }
}

export default withRouter(Comp);
