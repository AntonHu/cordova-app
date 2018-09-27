import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchCancelTransfer,
  fetchTransferHistory, fetchVerifyPayByBuyer, fetchVerifyPayBySeller
} from "../request";
import { ToastError } from "../../ToastError";
import ToastNoMask from "../../../components/Toast";

class TransferHistoryList {
  @observable page = 1;
  @observable list = [];
  @observable isLoading = false;

  // 正在发送 取消转让 请求
  @observable isCancelTransferring = false;
  // 正在发送 卖方确认收款 请求
  @observable isSellerVerifying = false;
  // 正在发送 买方确认打款 请求
  @observable isBuyerVerifying = false;

  @action
  reset = () => {
    this.page = 1;
    this.list = [];
    this.isLoading = false;
    this.isCancelTransferring = false;
    this.isSellerVerifying = false;
    this.isBuyerVerifying = false;
  };

  @action
  loadList = async () => {
    try {
      this.isLoading = true;
      const result = await fetchTransferHistory();
      runInAction(() => {
        this.isLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.list = data || []
        } else {
          throw result;
        }
      });
      return result;
    } catch (e) {
      this.isLoading = false;
      ToastError(e);
      return e;
    }
  };

  @action
  initLoad = async () => {
    if (this.isLoading) {
      return;
    }
    this.page = 1;
    this.isLoading = false;
    this.loadList()
  };

  // 取消转让
  @action
  cancelTransfer = async (productId) => {
    try {
      this.isCancelTransferring = true;
      const result = await fetchCancelTransfer({ productId });
      this.isCancelTransferring = false;
      if (result.success) {
        ToastNoMask('取消转让成功');
        return result
      } else {
        throw result;
      }
    } catch (e) {
      this.isCancelTransferring = false;
      ToastError(e);
      return e;
    }
  };

  // 买方确认支付
  @action
  buyerVerify = async (orderId) => {
    try {
      this.isBuyerVerifying = true;
      const result = await fetchVerifyPayByBuyer({ orderId });
      this.isBuyerVerifying = false;
      if (result.success) {
        ToastNoMask('确认支付成功');
        this.initLoad();
        return result
      } else {
        throw result;
      }
    } catch (e) {
      this.isBuyerVerifying = false;
      ToastError(e);
      return e;
    }
  };

  // 卖方确认打款
  @action
  sellerVerify = async (orderId) => {
    try {
      this.isSellerVerifying = true;
      const result = await fetchVerifyPayBySeller({ orderId });
      this.isSellerVerifying = false;
      if (result.success) {
        ToastNoMask('确认成功');
        this.initLoad();
        return result
      } else {
        throw result;
      }
    } catch (e) {
      this.isSellerVerifying = false;
      ToastError(e);
      return e;
    }
  }

}

export default TransferHistoryList;
