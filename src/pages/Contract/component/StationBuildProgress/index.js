import React from 'react';
import { Accordion, Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import Picture from "../../../../components/Picture";

const AccordionHeader = (props) => {
  return (
    <div className="accordion-header">
      <div>
        <div className="h-name">{ props.name }</div>
        <div className="h-time">{ props.time }</div>
      </div>
      <div className="h-amount">{ props.amount === undefined ? '' : `单价：${props.amount}元` }</div>
    </div>
  )
};

// 电站建设组件
class StationBuildProgress extends React.PureComponent {
  static propTypes = {
    siteInfo: PropTypes.object.isRequired
  };

  static defaultProps = {
    siteInfo: {}
  };

  render() {
    const { siteInfo } = this.props;
    const materialOverviewList = siteInfo.materialOverviewList || [];
    const gridConnectedFileList = siteInfo.gridConnectedFileList || [];
    const constructionFileList = siteInfo.constructionFileList || [];

    return (
      <div className="station-build-progress">
        <div className="panel">
          <div className="panel-name">原材料</div>
          {
            materialOverviewList.length > 0
            ?
            materialOverviewList.map((item) => (
              <div className="detail-wrap" key={ item.id }>
                <Accordion className="my-accordion">
                  <Accordion.Panel
                    header={ <AccordionHeader name={ '已购买组件' } time={ item.purchaseTime } amount={ item.num * item.unitPrice }/> }>

                  </Accordion.Panel>
                </Accordion>
              </div>
            ))
              :
              <div className="detail-wrap" >
                <Accordion className="my-accordion">
                  <Accordion.Panel
                    header={ <AccordionHeader name={ '等待上传' } /> }>

                  </Accordion.Panel>
                </Accordion>
              </div>
          }
        </div>
        <div className="panel">
          <div className="panel-name">电站建设</div>
          {
            constructionFileList.length > 0
            ?
            constructionFileList.map((item) => (
              <div className="detail-wrap" key={ item.id }>
                <Accordion className="my-accordion">
                  <Accordion.Panel
                    header={ <AccordionHeader name={ item.fileTypeName } time={ item.uploadTime }/> }>
                    <Picture
                      src={item.ossPath}
                      emptyElement={(props) => <div className={props.className}>加载图片失败</div>}
                    />
                  </Accordion.Panel>
                </Accordion>
              </div>
            ))
              :
              <div className="detail-wrap" >
                <AccordionHeader name={ '等待上传...' } />
              </div>
          }

        </div>
        <div className="panel">
          <div className="panel-name">并网备案文件</div>

          {
            gridConnectedFileList.length > 0
            ?
              <div className="detail-wrap">
                <Accordion className="my-accordion">
                  <Accordion.Panel
                    header={ <AccordionHeader name={ '并网备案文件' } time={ '' }/> }>
                    {
                      gridConnectedFileList.map((item) => (
                        <Picture
                          src={item.ossPath}
                          emptyElement={(props) => <div className={props.className}>加载图片失败</div>}
                        />
                      ))
                    }
                  </Accordion.Panel>
                </Accordion>
              </div>
              :
              <div className="detail-wrap">
                <AccordionHeader name={ '等待上传...' } />
              </div>
          }

        </div>
      </div>
    )
  }
}


export default StationBuildProgress;
