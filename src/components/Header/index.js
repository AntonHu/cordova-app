import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd-mobile';
import './style.less';

/**
 * Header组件，包含后退按钮
 */
class Header extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element,
    transparent: PropTypes.bool,
    fixed: PropTypes.bool
  };

  static defaultProps = {
    title: '标题',
    leftComponent: (
      <Button className={'header-back'}>
        <Icon type={'left'} />
      </Button>
    ),
    rightComponent: null,
    transparent: false,
    fixed: false
  };

  render() {
    const { title, leftComponent, rightComponent, transparent, fixed } = this.props;
    return (
      <div className={`block-chain-header ${transparent ? 'transparent' : ''}`}>
        <div onClick={() => this.props.history.goBack()} className={'left'}>
          {leftComponent}
        </div>
        <div className={'center'}>{title}</div>
        <div className={'right'}>{rightComponent}</div>
      </div>
    );
  }
}

export default withRouter(Header);
