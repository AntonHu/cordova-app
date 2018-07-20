import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import './style.less';

class EquipmentItem extends React.PureComponent {
  static propTypes = {
    // 点击事件
    onClick: PropTypes.func.isRequired,
    // 功率
    currentPower: PropTypes.number,
    // 日电量
    dayElectric: PropTypes.number,
    // 设备名
    equipmentName: PropTypes.string
  };

  static defaultProps = {

  };

  render() {
    const {onClick, currentPower, dayElectric, equipmentName} = this.props;
    return (
      <div
        className="equipment-item"
        onClick={onClick}
      >
        <div className="item-pic">
          <i className="iconfont">&#xea35;</i>
        </div>
        <div className="item-detail">
          <div className="item-name">{equipmentName}</div>
          <div className="item-info">
            <span>
              {`功率：${currentPower}w`}
            </span>
            <span>
              {`日电量：${dayElectric}kwh`}
            </span>
          </div>
        </div>
        <Icon type="right"/>
      </div>
    )
  }
}

export default EquipmentItem;