import axios from 'axios';
import qs from 'qs';
import { getSessionStorage } from './storage';

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
  const token = getSessionStorage('token');
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?access_token=${token}&`;
    urlStr += qs.stringify(params);
  } else {
    urlStr += `?access_token=${token}`;
  }
  return JSONInstance.get(urlStr);
};

/*
  post请求
*/
export const post = (url, params) => {
  const token = getSessionStorage('token');
  const urlStr = `${url}?access_token=${token}`;
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
