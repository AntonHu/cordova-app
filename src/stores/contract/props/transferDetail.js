import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchBuyTransfer,
  fetchTransferInfo
} from "../request";
import { ToastError } from "../../ToastError";

// todo: 添加转让的逻辑
class TransferDetail {
  constructor(projectDetail) {
    this.projectDetail = projectDetail
  }

  // 转让信息
  @observable transferInfo = {};
  @observable loadingTransferInfo = false;

  @observable isBuying = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.transferInfo = {};
    this.loadingTransferInfo = false;
    this.isBuying = false;
    this.projectDetail.reset();
  };

  @action
  loadData = ({ projectId, productId }) => {
    this.projectDetail.loadData(projectId);
    this.loadTransferInfo({ productId })
  };

  @action
  loadTransferInfo = async ({ productId }) => {
    try {
      this.loadingTransferInfo = true;
      const result = await fetchTransferInfo({ productId });
      this.loadingTransferInfo = false;
      if (result.success) {
        this.transferInfo = result.data || {};
        return result;
      } else {
        throw result;
      }
    } catch (e) {
      this.loadingTransferInfo = false;
      ToastError(e);
      return e;
    }
  };

  @action
  buyProject = async ({ productId }) => {
    try {
      this.isBuying = true;
      const result = await fetchBuyTransfer({ productId });
      this.isBuying = false;
      if (result.success) {
        return result;
      } else {
        throw result;
      }
    } catch (e) {
      this.isBuying = false;
      ToastError(e);
      return e;
    }
  }

}

export default TransferDetail;
