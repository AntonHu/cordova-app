import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Title, Picture, ToastNoMask, EquipmentItem } from '../../components';
import { NoticeBar, Icon, ActivityIndicator, Carousel } from 'antd-mobile';
import { EQUIPMENT_DATA_TYPE } from '../../utils/variable';
import PullToRefresh from 'pulltorefreshjs';
import { setLocalStorage, getLocalStorage } from '../../utils/storage';
import {
  decrypt,
  sliceLongString,
  handleAbnormalData,
  isExpire
} from '../../utils/methods';
import './style.less';

/**
 * 太阳城-首页
 */
const sunDistanceX = 50; // 小太阳x轴之间的距离
const sunDistanceY = 70; // 小太阳y轴之间的距离
const initialCoordinates = { left: 15, top: 20 };
const toCollectNumber = 1; // 待收取小太阳的数量
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
class SunCity extends React.Component {
  state = {
    equipmentListObj: JSON.parse(getLocalStorage('equipmentListObj')) || {},
    loading: true,
    refreshing: false,
    sunCoordinateArr: [],
    power: 0, // 功率
    dayPower: 0, // 日发电量
    sumPower: 0 // 总发电量
  };
  sunIntegralArr = [];
  selectSunNode = null;
  timeoutID = null;
  sunArea = null; // 大图形

  async componentDidMount() {
    const { keyPair, userStore, history } = this.props;
    this.initPullToRefresh();
    // 获取最新公告,条件固定
    this.props.sunCityStore.fetchSCNews({
      page: 0,
      pageSize: 10
    });

    // 获取用户信息
    this.props.userStore.fetchUserInfo({ keyPair, userStore, history });
    // 用户邀请码
    this.props.userStore.fetchInvitationCode();

    // 如果有私钥
    if (keyPair.hasKey) {
      // 获取我的太阳积分
      this.props.miningStore.fetchBalance({ publicKey: keyPair.publicKey });
      // 获取"在路上"的积分
      this.props.miningStore.fetchUnconfirmedToken({
        publicKey: keyPair.publicKey
      });
      // 获取最新动态
      this.props.sunCityStore.fetchSCLastTrend({
        num: 5
      });
      // 获取排行
      this.props.miningStore.fetchBalanceRanking({
        publicKey: keyPair.publicKey
      });
      // 获取电价
      this.props.sunCityStore.fetchSCGetElectricityPrice({
        userPubKey: keyPair.publicKey
      });
      // 获取太阳积分
      this.getSunFromRemote();
      // 获取身份认证情况
      this.props.userStore.checkIsKycInChain({publicKey: keyPair.publicKey});

      // 判断数据是否过期，储存设备列表整理后的数据
      if (isExpire(1, 'stationExpireTime')) {
        const equipmentListObj = await this.getEquipmentList(keyPair);
        setLocalStorage(
          'equipmentListObj',
          JSON.stringify(equipmentListObj || {})
        ); // 本地储存所有设备列表
        this.setState({ equipmentListObj, loading: false });
        // 获取设备，月，年，所有的数据，并缓存
        this.cacheEquipmentData(equipmentListObj);
      } else {
        this.props.sunCityStore.recoverDataFromCache();
        this.setState({ loading: false });
      }
    } else {
      this.props.sunCityStore.deleteAllCache();
      this.setState({
        loading: false
      });
    }
  }

  /**
   * 从服务器获取积分列表，并且同步到state
   * @returns {Promise.<void>}
   */
  getSunFromRemote = async () => {
    const { keyPair, userStore, history } = this.props;
    // 获取积分列表
    const res = await this.props.sunCityStore.fetchSCSunIntegral({
      publicKey: keyPair.publicKey
    });
    // 分割积分数组
    this.sunIntegralArr = [];
    let sunIntegral = toJS(this.props.sunCityStore.sunIntegral);
    /*
    * 出现一个太阳的时候 显示 出一个太阳，然后两个挖宝中，  
    * 出现2个太阳，一个挖宝中， 出现太阳超过3个的时候，就不出现挖宝中
    * 用空数组填充待收取
    */
    if (sunIntegral.length < toCollectNumber) {
      const emptyArr = Array(toCollectNumber - sunIntegral.length);
      sunIntegral = sunIntegral.concat(emptyArr);
    }
    this.spliceArr(sunIntegral, this.sunIntegralArr);
    // 获取坐标数组
    this.setState({
      sunCoordinateArr: this.getSunCoordinateArr(this.sunIntegralArr[0])
    });
    return res;
  };

  pullToRefresh = async () => {
    const { keyPair, userStore, history } = this.props;
    this.props.sunCityStore.deleteAllCache();
    const promiseArray = [];
    // 获取最新公告,条件固定
    const res1 = this.props.sunCityStore.fetchSCNews({
      page: 0,
      pageSize: 10
    });

    // 获取用户信息
    const res2 = this.props.userStore.fetchUserInfo({
      keyPair,
      userStore,
      history
    });
    promiseArray.push(res1, res2);

    // 如果有私钥
    if (keyPair.hasKey) {
      // 获取电价
      this.props.sunCityStore.fetchSCGetElectricityPrice({
        userPubKey: keyPair.publicKey
      });
      // 获取我的太阳积分
      const res4 = this.props.miningStore.fetchBalance({
        publicKey: keyPair.publicKey
      });

      // 获取排行
      const res5 = this.props.miningStore.fetchBalanceRanking({
        publicKey: keyPair.publicKey
      });
      // 获取积分列表
      const res6 = await this.getSunFromRemote();
      // 获取最新动态
      const res7 = this.props.sunCityStore.fetchSCLastTrend({
        num: 5
      });
      // 获取"在路上"的积分
      const res8 = this.props.miningStore.fetchUnconfirmedToken({
        publicKey: keyPair.publicKey
      });

      // 储存设备列表整理后的数据
      const equipmentListObj = await this.getEquipmentList(keyPair);
      setLocalStorage(
        'equipmentListObj',
        JSON.stringify(equipmentListObj || {})
      ); // 本地储存所有设备列表
      this.setState({ equipmentListObj, loading: false });
      // 获取设备，月，年，所有的数据，并缓存
      this.cacheEquipmentData(equipmentListObj);
      promiseArray.push(res4, res5, res6, res7, res8, equipmentListObj);
    }
    return Promise.all(promiseArray);
  };

  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = () => {
    PullToRefresh.init({
      mainElement: '#page-sunCity-info', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-sunCity-info', // "下拉刷新"把哪个部分包住
      onRefresh: this.pullToRefresh, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        const ele = document.getElementById('page-sunCity-info');
        if (ele === null) {
          return false;
        }
        // return ele.parentNode.parentNode.scrollTop === 0;
        return ele.scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };

  // 获取设备列表并处理列表数据
  async getEquipmentList(keyPair) {
    let equipmentListObj = {};
    // 获取设备列表
    await this.props.sunCityStore.fetchSCEquipmentList({
      userPubKey: keyPair.publicKey
    });
    equipmentListObj = toJS(this.props.sunCityStore.equipmentListObj);
    // 添加各个设备的功率和日电量
    equipmentListObj =
      equipmentListObj &&
      (await this.addEquipmentPower(equipmentListObj, EQUIPMENT_DATA_TYPE.DAY));
    return equipmentListObj;
  }

  // 获取设备，（月，年，所有）的数据，并缓存
  async cacheEquipmentData(equipmentListObj) {
    // 储存电站数据,EQUIPMENT_DATA_TYPE.MONTH-月，EQUIPMENT_DATA_TYPE.YEAR-年，EQUIPMENT_DATA_TYPE.ALL-全部
    if (isExpire(1, 'stationExpireTime') && equipmentListObj) {
      // 请求电站每月发电数据，本地储存
      const monthStationData = await this.equipmentDataIntegrate(
        equipmentListObj,
        EQUIPMENT_DATA_TYPE.MONTH
      );
      setLocalStorage('monthStationData', JSON.stringify(monthStationData));

      // 请求电站每年发电数据，本地储存
      const yearStationData = await this.equipmentDataIntegrate(
        equipmentListObj,
        EQUIPMENT_DATA_TYPE.YEAR
      );
      setLocalStorage('yearStationData', JSON.stringify(yearStationData));

      // 请求电站所有发电数据，本地储存
      const equipmentDataArr = await this.getAllEquipmentData(
        equipmentListObj,
        EQUIPMENT_DATA_TYPE.ALL
      );
      const allStationData = this.allEquipmentDataIntegrate(equipmentDataArr);
      setLocalStorage('allStationData', JSON.stringify(allStationData));
      setLocalStorage('stationExpireTime', new Date().getTime()); // 本地储存电站数据过期时间
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
      const decryptData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      // 合并每天的设备数据为电站每天数据
      equipmentDataArr = equipmentDataArr.concat(decryptData);
      // 设备当前功率
      let currentPower = 0;
      // 设备日电量
      let dayElectric = 0;
      // 当前电站发电量
      let maxValue = 0;
      if (decryptData.length > 0 && decryptData[decryptData.length - 1]) {
        const equipmentData = decryptData[decryptData.length - 1];
        currentPower =
          (equipmentData.totalPower && equipmentData.totalPower.toFixed(2)) ||
          '0.00';
        dayElectric =
          (equipmentData.todayEnergy && equipmentData.todayEnergy.toFixed(2)) ||
          '0.00';
        maxValue =
          (equipmentData.totalEnergy && equipmentData.totalEnergy.toFixed(2)) ||
          '0.00';
      }
      // 电站日电量
      dayStationElectric += +dayElectric;
      equipmentListObj[name].currentPower = currentPower || 0; // 设备功率
      equipmentListObj[name].dayElectric = dayElectric || 0; // 设备日电量
      currentStationPower += Number(currentPower); // 当前电站功率
      totalStationElectric += Number(maxValue); // 当前电站发电量
    }
    const dayStationData = this.mergeEquipmentData(equipmentDataArr);
    setLocalStorage('dayStationData', JSON.stringify(dayStationData)); // 本地储存电站每天发电数据
    this.props.sunCityStore.updateDayStationElectric(dayStationElectric);
    setLocalStorage(
      'dayStationElectric',
      dayStationElectric && dayStationElectric.toFixed(2)
    ); // 本地储存当前电站今日发电量
    setLocalStorage(
      'currentStationPower',
      currentStationPower && currentStationPower.toFixed(2)
    ); // 本地储存当前电站功率
    setLocalStorage(
      'totalStationElectric',
      totalStationElectric && totalStationElectric.toFixed(2)
    ); // 本地储存电站总发电量
    return equipmentListObj;
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
        setLocalStorage(
          'monthTotalStationElectric',
          stationEnergy && stationEnergy.toFixed(2)
        ); // 本地储存电站总发电量--月
        break;
      case 3:
        setLocalStorage(
          'yearTotalStationElectric',
          stationEnergy && stationEnergy.toFixed(2)
        ); // 本地储存电站总发电量--年
        break;
      case 4:
        setLocalStorage(
          'allTotalStationElectric',
          stationEnergy && stationEnergy.toFixed(2)
        ); // 本地储存电站总发电量--所有
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
    // 日数据不用解密
    if (dateType === EQUIPMENT_DATA_TYPE.DAY) {
      return receiveData || [];
    }
    const decryptData = await this.handleDecryptData(receiveData, dateType);
    return decryptData;
  }

  // 处理获取的解密数据,并排序
  handleDecryptData = async (receiveData, dateType) => {
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
          const value = +(powerInfo.maxEnergy - powerInfo.minEnergy).toFixed(2);
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

  componentWillUnmount() {
    console.log('Suncity will unmount');
    this.timeoutID = null;
    // 清除监听事件，重要。
    PullToRefresh.destroyAll();
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
    const { keyPair, miningStore } = this.props;
    if (keyPair.showHasKey(this.props)) {
      this.selectSunNode = e.target.parentNode;
      // 避免重复点击
      if (this.selectSunNode._clicked) {
        return;
      } else {
        this.selectSunNode._clicked = true;
      }
      this.props.sunCityStore
        .fetchSCGetSunIntegral({
          tokenId: sunIntegralInfo.id,
          value: sunIntegralInfo.amount,
          publicKey: keyPair.publicKey
        })
        .then(result => {
          if (result.code === 200) {
            miningStore.updateUnconfirmedToken(
              sunIntegralInfo.amount + miningStore.unconfirmedToken
            );
            pickNumber += 1;
            this.selectSunNode.classList.add('remove');
            // 如果pickNumber与目前太阳总数相等
            const sunCoordinateArrLen = this.state.sunCoordinateArr.filter(
              item => item.info
            ).length;
            if (pickNumber === sunCoordinateArrLen) {
              pickNumber = 0;
              setTimeout(() => {
                this.setState({
                  sunCoordinateArr: []
                });
                this.getSunFromRemote();
              }, 2000);
            }
          } else {
            ToastNoMask(`收取失败。${result.msg || ''}`);
          }
        });
    }
  };

  sliceLongName = (name, lengthLimit = 10) => {
    const shortName = sliceLongString(name, lengthLimit);
    if (name === shortName) {
      return shortName;
    }
    return shortName + '...';
  };

  render() {
    const userInfo = toJS(this.props.userStore.userInfo);
    const { avatar, nickName } = userInfo;
    const {
      balance,
      balanceRanking,
      unconfirmedToken
    } = this.props.miningStore;
    const { equipmentListObj } = this.state;
    const { lastNews, lastTrend } = this.props.sunCityStore;
    const equipmentNameList = equipmentListObj && Object.keys(equipmentListObj);
    return (
      <div className={'page-sunCity-info'} id="page-sunCity-info">
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          <span className="h4">{`${lastNews.title}:${lastNews.content}`}</span>
        </NoticeBar>
        <div className="sun-content">
          <div className="info">
            <div className="detail">
              <div className="detail-row">
                <Picture src={avatar} size={60} showBorder={true}/>
                <div className="ranking">
                  <span>当前排行：</span>
                  {balanceRanking}
                </div>
              </div>
              <div className="detail-row">
                <div className="token">
                  <span>太阳积分：</span>
                  {balance.toFixed(2)}
                </div>
                {unconfirmedToken > 0 ? (
                  <div>
                    <span>在路上：</span>
                    {unconfirmedToken.toFixed(2)}
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className="powerStation"
              onClick={() => this.props.history.push('/sunCity/allPowerStation')}
            >
              <img className="ufo-png" src={require('../../images/ufo.png')} />
              电站
            </div>
          </div>
          <div className="sun-items" ref={el => (this.sunArea = el)}>
            {this.sunIntegralArr.length > 0 &&
              this.state.sunCoordinateArr.map((item, index) => {
                return (
                  <div
                    className={`sun ${!item.info && 'sun-wait'}`}
                    key={index}
                    style={{
                      left: `${item.left}px`,
                      top: `${item.top}px`
                    }}
                    onClick={e =>
                      item.info && this.selectSunIntegral(e, item.info)
                    }
                  >
                    <span className={`sun-pic ${!item.info && 'wait-pic'}`} />
                    <span className="sun-number">
                      {(item.info && item.info.amount) || '挖宝中...'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="rend">
          <span className="rend-title">最新动态</span>
          <div className="rend-item-wrap">
            {lastTrend.length > 0 ? (
              <Carousel
                className="rend-item"
                vertical
                dots={false}
                dragging={false}
                swiping={false}
                autoplay
                infinite
                autoplayInterval={3000}
              >
                {toJS(lastTrend).map((item, index) => (
                  <div key={index} className="help-text">
                    {`${this.sliceLongName(item.nickName, 3)}收取了${
                      item.value
                    }个太阳积分`}
                  </div>
                ))}
              </Carousel>
            ) : <div className="help-text">
              暂无最新动态
            </div>
            }
          </div>
        </div>
        <div className="promote">
          <Carousel
            autoplay
            infinite
            autoplayInterval={5000}
          >
            <Link to="/user/introduction">
              <img src={require('../../images/banner_1.png')} width="100%" />
            </Link>
            <Link to="/user/msgCenter">
              <img src={require('../../images/carousel_2.png')} width="100%" />
            </Link>
            <Link to="/user/inviteFriends">
              <img src={require('../../images/carousel_3.png')} width="100%" />
            </Link>

          </Carousel>

        </div>
        <div className="equipment">
          <Title title="设备" />
          {equipmentNameList && equipmentNameList.length > 0 ? (
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
                  currentPower={equipmentListObj[equipment].currentPower}
                  dayElectric={equipmentListObj[equipment].dayElectric}
                  equipmentName={equipment}
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
                    src={require('../../images/no_inverter.png')}
                    height={239}
                    width={303}
                  />
                  <span>还未添加逆变器，快去添加~</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(SunCity);
