import {get, post} from '../../utils/fetch';
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
export const reqRegister = async ({username, password}) => {
  const response = await post(`${userServer}/authz/users/register`,
    {
      username,
      password,
      scope: 'read',
      client_id: 'test',
      client_secret: 'test',
      register_type: 'password'
    });
  return {
    success: response.success,
    msg: response.msg || '注册失败'
  }
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
export const modifyLoginPassword = async ({access_token, newPassword, oldPassword}) => {
  const response = await post(`${userServer}/resource/user/updatePassword`, {access_token, newPassword, oldPassword});
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
