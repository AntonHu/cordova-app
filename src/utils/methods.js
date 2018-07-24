import { JSRsasign } from '../jssign';
import SM2Cipher from '../jssign/SM2Cipher';
import { getLocalStorage } from './storage';
const BigInteger = JSRsasign.BigInteger;

/**
 * 去掉字符串里的空格
 * @param string
 * @returns {string}
 */
export const clearSpace = string => {
  if (typeof string === 'string') {
    return string.replace(/\s+/g, '');
  }
  return string.toString();
};

/**
 * 检验是否合法手机号
 */
export const testPhoneNumber = value => {
  const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
  return reg.test(value);
};

/**
 * 检查是否合法短信验证码
 * @param code
 */
export const testCode = code => {
  const reg = /^\d{6}$/;
  return reg.test(code);
};

/**
 * 检查是否合法密码，长度6-16，大小写数字及_
 * @param password
 * @returns {boolean}
 */
export const testPassword = password => {
  const reg = /^[a-zA-Z0-9_]{6,16}$/;
  return reg.test(password);
};

/**
 * 检查是否合法代理商码
 * @param code
 * @returns {boolean}
 */
export const testContractorCode = code => {
  const reg = /^[a-zA-Z0-9]{1,20}$/;
  return reg.test(code);
};

/**
 * 如果是手机号，用星号代替中间四位
 * @param string
 * @returns {*}
 */
export const maskIfPhone = string => {
  if (testPhoneNumber(string)) {
    return string.slice(0, 3) + '****' + string.slice(7);
  }
  return string;
};

/**
 * 手机号中间加空格
 * @param phone
 * @returns '13811112222' => '138 1111 2222'
 */
export const formatPhoneWithSpace = phone => {
  if (!phone || !phone.length) return '';
  if (phone.length !== 11) {
    return phone;
  }
  return phone.slice(0, 3) + ' ' + phone.slice(3, 7) + ' ' + phone.slice(7);
};

/**
 * 截取超过长度的字符串
 * @param str          字符串
 * @param lengthLimit  长度限制
 * @param fullAndHalf  区分全角半角。true 区分 false 不区分
 * @returns {*}
 */
export const sliceLongString = (str, lengthLimit = 5, fullAndHalf = true) => {
  let result = '';
  if (typeof str !== 'string') {
    return result;
  }
  if (str === '') {
    return result;
  }
  if (fullAndHalf) {
    let len = 0;
    const strArray = str.split('');
    while (len < lengthLimit) {
      const char = strArray.shift();
      if (char === undefined) {
        break;
      }
      if (/[\u0000-\u00ff]/.test(char)) {
        len += 1;
      } else {
        len += 2;
      }
      result += char;
    }
  } else {
    if (str.length) {
      result = str.substr(0, lengthLimit);
    }
  }
  return result;
};

/**
 * 相当于window.resolveLocalFileSystemURL(uri, onSuccess, onFail)
 * 返回fileEntry
 * @param fileURL
 * @returns {Promise}
 */
export const getFileEntryFromURL = fileURL => {
  return new Promise((resolve, reject) => {
    if (window.resolveLocalFileSystemURL) {
      window.resolveLocalFileSystemURL(
        fileURL,
        function(fileEntry) {
          resolve(fileEntry);
        },
        function(err) {
          reject(err);
        }
      );
    } else {
      reject('there is no window.resolveLocalFileSystemURL');
    }
  });
};

/**
 * 相当于fileEntry.file(onSuccess, onFail)
 * 返回file
 * @param fileEntry
 * @returns {Promise}
 */
export const getFileFromFileEntry = fileEntry => {
  return new Promise((resolve, reject) => {
    fileEntry.file(
      function(file) {
        resolve(file);
      },
      function(err) {
        reject(err);
      }
    );
  });
};

/**
 * 调用FileReader返回result
 * @param file
 * @returns {Promise}
 */
export const readFileAsBuffer = file => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = function(e) {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 把readFileAsBuffer的返回值转成blob
 * @param result
 * @returns {*}
 */
export const turnJpegIntoBlob = result => {
  return new Blob([result], { type: 'image/jpeg' });
};

/**
 * cordova文件操作相关
 */
export const FileMethods = {
  getFileEntryFromURL,
  getFileFromFileEntry,
  readFileAsBuffer,
  turnJpegIntoBlob
};

let cipherMode = '1'; // C1C3C2
const cipher = new SM2Cipher(cipherMode);

/**
 * JS版的解密
 * @param privateKey
 * @param cipherMsg
 * @returns {*}
 */
export const decrypt = (privateKey, cipherMsg) => {
  if (privateKey === '') {
    return '';
  }
  const privBI = new BigInteger(privateKey, 16);

  const decryptedMsg = cipher.Decrypt(privBI, cipherMsg);
  return decryptedMsg;
};

/**
 * 处理解密后的异常原始数据
 * @param strData
 * @returns {*}
 */
export const handleAbnormalData = strData => {
  let handleStrData = strData;
  if (strData.indexOf('#') > 0) {
    handleStrData = strData.replace(/#/g, '"');
  } else if (strData.indexOf('/') > 0) {
    handleStrData = strData.replace(/\//g, '.');
  }
  handleStrData = JSON.parse(handleStrData);
  return handleStrData;
};

/**
 * 检测数据是否过期
 * @param hours Number 默认为 1
 * @param type String
 * @returns {boolean}
 */
export const isExpire = (hours, type) => {
  hours = isNaN(Number(hours)) ? 1 : Number(hours);
  if (!getLocalStorage(type)) {
    return false;
  }
  return new Date().getTime() - getLocalStorage(type) > hours * 60 * 60 * 1000;
};
