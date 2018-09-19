import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchConfirmPayment,
  fetchHistoryProjectList,
  fetchProjectDetail,
  fetchPurchaseProject,
  fetchPurchaseLegalFile,
  fetchInvestAgreement, fetchCancelPurchase
} from "../request";
import { Toast } from 'antd-mobile';
import { ToastError } from "../../ToastError";

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

  // loading状态
  @observable isPurchasing = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.projectDetail = {};
    this.isDetailLoading = false;
    this.historyList = [];
    this.isHistoryLoading = false;
    this.purchaseCount = 1;
    this.purchaseId = '';
    this.isPurchasing = false;
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
    try {
      this.isDetailLoading = true;
      const result = await fetchProjectDetail({ id });
      runInAction(() => {
        this.isDetailLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.projectDetail = data || {};
        } else {
          throw result;
        }
      });
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  };

  // 历史项目列表
  @action
  loadHistory = async ({ enterpriseId, onlyBaseInfo, currentProjectId }) => {
    try {
      this.isHistoryLoading = true;
      const result = await fetchHistoryProjectList({ enterpriseId, onlyBaseInfo, currentProjectId });
      runInAction(() => {
        this.isHistoryLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.historyList = data.list || [];
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  };

  // 调申购方法
  @action
  onPurchase = async ({projectId, purchaseNumber}) => {
    try {
      this.isPurchasing = true;
      const result = await fetchPurchaseProject({
        projectId,
        purchaseNumber
      });
      this.isPurchasing = false;

        if (result.success) {
          const data = result.data || {};
          this.purchaseId = data.purchaseId + '' || '';
        } else {
          throw result;
        }


      return result;
    } catch (e) {
      ToastError(e);
      return e
    }
  };

  // "确认已付款"
  onConfirmPay = async ({projectId, purchaseId}) => {
    try {
      const result = await fetchConfirmPayment({
        projectId: this.projectDetail.projectId,
        purchaseId: this.purchaseId
      });
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  };

  // 取消申购
  onCancelPurchase = async ({projectId, purchaseId}) => {
    try {
      const result = await fetchCancelPurchase({
        projectId,
        purchaseId
      });
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  };

  // 点击申购的时候，输入申购份数
  @action
  updatePurchaseCount = (share) => {
    this.purchaseCount = share;
  };

  // 申购总金额(computed)
  @computed
  get purchaseAmount() {
    return (this.projectDetail.minInvestmentAmount || 0) * this.purchaseCount;
  }



}

export default NotInvolvedDetail;
