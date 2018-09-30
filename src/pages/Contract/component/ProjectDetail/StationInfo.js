import React from 'react';
import { Accordion, List } from 'antd-mobile';
import { Picture } from '../../../../components';
import PropTypes from 'prop-types';
import './StationInfo.less';
import { toJS } from 'mobx';

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
    const { projectDetail, transferInfo } = this.props;
    const fileList = projectDetail.fileList || [];
    const materialOverviewList = projectDetail.materialOverviewList || [];
    const houseRent =
      fileList.find(item => item.fileTypeName === '房屋租赁协议') || {};
    const stationDesign =
      fileList.find(item => item.fileTypeName === '电站设计图') || {};
    console.log('转让的数据', toJS(transferInfo));

    return (
      <div className="_station-info">
        <List className="info-list">
          <Item extra={`${projectDetail.powerStationCapacity || 0}kW`}>
            电站容量
          </Item>
          <Item
            extra={`成团后${projectDetail.estimatedPowerPlantConstructionCycle ||
              '-'}天`}
          >
            电站建设预计周期
          </Item>
          <Item extra={`${projectDetail.address || '-'}`}>电站位置</Item>
          <Item extra={`${projectDetail.minInvestmentAmount || 0}元`}>
            最低购买金额
          </Item>
          <Item extra={`${projectDetail.estimatedAnnualizedIncome || 0}%`}>
            预期年化收益
          </Item>
          <Item extra={`${projectDetail.totalCostOfRawMaterials || '-'}元`}>
            原材料成本
          </Item>
          <Item extra={`${projectDetail.otherCosts || '-'}元`}>其他成本</Item>
          <Item extra={`${projectDetail.otherAccessoryCosts || '-'}元`}>
            其他配件成本
          </Item>
          {//电站信息分为普通电站和转让电站，转让电站又下面2个字段
          toJS(transferInfo) ? (
            <div>
              <Item extra={`${toJS(transferInfo).purchaseNumber || '-'}份`}>
                转让份数
              </Item>
              <Item extra={`${toJS(transferInfo).unitPrice || '-'}元`}>
                转让价格
              </Item>
            </div>
          ) : null}
          <Accordion className="station-accordion">
            <Accordion.Panel header="材料计划">
              {materialOverviewList.map(item => (
                <div className="material-item" key={item.id}>
                  <div className="material-name">
                    材料名称：
                    {item.materialTypeName || '无'}
                  </div>
                  <div className="material-row">
                    <div className="material-unit-price">
                      单价：
                      {item.unitPrice || 0}元
                    </div>
                    <div className="material-num">
                      计划采购数量：
                      {item.num}
                    </div>
                  </div>
                </div>
              ))}
            </Accordion.Panel>
          </Accordion>
          <Item extra={`${projectDetail.installationCost || '-'}元`}>
            安装成本
          </Item>
          <Item
            extra={`${projectDetail.estimatedElectricityPrice || '-'}元/kWh`}
          >
            预计上网电价
          </Item>
          <Accordion className="station-accordion">
            <Accordion.Panel header="电站设计图">
              <Picture
                src={stationDesign.ossPath || ''}
                emptyElement={props => (
                  <div className={props.className}>该文件非图片，无法预览</div>
                )}
              />
            </Accordion.Panel>
          </Accordion>
          <Accordion className="station-accordion">
            <Accordion.Panel header="房屋租赁协议">
              <Picture
                src={houseRent.ossPath || ''}
                emptyElement={props => (
                  <div className={props.className}>该文件非图片，无法预览</div>
                )}
              />
            </Accordion.Panel>
          </Accordion>
        </List>
      </div>
    );
  }
}

export default StationInfo;
