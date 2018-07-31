import {observable, action, runInAction, computed} from 'mobx';
import {
  getTokenRecords,
  getAllRanking,
  getNearbyWalletTopRank,
  getTokenBalance,
  getTokenBalanceRanking,
  getDigTimes,
  getTodayIntegral,
  geUnconfirmedToken
} from './request';

class MiningStore {
  @observable tokenRecords = [];
  @observable allRanking = [];
  @observable nearbyRank = [];
  @observable balance = 0;
  @observable unconfirmedToken = 0;
  @observable balanceRanking = 0;
  @observable
  digTimes = {
    countAllTimes: 0,
    countAllTimesToday: 0
  };
  @observable todayIntegral = 0; // 今日太阳积分

  @action
  resetStore = () => {
    this.tokenRecords = [];
    this.allRanking = [];
    this.nearbyRank = [];
    this.balance = 0;
    this.unconfirmedToken = 0;
    this.balanceRanking = 0;
    this.digTimes = {
      countAllTimes: 0,
      countAllTimesToday: 0
    };
    this.todayIntegral = 0; // 今日太阳积分
  };

  onLogout = () => {
    this.resetStore();
  };

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
          if (page === 0) {
            this.tokenRecords = res.data.data;
          } else {
            this.tokenRecords = this.tokenRecords.concat(res.data.data);
          }
        });
        return res.data.data
      }
      return [];
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
  fetchNearbyRanking = async ({publicKey}) => {
    try {
      const res = await getNearbyWalletTopRank({publicKey});
      if (res.data.code === 200) {
        runInAction(() => {
          this.nearbyRank = res.data.data;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 获取"当前积分"
   * @returns {Promise.<void>}
   */
  @action
  fetchBalance = async ({publicKey}) => {
    try {
      const res = await getTokenBalance({publicKey});
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          const data = res.data.data || {};
          this.balance = data.amount || 0;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  @action
  updateBalance = newBalance => {
    this.balance = newBalance
  };

  @action
  fetchUnconfirmedToken = async ({publicKey}) => {
    try {
      const res = await geUnconfirmedToken({publicKey});
      if (res.data && res.data.code === 200) {
        const data = res.data.data || {};
        runInAction(() => {
          this.unconfirmedToken = data.total || 0;
        });
      }
    } catch (err) {
      console.log(err)
    }
  };

  /**
   * 获取"当前积分排行"
   * @returns {Promise.<void>}
   */
  @action
  fetchBalanceRanking = async ({publicKey}) => {
    try {
      const res = await getTokenBalanceRanking({publicKey});
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          const data = res.data.data || {};
          this.balanceRanking = data.Ranking || 0;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 获取"挖宝数据"
   * @returns {Promise.<void>}
   */
  @action
  fetchDigTimes = async () => {
    try {
      const res = await getDigTimes();
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          const data = res.data.data || {};
          if (data.countAllTimes) {
            this.digTimes.countAllTimes = data.countAllTimes;
          }
          if (data.countAllTimesToday) {
            this.digTimes.countAllTimesToday = data.countAllTimesToday;
          }
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 获取"今日太阳积分"
   * @returns {Promise.<void>}
   */
  @action
  fetchTodayIntegral = async ({publicKey}) => {
    try {
      const res = await getTodayIntegral({publicKey});
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          const data = res.data.data || {};
          this.todayIntegral = data.totalSolar || 0;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };
}

const miningStore = new MiningStore();
export default miningStore;
