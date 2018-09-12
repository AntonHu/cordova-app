import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
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

// TODO: 项目详情组件
// TODO: 详情页的必有组件：头部、项目简介、电站信息、受托建造运营方信息、历史项目
// TODO：橙色渐变的Button，可以选渐变方向
// TODO: tab里的 list 的样式
class ProjectDetail extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {
    const { projectDetail } = this.props;
    return (
      <div className="project-detail">
        <ProjectHeader projectDetail={ projectDetail }/>
        <ProjectIntro projectDetail={ projectDetail }/>
        <div className="tabs-container">
          <Tabs tabs={ tabs } initialPage={ 0 }>
            <StationInfo projectDetail={ projectDetail }/>
            <OperatorInfo projectDetail={ projectDetail }/>
            <HistoryProject projectDetail={ projectDetail }/>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default ProjectDetail;
