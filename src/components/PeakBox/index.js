import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import { getDeviceWidth, UI_PAGE_WIDTH } from '../../utils/getDevice';

/**
 * 冒尖的容器
 * 可选是否冒尖
 */
class Comp extends React.PureComponent {
  static propTypes = {
    showPeak: PropTypes.bool,
    top: PropTypes.number
  };

  static defaultProps = {
    showPeak: false,
    top: 400
  };

  render() {
    const { showPeak, top } = this.props;
    return (
      <div
        className={`peak-box ${showPeak ? 'show-peak' : ''}`}
        style={{
          top: (top * getDeviceWidth() / UI_PAGE_WIDTH) + 'px'
        }}
      >
        <div className="white-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Comp;
