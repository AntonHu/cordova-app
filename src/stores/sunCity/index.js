import { observable, action, runInAction, computed } from 'mobx';
import { fetchSunIntegral } from './request';

class SunCityStore {
  @observable sunIntegral;

  // 获取发货列表数据
  @computed
  get getSunIntegral() {
    return this.sunIntegral;
  }

  // 订单列表
  @action
  fetchSCSunIntegral = async params => {
    let result;
    try {
      // result = await fetchSunIntegral(params);
      runInAction(() => {
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
}

const sunCityStore = new SunCityStore({});
export default sunCityStore;
