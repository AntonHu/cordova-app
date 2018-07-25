import { get, post } from '../../utils/fetch';
import { backendServer } from '../../utils/variable';

/**
 * 获取最新公告
 */
export const fetchNews = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/info/latestNews`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

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
 * 获取最新动态
 */
export const fetchLastTrend = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/wallet/getRecentData`, params);
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

/**
 * 请求所有逆变器类型
 */
export const fetchInverters = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/equipment/sourceType`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 添加逆变器
 */
export const fetchAddInverter = async params => {
  let response = {};
  try {
    response = await post(`${backendServer}/equipment/inverterBarCode`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 奥泰 添加逆变器
 * 是输入账号和密码
 */
export const fetchAddInverterAT = async params => {
  let response = {};
  try {
    response = await post(`${backendServer}/equipment/inverterAT`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取天气信息
 */
export const fetchGetWeather = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/info/WeatherbyCityName`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};

/**
 * 获取电价信息
 */
export const fetchGetElectricityPrice = async params => {
  let response = {};
  try {
    response = await get(`${backendServer}/user/getDetailInfo`, params);
  } catch (err) {
    console.log(err);
  }
  return response.data || [];
};
