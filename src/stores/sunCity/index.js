import { observable, action, runInAction } from 'mobx';
import {
  fetchNews,
  fetchSunIntegral,
  fetchGetSunIntegral,
  fetchPowerstationData,
  fetchEquipmentList,
  fetchEquipmentInfo,
  fetchEquipmentPower
} from './request';

class SunCityStore {
  @observable lastNews;
  @observable sunIntegral;
  @observable powerstationData;
  @observable equipmentList;
  @observable equipmentInfo;
  @observable equipmentPower;

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
          this.sunIntegral = JSON.parse(result.data).filter(item => !item.pick);
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

  // 获取电站数据
  @action
  fetchSCPowerstationData = async params => {
    let result = {};
    try {
      // result = await fetchPowerstationData(params);
      runInAction(() => {
        // if (result.responseCode === 200) {
        //   this.powerstationData = order.total;
        // }
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
          this.equipmentList = result.data;
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
}

const sunCityStore = new SunCityStore({});
export default sunCityStore;
