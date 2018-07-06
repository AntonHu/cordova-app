import React from 'react';
import PropTypes from 'prop-types';
import {px} from '../../utils/getDevice';
import {Icon} from 'antd-mobile';

/**
 * 一个图片组件，主要用来做头像。
 * 主要功能是设置size，以及src为空的时候显示替代内容。
 */
class Comp extends React.PureComponent {
  static propTypes = {
    // 方的还是圆的
    circle: PropTypes.bool,
    // 尺寸
    size: PropTypes.number,
    // img的src
    src: PropTypes.string.isRequired,
    // 当src为空串的时候，显示的元素
    emptyElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    // 是否显示空元素
    showEmptyElement: PropTypes.bool,
    // img的alt
    alt: PropTypes.string
  };

  static defaultProps = {
    circle: true,
    size: 60,
    src: '',
    emptyElement: (props) => (
      <i className={`iconfont ${props.className}`} style={{...props.style, fontSize: px(props.size) + 'px'}}>
        &#xe620;
      </i>
    ),
    showEmptyElement: true,
    alt: '无图'
  };

  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        src: nextProps.src
      })
    }
  }

  calculateStyle = () => {
    const { circle, size} = this.props;
    const style = {};
    style.display = 'block';
    style.width = px(size) + 'px';
    style.height = px(size) + 'px';
    if (circle) {
      style.borderRadius = px(size / 2) + 'px'
    }
    return style;
  };

  renderEmptyElement = () => {
    const { emptyElement, size} = this.props;
    const EmptyElement = emptyElement;
    const style = this.calculateStyle();

    return (
      <EmptyElement style={style} className={'picture-empty-element'} size={size}>
        {this.props.children}
      </EmptyElement>
    )
  };

  /**
   * 图片错误的时候，设置src为空，这样会显示emptyElement
   */
  onError = () => {
    this.setState({
      src: ''
    })
  };

  renderImg = () => {
    const { alt } = this.props;
    const style = this.calculateStyle();

    return <img src={this.state.src} alt={alt} className={'picture'} style={style} onError={this.onError}>
      {this.props.children}
    </img>
  };

  render() {
    const { showEmptyElement } = this.props;

    if (this.state.src === '' && showEmptyElement) {
      return this.renderEmptyElement();
    }
    return this.renderImg();
  }

}

export default Comp;
