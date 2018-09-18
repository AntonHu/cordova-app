import { action, computed, observable } from 'mobx';
import {
  fetchConfirmPayment,
  fetchHistoryProjectList,
  fetchProjectDetail,
  fetchPurchaseProject,
  fetchShareConfirmDoc,
  fetchInvestAgreement, fetchCancelPurchase
} from "../request";

// 未参与的合约项目详情（包含申购）
class NotInvolvedDetail {
  // 项目详情
  @observable projectDetail = {};
  @observable isDetailLoading = false;

  // 历史项目列表
  @observable historyList = [];
  @observable isHistoryLoading = false;

  // 申购份数
  @observable purchaseCount = 1;

  // 申购Id，申购后返回，用于确认付款
  @observable purchaseId = '';

  // goBack的时候，重置store
  @action
  reset = () => {
    this.projectDetail = {};
    this.isDetailLoading = false;
    this.historyList = [];
    this.isHistoryLoading = false;
    this.purchaseCount = 1;
    this.purchaseId = '';
  };

  // didMount且不是goBack过来的时候，获取项目详情
  // 获取项目详情之后，再获取历史项目列表
  loadData = (id) => {
    if (this.isDetailLoading) {
      return;
    }
    this.loadDetail(id)
      .then(result => {
        if (result.success) {
          this.loadHistory({
            enterpriseId: this.projectDetail.enterpriseId,
            onlyBaseInfo: true,
            currentProjectId: id
          })
        }
      })
  };

  // 项目详情
  @action
  loadDetail = async (id) => {
    this.isDetailLoading = true;
    const result = await fetchProjectDetail({ id });
    this.isDetailLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.projectDetail = data.projectDetail || {};
    } else {

    }
    return result;
  };

  // 历史项目列表
  @action
  loadHistory = async ({ enterpriseId, onlyBaseInfo, currentProjectId }) => {
    this.isHistoryLoading = true;
    const result = await fetchHistoryProjectList({ enterpriseId, onlyBaseInfo, currentProjectId });
    this.isHistoryLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.historyList = data.list || [];
    } else {

    }
    return result;
  };

  // 调申购方法
  @action
  onPurchase = async () => {
    const result = await fetchPurchaseProject({
      projectId: this.projectDetail.projectId,
      purchaseNumber: this.purchaseCount
    });
    if (result.success) {
      const data = result.data || {};
      this.purchaseId = data.purchaseId + '' || '';
    } else {

    }
    return result;
  };

  // "确认已付款"
  onConfirmPay = async () => {
    const result = await fetchConfirmPayment({
      projectId: this.projectDetail.projectId,
      purchaseId: this.purchaseId
    });
    return result;
  };

  // 取消申购
  onCancelPurchase = async () => {
    const result = await fetchCancelPurchase({
      projectId: this.projectDetail.projectId,
      purchaseId: this.purchaseId
    });
    return result;
  };

  // 获取投资份额确认书
  getShareConfirmDoc = async ({ type }) => {
    const result = await fetchShareConfirmDoc({
      type,
      projectId: this.projectDetail.projectId,
      purchaseNumber: this.purchaseCount
    });
    return result;
  };

  // 获取投资协议
  getInvestAgreement = async ({ type }) => {
    const result = await fetchInvestAgreement({
      type,
      projectId: this.projectDetail.projectId,
      purchaseNumber: this.purchaseCount
    });
    return result;
  };

  // 点击申购的时候，输入申购份数
  @action
  updatePurchaseCount = (share) => {
    this.purchaseCount = share;
  };

  // 申购总金额(computed)
  @computed
  get purchaseAmount() {
    return this.projectDetail * this.purchaseCount;
  }



}

export default NotInvolvedDetail;
