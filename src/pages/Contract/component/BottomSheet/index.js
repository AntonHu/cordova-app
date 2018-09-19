import React from 'react';
import { Icon, Tabs, WhiteSpace, Button, Stepper } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 电站转让的item
 */
class BottomSheet extends React.PureComponent {
  state = {
    Height: 0, //设置遮盖整个屏幕
    Width: 0, //设置遮盖整个屏幕
    val: 3 //测试的默认份数
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
  onChange = val => {
    this.setState({
      val
    });
  };
  /**
   * 确认按钮
   */
  _onConfirm = e => {
    const { onConfirm } = this.props;
    if (onConfirm) {
      onConfirm(e);
    }
  };
  render() {
    const { Height, Width } = this.state;
    const { isShow } = this.props;
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
              <span className="total-money">8000元</span>
              <span onClick={this._close}>
                <Icon type={'cross'} color="#888888" />
              </span>
            </p>
            <p className="money-row-two">转让标准2000元每份</p>
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
                min={1}
                value={this.state.val}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="has-agree">
            <span>是否同意《XXXX》</span>
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
