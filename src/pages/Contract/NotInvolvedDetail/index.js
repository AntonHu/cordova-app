import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import {
  PageWithHeader,
  OrangeGradientBtn,
  Stepper
} from '../../../components';
import {
  Modal,
  List,
  ActivityIndicator
} from 'antd-mobile';
import PullToRefresh from 'pulltorefreshjs';
import { ProjectDetail } from '../component';
import './index.less';
import { VERIFY_STATUS } from '../../../utils/variable';

// 未参与的 项目详情页面
// didMount的时候会发请求
// 然后调用ProjectDetail组件来进行渲染。
// 还有申购按钮、申购窗口等组件
@inject('contractStore', 'bankCardStore', 'keyPair', 'userStore')
@observer
class NotInvolvedDetail extends React.Component {
  state = {
    isModalVisible: false,
    loading: false,
    loadingText: ''
  };

  componentDidMount() {
    const { notInvolvedDetail } = this.props.contractStore;
    const { projectId } = this.props.match.params;
    notInvolvedDetail.loadData(projectId)
  }

  componentWillUnmount() {
    const { notInvolvedDetail } = this.props.contractStore;
    if (this.props.history.action === 'POP') {
      notInvolvedDetail.reset();
    }
    this.bankCardLoading();
    this.detailLoading();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId } = this.props.match.params;
    const nextId = nextProps.match.params.projectId;
    const { notInvolvedDetail } = this.props.contractStore;
    if (projectId !== nextId) {
      notInvolvedDetail.loadData(nextId)
    }
  }

  bankCardLoading = reaction(
    () => this.props.bankCardStore.loadingBankCard,
    loading => {
      this.setState({
        loading: loading,
        loadingText: loading ? '正在查询银行卡...' : ''
      });
    }
  );

  detailLoading = reaction(
    () =>
      this.props.contractStore.notInvolvedDetail.projectDetail.isDetailLoading,
    loading => {
      this.setState({
        loading: loading,
        loadingText: loading ? '正在加载详情...' : ''
      });
    }
  );

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
        this.openModal();
      })
      .catch(() => {
        this.props.history.push('/contract/addBankCard');
      });
    // this.openModal();
  };

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
   * 去 投资份额确认 页
   */
  toShareConfirm = () => {
    const { notInvolvedDetail } = this.props.contractStore;
    const projectId = this.props.match.params.projectId;
    const purchaseNumber = notInvolvedDetail.purchaseCount;
    this.closeModal();
    this.props.history.push(
      `/contract/shareConfirm/${projectId}/purchaseNumber/${purchaseNumber}`
    );
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  openModal = () => {
    this.setState({ isModalVisible: true });
  };

  render() {
    const { notInvolvedDetail } = this.props.contractStore;
    const { purchaseCount, purchaseAmount } = notInvolvedDetail;
    const projectDetail = notInvolvedDetail.projectDetail.detail;
    const historyList = notInvolvedDetail.projectDetail.historyList;

    const { loadingText, loading, isModalVisible } = this.state;
    return (
      <PageWithHeader
        title={'合约电站'}
        id="page-not-involved-detail"
        footer={
          <OrangeGradientBtn
            onClick={this.onPurchase}
            disabled={projectDetail.availableShare <= 0}
          >
            申购
          </OrangeGradientBtn>
        }
      >
        <ProjectDetail
          projectDetail={projectDetail}
          historyList={toJS(historyList)}
        />

        <ActivityIndicator toast text={loadingText} animating={loading} />
        <Modal
          popup
          visible={isModalVisible}
          onClose={this.closeModal}
          animationType="slide-up"
          maskClosable
          closable
          className="purchase-modal"
        >
          <div className="amount">{`${purchaseAmount}元`}</div>
          <div className="min-invest">{`申购标准：${projectDetail.minInvestmentAmount ||
            0}元每份`}</div>
          <List.Item
            wrap
            extra={
              <Stepper
                max={projectDetail.availableShare || 0}
                min={1}
                value={purchaseCount}
                onChange={notInvolvedDetail.updatePurchaseCount}
              />
            }
          >
            申购数
          </List.Item>
          <OrangeGradientBtn onClick={this.toShareConfirm}>
            申购
          </OrangeGradientBtn>
        </Modal>
      </PageWithHeader>
    );
  }
}

export default NotInvolvedDetail;
