import {observable, action, runInAction, computed, toJS} from 'mobx';
import {getOwnerInfo, getMessages, getIsInChain, getIsKycInChain, getInvitationCode, getNewsList} from './request';
import {getLocalStorage, setLocalStorage, deleteLocalStorage} from '../../utils/storage';
import {formatPhoneWithSpace} from '../../utils/methods';
import {testPhoneNumber} from '../../utils/validate';
import {VERIFY_STATUS} from '../../utils/variable';
import {ToastNoMask} from '../../components';
import {Modal} from 'antd-mobile';
import User from '../../utils/user';

const alert = Modal.alert;
const IS_KYC_IN_CHAIN = 'IS_KYC_IN_CHAIN';

class UserStore {
  // 用户信息
  @observable userInfo = {};
  // 消息列表
  @observable msgList = [];
  // 用户是否身份认证了
  @observable isKycInChain = VERIFY_STATUS.UNAUTHORIZED;
  // 用户邀请码
  @observable invitationCode = '';
  // 资讯列表
  @observable newsList = [];
  // 消息中心的Tab
  @observable msgCenterTabPage = 0;

  @action
  onLogout = () => {
    this.deleteIsKycInChain();
    this.userInfo = {};
    this.msgList = [];
    this.isKycInChain = VERIFY_STATUS.UNAUTHORIZED;
    this.invitationCode = '';
    this.newsList = [];
    this.msgCenterTabPage = 0;
  };

  /**
   * '138 0000 1111'
   */
  @computed
  get userPhoneWithSpace() {
    if (testPhoneNumber(this.userInfo.username)) {
      return formatPhoneWithSpace(this.userInfo.username)
    }
    if (testPhoneNumber(this.userInfo.cellPhone)) {
      return formatPhoneWithSpace(this.userInfo.cellPhone)
    }
    return ''
  }

  /**
   * 获取用户信息
   * @returns {Promise.<*>}
   */
  @action
  fetchUserInfo = async ({keyPair, userStore, history}) => {
    try {
      const res = await getOwnerInfo();
      if (res.status === 200) {
        runInAction(() => {
          this.userInfo = res.data.result;
        });
      }
      return res;
    } catch (err) {
      console.log(err);
      if (err.data && err.data.error === 'invalid_token') {
        alert('登录过期', '您的登录已过期，请重新登录。', [{
          text: '好的', onPress: function () {
            const user = new User();
            user.logout();
            keyPair.clearKeyPair();
            userStore.deleteIsKycInChain();
            history.replace('/');
          }
        }]);
      } else {
        throw err;
      }

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
      return res;
    } catch (err) {
      throw err;
    }
  };

  /**
   * 获取资讯列表
   * @param page
   * @returns {Promise.<*>}
   */
  @action
  fetchNewsList = async ({page}) => {
    try {
      const res = await getNewsList({page});
      if (res.data && res.data.code === 200) {
        runInAction(() => {
          if (page === 0) {
            this.newsList = res.data.data.list || [];
          } else {
            this.newsList = this.newsList.concat(res.data.data.list || []);
          }
        })
      }
      return res;
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
  fetchIsKycInChain = async ({publicKey}) => {
    try {
      const res = await getIsKycInChain({publicKey});
      console.log(res)
      if (res.data && res.data.code === 200) {
        const data = res.data.data || {};
        const status = data.statusId || VERIFY_STATUS.UNAUTHORIZED;
        runInAction(() => {
          this.isKycInChain = status;
        })
      }
    } catch (err) {
      if (err.data && err.data.code === 0) {
        ToastNoMask('检查实名认证超时')
      }
    }
  };

  /**
   * 获取用户邀请码
   * @returns {Promise.<void>}
   */
  @action
  fetchInvitationCode = async () => {
    // 存在邀请码就没必要获取了
    if (!this.invitationCode) {
      try {
        const res = await getInvitationCode();
        const data = res.data || {};
        if (data.code === 200) {
          runInAction(() => {
            this.invitationCode = data.data.invitationCode || '';
          })
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * 直接更新头像的src
   * @param src
   */
  @action
  updateAvatar = src => {
    this.userInfo.avatar = src;
  };

  @action
  updateMsgCenterTabPage = page => {
    this.msgCenterTabPage = page
  };

  /**
   * 检查是否身份认证了
   * @param publicKey
   */
  @action
  checkIsKycInChain = ({publicKey}) => {
    this.fetchIsKycInChain({publicKey});
  };

  /**
   * 更新IsKycInChain
   * @param status
   */
  @action
  updateIsKycInChain = status => {
    this.isKycInChain = status;
  };

  /**
   * 删除缓存的更新IsKycInChain
   */
  deleteIsKycInChain = () => {
    deleteLocalStorage(IS_KYC_IN_CHAIN);
  };

}

const userStore = new UserStore();
export default userStore;
