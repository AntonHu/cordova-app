import React from 'react';
import PropTypes from 'prop-types';
import Picture from '../Picture';
import './style.less';

/**
 * Loading组件
 */
class Comp extends React.PureComponent {
  static propTypes = {
    // 尺寸
    size: PropTypes.number
  };

  render() {
    const { size } = this.props;
    return (
      <div className="loading-wrap">
        <Picture
          src={require('../../images/loading.gif')}
          size={size}
          showBorder={false}
        />
        <span>加载中……</span>
      </div>
    );
  }
}

export default Comp;
