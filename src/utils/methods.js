/**
 * 去掉字符串里的空格
 * @param string
 * @returns {string}
 */
export const clearSpace = string => {
  if (typeof string === 'string') {
    return string.replace(/\s+/g, '')
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
 * 如果是手机号，用星号代替中间四位
 * @param string
 * @returns {*}
 */
export const maskIfPhone = string => {
  if (testPhoneNumber(string)) {
    return string.slice(0, 3) + '****' + string.slice(7)
  }
  return string;
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
      window.resolveLocalFileSystemURL(fileURL, function (fileEntry) {
        resolve(fileEntry);
      }, function (err) {
        reject(err)
      })
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
export const getFileFromFileEntry = (fileEntry) => {
  return new Promise((resolve, reject) => {
    fileEntry.file(function (file) {
      resolve(file)
    }, function (err) {
      reject(err)
    })
  })
};

/**
 * 调用FileReader返回result
 * @param file
 * @returns {Promise}
 */
export const readFileAsBuffer = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file)
    } catch (err) {
      reject(err)
    }
  })
};

/**
 * 把readFileAsBuffer的返回值转成blob
 * @param result
 * @returns {*}
 */
export const turnJpegIntoBlob = (result) => {
  return new Blob([result], {type: 'image/jpeg'});
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
