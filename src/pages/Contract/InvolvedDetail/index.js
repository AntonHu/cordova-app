import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import {
  Title,
  PageWithHeader,
  Picture,
  Rank,
  PlantInfoItem
} from '../../../components';
import {
  Icon,
  Tabs,
  WhiteSpace,
  Button,
  List,
  Stepper,
  Modal,
  ActivityIndicator
} from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import {
  ProjectStep,
  ProjectDetail,
  FundingStatus,
  StationBuildProgress,
  RejectInfo
} from '../component';
import { mockDetail } from '../NotInvolvedDetail/mock';
import OrangeGradientBtn from '../../../components/OrangeGradientBtn';
import {
  PROJECT_STATUS_CODE,
  USER_PROJECT_STATUS_CODE
} from '../../../utils/variable';

// 已参与的 项目详情页面
// didMount的时候会发请求，根据详情的status不同，来发送不同请求
// 如：项目成团、电站建设、发电收益

// 调用的主要组件：ProjectDetail、项目成团、电站建设、发电收益、进度步骤
// 调用的次要组件：我要申诉、驳回详情、header右上角的法律文书
// todo: 重新申购弹窗、
@inject('contractStore')
@observer
class InvolvedDetail extends React.Component {
  state = {
    isModalVisible: false,
    transferCount: 1,
    isLoading: false,
    loadingText: ''
  };

  componentDidMount() {
    const { involvedDetail } = this.props.contractStore;
    const { projectId, purchaseId } = this.props.match.params;
    involvedDetail.loadData({ id: projectId, purchaseId })
  }

  componentWillUnmount() {
    const { involvedDetail } = this.props.contractStore;
    if (this.props.history.action === 'POP') {
      involvedDetail.reset();
    }
    this.transferring();
    this.confirmSending();
    this.detailLoading();
  }

  transferring = reaction(
    () => this.props.contractStore.involvedDetail.isTransferring,
    loading => {
      this.setState({
        loading,
        loadingText: loading ? '正在发送转让请求...' : ''
      });
    }
  );

  confirmSending = reaction(
    () => this.props.contractStore.notInvolvedDetail.isConfirmPaying,
    loading => {
      this.setState({
        loading,
        loadingText: loading ? '正在确认支付，请稍候...' : ''
      });
    }
  );

  detailLoading = reaction(
    () => this.props.contractStore.involvedDetail.projectDetail.isDetailLoading,
    loading => {
      this.setState({
        loading,
        loadingText: loading ? '正在获取详情...' : ''
      });
    }
  );

  toAppeal = () => {
    const { projectId, purchaseId } = this.props.match.params;
    this.props.history.push(`/contract/appeal/${projectId}/purchaseId/${purchaseId}`);
  };

  onPurchase = async () => {
    const { notInvolvedDetail } = this.props.contractStore;
    const { projectId, purchaseId } = this.props.match.params;
    const result = await notInvolvedDetail.onConfirmPay({
      projectId,
      purchaseId
    });

    if (result.success) {
      Modal.alert('已支付', '您已确认支付，即将返回上一页', [
        {
          text: '好的',
          onPress: () => {
            this.props.history.goBack();
          }
        }
      ]);
    }
  };

  onTransfer = async () => {
    const { involvedDetail } = this.props.contractStore;
    const projectDetail = involvedDetail.projectDetail.detail;
    const { transferCount } = this.state;
    Modal.alert(
      '转让',
      `您确定以每份${
        projectDetail.minInvestmentAmount
      }元的价格，转让${transferCount}份？`,
      [{ text: '取消' }, { text: '确认', onPress: this.makeTransfer }]
    );
  };

  makeTransfer = async () => {
    const { involvedDetail } = this.props.contractStore;
    const { projectId } = this.props.match.params;
    const projectDetail = involvedDetail.projectDetail.detail;
    const { transferCount } = this.state;
    const result = await involvedDetail.makeTransfer({
      purchaseNumber: transferCount,
      unitPrice: projectDetail.minInvestmentAmount,
      amount: transferCount * projectDetail.minInvestmentAmount,
      projectId
    });
    if (result.success) {
      Modal.alert('转让', `转让成功，即将回到上一页`, [
        { text: '好的', onPress: () => this.props.history.goBack() }
      ]);
    }
  };

  openTransfer = () => {
    this.setState({
      isModalVisible: true
    });
  };

  closeTransfer = () => {
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    const { involvedDetail } = this.props.contractStore;
    const {
      purchaseDetail,
      rejectInfo,
      groupInfo,
      siteInfo,
      plantInfo,
      isTransferring
    } = involvedDetail;
    const projectDetail = involvedDetail.projectDetail.detail;
    const historyList = involvedDetail.projectDetail.historyList;
    const { isModalVisible, transferCount } = this.state;
    return (
      <PageWithHeader
        title="合约电站"
        id="page-involved-detail"
        rightComponent={
          <Button
            className="to-legal-doc"
            onClick={() => this.props.history.push('/contract/legalDocument')}
          >
            法律文书
          </Button>
        }
        footer={
          <div>
            {/* 驳回状态下 */
            rejectInfo.id && (
              <div className="reject-btn-wrap">
                <Button onClick={this.toAppeal}>申诉</Button>
                <OrangeGradientBtn onClick={this.onPurchase}>
                  重新申购
                </OrangeGradientBtn>
              </div>
            )}
            {/* 非驳回状态下 */
            !rejectInfo.id && (
              <div className="btn-wrap">
                {/* 成团后 */
                projectDetail.status >= PROJECT_STATUS_CODE.GROUPED && (
                  <Button onClick={this.openTransfer}>我要转让</Button>
                )}
                {/* 未支付 */
                purchaseDetail.userStatus < USER_PROJECT_STATUS_CODE.PAID && (
                  <Button onClick={this.onPurchase}>已支付</Button>
                )}

                <Button onClick={this.toAppeal}>我要申诉</Button>
              </div>
            )}
          </div>
        }
      >
        <ProjectStep projectDetail={projectDetail}>
          <React.Fragment>
            {rejectInfo.id && <RejectInfo info={rejectInfo} />}
            <ProjectDetail
              projectDetail={projectDetail}
              historyList={toJS(historyList)}
              purchaseDetail={purchaseDetail}
            />
          </React.Fragment>

          <FundingStatus
            groupInfo={groupInfo}
            purchaseDetail={purchaseDetail}
          />
          <StationBuildProgress siteInfo={siteInfo} />
          <PlantInfoItem
            capacity={plantInfo.powerStationCapacity}
            plantName={plantInfo.plantName}
          />
        </ProjectStep>

        <Modal
          popup
          visible={isModalVisible}
          onClose={this.closeTransfer}
          animationType="slide-up"
          maskClosable
          closable
          className="purchase-modal"
        >
          <div className="amount">{`${transferCount *
            (projectDetail.minInvestmentAmount || 0)}元`}</div>
          <div className="min-invest">{`转让标准：${projectDetail.minInvestmentAmount ||
            0}元每份`}</div>
          <List.Item
            wrap
            extra={
              <Stepper
                style={{ width: '100%', minWidth: '100px' }}
                showNumber
                max={purchaseDetail.purchaseNumber || 0}
                min={1}
                value={transferCount}
                onChange={transferCount => this.setState({ transferCount })}
              />
            }
          >
            转让份数
          </List.Item>
          <OrangeGradientBtn onClick={this.onTransfer}>转让</OrangeGradientBtn>
        </Modal>
        <ActivityIndicator
          animating={this.state.loading}
          text={this.state.loadingText}
          toast
        />
      </PageWithHeader>
    );
  }
}

export default InvolvedDetail;
