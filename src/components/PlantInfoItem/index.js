import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class PlantInfoItem extends React.PureComponent {
  static propTypes = {
    plantName: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    plantName: '无',
    capacity: 0,
    icon: '\ue619',
    onClick: () => {}
  };

  render() {
    const { plantName, capacity, icon, onClick } = this.props;
    return (
      <div className="plant-info-item" onClick={onClick}>
        <div className="left">
          <i className="iconfont site-icon">{icon}</i>
          <div className="content">
            <div className="plant-name">
              电站名称：
              {plantName || '无'}
            </div>
            <div className="capacity">
              电站容量：
              {capacity || 0}
              kW
            </div>
          </div>
        </div>
        <div className="right">
          <i className="iconfont right-arrow">&#xe62e;</i>
        </div>
      </div>
    );
  }
}

export default PlantInfoItem;
