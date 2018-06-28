import { get, post } from '../../utils/fetch';
import { backendServer } from '../../utils/variable';

/**
 * 太阳积分列表
 */
export const fetchSunIntegral = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/wallet/getWalletData`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 收取太阳积分
 */
export const fetchGetSunIntegral = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/wallet/gainTokens`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取电站数据
 */
export const fetchPowerstationData = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/wallet/gainTokens`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取设备列表
 */
export const fetchEquipmentList = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/equipment/equipments`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取设备信息
 */
export const fetchEquipmentInfo = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/equipment/equipmentInfo`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取设备发电量
 */
export const fetchEquipmentPower = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/equipment/dailyGeneration`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};
