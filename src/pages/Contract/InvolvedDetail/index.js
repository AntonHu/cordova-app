import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { ProjectStep, ProjectDetail, FundingStatus, StationBuildProgress } from "../component";
import { mockDetail } from "../NotInvolvedDetail/mock";

// TODO:已参与的 项目详情页面
// TODO:didMount的时候会发请求，根据详情的status不同，来发送不同请求
// TODO:如：项目成团、电站建设、发电收益

// TODO： 调用的主要组件：ProjectDetail、项目成团、电站建设、发电收益、进度步骤
// TODO: 调用的次要组件：我要申诉、驳回详情、header右上角的法律文书、申购弹窗、重新申购弹窗、
class InvolvedDetail extends React.Component {
  render() {
    return (
      <PageWithHeader title="合约电站" id="page-involved-detail">
        <ProjectStep>
          <ProjectDetail projectDetail={mockDetail}/>
          <FundingStatus />
          <StationBuildProgress />
          <div>发电收益</div>
        </ProjectStep>
      </PageWithHeader>
    )
  }
}

export default InvolvedDetail;
