import {
  clearSpace,
  maskIfPhone,
  formatPhoneWithSpace,
  sliceLongString,
} from './methods';

test('去掉字符串里的空格', () => {
  expect(clearSpace('   123 456 789  ')).toBe('123456789');
  expect(clearSpace('123456789')).toBe('123456789');
  expect(clearSpace('')).toBe('');
});


test('手机号中间加空格', () => {
  expect(formatPhoneWithSpace(undefined)).toBe('');
  expect(formatPhoneWithSpace({})).toBe('');
  expect(formatPhoneWithSpace('')).toBe('');
  expect(formatPhoneWithSpace('15201458525')).toBe('152 0145 8525');
  expect(formatPhoneWithSpace('152 0145 8525')).toBe('152 0145 8525');
});


test('如果是手机号，用星号代替中间四位', () => {
  expect(maskIfPhone('test')).toBe('test');
  expect(maskIfPhone('13344556677')).toBe('133****6677');
  expect(maskIfPhone('133****6677')).toBe('133****6677');
  expect(maskIfPhone('1334***6677')).toBe('1334***6677');

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

