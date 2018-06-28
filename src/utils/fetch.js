import axios from 'axios';
import qs from 'qs';
import { getSessionStorage } from './storage';

// 临时的publicKey
const publicKey =
  '0439ad8cd4dd8be0a809f7808c9d07fcf0f85a71c079ad9fd265e43f5d5ba114251941c2908b2f42ba393421368ed4da585837cd4a303ffc0ee09a5427a6df2605';
/*
  请求头为application/json
*/
const JSONInstance = axios.create({
  timeout: 60000,
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
  timeout: 60000,
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

/*
  get请求，参数：params
*/
export const get = (url, params) => {
  // const token = getSessionStorage('token');
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?publicKey=${publicKey}&`;
    urlStr += qs.stringify(params);
  } else {
    urlStr += `?publicKey=${publicKey}`;
  }
  return JSONInstance.get(urlStr);
};

/*
  post请求
*/
export const post = (url, params) => {
  // const token = getSessionStorage('token');
  // const urlStr = `${url}?access_token=${token}`;
  const urlStr = `${url}?publicKey=${publicKey}`;
  return postInstance.post(urlStr, qs.stringify(params));
};

/*
  登录post请求
*/
export const authPost = (url, params) => {
  return postInstance.post(url, qs.stringify(params));
};
/*
  请求头为application/json的post请求
*/
export const jsonPost = (url, params) =>
  postInstance.post(url, JSON.stringify(params));
