import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 冒尖的容器
 * 可选是否冒尖
 */
class Comp extends React.PureComponent {
  static propTypes = {
    showPeak: PropTypes.bool
  };

  static defaultProps = {
    showPeak: true
  };

  render() {
    const { showPeak } = this.props;
    return (
      <div className={`peak-box ${showPeak ? 'show-peak' : ''}`}>
        {this.props.children}
      </div>
    )
  }
}

export default Comp;
