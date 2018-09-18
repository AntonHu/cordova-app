import { observable, action, runInAction, computed } from 'mobx';
import { fetchBindBankCard, fetchLatestBankCard } from "./request";

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
    const result = await fetchLatestBankCard();
    if (result.success) {
      const data = result.data || {};
      this.bankCard = data;
    } else {

    }
  };

  // 填写银行卡
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
