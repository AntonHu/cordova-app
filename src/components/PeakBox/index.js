import React from 'react';
import PropTypes from 'prop-types';

/**
 * 冒尖的容器
 * 可选是否冒尖
 */
class Comp extends React.PureComponent {
  static propTypes = {
    showPeak: PropTypes.bool
  };

  static defaultProps = {

  };

  render() {
    return (
      <div className={'peak-box'}>
        {this.props.children}
      </div>
    )
  }
}

export default Comp;
