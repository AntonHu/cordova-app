import { observable, action, runInAction, computed, toJS } from 'mobx';
import { getOwnerInfo, getMessages, getIsInChain, getIsKycInChain, putUserIntoChain } from './request';
import {getLocalStorage, setLocalStorage, deleteLocalStorage} from '../../utils/storage';
import {testPhoneNumber, formatPhoneWithSpace} from '../../utils/methods';
import {ToastNoMask} from '../../components';
import {Modal} from 'antd-mobile';
import User from '../../utils/user';

const alert = Modal.alert;
const IS_KYC_IN_CHAIN = 'IS_KYC_IN_CHAIN';

class UserStore {
  //用户信息
  @observable userInfo = {};
  //消息列表
  @observable msgList = [];
  //用户是否身份认证了
  @observable isKycInChain = false;

  /**
   * '138 0000 1111'
   */
  @computed
  get userPhoneWithSpace () {
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
        alert('登录过期', '您的登录已过期，请重新登录。', [{text: '好的', onPress: function () {
          const user = new User();
          user.logout();
          keyPair.clearKeyPair();
          userStore.deleteIsKycInChain();
          history.replace('/');
        }}]);
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
      runInAction(() => {
        if (res.data) {
          const status =  !!res.data.msg || false;
          this.isKycInChain = status;
          setLocalStorage(IS_KYC_IN_CHAIN, status);
        }
      });
    } catch (err) {
      if (err.data && err.data.code === 0) {
        ToastNoMask('检查实名认证超时')
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

  /**
   * 从缓存取出IsKycInChain
   * 如果为null，发请求获取
   * @param publicKey
   */
  @action
  checkIsKycInChain = ({publicKey}) => {
    const status = getLocalStorage(IS_KYC_IN_CHAIN);
    if (status === null) {
      this.fetchIsKycInChain({publicKey});
    } else {
      this.isKycInChain = (status === 'true');
    }
  };

  /**
   * 更新IsKycInChain，并且缓存在localStorage
   * @param status
   */
  @action
  updateIsKycInChain = status => {
    this.isKycInChain = status;
    setLocalStorage(IS_KYC_IN_CHAIN, status);
  };

  /**
   * 删除缓存的更新IsKycInChain
   */
  deleteIsKycInChain = () => {
    deleteLocalStorage(IS_KYC_IN_CHAIN);
  }
}

const userStore = new UserStore();
export default userStore;
