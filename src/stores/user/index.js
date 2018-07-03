import { observable, action, runInAction, computed, toJS } from 'mobx';
import { getOwnerInfo } from './request';

class UserStore {
  @observable userInfo = {};

  @action
  fetchUserInfo = async () => {
    try {
      const res = await getOwnerInfo();
      if (res.status === 200) {
        runInAction(() => {
          this.userInfo = res.data.result;
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  @action
  updateAvatar = src => {
    this.userInfo.avatar = src;
  };
}

const userStore = new UserStore();
export default userStore;
