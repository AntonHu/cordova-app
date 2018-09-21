import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { Title, PageWithHeader, Picture, Rank, PlantInfoItem } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { ProjectStep, ProjectDetail, FundingStatus, StationBuildProgress, RejectInfo } from "../component";
import { mockDetail } from "../NotInvolvedDetail/mock";
import OrangeGradientBtn from "../../../components/OrangeGradientBtn";

// 已参与的 项目详情页面
// didMount的时候会发请求，根据详情的status不同，来发送不同请求
// 如：项目成团、电站建设、发电收益

// 调用的主要组件：ProjectDetail、项目成团、电站建设、发电收益、进度步骤
// 调用的次要组件：我要申诉、驳回详情、header右上角的法律文书
// todo: 重新申购弹窗、
@inject('contractStore')
@observer
class InvolvedDetail extends React.Component {

  componentDidMount() {
    const { involvedDetail } = this.props.contractStore;
    const { id, purchaseId } = this.props.match.params;
    involvedDetail.loadData({ id, purchaseId })
  }

  componentWillUnmount() {
    const { involvedDetail } = this.props.contractStore;
    if (this.props.history.action === 'POP') {
      involvedDetail.reset();
    }
  }

  toAppeal = () => {
    const { id, purchaseId } = this.props.match.params;
    this.props.history.push(`/contract/appeal/${id}/purchaseId/${purchaseId}`);
  };

  onRePurchase = () => {

  };

  onTransfer = () => {

  };

  render() {
    const { involvedDetail } = this.props.contractStore;
    const { purchaseDetail, rejectInfo, groupInfo, siteInfo, plantInfo } = involvedDetail;
    const projectDetail = involvedDetail.projectDetail.detail;
    const historyList = involvedDetail.projectDetail.historyList;

    return (
      <PageWithHeader
        title="合约电站"
        id="page-involved-detail"
        rightComponent={
          <Button
            className="to-legal-doc"
            onClick={ () => this.props.history.push('/contract/legalDocument') }
          >
            法律文书
          </Button>
        }
        footer={
          <div>
            {
              /* 驳回状态下 */
              rejectInfo.id &&
              <div className="reject-btn-wrap">
                <Button onClick={ this.toAppeal }>
                  申诉
                </Button>
                <OrangeGradientBtn onClick={ this.onRePurchase }>
                  重新申购
                </OrangeGradientBtn>
              </div>
            }
            {
              /* 非驳回状态下 */
              !rejectInfo.id &&
              <div className="btn-wrap">
                <Button onClick={ this.onTransfer }>
                  我要转让
                </Button>
                <Button onClick={ this.toAppeal }>
                  我要申诉
                </Button>
              </div>
            }
          </div>
        }
      >

        <ProjectStep projectDetail={ projectDetail }>
          <React.Fragment>
            {
              rejectInfo.id &&
              <RejectInfo info={ rejectInfo }/>
            }
            <ProjectDetail
              projectDetail={ projectDetail }
              historyList={ toJS(historyList) }
              purchaseDetail={ purchaseDetail }
            />
          </React.Fragment>

          <FundingStatus groupInfo={ groupInfo } purchaseDetail={ purchaseDetail }/>
          <StationBuildProgress siteInfo={siteInfo}/>
          <PlantInfoItem capacity={plantInfo.powerStationCapacity} plantName={plantInfo.plantName}/>
        </ProjectStep>

      </PageWithHeader>
    )
  }
}

export default InvolvedDetail;
