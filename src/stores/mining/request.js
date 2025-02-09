import { get, post, requestError } from '../../utils/fetch';
import { backendServer, PAGE_SIZE } from '../../utils/variable';

/**
 * 获取挖宝总排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getAllRanking = async params => {
  try {
    const response = await get(`${backendServer}/wallet/getAllRanking`, params);
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取挖宝邻居排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getNearbyWalletTopRank = async ({ publicKey }) => {
  try {
    const response = await get(
      `${backendServer}/wallet/getNearbyWalletTopRank`,
      { publicKey }
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取积分记录(获取太阳积分)
 * @param params
 * @returns {Promise.<void>}
 */
export const getTokenRecords = async ({ publicKey, page }) => {
  try {
    const response = await get(`${backendServer}/wallet/getTokenRecords`, {
      publicKey,
      page,
      pageSize: PAGE_SIZE
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 用户的"当前积分"
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const getTokenBalance = async ({ publicKey }) => {
  try {
    const response = await get(`${backendServer}/wallet/tokenBalance`, {
      publicKey
    });
    return response;
  } catch (err) {
    throw requestError(err, '查询当前积分');
  }
};

/**
 * "在路上"的积分
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const geUnconfirmedToken = async ({ publicKey }) => {
  try {
    const response = await get(`${backendServer}/wallet/geUnconfirmedToken`, {
      publicKey
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 用户的"当前排行"
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const getTokenBalanceRanking = async ({ publicKey }) => {
  try {
    const response = await get(`${backendServer}/wallet/tokenBalanceRanking`, {
      publicKey
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 挖宝数据-今日全民累计挖宝次数、累计全民挖宝次数
 * @returns {Promise.<void>}
 */
export const getDigTimes = async () => {
  try {
    const response = await get(`${backendServer}/wallet/digTimes`);
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 用户的"今日太阳积分"
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const getTodayIntegral = async ({ publicKey }) => {
  try {
    const response = await get(`${backendServer}/wallet/tokenTotalToday`, {
      publicKey
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
