import { get, getFile, post, requestError } from '../../utils/fetch';
import { backendServer, contractServer, PAGE_SIZE } from '../../utils/variable';
import axios from "axios";
import { getLocalStorage } from "../../utils/storage";

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
 * 获取某个项目的申购详情（一些申购信息）
 * @param projectId
 * @param purchaseId 如果没有，说明是买的转让。
 * @returns {Promise<*>}
 */
export const fetchPurchaseDetail = async ({ projectId, purchaseId }) => {
  try {
    const response = await get(`${serverUrl}/project/purchase/detail`, { projectId, purchaseId });
    return response.data;
  } catch (err) {
    throw requestError(err, '申购信息');
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
 * @param fileList 上传的文件 数组
 * @returns {Promise<*>}
 */
export const fetchUploadAppeal = async ({ projectId, purchaseId, content, fileList }) => {
  try {
    const response = await post(`${serverUrl}/project/appeal`, {
      projectId,
      purchaseId,
      content,
      fileList: JSON.stringify(fileList)
    });
    console.log(JSON.stringify({ projectId, purchaseId, content, fileList }));
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
export const fetchComponentTrace = async ({ moduleId }) => {
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

/**
 * 项目中电站信息
 * @param projectId
 * @param purchaseId
 * @returns {Promise<*>}
 */
export const fetchPlantInfo = async ({ projectId }) => {
  try {
    const response = await get(`${serverUrl}/project/plantInfo`, { projectId });
    return response.data;
  } catch (err) {
    throw requestError(err, '电站信息');
  }
};

export const getUploadFunc = (url) => {
  return (fileBlob) => {
    const formData = new FormData();
    formData.append('file', fileBlob);

    let config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return axios.post(`${contractServer}${url}?access_token=${getLocalStorage('token')}`, formData, config)
    // axios.post(`http://192.168.1.100:8080/user/headImg`, formData, config)
      .then(res => {
        console.log('upload success!');
        console.log(JSON.stringify(res));
        return res.data;
      })
      .catch(err => {
        console.log('upload fail!');
        console.log(err);
        console.log(Object.keys(err));
        console.log(JSON.stringify(err.response));
        throw requestError(err, '上传文件');
      })
  }
};

export const uploadContractPublicFile = getUploadFunc('/oss/public/upload');
export const uploadContractPrivateFile = getUploadFunc('/oss/private/upload');

/**
 * 合约电站列表
 * @returns {Promise<*>}
 */
export const fetchPlantList = async () => {
  try {
    const response = await get(`${serverUrl}/project/plantList`);
    return response.data;
  } catch (err) {
    throw requestError(err, '合约电站列表');
  }
};

/**
 * 转让电站列表
 * @returns {Promise<*>}
 */
export const fetchTransferList = async () => {
  try {
    const response = await get(`${serverUrl}/transferPlant/getTransferList`);
    return response.data;
  } catch (err) {
    throw requestError(err, '转让电站');
  }
};

/**
 * 我的转让历史
 * @returns {Promise<*>}
 */
export const fetchTransferHistory = async () => {
  try {
    const response = await get(`${serverUrl}/transferPlant/getTransferHistory`);
    return response.data;
  } catch (err) {
    throw requestError(err, '转让历史');
  }
};

/**
 * 转让 我的项目
 * @param purchaseNumber
 * @param amount
 * @param unitPrice
 * @param projectId
 * @returns {Promise<*>}
 */
export const fetchSellMyProject = async ({ purchaseNumber, amount, unitPrice, projectId }) => {
  try {
    const response = await post(`${serverUrl}/transferPlant/sell`, { purchaseNumber, amount, unitPrice, projectId });
    return response.data;
  } catch (err) {
    throw requestError(err, '申请转让');
  }
};

/**
 * 获取转让信息
 * @param productId
 * @returns {Promise<*>}
 */
export const fetchTransferInfo = async ({productId}) => {
  try {
    const response = await get(`${serverUrl}/transferPlant/getTransferInfo`, { productId });
    return response.data;
  } catch (err) {
    throw requestError(err, '转让信息');
  }
};

/**
 * 购买转让
 * @param productId
 * @returns {Promise<*>}
 */
export const fetchBuyTransfer = async ({ productId }) => {
  try {
    const response = await post(`${serverUrl}/transferPlant/buy`, { productId });
    return response.data;
  } catch (err) {
    throw requestError(err, '购买转让');
  }
};

/**
 * 卖方取消转让
 * @param productId
 * @returns {Promise<*>}
 */
export const fetchCancelTransfer = async ({ productId }) => {
  try {
    const response = await post(`${serverUrl}/transferPlant/cancelTransferPlant`, { productId });
    return response.data;
  } catch (err) {
    throw requestError(err, '取消转让');
  }
};

/**
 * 卖方确认打款
 * @param productId
 * @returns {Promise<*>}
 */
export const fetchVerifyPayBySeller = async ({ orderId }) => {
  try {
    const response = await post(`${serverUrl}/transferPlant/verifyPayBySeller`, { orderId });
    return response.data;
  } catch (err) {
    throw requestError(err, '确认打款');
  }
};

/**
 * 买方确认支付
 * @param productId
 * @returns {Promise<*>}
 */
export const fetchVerifyPayByBuyer = async ({ orderId }) => {
  try {
    const response = await post(`${serverUrl}/transferPlant/verifyPayByBuyer`, { orderId });
    return response.data;
  } catch (err) {
    throw requestError(err, '确认支付');
  }
};

export const fetchLegalDocument = async ({ type, projectId, purchaseNumber }) => {
  try {
    const response = await getFile(`${serverUrl}/project/legalFile`, { type, projectId, purchaseNumber });
    console.log(response)
    return response;
  } catch (err) {
    throw requestError(err, '获取协议');
  }
};


//TODO: kd写的 获取用户电站收益百分比 不知道在哪用到了

