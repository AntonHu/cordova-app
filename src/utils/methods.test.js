import {
  testCode,
  clearSpace,
  testPassword,
  testPhoneNumber,
  maskIfPhone,
  testContractorCode,
  formatPhoneWithSpace,
  sliceLongString,
  testInvitationCode
} from './methods';

test('去掉字符串里的空格', () => {
  expect(clearSpace('   123 456 789  ')).toBe('123456789');
  expect(clearSpace('123456789')).toBe('123456789');
  expect(clearSpace('')).toBe('');
});

test('检验是否合法手机号', () => {
  expect(testPhoneNumber(undefined)).toBe(false);
  expect(testPhoneNumber('')).toBe(false);
  expect(testPhoneNumber('15201458525')).toBe(true);
  expect(testPhoneNumber('12345678912')).toBe(false);
});

test('手机号中间加空格', () => {
  expect(formatPhoneWithSpace(undefined)).toBe('');
  expect(formatPhoneWithSpace({})).toBe('');
  expect(formatPhoneWithSpace('')).toBe('');
  expect(formatPhoneWithSpace('15201458525')).toBe('152 0145 8525');
  expect(formatPhoneWithSpace('152 0145 8525')).toBe('152 0145 8525');
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
  expect(testPassword('')).toBe(false);// 空串
  expect(testPassword('12345')).toBe(false);// 少于6位
  expect(testPassword('1234567890ABCdefg')).toBe(false);// 多于16位
  expect(testPassword(' abc123 ')).toBe(false);// 有空格

  expect(testPassword('1234567')).toBe(true);
  expect(testPassword('asd123')).toBe(true);
  expect(testPassword('__asd123__')).toBe(true);

});

test('如果是手机号，用星号代替中间四位', () => {
  expect(maskIfPhone('test')).toBe('test');
  expect(maskIfPhone('13344556677')).toBe('133****6677');
  expect(maskIfPhone('133****6677')).toBe('133****6677');
  expect(maskIfPhone('1334***6677')).toBe('1334***6677');

});

test('检查是否合法代理商码', () => {
  expect(testContractorCode('')).toBe(false);
  expect(testContractorCode('13344556677')).toBe(true);
  expect(testContractorCode('aabbccDD13344556677')).toBe(true);
  expect(testContractorCode('133****6677')).toBe(false);
  expect(testContractorCode('abcdefghijklmnopqrstu')).toBe(false);
});

test('截取超过长度的字符串', () => {
  // 全角 异常情况
  expect(sliceLongString('')).toBe('');
  expect(sliceLongString(undefined)).toBe('');
  expect(sliceLongString({})).toBe('');
  expect(sliceLongString([])).toBe('');
  expect(sliceLongString(null)).toBe('');
  // 半角 异常情况
  expect(sliceLongString('', 5, false)).toBe('');
  expect(sliceLongString(undefined, 5, false)).toBe('');
  expect(sliceLongString({}, 5, false)).toBe('');
  expect(sliceLongString([], 5, false)).toBe('');
  expect(sliceLongString(null, 5, false)).toBe('');

  // 全角 默认5位
  expect(sliceLongString('abcd')).toBe('abcd');
  expect(sliceLongString('abcdefg')).toBe('abcde');
  // 半角 默认5位
  expect(sliceLongString('abcd', 5, false)).toBe('abcd');
  expect(sliceLongString('abcdefg', 5, false)).toBe('abcde');

  // 全角情况
  expect(sliceLongString('全角情况四舍五入')).toBe('全角情');
  expect(sliceLongString('123全角情况')).toBe('123全');
  expect(sliceLongString('1234全角情况')).toBe('1234全');

  // 半角情况
  expect(sliceLongString('全角情况四舍五入', 5, false)).toBe('全角情况四');
  expect(sliceLongString('123全角情况', 5, false)).toBe('123全角');
  expect(sliceLongString('1234全角情况')).toBe('1234全');


  // 全角 length
  expect(sliceLongString('全角情况四舍五入', 9)).toBe('全角情况四');
  expect(sliceLongString('123全角情况四舍五入', 9)).toBe('123全角情');
  expect(sliceLongString('1234全角情况四舍五入', 9)).toBe('1234全角情');

  // 半角 length
  expect(sliceLongString('全角情况四舍五入', 9, false)).toBe('全角情况四舍五入');
  expect(sliceLongString('123全角情况四舍五入', 9, false)).toBe('123全角情况四舍');
  expect(sliceLongString('1234全角情况四舍五入', 9, false)).toBe('1234全角情况四');
});

test('校验邀请码', () => {
  expect(testInvitationCode('123456')).toBe(true);
  expect(testInvitationCode('abc456')).toBe(true);
  expect(testInvitationCode('abC456')).toBe(true);

  expect(testInvitationCode('12345')).toBe(false);
  expect(testInvitationCode('1234567')).toBe(false);
});
