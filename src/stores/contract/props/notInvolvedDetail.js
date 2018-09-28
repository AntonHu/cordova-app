import { action, computed, observable, runInAction, toJS } from 'mobx';
import {
  fetchConfirmPayment,
  fetchPurchaseProject,
  fetchCancelPurchase
} from '../request';
import { ToastError } from '../../ToastError';

// 未参与的合约项目详情（包含申购）
class NotInvolvedDetail {
  constructor(projectDetail) {
    this.projectDetail = projectDetail;
  }

  // 申购份数
  @observable
  purchaseCount = 1;

  // 申购Id，申购后返回，用于确认付款
  @observable
  purchaseId = '';

  // loading状态
  @observable
  isPurchasing = false;

  @observable
  isConfirmPaying = false;

  @observable
  isCancelPurchasing = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.purchaseCount = 1;
    this.purchaseId = '';
    this.isPurchasing = false;
    this.isConfirmPaying = false;
    this.isCancelPurchasing = false;
    this.projectDetail.reset();
  };

  // didMount且不是goBack过来的时候，获取项目详情
  // 获取项目详情之后，再获取历史项目列表
  loadData = id => {
    this.projectDetail.loadData(id);
  };

  // 调申购方法
  @action
  onPurchase = async ({ projectId, purchaseNumber }) => {
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
      this.isPurchasing = false;
      ToastError(e);
      return e;
    }
  };

  // "确认已付款"
  @action
  onConfirmPay = async ({ projectId, purchaseId }) => {
    try {
      this.isConfirmPaying = true;
      const result = await fetchConfirmPayment({
        projectId,
        purchaseId
      });
      this.isConfirmPaying = false;
      if (result.success) {
        return result;
      } else {
        throw result;
      }
    } catch (e) {
      this.isConfirmPaying = false;
      ToastError(e);
      return e;
    }
  };

  // 取消申购
  @action
  onCancelPurchase = async ({ projectId, purchaseId }) => {
    try {
      this.isCancelPurchasing = true;
      const result = await fetchCancelPurchase({
        projectId,
        purchaseId
      });
      this.isCancelPurchasing = false;
      if (result.success) {
        return result;
      } else {
        throw result;
      }
    } catch (e) {
      this.isCancelPurchasing = false;
      ToastError(e);
      return e;
    }
  };

  // 点击申购的时候，输入申购份数
  @action
  updatePurchaseCount = share => {
    //只要输入的份数不合法，将份数转成最大份数
    //不合法的情况：1：非数字或整数 。 2：不和合法范围
    const MAX_VALUE = toJS(this.projectDetail).detail.availableShare || 0;
    if (
      typeof share !== 'number' ||
      Math.round(share) !== share ||
      share < 0 ||
      share > MAX_VALUE
    ) {
      //不合法则默认选择最大值
      this.purchaseCount = MAX_VALUE;
    } else {
      this.purchaseCount = share;
    }
  };

  // 申购总金额(computed)
  @computed
  get purchaseAmount() {
    return (
      (this.projectDetail.detail.minInvestmentAmount || 0) * this.purchaseCount
    );
  }
}

export default NotInvolvedDetail;
