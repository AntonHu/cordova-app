import {get, post, authPost} from '../../utils/fetch';
import {backendServer, userServer, PAGE_SIZE, testPublicKey} from '../../utils/variable';

/**
 * 用户密码登录
 * @param phone
 * @param password
 * @returns {Promise.<{success, msg: string}>}
 */
export const reqLogin = async ({username, password}) => {
  try {
    const response = await post(`${userServer}/authz/oauth/token`,
      {
        username,
        password,
        scope: 'read',
        client_id: 'test',
        client_secret: 'test',
        grant_type: 'password'
      });
    return response
  } catch (err) {
    return err.response;
  }

};

/**
 * 用户注册
 * @returns {Promise.<{success, msg: string}>}
 */
export const reqRegister = async ({mobile, password, verificationCode}) => {
  try {
    const response = await post(`${userServer}/authz/users/register`,
      {
        mobile,
        password,
        scope: 'read',
        client_id: 'test',
        client_secret: 'test',
        register_type: 'phone',
        verification_code: verificationCode
      });
    return response
  } catch (err) {
    return err.response;
  }

};

/**
 * 发送验证码
 * @param mobile 手机号
 * @param type   0 注册 1 修改密码
 * @returns {Promise.<void>}
 */
export const reqSendCode = async ({mobile, type = '0'}) => {
  try {
    const response = await post(`${userServer}/authz/sms/send`, {mobile, type});
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取个人信息
 * @returns {Promise.<*>}
 */
export const getOwnerInfo = async () => {
  try {
    const response = await get(`${userServer}/resource/rs/checkToken`);
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 获取消息列表
 * @returns {Promise.<*>}
 */
export const getMessages = async ({page}) => {
  try {
    const response = await get(`${backendServer}/info/latestNews`, {page, pageSize: PAGE_SIZE});
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 修改登录密码
 * @returns {Promise.<*>}
 */
export const modifyLoginPassword = async ({newPassword, oldPassword}) => {
  try {
    const response = await post(`${userServer}/resource/user/updatePassword`, {newPassword, oldPassword});
    return response;
  } catch (err) {
    return err.response;
  }
};

/**
 * 用户信息修改（头像，昵称）
 * @returns {Promise.<*>}
 */
export const reqUpdateUser = async ({header, nickName}) => {
  try {
    const response = await post(`${userServer}/resource/user/updateUserInfo`,
      {
        header,
        nickName
      }
    );
    return response
  } catch (err) {
    return err.response;
  }
};

/**
 * 上传用户地理位置
 * @param publicKey
 * @param rectangle 经纬度字符串：'30.123,25.66'
 * @returns {Promise.<*>}
 */
export const reqUpdateGeolocation = async ({publicKey, rectangle}) => {
  try {
    const response = await post(`${backendServer}/info/rectangle`, {publicKey: testPublicKey, rectangle});
    return response;
  } catch (err) {
    return err.response;
  }
};
