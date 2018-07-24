import { observable, action, runInAction } from 'mobx';
import {
  fetchNews,
  fetchSunIntegral,
  fetchGetSunIntegral,
  fetchLastTrend,
  fetchEquipmentList,
  fetchEquipmentInfo,
  fetchEquipmentPower,
  fetchInverters,
  fetchAddInverter,
  fetchGetWeather
} from './request';

class SunCityStore {
  @observable lastNews;
  @observable lastTrend;
  @observable sunIntegral;
  @observable powerstationData;
  @observable equipmentList;
  @observable equipmentInfo;
  @observable equipmentPower;
  @observable inverterList;
  @observable weatherInfo;

  @action
  resetStore = () => {

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
          this.equipmentList = result.data || {};
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备信息
  @action
  fetchSCEquipmentInfo = async params => {
    let result = {};
    try {
      result = await fetchEquipmentInfo(params);
      runInAction(() => {
        if (result.code === 200) {
          this.equipmentInfo = result.data;
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
}

const sunCityStore = new SunCityStore({});
export default sunCityStore;
