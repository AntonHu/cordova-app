import {get, post} from '../../utils/fetch';
import {backendServer, PAGE_SIZE, TEST_PUBLIC_KEY} from '../../utils/variable';


/**
 * 获取挖宝总排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getAllRanking = async params => {
  try {
    const response = await get(`${backendServer}/wallet/getAllRanking`, params);
    return response
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取挖宝邻居排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getNearbyWalletTopRank = async ({publicKey}) => {
  try {
    const response = await get(`${backendServer}/wallet/getNearbyWalletTopRank`, {publicKey: TEST_PUBLIC_KEY});
    return response
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取积分记录(获取太阳积分)
 * @param params
 * @returns {Promise.<void>}
 */
export const getTokenRecords = async ({publicKey, page}) => {
  try {
    const response = await get(`${backendServer}/wallet/getTokenRecords`, {publicKey: TEST_PUBLIC_KEY, page, pageSize: PAGE_SIZE});
    return response
  } catch (err) {
    return err.response;
  }
};

/**
 * 用户的"当前排行"
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const getTokenBalanceRanking = async ({publicKey}) => {
  try {
    const response = await get(`${backendServer}/wallet/tokenBalanceRanking`, {publicKey: testPublicKey});
    return response
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
    return response
  } catch (err) {
    return err.response;
  }
};

