import React from 'react';
import { Icon, Tabs, WhiteSpace, Button, Stepper, Toast } from 'antd-mobile';
import PropTypes from 'prop-types';
import Validator from '../../../../utils/validator';
import './index.less';

/**
 * 电站转让的item
 */
class BottomSheet extends React.PureComponent {
  state = {
    Height: 0, //设置遮盖整个屏幕
    Width: 0, //设置遮盖整个屏幕
    count: 3, //测试的默认份数
    isAgreen: false //默认是否同意文件
  };
  static defaultProps = {
    isShow: false,
    onClose: this._close,
    onShow: this._show,
    perCountMoney: 2000,
    onConfirm: () => {} //点击了确认按钮购买
  };

  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onShow: PropTypes.func,
    perCountMoney: PropTypes.number,
    onConfirm: PropTypes.func
  };
  /**
   * 测试底部弹出
   */
  _show = e => {
    const { onShow } = this.props;
    onShow ? onShow() : void 0;
    const Height = document.body.clientHeight;
    const Width = document.body.clientWidth;
    this.setState({
      Height,
      Width
    });
  };
  /**
   * 关闭底部
   */
  _close = e => {
    e.stopPropagation(); //除了点击内容，点击整个背景可以关闭遮盖
    const { onClose } = this.props;
    if (onClose) {
      onClose();
      this.setState({
        Height: 0,
        Width: 0
      });
    }
  };
  /**
   * 选择份数发生变化
   */
  onChange = count => {
    this.setState({
      count
    });
  };
  /**
   * 确认按钮
   * 已同意文件已读，并且购买份数大于0
   * 不合法则无法申购
   */
  _onConfirm = e => {
    const { count, isAgreen } = this.state;
    const { onConfirm, perCountMoney } = this.props;
    const { errorMsg, formData } = this.validatorFunc(); //开始校验申购的数据
    if (errorMsg) {
      Toast.fail(errorMsg);
      console.log(formData);
      return;
    }
    const resultJson = {
      totalPay: count * perCountMoney
    };
    if (onConfirm) {
      onConfirm(e, resultJson);
    }
  };
  /**
   * 用来校验输入值是否合法
   */
  validatorFunc = () => {
    const { count, isAgreen } = this.state;
    //此变量用来配置校验规则
    const strategies = {
      isNonEmpty(value, errorMsg) {
        return value === '' ? errorMsg : void 0;
      },
      minLength(value, length, errorMsg) {
        return value.length < length ? errorMsg : void 0;
      },
      isTrue(value, errorMsg) {
        return !value ? errorMsg : void 0;
      }
    };
    let validator = new Validator(strategies); //生成校验实例并且配置了该实例所需的校验规则
    validator.add(isAgreen, [
      {
        strategy: 'isTrue',
        errorMsg: '请先同意以下文件再申购'
      }
    ]);
    validator.add(count, [
      {
        strategy: 'isTrue',
        errorMsg: '申购份数必须大于0'
      }
    ]);
    let errorMsg = validator.start();
    return {
      errorMsg,
      formData: {
        isAgreen,
        count
      }
    };
  };
  /**
   * 同意文件
   */
  _onAgree = e => {
    this.setState({
      isAgreen: !this.state.isAgreen
    });
  };
  render() {
    const { Height, Width, count, isAgreen } = this.state;
    const { isShow, perCountMoney } = this.props;
    //显示调用内部的onshow
    isShow ? this._show() : void 0;
    return (
      <div
        className="bottom-action"
        onClick={this._close}
        style={{
          width: Width,
          height: Height,
          display: isShow ? 'block' : 'none'
        }}
      >
        <div className="sheet-content" onClick={e => e.stopPropagation()}>
          <div className="total-money-container">
            <p className="money-row">
              <span className="total-money">{count * perCountMoney} 元</span>
              <span onClick={this._close}>
                <Icon type={'cross'} color="#888888" />
              </span>
            </p>
            <p className="money-row-two">
              转让标准
              {perCountMoney}
              元每份
            </p>
          </div>
          <div className="stepper-container">
            <div className="stepper-left">
              <span>转让份数</span>
            </div>
            <div className="stepper-right">
              <Stepper
                style={{ width: '100%', minWidth: '100px' }}
                showNumber
                max={10}
                min={0}
                value={count}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="has-agree" onClick={this._onAgree}>
            <i className={isAgreen ? `agree-document iconfont` : 'iconfont'}>
              &#xe61d;
            </i>
            <span className="agree-document-font">
              是否同意
              <span className="agree-document">《XXXX》</span>
            </span>
          </div>
          <div>
            <Button className="buy-btn" onClick={this._onConfirm}>
              确认
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default BottomSheet;
