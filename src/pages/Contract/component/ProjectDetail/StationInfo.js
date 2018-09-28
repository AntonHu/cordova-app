import React from 'react';
import { Accordion, List } from 'antd-mobile';
import { Picture } from '../../../../components'
import PropTypes from 'prop-types';
import './StationInfo.less';

const Item = List.Item;

// 电站信息组件
// TODO: 材料计划 跳转
// TODO: 电站设计图 跳转
// TODO: 房屋租赁协议 展开
class StationInfo extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {

    const { projectDetail } = this.props;
    const fileList = projectDetail.fileList || [];
    const materialOverviewList = projectDetail.materialOverviewList || [];
    const houseRent = fileList.find(item => item.fileTypeName === '房屋租赁协议') || {};
    const stationDesign = fileList.find(item => item.fileTypeName === '电站设计图') || {};

    return (
      <div className="_station-info">
        <List className="info-list">
          <Item extra={ `${projectDetail.powerStationCapacity || 0}kW` }>电站容量</Item>
          <Item extra={ `成团后${projectDetail.estimatedPowerPlantConstructionCycle || '-'}天` }>电站建设预计周期</Item>
          <Item extra={ `${projectDetail.address || '-'}` }>电站位置</Item>
          <Item extra={ `${projectDetail.minInvestmentAmount || 0}元` }>最低购买金额</Item>
          <Item extra={ `${projectDetail.estimatedAnnualizedIncome || 0}%` }>预期年化收益</Item>
          <Item extra={ `${projectDetail.totalCostOfRawMaterials || '-'}` }>原材料成本</Item>
          <Accordion className="station-accordion">
            <Accordion.Panel header="材料计划">
              {
                materialOverviewList.map((item) => (
                  <div className="material-item" key={item.id}>
                    <div className="material-name">材料名称：{ item.materialTypeName || '无' }</div>
                    <div className="material-row">
                      <div className="material-unit-price">单价：{ item.unitPrice || 0 }元</div>
                      <div className="material-num">计划采购数量：{ item.num }</div>
                    </div>

                  </div>
                ))
              }
            </Accordion.Panel>
          </Accordion>
          <Item extra={ `${projectDetail.installationCost || '-'}` }>安装成本</Item>
          <Item extra={ `${projectDetail.estimatedElectricityPrice || '-'}` }>预计上网电价</Item>
          <Accordion className="station-accordion">
            <Accordion.Panel header="电站设计图">
              <Picture
                src={ stationDesign.ossPath || '' }
                emptyElement={
                  (props) => <div className={ props.className }>
                    该文件非图片，无法预览
                  </div>
                }
              />
            </Accordion.Panel>
          </Accordion>
          <Accordion className="station-accordion">
            <Accordion.Panel header="房屋租赁协议">
              <Picture
                src={ houseRent.ossPath || '' }
                emptyElement={
                  (props) => <div className={ props.className }>
                    该文件非图片，无法预览
                  </div>
                }
              />
            </Accordion.Panel>
          </Accordion>
        </List>
      </div>
    )
  }
}

export default StationInfo;
