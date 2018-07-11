import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd-mobile';
import GreenButton from '../GreenButton';
import './style.less';

/**
 * 弹窗组件
 */
class Comp extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: '标题',
    subTitle: '副标题',
    buttonText: '按钮文字',
    visible: false
  };

  render() {
    const {
      title,
      subTitle,
      onPress,
      buttonText,
      visible,
      onClose
    } = this.props;

    return (
      <Modal visible={visible} transparent className={'msg-popup'} maskClosable onClose={onClose}>
        <div className={'icon'}>
          <i className="iconfont">&#xe67d;</i>
        </div>
        <div className={'title'}>{title}</div>
        <div className={'subtitle'}>{subTitle}</div>
        <div className={'button'}>
          <GreenButton size={'small'} onClick={onPress}>
            {buttonText}
          </GreenButton>
        </div>
      </Modal>
    );
  }
}

export default Comp;
