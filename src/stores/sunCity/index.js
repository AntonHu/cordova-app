import { observable, action, runInAction, computed } from 'mobx';
import {
  fetchSunIntegral,
  fetchGetSunIntegral,
  fetchPowerstationData,
  fetchEquipmentList,
  fetchEquipmentInfo,
  fetchEquipmentPower
} from './request';

class SunCityStore {
  @observable sunIntegral;
  @observable powerstationData;
  @observable equipmentList;
  @observable equipmentInfo;
  @observable equipmentPower;

  // 太阳积分列表
  @computed
  get getSunIntegral() {
    return this.sunIntegral;
  }

  // 太阳积分列表
  @action
  fetchSCSunIntegral = async params => {
    let result;
    try {
      // result = await fetchSunIntegral(params);
      runInAction(() => {
        // 测试数据
        this.sunIntegral = [
          1.032,
          2.323,
          3.323,
          4.2334,
          5.2336,
          6.2334,
          7.3234
        ];
        // if (result.responseCode === 200) {
        //   const order = JSON.parse(result.responseJson);
        //   this.orderNums = order.total;
        //   // 按时间排序处理数组
        //   this.orderList = order.list.sort(
        //     (a, b) => Number(b.date) - Number(a.date)
        //   );
        // }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 收取太阳积分
  @action
  fetchSCGetSunIntegral = async params => {
    let result;
    try {
      result = await fetchGetSunIntegral(params);
      runInAction(() => {});
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取电站数据
  @computed
  get getPowerstationData() {
    return this.powerstationData;
  }

  // 获取电站数据
  @action
  fetchSCPowerstationData = async params => {
    let result;
    try {
      // result = await fetchPowerstationData(params);
      runInAction(() => {
        // if (result.responseCode === 200) {
        //   const order = JSON.parse(result.responseJson);
        //   this.orderNums = order.total;
        //   // 按时间排序处理数组
        //   this.orderList = order.list.sort(
        //     (a, b) => Number(b.date) - Number(a.date)
        //   );
        // }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备列表
  @computed
  get getEquipmentList() {
    return this.equipmentList;
  }

  // 获取设备列表
  @action
  fetchSCEquipmentList = async params => {
    let result;
    try {
      // result = await fetchEquipmentList(params);
      runInAction(() => {
        // if (result.responseCode === 200) {
        //   const order = JSON.parse(result.responseJson);
        //   this.orderNums = order.total;
        //   // 按时间排序处理数组
        //   this.orderList = order.list.sort(
        //     (a, b) => Number(b.date) - Number(a.date)
        //   );
        // }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备信息
  @computed
  get getEquipmentInfo() {
    return this.equipmentInfo;
  }

  // 获取设备信息
  @action
  fetchSCEquipmentInfo = async params => {
    let result;
    try {
      // result = await fetchEquipmentInfo(params);
      runInAction(() => {
        // if (result.responseCode === 200) {
        //   const order = JSON.parse(result.responseJson);
        //   this.orderNums = order.total;
        //   // 按时间排序处理数组
        //   this.orderList = order.list.sort(
        //     (a, b) => Number(b.date) - Number(a.date)
        //   );
        // }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  // 获取设备发电量
  @computed
  get getEquipmentPower() {
    return this.equipmentPower;
  }

  // 获取设备发电量
  @action
  fetchSCEquipmentPower = async params => {
    let result;
    try {
      // result = await fetchEquipmentPower(params);
      runInAction(() => {
        // if (result.responseCode === 200) {
        //   const order = JSON.parse(result.responseJson);
        //   this.orderNums = order.total;
        //   // 按时间排序处理数组
        //   this.orderList = order.list.sort(
        //     (a, b) => Number(b.date) - Number(a.date)
        //   );
        // }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };
}

const sunCityStore = new SunCityStore({});
export default sunCityStore;
