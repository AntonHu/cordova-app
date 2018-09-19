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
      <div className="h-amount">{ props.amount === undefined ? '' : props.amount + '元' }</div>
    </div>
  )
};

// TODO：电站建设组件
class StationBuildProgress extends React.PureComponent {

  render() {
    return (
      <div className="station-build-progress">
        <div className="panel">
          <div className="panel-name">原材料</div>

          <div className="detail-wrap">
            <Accordion className="my-accordion">
              <Accordion.Panel
                header={ <AccordionHeader name={ '已购买组件' } time={ '2018-05-12 12:88' } amount={ 1000 }/> }>
                some thig
              </Accordion.Panel>
            </Accordion>
          </div>
          <div className="detail-wrap">
            <Accordion className="my-accordion">
              <Accordion.Panel
                header={ <AccordionHeader name={ '已购买组件' } time={ '2018-05-12 12:88' } amount={ 1000 }/> }>
                some thig
              </Accordion.Panel>
            </Accordion>
          </div>

        </div>
        <div className="panel">
          <div className="panel-name">电站建设</div>

          <div className="detail-wrap">
            <Accordion className="my-accordion">
              <Accordion.Panel
                header={ <AccordionHeader name={ '现场施工图' } time={ '2018-05-12 12:88' } /> }>
                some thig
              </Accordion.Panel>
            </Accordion>
          </div>
          <div className="detail-wrap">
            <Accordion className="my-accordion">
              <Accordion.Panel
                header={ <AccordionHeader name={ '电站安装图' } time={ '2018-05-12 12:88' } /> }>
                some thig
              </Accordion.Panel>
            </Accordion>
          </div>

        </div>
        <div className="panel">
          <div className="panel-name">并网备案文件</div>

          <div className="detail-wrap">
            <Accordion className="my-accordion">
              <Accordion.Panel
                header={ <AccordionHeader name={ '并网备案文件' } time={ '2018-05-12 12:88' } /> }>
                some thig
              </Accordion.Panel>
            </Accordion>
          </div>

        </div>


      </div>
    )
  }
}


export default StationBuildProgress;
