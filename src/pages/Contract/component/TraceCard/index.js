import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

// 组件溯源卡片，可以传入icon、title、children可以传入TraceItem
class TraceCard extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const { icon, title } = this.props;
    return (
      <div className="trace-card">
        <i className="iconfont trace-card-icon">{ icon }</i>
        <div className="trace-card-title">{ title }</div>
        <div className="_trace-box">
          {
            /* 两列布局 */
            this.props.children && this.props.children.length ?
              this.props.children.map((c, idx) => {
                if (idx % 2 === 1) return null;
                return (
                  <div className="_trace-row">
                    { this.props.children[idx] }
                    { this.props.children[idx + 1] || null }
                  </div>
                );

              })
              : this.props.children
          }
        </div>

      </div>
    )
  }
}

TraceCard.Item = (props) =>
  <div className="_trace-item">{ props.children }</div>;

export default TraceCard;
