import React from 'react';
import { Button } from 'antd-mobile';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 常用的绿色按钮
 */
class Comp extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['big', 'medium', 'small'])
  };

  static defaultProps = {
    size: 'medium'
  };

  render() {
    const { onClick, size } = this.props;
    return (
      <Button className={`green-button ${size}`} onClick={onClick}>
        {this.props.children}
      </Button>
    )
  }
}

export default Comp;
