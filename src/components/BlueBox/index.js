import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

const classNames = {
  bluePic: 'blue-pic',
  greyPic: 'grey-pic',
  pure: 'pure'
};

/**
 * 蓝色背景的容器
 * 可以选纯色或图片
 * 可以选蓝色或灰色图片
 */
class Comp extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['pic', 'pure']),// 背景是"图片"或"纯色"
    picType: PropTypes.oneOf(['blue', 'grey']),// 图片是"蓝色"或"灰色"
    pureColor: PropTypes.string
  };

  static defaultProps = {
    type: 'pic',
    picType: 'blue',
    pureColor: '#0082f6'
  };

  getClassName = () => {
    const { type, picType } = this.props;

    if (type === 'pic' && picType === 'blue') {
      return classNames.bluePic;
    }
    if (type === 'pic' && picType === 'grey') {
      return classNames.greyPic;
    }
    if (type === 'pure') {
      return classNames.pure
    }
    return '';
  };

  getStyle = () => {
    const { type, pureColor } = this.props;
    if (type === 'pure') {
      return {
        backgroundColor: pureColor
      }
    }
    return {};
  };

  render() {
    const className = this.getClassName();
    const style = this.getStyle();
    return (
      <div className={`blue-box ${className}`} style={style}>
        {this.props.children}
      </div>
    )
  }
}

export default Comp;
