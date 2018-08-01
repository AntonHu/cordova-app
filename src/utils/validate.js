/**
 * 检验是否合法手机号
 */
export const testPhoneNumber = value => {
  const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57]|19[0-9])[0-9]{8}$/;
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
 * 检查是否合法邀请码
 * @param code
 * @returns {boolean}
 */
export const testInvitationCode = code => {
  const reg = /^[a-zA-Z0-9]{6}$/;
  return reg.test(code);
};

/**
 * 字符串是否是图片地址
 * @param str
 * @returns {boolean}
 */
export const isImage = (str) => {
  const reg = /\.(jpg|jpeg|png)$/gi;
  return reg.test(str);
};

/**
 * 字符串是否是url
 * @param str
 * @returns {boolean}
 */
export const isUrl = (str) => {
  const reg = /^(http|https):\/\//i;
  return reg.test(str);
};

/**
 * 字符串是否是HTML string
 * @param str
 */
export const isHtml = (str) => {
  const reg = /<(body|div|p|span)[^>]*>/i;
  return reg.test(str)
};

