import { observable, action, runInAction, computed } from 'mobx';
import { fetchOrderList } from './request';

class SunCityStore {
  @observable orderList;

  // 获取发货列表数据
  @computed
  get getOrderList() {
    return this.orderList;
  }

  // 订单列表
  @action
  fetchOSOrderList = async params => {
    let result;
    try {
      result = await fetchOrderList(params);
      runInAction(() => {
        if (result.responseCode === 200) {
          const order = JSON.parse(result.responseJson);
          this.orderNums = order.total;
          // 按时间排序处理数组
          this.orderList = order.list.sort(
            (a, b) => Number(b.date) - Number(a.date)
          );
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
