import { action, observable } from 'mobx';
import { fetchBindBankCard, fetchLatestBankCard } from "./request";
import { ToastError } from "../ToastError";

class BankCardStore {
  @observable bankCard = {};
  @observable loadingBankCard = false;

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
      this.loadingBankCard = true;
      const result = await fetchLatestBankCard();
      this.loadingBankCard = false;
      if (result.success) {
        this.bankCard = result.data || {};
      } else {

        throw result;
      }
      return result;
    } catch (e) {
      this.loadingBankCard = false;
      ToastError(e);
      return e;
    }
  };

  // 填写银行卡
  @action
  setBankCard = async ({ bank, name, bankCardNumber }) => {
    return await fetchBindBankCard({ bank, name, bankCardNumber });
  };


}

const bankCardStore = new BankCardStore();
export default bankCardStore;
