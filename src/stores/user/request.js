import {get, post, authPost} from '../../utils/fetch';
import {backendServer, userServer} from '../../utils/variable';

/**
 * 用户密码登录
 * @param phone
 * @param password
 * @returns {Promise.<{success, msg: string}>}
 */
export const reqLogin = async ({username, password}) => {
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
};

/**
 * 用户注册
 * @returns {Promise.<{success, msg: string}>}
 */
export const reqRegister = async ({mobile, password, verificationCode}) => {
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
};

/**
 * 发送验证码
 * @param mobile 手机号
 * @param type   0 注册 1 修改密码
 * @returns {Promise.<void>}
 */
export const reqSendCode = async ({mobile, type = '0'}) => {
  const response = await post(`${userServer}/authz/sms/send`, {mobile, type});
  return response;
};

/**
 * 获取个人信息
 * @returns {Promise.<*>}
 */
export const getOwnerInfo = async () => {
  const response = await get(`${backendServer}/user/getOwnerInfo`);
  return response;
};

/**
 * 获取消息列表
 * @returns {Promise.<*>}
 */
export const getMessages = async () => {
  const response = await get(`${backendServer}/message/getMessages`);
  return response;
};

/**
 * 修改登录密码
 * @returns {Promise.<*>}
 */
export const modifyLoginPassword = async ({newPassword, oldPassword}) => {
  const response = await post(`${userServer}/resource/user/updatePassword`, {newPassword, oldPassword});
  return response;
};

/**
 * 用户信息修改（头像，昵称）
 * @returns {Promise.<*>}
 */
export const reqUpdateUser = async () => {
  const response = await post(`${backendServer}/user/update`);
  return response
};
