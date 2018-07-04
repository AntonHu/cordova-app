import { observable, action, runInAction, computed, toJS } from 'mobx';
import { getOwnerInfo, getMessages, getIsInChain } from './request';

class UserStore {
  //用户信息
  @observable userInfo = {};
  //消息列表
  @observable msgList = [];
  //用户是否身份认证了
  @observable isInChain = false;

  /**
   * 获取用户信息
   * @returns {Promise.<*>}
   */
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

  /**
   * 获取消息列表
   * @param page
   * @returns {Promise.<void>}
   */
  @action
  fetchMessages = async ({page}) => {
    try {
      const res = await getMessages({page});
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          if (page === 0) {
            this.msgList = res.data.data;
          } else {
            this.msgList = this.msgList.concat(res.data.data);
          }
        })
      }
    } catch (err) {
      throw err;
    }
  };

  /**
   * 用户是否身份认证
   * @param publicKey
   * @returns {Promise.<void>}
   */
  @action
  fetchIsInChain = async ({publicKey}) => {
    try {
      const res = await getIsInChain({publicKey});
      runInAction(() => {
        if (res.data) {
          this.isInChain = res.data.success || false;
        }
      });
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
