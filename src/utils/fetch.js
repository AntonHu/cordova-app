import axios from 'axios';
import qs from 'qs';
import { getLocalStorage } from './storage';
import { KEY_PAIR_LOCAL_STORAGE } from './variable';

export const TIME_OUT = 10000;
// export const TIME_OUT = 99999999999;
export const LONG_TIME_OUT = 15000;
export const ERR_CODE = {
  timeout: -TIME_OUT,
  notFound: 404,
  networkError: 500
};

/*
  请求头为application/json
*/
export const JSONInstance = axios.create({
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: [
    function(resp) {
      resp = JSON.parse(resp);
      return resp;
    }
  ]
});

/*
  post请求
*/
const postInstance = axios.create({
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformResponse: [
    function(resp) {
      resp = JSON.parse(resp);
      return resp;
    }
  ]
});

// 重新包装一下，使得超时的err有response
const errHandler = err => {
  console.dir(err);
  if (err.message === `timeout of ${TIME_OUT}ms exceeded`) {
    throw {
      success: false,
      code: ERR_CODE.timeout,
      msg: '请求超时'
    };
  }
  if (err.message === 'Request failed with status code 404') {
    throw {
      success: false,
      code: ERR_CODE.notFound,
      msg: '接口404'
    };
  }
  if (err.message === 'Network Error') {
    throw {
      success: false,
      code: ERR_CODE.networkError,
      msg: '网络错误'
    };
  }
  throw err;
};

/**
 * 把err用接口名包装一下
 * @param err
 * @param name  接口名字
 * @returns {*}
 */
export const requestError = (err, name) => {
  if (err.code !== undefined && err.msg) {
    err.msg = name + ' ' + err.msg;
  } else {
    err = {
      success: false,
      code: -1,
      msg: name + ' 接口错误'
    };
  }
  return err;
};

/*
  get请求，参数：params
*/
export const get = (url, params) => {
  const token = getLocalStorage('token');
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?access_token=${token}&`;
    urlStr += qs.stringify(params);
  } else {
    urlStr += `?access_token=${token}`;
  }
  return JSONInstance.get(urlStr).catch(errHandler);
};

export const getFile = (url, params) => {
  const token = getLocalStorage('token');
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?access_token=${token}&`;
    urlStr += qs.stringify(params);
  } else {
    urlStr += `?access_token=${token}`;
  }
  return axios
    .create({
      timeout: TIME_OUT,
      headers: {
        // 'Content-Type': 'application/octet-stream'
        'Content-Type': 'application/pdf',
        responseType: 'arraybuffer'
      }
    })
    .get(urlStr)
    .then(res => {
      return {
        success: res.status === 200,
        data: new Buffer(res.data, 'binary').toString('base64')
      };
    })
    .catch(errHandler);
};

/*
  post请求
*/
export const post = (url, params) => {
  const token = getLocalStorage('token');
  const urlStr = `${url}?access_token=${token}`;
  return postInstance.post(urlStr, qs.stringify(params)).catch(errHandler);
};

/*
  登录post请求
*/
export const authPost = (url, params) => {
  return postInstance.post(url, qs.stringify(params)).catch(errHandler);
};
/*
  请求头为application/json的post请求
*/
export const jsonPost = (url, params) => {
  const token = getLocalStorage('token');
  const urlStr = `${url}?access_token=${token}`;
  return postInstance.post(urlStr, JSON.stringify(params)).catch(errHandler);
};
/**
 * 蚂蚁存证服务接口
 */
export const saveEvidence = (url, params) => {
  const token = getLocalStorage('token');
  const publicKey = getLocalStorage(KEY_PAIR_LOCAL_STORAGE.PUBLIC_KEY);
  const urlStr = `http://192.168.1.161:8080/app/test/post?access_token=${token}`;
  const { signData } = params;
  signData.publicKey = publicKey;
  params = {
    ...params,
    signData
  };
  console.log(params);
  return JSONInstance.post(urlStr, JSON.stringify(params)).catch(errHandler);
};
/**
 * 给所需要的数据签名
 * @param msg 需要签名的数据
 */
export const signData = msg => {
  const privateKey = getLocalStorage(KEY_PAIR_LOCAL_STORAGE.PRIVATE_KEY);
  const publicKey = getLocalStorage(KEY_PAIR_LOCAL_STORAGE.PUBLIC_KEY);
  const url = `https://api.thundersdata.com/grpc/blockchain/crypt-service/sm2/Sign`;
  return JSONInstance.post(
    url,
    JSON.stringify({
      privateKey,
      publicKey,
      msg
    })
  ).catch(errHandler);
};
