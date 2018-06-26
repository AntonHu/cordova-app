import {get, post} from '../../utils/fetch';
import {backendServer} from '../../utils/variable';

const defaultPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQFJmSxkkIOvFnyhTqxz5NeWI93tMkgT3CIUJ40ypifONF21QRB067c4gNOkfLnvwX2IqWNjBjvizD7KxxoHnGezLwJFAnJjmAmqLK2+QXeyz82xnsHczbl+GUIAy18my2+lcmnDMdgfcaksamnQUDB+tTDwnkV7fMvrC13nNcYQIDAQAB';

/**
 * 获取挖宝数据
 * @param params
 * @returns {Promise.<void>}
 */
export const getWalletData = async ({publicKey}) => {
  const response = await get(`${backendServer}/wallet/getWalletData`, {publicKey: defaultPublicKey});
  return response.success
};

/**
 * 收取token
 * @param params
 * @returns {Promise.<void>}
 */
export const gainTokens = async ({publicKey, tokenId, value}) => {
  const response = await get(`${backendServer}/wallet/gainTokens`, {publicKey: defaultPublicKey, tokenId, value});
  return response.success
};

/**
 * 获取挖宝总排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getWalletTopRank = async params => {
  const response = await get(`${backendServer}/wallet/getWalletTopRank`, params);
  return response.success
};

/**
 * 获取挖宝邻居排行榜
 * @param params
 * @returns {Promise.<void>}
 */
export const getNearbyWalletTopRank = async params => {
  const response = await get(`${backendServer}/wallet/getNearbyWalletTopRank`, params);
  return response.success
};

/**
 * 获取积分记录
 * @param params
 * @returns {Promise.<void>}
 */
export const getTokenRecords = async params => {
  const response = await get(`${backendServer}/wallet/getTokenRecords`, params);
  return response.success
};

