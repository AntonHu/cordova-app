import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import {px} from '../../utils/getDevice'

/**
 * 带有Header的页面
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element,
    headerMarginBottom: PropTypes.number
  };

  static defaultProps = {
    headerMarginBottom: 20
  };

  render() {
    const { title, rightComponent, leftComponent, headerMarginBottom } = this.props;
    return (
      <div className={'page-with-header'}>
        <Header
          title={title}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
        />
        <div style={{ height: `${px(headerMarginBottom)}px` }} />
        {this.props.children}
      </div>
    );
  }
}

export default Comp;
