import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import ProjectHeader from './ProjectHeader';
import ProjectIntro from './ProjectIntro';
import StationInfo from './StationInfo';
import OperatorInfo from './OperatorInfo';
import HistoryProject from './HistoryProject';
import PropTypes from 'prop-types';
import './index.less';

const tabs = [
  { title: '电站信息' },
  { title: '受托建造运营方信息' },
  { title: '历史项目' },
];

// 项目详情组件
// 详情页的必有组件：头部、项目简介、电站信息、受托建造运营方信息、历史项目
class ProjectDetail extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired,
    historyList: PropTypes.array.isRequired,
    purchaseDetail: PropTypes.object
  };

  render() {
    const { projectDetail, historyList, purchaseDetail } = this.props;
    return (
      <div className="project-detail">
        <ProjectHeader projectDetail={ projectDetail } purchaseDetail={purchaseDetail}/>
        <ProjectIntro projectDetail={ projectDetail }/>
        <div className="tabs-container">
          <Tabs tabs={ tabs } initialPage={ 0 }>
            <StationInfo projectDetail={ projectDetail }/>
            <OperatorInfo projectDetail={ projectDetail }/>
            <HistoryProject historyList={ historyList }/>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default ProjectDetail;
