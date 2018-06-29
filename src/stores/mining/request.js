import {get, post} from '../../utils/fetch';
import {backendServer, PAGE_SIZE, testPublicKey} from '../../utils/variable';



/**
 * 获取挖宝数据
 * @param params
 * @returns {Promise.<void>}
 */
export const getWalletData = async ({publicKey}) => {
  const response = await get(`${backendServer}/wallet/getWalletData`, {publicKey: testPublicKey});
  return response.success
};

/**
 * 收取token
 * @param params
 * @returns {Promise.<void>}
 */
export const gainTokens = async ({publicKey, tokenId, value}) => {
  const response = await get(`${backendServer}/wallet/gainTokens`, {publicKey: testPublicKey, tokenId, value});
  return response.success
};

/**
 * 获取挖宝总排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getAllRanking = async params => {
  const response = await get(`${backendServer}/wallet/getAllRanking`, params);
  return response
};

/**
 * 获取挖宝邻居排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getNearbyWalletTopRank = async params => {
  const response = await get(`${backendServer}/wallet/getNearbyWalletTopRank`, params);
  return response
};

/**
 * 获取积分记录(获取太阳积分)
 * @param params
 * @returns {Promise.<void>}
 */
export const getTokenRecords = async ({publicKey, page}) => {
  const response = await get(`${backendServer}/wallet/getTokenRecords`, {publicKey: testPublicKey, page, pageSize: PAGE_SIZE});
  return response
};

