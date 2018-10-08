import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

// 为什么不用antd-mobile的stepper？
// 因为那个stepper不是完全受控的
//
// min、max、value、onChange
class Stepper extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number
  };

  static defaultProps = {
    value: 0,
    onChange: () => {
    },
    min: NaN,
    max: NaN
  };

  // 如果max不为NaN且value大于max，使"加"disable
  addDisabled = () => this.props.value !== '' && !isNaN(this.props.max) && +this.props.value >= this.props.max;

  // 如果min不为NaN且value小于min，使"减"disable
  minusDisabled = () => this.props.value !== '' && !isNaN(this.props.min) && +this.props.value <= this.props.min;

  _onAddClick = () => {
    const value = +(this.props.value || '0');
    this.changeValue(value + 1);
  };

  _onMinusClick = () => {
    const value = +(this.props.value || '0');
    this.changeValue(value - 1);
  };

  _onChange = (e) => {
    this.changeValue(e.target.value);
  };

  changeValue = (input) => {
    const {
      onChange,
      min,
      max
    } = this.props;
    if (input !== '') {
      input = parseFloat(input);
      if (!isNaN(min) && input < min) {
        onChange(min);
        return;
      }
      if (!isNaN(max) && input > max) {
        onChange(max);
        return;
      }
    }

    if (typeof onChange === 'function') {
      onChange(input);
    }
  };

  render() {
    const {
      value
    } = this.props;
    return (
      <div className="_stepper">
        <button
          disabled={ this.minusDisabled() }
          className={`_stepper-btn minus-btn ${this.minusDisabled() ? 'disabled' : ''}`}
          onClick={ this._onMinusClick }
        >
          -
        </button>
        <input
          type="number"
          className="_stepper-input"
          value={ value }
          onChange={ this._onChange }
        />
        <button
          disabled={ this.addDisabled() }
          className={`_stepper-btn add-btn ${this.addDisabled() ? 'disabled' : ''}`}
          onClick={ this._onAddClick }
        >
          +
        </button>
      </div>
    );
  }
}

export default Stepper;
