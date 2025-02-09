import { getLocalStorage, setLocalStorage, deleteLocalStorage} from './storage';
/**
 * 保存和操作用户登录信息
 *
 * @class User
 */
class User {
  constructor() {
    // this.userName = userName;
    // this.userEmail = userEmail;
    // this.accessToken = accessToken;
    // this.expireTime = expireTime;
  }

  /**
   * 用户登录
   * 将username，token，expireTime 保存到 sessionStorage 中
   *
   * @memberof User
   */
  login(accessToken) {
    setLocalStorage('token', accessToken);
  }

  setPhone(phone) {
    setLocalStorage('loginPhone', phone);
  }

  /**
   * 判断用户是否登录
   *
   * @memberof User
   */
  isLogin() {
    const accessToken = getLocalStorage('token');
    return !!accessToken;
    // return true; // 测试，默认返回 true
  }

  /**
   * 获取用户信息
   *
   * @memberof User
   */
  getInfo() {
    const userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    if (userInfo) {
      return {
        userName: userInfo.userName,
        userEmail: userInfo.userEmail,
        accessToken: userInfo.accessToken
      };
    } else {
      return {
        userName: '',
        userEmail: '',
        accessToken: ''
      };
    }
  }

  /**
   * 用户退出登录
   *
   * @memberof User
   */
  logout() {
    deleteLocalStorage('token');
    deleteLocalStorage('loginPhone');
  }
}

export default User;
