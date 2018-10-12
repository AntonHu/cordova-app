import React from 'react';
import { Accordion, List, Button } from 'antd-mobile';
import { Picture } from '../../../../components';
import PropTypes from 'prop-types';
import './StationInfo.less';
import { toJS } from 'mobx';

const Item = List.Item;

// 电站信息组件
// 材料计划 展开
// 电站设计图 展开
// 房屋租赁协议 展开
class StationInfo extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired
  };

  isPdfFile = (url) => {
    if (!url) {
      return false;
    } else {
      return /\.pdf$/.test(url);
    }
  };

  viewPdf = (url) => {
    if (window.cordova) {
      const device = window.device;
      const target = device.platform === 'Android' ? '_system' : '_blank';
      window.cordova.InAppBrowser.open(url, target, 'location=no,closebuttoncaption=关闭,closebuttoncolor=#ffffff');
    } else {
      window.open(url, '_blank')
    }
  };

  render() {
    const { projectDetail, siteInfo } = this.props;
    const fileList = projectDetail.fileList || [];
    // const materialOverviewList = projectDetail.materialOverviewList || [];
    const houseRent =
      fileList.find(item => item.fileTypeName === '房屋租赁协议') || {};
    const stationDesign =
      fileList.find(item => item.fileTypeName === '电站设计图') || {};
    const gridConnectedFileList = siteInfo.gridConnectedFileList || [];
    const materialOverviewList = siteInfo.materialOverviewList || [];
    const constructionFileList = siteInfo.constructionFileList || [];

    return (
      <div className="_station-info">
        <List className="info-list">
          <Item extra={`${projectDetail.powerStationCapacity || 0}kW`}>
            电站容量
          </Item>

          <Item extra={`${projectDetail.address || '-'}`}>电站位置</Item>
          <Item extra={`${projectDetail.minInvestmentAmount || 0}元`}>
            最低购买金额
          </Item>
          <Item extra={`${projectDetail.estimatedAnnualizedIncome || 0}%`}>
            预期年化收益
          </Item>
          <Item extra={`${projectDetail.totalCostOfRawMaterials}元`}>
            原材料成本
          </Item>
          <Item extra={`${projectDetail.otherCosts}元`}>其他成本</Item>
          <Item extra={`${projectDetail.otherAccessoryCosts}元`}>
            其他配件成本
          </Item>
          <Accordion className="station-accordion">
            <Accordion.Panel header="原材料采购">
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
          <Item extra={`${projectDetail.installationCost}元`}>
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
              {
                this.isPdfFile(houseRent.ossPath)
                ?
                  <Button
                    onClick={() => this.viewPdf(houseRent.ossPath)}
                    className="view-pdf-btn"
                  >点击预览PDF</Button>
                  :
                  <div className="picture-empty-element">
                    非PDF文件，无法预览
                  </div>
              }
            </Accordion.Panel>
          </Accordion>
          <Accordion className="station-accordion">
            <Accordion.Panel header="电站建设文件">
              {constructionFileList.map(item => (
                <div className="file-with-name" key={item.id}>
                  <div className="file-name">{item.fileTypeName || ''}</div>
                  <Picture
                    src={item.ossPath || ''}
                    emptyElement={props => (
                      <div className={props.className}>
                        该文件非图片，无法预览
                      </div>
                    )}
                  />
                </div>
              ))}
            </Accordion.Panel>
          </Accordion>
          <Accordion className="station-accordion">
            <Accordion.Panel header="并网和备案文件">
              {gridConnectedFileList.map(item => (
                <div className="file-with-name" key={item.id}>
                  <div className="file-name">{item.fileTypeName || ''}</div>
                  {
                    this.isPdfFile(item.ossPath)
                      ?
                      <Button
                        onClick={() => this.viewPdf(item.ossPath)}
                        className="view-pdf-btn"
                      >点击预览PDF</Button>
                      :
                      <div className="picture-empty-element">
                        非PDF文件，无法预览
                      </div>
                  }
                </div>
              ))}
            </Accordion.Panel>
          </Accordion>
        </List>
      </div>
    );
  }
}

export default StationInfo;
