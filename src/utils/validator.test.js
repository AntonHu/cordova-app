import Validator from './validator';

//测试用例，所有通过的校验都返回''
const strategies = {
  isNonEmpty(value, errorMsg) {
    return value === '' ? errorMsg : '';
  },
  minLength(value, length, errorMsg) {
    return value.length < length ? errorMsg : '';
  },
  isTrue(value, errorMsg) {
    return !value ? errorMsg : '';
  }
};

test('当没有传入strategies，但是传入了add', () => {
  const validator = new Validator();
  validator.add(true, [
    {
      strategy: 'isTrue',
      errorMsg: '请先同意以下文件再申购'
    }
  ]);
  //由于strategies是空，所以调用的strategy肯定不是一个function，此时运行start,
  //没有任何的校验方法，行为因与未配置校验规则保持一个返回''
  //去用一个不存在的方法去校验永远无法得到预期的结果
  expect(validator.start()).toBe('');
});

test('当没有传入strategies，也没有add任何strategy', () => {
  const validator = new Validator();
  validator.add(true, []);
  //只要没有配置校验规则都认为不校验，默认返回空字符表示通过
  expect(validator.start()).toBe('');
});

test('当传入strategies，但没有add任何strategy', () => {
  const validator = new Validator(strategies);
  validator.add(true, []);
  //只要没有配置校验规则都认为不校验，默认返回空字符表示通过
  expect(validator.start()).toBe('');
});

test('当传入strategies，也add了一些strategy', () => {
  const validator = new Validator(strategies);
  validator.add(true, [
    {
      strategy: 'isTrue',
      errorMsg: '这是一个假值'
    }
  ]);
  //正常调用，期待返回空字符''
  expect(validator.start()).toBe('');
  validator.add(false, [
    {
      strategy: 'isTrue',
      errorMsg: '这是一个假值'
    }
  ]);
  //正常调用，校验失败，期待返回第一个校验失败的errorMsg
  expect(validator.start()).toBe('这是一个假值');
});
