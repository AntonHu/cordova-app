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
 *
 * @param password
 * @returns {boolean}
 */
export const testPassword = password => {
  const reg = /^[a-zA-Z0-9_]{6,16}$/;
  return reg.test(password);
};
