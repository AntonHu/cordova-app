import axios from 'axios';
import qs from 'qs';
import { getLocalStorage } from './storage';

export const TIME_OUT = 10000;
export const LONG_TIME_OUT = 15000;
/*
  请求头为application/json
*/
const JSONInstance = axios.create({
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
  if (err.message === `timeout of ${TIME_OUT}ms exceeded`) {
    throw {
      response: {
        data: {
          code: 0,
          msg: '请求超时'
        }
      }
    }
  }
  throw err
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
export const jsonPost = (url, params) =>
  postInstance.post(url, JSON.stringify(params)).catch(errHandler);
