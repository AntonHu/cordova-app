import {
  testCode,
  testPassword,
  testPhoneNumber,
  testContractorCode,
  testInvitationCode,
  isHtml,
  isImage,
  isUrl,
  type
} from './validate';

test('检验是否合法手机号', () => {
  expect(testPhoneNumber(undefined)).toBe(false);
  expect(testPhoneNumber('')).toBe(false);
  expect(testPhoneNumber('1520145852')).toBe(false);
  expect(testPhoneNumber('25201458525')).toBe(false);
  expect(testPhoneNumber('15201458525')).toBe(true);
  expect(testPhoneNumber('19975279179')).toBe(true);
  expect(testPhoneNumber('17557293511')).toBe(true);
  expect(testPhoneNumber('12345678912')).toBe(true);
});

test('检查是否合法短信验证码', () => {
  // 6位数字
  expect(testCode('')).toBe(false);
  expect(testCode('12345')).toBe(false);
  expect(testCode('1234567')).toBe(false);
  expect(testCode('asd123')).toBe(false);
  expect(testCode('123456')).toBe(true);
});

test('检查是否合法密码', () => {
  expect(testPassword('')).toBe(false); // 空串
  expect(testPassword('12345')).toBe(false); // 少于6位
  expect(testPassword('1234567890ABCdefg')).toBe(false); // 多于16位
  expect(testPassword(' abc123 ')).toBe(false); // 有空格

  expect(testPassword('1234567')).toBe(true);
  expect(testPassword('asd123')).toBe(true);
  expect(testPassword('__asd123__')).toBe(true);
});

test('检查是否合法代理商码', () => {
  expect(testContractorCode('')).toBe(false);
  expect(testContractorCode('13344556677')).toBe(true);
  expect(testContractorCode('aabbccDD13344556677')).toBe(true);
  expect(testContractorCode('133****6677')).toBe(false);
  expect(testContractorCode('abcdefghijklmnopqrstu')).toBe(false);
});

test('校验邀请码', () => {
  expect(testInvitationCode('123456')).toBe(true);
  expect(testInvitationCode('abc456')).toBe(true);
  expect(testInvitationCode('abC456')).toBe(true);

  expect(testInvitationCode('12345')).toBe(false);
  expect(testInvitationCode('1234567')).toBe(false);
});

test('字符串是否是图片地址', () => {
  expect(isImage('')).toBe(false);
  expect(isImage(undefined)).toBe(false);
  expect(isImage(null)).toBe(false);

  expect(isImage('123.png')).toBe(true);
  expect(isImage('abc.jpg')).toBe(true);
  expect(isImage('efg123.jpeg')).toBe(true);
  expect(isImage('https://avatar.csdn.net/2/C/1/1_ws_hgo.jpg')).toBe(true);
});

test('字符串是否是url', () => {
  expect(isUrl('')).toBe(false);
  expect(isUrl(undefined)).toBe(false);
  expect(isUrl(null)).toBe(false);
  expect(isUrl('httpthundersdata.com')).toBe(false);

  expect(isUrl('http://thundersdata.com')).toBe(true);
  expect(isUrl('https://thundersdata.com')).toBe(true);
  expect(isUrl('https://avatar.csdn.net/2/C/1/1_ws_hgo.jpg')).toBe(true);
});

test('字符串是否是html', () => {
  expect(isHtml('')).toBe(false);
  expect(isHtml(undefined)).toBe(false);
  expect(isHtml(null)).toBe(false);

  expect(isHtml('<body></body>')).toBe(true);
  expect(isHtml('<div></div>')).toBe(true);
  expect(isHtml('<p></p>')).toBe(true);

  expect(isHtml('<body style=""></body>')).toBe(true);
  expect(isHtml('<div style=""></div>')).toBe(true);
  expect(isHtml('<p style=""></p>')).toBe(true);
});

test('校验变量类型', () => {
  expect(type('123')).toBe('string');
  expect(type(123)).toBe('number');
  expect(type(true)).toBe('boolean');
  expect(type(null)).toBe('null');
  expect(type(undefined)).toBe('undefined');
  expect(type(new Object())).toBe('object');
  expect(type(new Function())).toBe('function');
  expect(type(new Array())).toBe('array');
  expect(type(new Date())).toBe('date');
  expect(type(new RegExp())).toBe('regexp');
});
