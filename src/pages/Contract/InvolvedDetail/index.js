import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import { PageWithHeader, PlantInfoItem, Stepper } from '../../../components';
import { Button, List, Modal, ActivityIndicator } from 'antd-mobile';
import './index.less';
import { ProjectStep, ProjectDetail, RejectInfo } from '../component';
import OrangeGradientBtn from '../../../components/OrangeGradientBtn';
import {
  PROJECT_STATUS_CODE,
  USER_PROJECT_STATUS_CODE,
  VERIFY_STATUS
} from '../../../utils/variable';

// 已参与的 项目详情页面
// didMount的时候会发请求，根据详情的status不同，来发送不同请求
// 如：项目成团、电站建设、发电收益

// 调用的主要组件：ProjectDetail、项目成团、电站建设、发电收益、进度步骤
// 调用的次要组件：我要申诉、驳回详情、header右上角的法律文书
// todo: 重新申购弹窗、
@inject('contractStore', 'userStore', 'keyPair', 'bankCardStore')
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
    involvedDetail.loadData({ id: projectId, purchaseId });
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
    this.props.history.push(
      `/contract/appeal/${projectId}/purchaseId/${purchaseId}`
    );
  };

  // onPurchase = async () => {
  //   const { notInvolvedDetail } = this.props.contractStore;
  //   const { projectId, purchaseId } = this.props.match.params;
  //   const result = await notInvolvedDetail.onConfirmPay({
  //     projectId,
  //     purchaseId
  //   });

  //   if (result.success) {
  //     Modal.alert('已支付', '您已确认支付，即将返回上一页', [
  //       {
  //         text: '好的',
  //         onPress: () => {
  //           this.props.history.goBack();
  //         }
  //       }
  //     ]);
  //   }
  // };

  isCardBind = async () => {
    const { bankCard, getBankCard } = this.props.bankCardStore;
    const bankCardObj = toJS(bankCard);

    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(bankCardObj) !== '{}') {
        resolve();
      } else {
        const result = await getBankCard();
        if (result.success && result.data && result.data.bankCardNumber) {
          resolve();
        } else {
          reject();
        }
      }
    });
  };

  /**
   * 点击申购
   * 先看看有没有绑过银行卡
   * 如果没有，去绑银行卡
   * 如果有，弹出弹窗
   */
  onPurchase = async () => {
    if (!this.props.keyPair.showHasKey(this.props)) {
      return;
    }

    if (this.props.userStore.isKycInChain === VERIFY_STATUS.UNAUTHORIZED) {
      Modal.alert('您尚未进行身份认证', '在"我的" => "完善信息"中去认证', [
        { text: '知道了' }
      ]);
      return;
    }

    this.isCardBind()
      .then(() => {
        this.openTransfer();
      })
      .catch(() => {
        this.props.history.push('/contract/addBankCard');
      });
    // this.openModal();
  };

  onTransfer = () => {
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
  //确认重新购买
  confirmRePurchase = () => {
    const { involvedDetail } = this.props.contractStore;
    const { purchaseDetail } = involvedDetail;
    const projectDetail = involvedDetail.projectDetail.detail;
    Modal.alert(
      '转让',
      `您确定以每份${projectDetail.minInvestmentAmount}元的价格，重新购买${
        purchaseDetail.purchaseNumber
      }份？`,
      [{ text: '取消' }, { text: '确认', onPress: this.rePurchase }]
    );
  };
  //重新购买，去投资份额确认页
  rePurchase = async () => {
    const { involvedDetail } = this.props.contractStore;
    const { purchaseDetail } = involvedDetail;
    const projectId = this.props.match.params.projectId;
    this.closeTransfer();
    this.props.history.push(
      `/contract/shareConfirm/${projectId}/purchaseNumber/${
        purchaseDetail.purchaseNumber
      }`
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
      plantInfo,
      projectDetail: { detail = {}, siteInfo = {}, historyList = [] } = {}
    } = involvedDetail;
    console.log('involvedDetail', toJS(purchaseDetail));
    const { isModalVisible, transferCount } = this.state;
    console.log('是否有驳回id', rejectInfo.id);
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
                <OrangeGradientBtn onClick={this.confirmRePurchase}>
                  重新申购
                </OrangeGradientBtn>
              </div>
            )}
            {/* 非驳回状态下 */
            !rejectInfo.id && (
              <div className="btn-wrap">
                {/* 支付后 */
                purchaseDetail.userStatus >= USER_PROJECT_STATUS_CODE.PAID && (
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
        <ProjectStep projectDetail={detail}>
          <React.Fragment>
            {rejectInfo.id && <RejectInfo info={rejectInfo} />}
            <ProjectDetail
              projectDetail={detail}
              historyList={toJS(historyList)}
              purchaseDetail={purchaseDetail}
              siteInfo={toJS(siteInfo)}
            />
          </React.Fragment>

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
          <div className="amount">{`${
            !rejectInfo.id
              ? transferCount * (detail.minInvestmentAmount || 0)
              : purchaseDetail.purchaseNumber *
                (detail.minInvestmentAmount || 0)
          }元`}</div>
          <div className="min-invest">{`转让标准：${detail.minInvestmentAmount ||
            0}元每份`}</div>
          <List.Item
            wrap
            extra={
              rejectInfo.id ? (
                <Stepper
                  value={purchaseDetail.purchaseNumber}
                  //有rejectInfo.id表示份额不可修改，否则表示可修改
                />
              ) : (
                <Stepper
                  max={purchaseDetail.purchaseNumber || 0}
                  min={1}
                  value={transferCount}
                  //有rejectInfo.id表示份额不可修改，否则表示可修改
                  onChange={transferCount => {
                    this.setState({ transferCount });
                  }}
                />
              )
            }
          >
            转让份数
          </List.Item>
          {/*如果有rejectInfo.id，则点击的操作是重新购买,否则点击的操作是转让*/}
          <OrangeGradientBtn
            onClick={!rejectInfo.id ? this.onTransfer : this.confirmRePurchase}
          >
            转让
          </OrangeGradientBtn>
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
