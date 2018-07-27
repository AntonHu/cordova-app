import { observable, action, runInAction } from 'mobx';
import {
  fetchNews,
  fetchSunIntegral,
  fetchGetSunIntegral,
  fetchLastTrend,
  fetchEquipmentList,
  fetchEquipmentPower,
  fetchInverters,
  fetchAddInverter,
  fetchGetWeather,
  fetchGetAddress,
  fetchGetElectricityPrice,
  fetchModifyElectricityPrice
} from './request';
import { deleteLocalStorage, getLocalStorage } from '../../utils/storage';

class SunCityStore {
  @observable
  lastNews = {
    title: '',
    content: ''
  };
  @observable lastTrend = [];
  @observable sunIntegral = [];
  @observable equipmentListObj = {};
  @observable equipmentPower = {};
  @observable inverterList = [];
  @observable weatherInfo = { type: '' };
  @observable addressInfo = [];
  @observable dayStationElectric = 0;
  @observable electricityPrice = 0;

  @action
  resetStore = () => {
    this.lastNews = {
      title: '',
      content: ''
    };
    this.lastTrend = [];
    this.sunIntegral = [];
    this.equipmentListObj = {};
    this.equipmentPower = {};
    this.inverterList = [];
    this.weatherInfo = { type: '' };
    this.addressInfo = [];
    this.dayStationElectric = 0;
  };

  deleteAllCache = () => {
    // 若是没有私钥，清空缓存
    deleteLocalStorage('stationExpireTime');
    deleteLocalStorage('equipmentListObj');
    deleteLocalStorage('currentStationPower');
    deleteLocalStorage('dayStationElectric');
    deleteLocalStorage('totalStationElectric');
    deleteLocalStorage('monthTotalStationElectric');
    deleteLocalStorage('yearTotalStationElectric');
    deleteLocalStorage('allTotalStationElectric');
  };

  onLogout = () => {
    this.deleteAllCache();
    this.resetStore();
  };

  /**
   * 从缓存取数据放到store
   */
  recoverDataFromCache = () => {
    this.recoverStationElectric();
  };

  recoverStationElectric = () => {
    let electric = getLocalStorage('dayStationElectric');
    electric = !!electric ? +electric : 0;
    this.updateDayStationElectric(electric);
  };

  @action
  updateDayStationElectric = electricity => {
    this.dayStationElectric = electricity;
  };

  // 获取最新公告
  @action
  fetchSCNews = async params => {
    let result = {};
    try {
      result = await fetchNews(params);
      runInAction(() => {
        if (result.code === 200) {
          this.lastNews = result.data && result.data[0];
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 太阳积分列表
  @action
  fetchSCSunIntegral = async params => {
    let result = {};
    try {
      result = await fetchSunIntegral(params);
      runInAction(() => {
        if (result.code === 200) {
          this.sunIntegral = result.data.filter(item => !item.pick);
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 收取太阳积分
  @action
  fetchSCGetSunIntegral = async params => {
    let result = {};
    try {
      result = await fetchGetSunIntegral(params);
      runInAction(() => {});
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取最新动态
  @action
  fetchSCLastTrend = async params => {
    let result = {};
    try {
      result = await fetchLastTrend(params);
      runInAction(() => {
        if (result.code === 200) {
          this.lastTrend = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备列表
  @action
  fetchSCEquipmentList = async params => {
    let result = {};
    try {
      result = await fetchEquipmentList(params);
      runInAction(() => {
        if (result.code === 200) {
          this.equipmentListObj = result.data || {};
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备发电量
  @action
  fetchSCEquipmentPower = async params => {
    let result = {};
    try {
      result = await fetchEquipmentPower(params);
      runInAction(() => {
        if (result.code === 200) {
          this.equipmentPower = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };
  // 请求所有逆变器类型
  @action
  fetchSCInverters = async params => {
    let result = {};
    try {
      result = await fetchInverters(params);
      runInAction(() => {
        if (result.code === 200) {
          this.inverterList = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 添加逆变器
  @action
  fetchSCAddInverter = async params => {
    let result = {};
    try {
      result = await fetchAddInverter(params);
      runInAction(() => {});
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取地址
  @action
  fetchSCGetAddress = async params => {
    let result = {};
    try {
      result = await fetchGetAddress(params);
      runInAction(() => {
        if (result.code === 200) {
          this.addressInfo = result.data.map(item => {
            item.label = item.cityName;
            item.value = item.cityName;
            return item;
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取天气信息
  @action
  fetchSCGetWeather = async params => {
    let result = {};
    try {
      result = await fetchGetWeather(params);
      runInAction(() => {
        if (result.code === 200) {
          this.weatherInfo = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取电价信息
  @action
  fetchSCGetElectricityPrice = async params => {
    let result = {};
    try {
      result = await fetchGetElectricityPrice(params);
      runInAction(() => {
        if (result.code === 200) {
          this.electricityPrice = result.data.fee || 0;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 电价修改
  @action
  fetchSCModifyElectricityPrice = async params => {
    let result = {};
    try {
      result = await fetchModifyElectricityPrice(params);
      runInAction(() => {});
    } catch (err) {
      console.log(err);
    }
    return result;
  };
}

const sunCityStore = new SunCityStore({});
export default sunCityStore;
