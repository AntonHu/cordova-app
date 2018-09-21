import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchConfirmPayment,
  fetchPurchaseProject,
  fetchCancelPurchase
} from "../request";
import { ToastError } from "../../ToastError";

// 未参与的合约项目详情（包含申购）
class NotInvolvedDetail {

  constructor(projectDetail) {
    this.projectDetail = projectDetail;
  }

  // 申购份数
  @observable purchaseCount = 1;

  // 申购Id，申购后返回，用于确认付款
  @observable purchaseId = '';

  // loading状态
  @observable isPurchasing = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.purchaseCount = 1;
    this.purchaseId = '';
    this.isPurchasing = false;
    this.projectDetail.reset();
  };

  // didMount且不是goBack过来的时候，获取项目详情
  // 获取项目详情之后，再获取历史项目列表
  loadData = (id) => {
    this.projectDetail.loadData(id);
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
