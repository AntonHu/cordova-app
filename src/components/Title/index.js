import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

/**
 * 标题组件
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string
  };

  static defaultProps = {
    title: '标题'
  };

  render() {
    const { title } = this.props;

    return <div className="common-title">{title}</div>;
  }
}

export default Comp;
