import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import {px} from '../../utils/getDevice'
import './style.less';

/**
 * 带有Header的页面
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element,
    headerMarginBottom: PropTypes.number,
    fixed: PropTypes.bool
  };

  static defaultProps = {
    headerMarginBottom: 20,
    fixed: true
  };

  render() {
    const { title, rightComponent, leftComponent, headerMarginBottom, fixed, id } = this.props;
    return (
      <div className={`page-with-header ${fixed ? 'fixed' : ''}`} id={id}>
        <Header
          title={title}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
          fixed={fixed}
        />
        <div style={{ height: `${px(headerMarginBottom)}px` }} />
        {this.props.children}
      </div>
    );
  }
}

export default Comp;
