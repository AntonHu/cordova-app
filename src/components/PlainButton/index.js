import React from 'react';
import { Button } from 'antd-mobile';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 常用的绿色按钮
 */
class Comp extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func
  };

  render() {
    const { onClick } = this.props;
    return (
      <Button className={`plain-button big`} onClick={onClick}>
        {this.props.children}
      </Button>
    );
  }
}

export default Comp;
