import { get, post } from '../../utils/fetch';
import { backendServer } from '../../utils/variable';

/**
 * 太阳积分列表
 */
export const fetchSunIntegral = async params => {
  const response = await get(
    `http://47.96.158.229:30135/wallet/getWalletData?publicKey=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQFJmSxkkIOvFnyhTqxz5NeWI93tMkgT3CIUJ40ypifONF21QRB067c4gNOkfLnvwX2IqWNjBjvizD7KxxoHnGezLwJFAnJjmAmqLK2+QXeyz82xnsHczbl+GUIAy18my2+lcmnDMdgfcaksamnQUDB+tTDwnkV7fMvrC13nNcYQIDAQAB`,
    params
  );
  return response.data || [];
};

/**
 * 收取太阳积分
 */
export const fetchGetSunIntegral = async params => {
  const response = await get(`${backendServer}/wallet/gainTokens`, params);
  return response.data || [];
};

/**
 * 获取电站数据
 */
export const fetchPowerstationData = async params => {
  const response = await get(`${backendServer}/wallet/gainTokens`, params);
  return response.data || [];
};

/**
 * 获取设备数据
 */
export const fetchEquipmentData = async params => {
  const response = await get(`${backendServer}/wallet/gainTokens`, params);
  return response.data || [];
};
