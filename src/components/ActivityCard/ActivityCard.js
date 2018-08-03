import React from 'react';
import PropTypes from 'prop-types';
import './ActivityCard.less';

class ActivityCard extends React.PureComponent {
  static propTypes = {
    imageSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    info: PropTypes.element.isRequired,
    showArrow: PropTypes.bool
  };

  static defaultProps = {
    showArrow: true
  };

  render() {
    const {imageSrc, title, subTitle, info, showArrow} = this.props;
    return (
      <div className="activity-card">
        <img src={imageSrc} className="left-image" />
        <div className="content">
          <div className="title">{title}</div>
          <div className="subTitle">{subTitle}</div>
          <div className="info">{info}</div>
        </div>
        {
          showArrow &&
          <div className="right-arrow">
            <i className="iconfont">&#xe62e;</i>
          </div>
        }
      </div>
    )
  }
}

export default ActivityCard;
