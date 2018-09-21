import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchConfirmPayment,
  fetchPurchaseProject,
  fetchCancelPurchase
} from "../request";
import { ToastError } from "../../ToastError";

// todo: 添加转让的逻辑
class TransferDetail {
  constructor(projectDetail) {
    this.projectDetail = projectDetail
  }

  // goBack的时候，重置store
  @action
  reset = () => {
    this.projectDetail.reset();
  };

  @action
  loadData = (id) => {
    this.projectDetail.loadData(id);
  }

}

export default TransferDetail;
