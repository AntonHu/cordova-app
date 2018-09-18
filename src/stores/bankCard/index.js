import { observable, action, runInAction, computed } from 'mobx';
import { fetchBindBankCard, fetchLatestBankCard } from "./request";
import { ToastError } from "../ToastError";

class BankCardStore {
  @observable bankCard = {};

  @action
  resetStore = () => {
    this.bankCard = {}
  };

  onLogout = () => {
    this.resetStore();
  };

  // 获取已填写银行卡
  @action
  getBankCard = async () => {
    try {
      const result = await fetchLatestBankCard();
      if (result.success) {
        this.bankCard = result.data || {};
      } else {
        throw result;
      }
      return result;
    } catch (e) {
      ToastError(e);
    }
  };

  // 填写银行卡
  // TODO: 从store里拿掉
  @action
  setBankCard = async ({ bank, name, bankCardNumber }) => {
    const result = await fetchBindBankCard({ bank, name, bankCardNumber });
    if (result.success) {

    } else {

    }
  };


}

const bankCardStore = new BankCardStore();
export default bankCardStore;
