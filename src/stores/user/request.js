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
