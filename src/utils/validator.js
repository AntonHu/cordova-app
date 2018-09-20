import { type } from './validate';
/**
 * 策略模式校验输入的各种值是否合法
 * 可配置校验规则
 */
class Validator {
  constructor(strategies) {
    this.cache = []; //保存校验规则
    this.strategies = strategies; //每个实例自身需要的校验规则
  }
  add(value, rules) {
    for (let rule of rules) {
      let strategyAry = rule.strategy.split(':'); //例如['minLength:6',6]
      let errorMsg = rule.errorMsg; //存储校验失败错误信息，例如'用户名不能为空'
      this.cache.push(() => {
        let strategy = strategyAry.shift(); //用户挑选的strategy校验规则
        strategyAry.unshift(value); //把value添加进参数列表
        strategyAry.push(errorMsg); //把errorMsg添加进参数列表[value,errorMsg]
        if (type(this.strategies[strategy]) === 'function') {
          return this.strategies[strategy].apply(value, strategyAry);
        } else {
          return (() => {
            console.error(
              `strategy must be function, but got ${type(
                this.strategies[strategy]
              )},please check your strategy.`
            );
          }).apply(value, strategyAry);
        }
      });
    }
  }
  start() {
    for (let validatorFunc of this.cache) {
      let errorMsg = validatorFunc(); //开始校验，并取得校验后的返回信息
      if (errorMsg) {
        //如果有确切返回值，说明校验没有通过
        return errorMsg;
      }
    }
  }
}

export default Validator;
