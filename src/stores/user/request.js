import {get, post, authPost, post2} from '../../utils/fetch';
import {backendServer, userServer, PAGE_SIZE} from '../../utils/variable';
import axios from 'axios';

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
    throw err.response;
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
    throw err.response;
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
    throw err.response;
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
    throw err.response;
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
    throw err.response;
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
    throw err.response;
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
    console.log('reqUpdateUser');
    console.log(JSON.stringify(response))
    return response
  } catch (err) {
    throw err.response;
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
    const response = await post(`${backendServer}/info/rectangle`, {publicKey, rectangle});
    return response;
  } catch (err) {
    throw err.response;
  }
};

/**
 * formData上传头像
 * @param fileBlob
 * @returns {Promise.<TResult>}
 */
export const reqUploadAvatar = (fileBlob) => {

  const formData = new FormData();
  formData.append('pngFile', fileBlob);

  let config = {
    headers:{'Content-Type':'multipart/form-data'}
  };
  return axios.post(`${backendServer}/user/headImg`, formData, config)
  // axios.post(`http://192.168.1.100:8080/user/headImg`, formData, config)
    .then(res => {
      console.log('upload success!');
      console.log(JSON.stringify(res));
      return res;
    })
    .catch(err => {
      console.log('upload fail!');
      console.log(err);
      console.log(Object.keys(err));
      console.log(JSON.stringify(err.response))
      throw err;
    })
};

/**
 * formData方式，上传认证信息
 * @param publicKey
 * @param username
 * @param idPositive 身份证正面图片文件
 * @param idNegative 身份证反面图片文件
 * @param idHandheld 身份证手持图片文件
 * @returns {Promise.<TResult>}
 */
export const reqUploadVerifyId = ({publicKey, username, idPositive, idNegative, idHandheld}) => {
  const formData = new FormData();
  console.log(JSON.stringify({username, idPositive, idNegative, idHandheld}));
  formData.append('publicKey', publicKey);
  formData.append('username', username);
  formData.append('idPositive', idPositive);
  formData.append('idNegative', idNegative);
  formData.append('idHandheld', idHandheld);

  let config = {
    headers:{'Content-Type':'multipart/form-data'}
  };

  return axios.post(`${backendServer}/user/verifiedUser`, formData, config)
    .then(res => {
      console.log('verifiedUser success');
      console.log(JSON.stringify(res));
      return res;
    })
    .catch(err => {
      console.log('verifiedUser fail');
      console.log(JSON.stringify(err.response));
      throw err;
    })
};

/**
 * 重置交易密码
 * @param phoneNumbe
 * @param newPassword
 * @param verificationCode
 * @returns {Promise.<*>}
 */
export const reqResetTradePassword = async (
  {
    phoneNumber,
    newPassword,
    verificationCode
  }) => {
  try {
    const response = await post(`${backendServer}/user/resetPassword`, {
      phoneNumber,
      newPassword,
      verificationCode});
    return response;
  } catch (err) {
    throw err.response;
  }
};

/**
 * 用户是否身份认证了
 * @param publicKey
 * @returns {Promise.<*>}
 */
export const getIsInChain = async ({publicKey}) => {
  try {
    const response = await get(`${backendServer}/user/isInChain`, {
      publicKey
    });
    return response;
  } catch (err) {
    throw err.response;
  }
};
