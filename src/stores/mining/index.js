import { observable, action, runInAction, computed } from 'mobx';
import { getTokenRecords, getAllRanking, getNearbyWalletTopRank } from './request';

class MiningStore {
  @observable tokenRecords = [];
  @observable allRanking = [];
  @observable nearbyRank = [];

  /**
   * 太阳积分
   * @param publicKey
   * @param page
   * @returns {Promise.<void>}
   */
  @action
  fetchTokenRecords = async ({publicKey, page}) => {
    try {
      const res = await getTokenRecords({publicKey, page});
      if (res.status === 200) {
        runInAction(() => {
          this.tokenRecords = res.data.data;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 全民排行榜
   * @returns {Promise.<void>}
   */
  @action
  fetchAllRanking = async () => {
    try {
      const res = await getAllRanking({});
      if (res.status === 200) {
        runInAction(() => {
          this.allRanking = res.data.data;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 获取邻居榜
   * @returns {Promise.<void>}
   */
  @action
  fetchNearbyRanking = async () => {
    try {
      const res = await getNearbyWalletTopRank({});
      if (res.data.code === 200) {
        runInAction(() => {
          this.nearbyRank = res.data.data;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  }


}

const miningStore = new MiningStore();
export default miningStore;
