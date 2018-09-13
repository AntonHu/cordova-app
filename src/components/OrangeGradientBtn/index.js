import React from 'react';
import { Button } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

// TODO：橙色渐变的Button，可以选渐变方向
class OrangeGradientBtn extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    gradientDirection: PropTypes.oneOf(['h', 's'])// h=横，s=竖
  };

  static defaultProps = {
    gradientDirection: 'h'
  };

  render() {
    const { onClick, gradientDirection } = this.props;
    return (
      <Button className={`orange-gradient-button ${gradientDirection}`} onClick={onClick}>
        {this.props.children}
      </Button>
    )
  }
}

export default OrangeGradientBtn;
