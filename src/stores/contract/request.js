import { get, post, requestError } from '../../utils/fetch';
import { contractServer, PAGE_SIZE } from '../../utils/variable';

const serverUrl = contractServer + '/app';

export const fetchProjectList = async ({ page }) => {
  try {
    const response = await get(`${serverUrl}/project/list`, { page, pageSize: PAGE_SIZE });
    return response.data;
  } catch (err) {
    throw requestError(err, '合约项目列表');
  }
};

export const fetchProjectDetail = async ({ id }) => {
  try {
    const response = await get(`${serverUrl}/project/detail`, { id });
    return response.data;
  } catch (err) {
    throw requestError(err, '合约详情');
  }
};

//todo: 获取用户当前项目的份额确认书  还没好
export const fetchShareConfirmDoc = async ({ type, projectId, purchaseNumber }) => {
  try {
    const response = await get(`${serverUrl}/app/project/legalFile`, { type, projectId, purchaseNumber });
    return response.data;
  } catch (err) {
    throw requestError(err, '份额确认书');
  }
};

//todo: 获取用户当前项目的投资协议  还没好
export const fetchInvestAgreement = async ({ type, projectId, purchaseNumber }) => {
  try {
    const response = await get(`${serverUrl}/app/project/legalFile`, { type, projectId, purchaseNumber });
    return response.data;
  } catch (err) {
    throw requestError(err, '投资协议');
  }
};

/**
 * 申购项目
 * @param projectId
 * @param purchaseNumber 申购份额
 * @returns {Promise<*>}
 */
export const fetchPurchaseProject = async ({ projectId, purchaseNumber }) => {
  try {
    const response = await post(`${serverUrl}/project/purchase`, { projectId, purchaseNumber });
    return response.data;
  } catch (err) {
    throw requestError(err, '申购项目');
  }
};

/**
 * 取消申购
 * @param projectId
 * @param purchaseId
 * @returns {Promise<*>}
 */
export const fetchCancelPurchase = async ({ projectId, purchaseId }) => {
  try {
    const response = await post(`${serverUrl}/project/cancel`, { projectId, purchaseId });
    return response.data;
  } catch (err) {
    throw requestError(err, '取消申购');
  }
};

/**
 * 确认付款
 * @param projectId
 * @param purchaseId
 * @returns {Promise<*>}
 */
export const fetchConfirmPayment = async ({ projectId, purchaseId }) => {
  try {
    const response = await post(`${serverUrl}/project/confirmPayment`, { projectId, purchaseId });
    return response.data;
  } catch (err) {
    throw requestError(err, '确认付款');
  }
};

/**
 * 提交申诉
 * @param projectId
 * @param purchaseId
 * @param content 申诉内容
 * @param fileList 上传的文件
 * @returns {Promise<*>}
 */
export const fetchUploadAppeal = async ({ projectId, purchaseId, content, fileList }) => {
  try {
    const response = await post(`${serverUrl}/project/appeal`, { projectId, purchaseId, content, fileList });
    return response.data;
  } catch (err) {
    throw requestError(err, '申诉');
  }
};

/**
 * 历史项目列表
 * @param enterpriseId
 * @param onlyBaseInfo true 显示基本信息 用于列表app历史项目
 * @param currentProjectId
 * @returns {Promise<*>}
 */
export const fetchHistoryProjectList = async ({ enterpriseId, onlyBaseInfo, currentProjectId }) => {
  try {
    const response = await get(`${serverUrl}/project/listAll`, { enterpriseId, onlyBaseInfo, currentProjectId });
    return response.data;
  } catch (err) {
    throw requestError(err, '历史项目列表');
  }
};

/**
 * 获取我参与的合约电站
 * @param page
 * @returns {Promise<*>}
 */
export const fetchUserProjectList = async ({ page }) => {
  try {
    const response = await get(`${serverUrl}/user/project/list`, { page, pageSize: PAGE_SIZE });
    return response.data;
  } catch (err) {
    throw requestError(err, '我的合约电站');
  }
};

/**
 * 获取项目成团信息
 * @param projectId
 * @returns {Promise<*>}
 */
export const fetchProjectGroupInformation = async ({ projectId }) => {
  try {
    const response = await get(`${serverUrl}/project/groupInformation`, { projectId });
    return response.data;
  } catch (err) {
    throw requestError(err, '项目成团信息');
  }
};

/**
 * 获取项目建站信息
 * @param projectId
 * @returns {Promise<*>}
 */
export const fetchProjectSiteInformation = async ({ projectId }) => {
  try {
    const response = await get(`${serverUrl}/project/siteInformation`, { projectId });
    return response.data;
  } catch (err) {
    throw requestError(err, '建站信息');
  }
};

/**
 * 获取组件溯源
 * @param moduleId
 * @returns {Promise<*>}
 */
export const fetchComponentTrace = async ({moduleId}) => {
  try {
    const response = await get(`https://api.thundersdata.com/operation-data/v1/project/moduleinfo/${moduleId}`);
    return response.data;
  } catch (e) {
    throw requestError(e, '组件溯源')
  }
};

/**
 * 获取项目法律文书
 * @param projectId
 * @param purchaseId
 * @returns {Promise<*>}
 */
export const fetchProjectLegalFile = async ({ projectId, purchaseId }) => {
  try {
    const response = await get(`${serverUrl}/project/legalFile/list`, { projectId, purchaseId });
    return response.data;
  } catch (err) {
    throw requestError(err, '项目法律文书');
  }
};

/**
 * 获取驳回信息
 * @param projectId
 * @param purchaseId
 * @returns {Promise<*>}
 */
export const fetchRejectInfo = async ({ projectId, purchaseId }) => {
  try {
    const response = await get(`${serverUrl}/project/reject/info`, { projectId, purchaseId });
    return response.data;
  } catch (err) {
    throw requestError(err, '驳回信息');
  }
};


//TODO: kd写的两个接口不知道在哪用到了

