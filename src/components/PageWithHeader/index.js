import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';

/**
 * 带有Header的页面
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    const { title } = this.props;
    return (
      <div className={'page-with-header'}>
        <Header title={title}/>
        {
          this.props.children
        }
      </div>
    )
  }
}

export default Comp;
