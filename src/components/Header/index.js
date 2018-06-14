import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd-mobile';
import './style.css';

/**
 * Header组件，包含后退按钮
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    leftComponent: PropTypes.element,
    rightComponent: PropTypes.element
  };

  static defaultProps = {
    title: '标题',
    leftComponent: <Button className={'header-back'}>
      <Icon type={'left'}/>
    </Button>,
    rightComponent: null
  };

  render() {
    const { title, leftComponent, rightComponent } = this.props;
    return (
      <div className={'block-chain-header'}>
        <div className={'left'}>{leftComponent}</div>
        <div className={'center'}>{title}</div>
        <div className={'right'}>{rightComponent}</div>
      </div>
    )
  }
}

export default Comp;
