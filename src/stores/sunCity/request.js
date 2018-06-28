import { get, post } from '../../utils/fetch';
import { backendServer } from '../../utils/variable';

/**
 * 太阳积分列表
 */
export const fetchSunIntegral = async params => {
  const response = await get(`${backendServer}/wallet/getWalletData`, params);
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
 * 获取设备列表
 */
export const fetchEquipmentList = async params => {
  const response = await get(`${backendServer}/equipment/equipments`, params);
  return response.data || [];
};

/**
 * 获取设备信息
 */
export const fetchEquipmentInfo = async params => {
  const response = await get(
    `${backendServer}/equipment/equipmentInfo`,
    params
  );
  return response.data || [];
};

/**
 * 获取设备发电量
 */
export const fetchEquipmentPower = async params => {
  const response = await get(
    `${backendServer}/equipment/dailyGeneration`,
    params
  );
  return response.data || [];
};
