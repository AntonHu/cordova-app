import {get, post, LONG_TIME_OUT} from '../../utils/fetch';
import {backendServer, userServer, PAGE_SIZE} from '../../utils/variable';
import axios from 'axios';

/**
 * 获取电站备案信息列表
 * @param username
 * @returns {Promise.<*>}
 */
export const getStationInfoRecord = async ({username}) => {
  try {
    const response = await get(`${backendServer}/user/getRecord`, {username});
    return response;
  } catch (err) {
    throw err.response;
  }
};

/**
 * 新建或修改电站信息
 * @param username      登录手机号
 * @param id            电站备案信息的id，有就是编辑，没有就是新建
 * @param recordImg     "备案资料"图片
 * @param connectionImg "并网成功文件"图片
 * @returns {Promise.<TResult>}
 */
export const reqUploadStationInfo = ({username, id, recordImg, connectionImg}) => {
  const formData = new FormData();
  console.log('并网链接是');
  console.log(connectionImg);

  formData.append('username', username);
  if (recordImg) {
    formData.append('recordImg', recordImg);
  }
  if (connectionImg) {
    formData.append('connectionImg', connectionImg);
  }
  if (id) {
    formData.append('id', id);
  }

  let config = {
    headers:{'Content-Type':'multipart/form-data'},
    ////先不加超时，感受一下
    // timeout: LONG_TIME_OUT
  };

  return axios.post(`${backendServer}/user/uploadImgRecord`, formData, config)
    .then(res => {
      console.log('UploadStationInfo success');
      console.log(JSON.stringify(res));
      return res;
    })
    .catch(err => {
      if (err.message === `timeout of ${LONG_TIME_OUT}ms exceeded`) {
        throw {
          data: {
            code: 0,
            msg: '请求超时'
          }
        }
      }
      throw err;
    })
};
