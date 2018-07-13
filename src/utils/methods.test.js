import {testCode, clearSpace, testPassword, testPhoneNumber, maskIfPhone, testContractorCode} from './methods';

test('去掉字符串里的空格', () => {
  expect(clearSpace('   123 456 789  ')).toBe('123456789');
  expect(clearSpace('')).toBe('');
});

test('检验是否合法手机号', () => {
  expect(testPhoneNumber('')).toBe(false);
  expect(testPhoneNumber('15201458525')).toBe(true);
  expect(testPhoneNumber('12345678912')).toBe(false);
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