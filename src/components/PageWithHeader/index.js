import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

/**
 * 带有Header的页面
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element
  };

  render() {
    const { title, rightComponent, leftComponent } = this.props;
    return (
      <div className={'page-with-header'}>
        <Header
          title={title}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Comp;
