import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import {px} from '../../utils/getDevice'
import './style.less';

const BODY_ID = 'body_of_pageWithHeader';

/**
 * 带有Header的页面
 */
class PageWithHeader extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element,
    headerMarginBottom: PropTypes.number,
    id: PropTypes.string.isRequired,
    footer: PropTypes.element,
  };

  static defaultProps = {
    headerMarginBottom: 20,
    id: '',
    footer: null
  };

  render() {
    const { title, rightComponent, leftComponent, headerMarginBottom, id, footer } = this.props;
    const containerProps = {};
    if (id) {
      containerProps.id = id
    }
    return (
      <div className={`page-with-header`} {...containerProps}>
        <Header
          title={title}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
        />
        <div style={{ height: `${px(headerMarginBottom)}px` }} />
        <div id={BODY_ID}>
          {this.props.children}
        </div>
        <div className="page-with-header-footer">
          {footer}
        </div>
      </div>
    );
  }
}

PageWithHeader.bodyId = BODY_ID;

export default PageWithHeader;
