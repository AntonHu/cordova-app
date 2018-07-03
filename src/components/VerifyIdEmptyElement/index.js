import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 实名认证的Picture的emptyElement
 */
class Comp extends React.PureComponent {
  static propTypes = {
    size: PropTypes.number,
    text: PropTypes.string
  };

  static defaultProps = {
    size: 120,
    text: '文字'
  };

  render() {
    const {text, size} = this.props;
    return (
      <div className={'verify-id-empty-element'} style={{width: `${size}px`, height: `${size}px`}}>
        <i className="iconfont">&#xe872;</i>
        <div className={'text'}>{text}</div>
      </div>
    )
  }
}

export default Comp;
