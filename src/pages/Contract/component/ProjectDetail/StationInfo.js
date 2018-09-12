import React from 'react';
import { List } from 'antd-mobile';
import PropTypes from 'prop-types';

const Item = List.Item;

// 电站信息组件
// TODO: 缺 预期年化收益
class StationInfo extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {

    const { projectDetail } = this.props;

    return (
      <div className="station-info">
        <List className="info-list">
          <Item extra={ `${projectDetail.powerStationCapacity || 0}kW` }>电站容量</Item>
          <Item extra={ `成团后${projectDetail.estimatedPowerPlantConstructionCycle || '-'}天` }>电站建设预计周期</Item>
          <Item extra={ `${projectDetail.address}` }>电站位置</Item>
          <Item extra={ `${projectDetail.minInvestmentAmount || 0}元` }>最低购买金额</Item>
          <Item extra={ `${projectDetail.annulRate || 0}%` }>预期年化收益</Item>
          <Item extra={ `${projectDetail.totalCostOfRawMaterials}` }>原材料成本</Item>
          <Item arrow="horizontal">材料计划</Item>
          <Item extra={ `${projectDetail.installationCost}` }>安装成本</Item>
          <Item extra={ `${projectDetail.estimatedElectricityPrice}` }>预计上网电价</Item>
          <Item arrow="horizontal">电站设计图</Item>
          <Item arrow="horizontal">房屋租赁协议</Item>
          <Item arrow="horizontal">投资协议</Item>
        </List>
      </div>
    )
  }
}

export default StationInfo;
