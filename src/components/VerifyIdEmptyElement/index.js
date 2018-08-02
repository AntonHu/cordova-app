import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 实名认证的Picture的emptyElement
 */
class Comp extends React.PureComponent {
  static propTypes = {
    size: PropTypes.number,
    text: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.string
  };

  static defaultProps = {
    size: 120,
    text: '文字',
    icon: '\ue872'
  };

  render() {
    const {text, size, style, icon} = this.props;
    return (
      <div className={'verify-id-empty-element'} style={style}>
        <i className="iconfont">{icon}</i>
        <div className={'text'}>{text}</div>
      </div>
    )
  }
}

export default Comp;
