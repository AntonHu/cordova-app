import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import {
  Title,
  PageWithHeader,
  Picture,
  Rank,
  OrangeGradientBtn
} from '../../../components';
import {
  Icon,
  Tabs,
  WhiteSpace,
  Modal,
  List,
  Stepper,
  ActivityIndicator,
  Toast
} from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { ProjectDetail } from '../component';
import { BottomSheet, TransferStationInfo } from '../component';
import './index.less';
import { VERIFY_STATUS } from '../../../utils/variable';

// 转让的 项目详情页面
// didMount的时候会发请求
// 然后调用ProjectDetail组件来进行渲染。
// 还有申购按钮、申购窗口等组件
@inject('contractStore', 'bankCardStore', 'keyPair', 'userStore')
@observer
class TransferDetail extends React.Component {
  state = {
    isModalVisible: false,
    loading: false,
    loadingText: '',
    isShow: false
  };

  componentDidMount() {
    const { transferDetail } = this.props.contractStore;
    const { projectId, productId } = this.props.match.params;
    transferDetail.loadData({ projectId, productId });
  }

  componentWillUnmount() {
    const { transferDetail } = this.props.contractStore;
    transferDetail.reset();
    this.bindBuyLoading();
  }

  bindBuyLoading = reaction(
    () => this.props.contractStore.transferDetail.isBuying,
    isBuying => {
      this.setState({
        loading: isBuying,
        loadingText: '正在发送购买请求...'
      });
    }
  );

  closeModal = () => {
    this.setState({
      isModalVisible: false
    });
  };

  openModal = () => {
    this.setState({
      isModalVisible: true
    });
  };

  /**
   * 点击购买
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

  buyConfirm = async () => {
    const { productId } = this.props.match.params;
    const { transferDetail } = this.props.contractStore;
    const result = await transferDetail.buyProject({ productId });
    this.closeModal();
    if (result.success) {
      Modal.alert('购买', '您已成功发送购买请求，即将返回上一页', [
        { text: '好的', onPress: () => this.props.history.goBack() }
      ]);
    }
  };

  render() {
    const { transferDetail } = this.props.contractStore;
    const { transferInfo } = transferDetail;
    const projectDetail = transferDetail.projectDetail.detail;
    const historyList = transferDetail.projectDetail.historyList;

    const { loadingText, loading, isModalVisible } = this.state;
    return (
      <PageWithHeader
        title={'转让详情'}
        id="page-transfer-detail"
        footer={
          <OrangeGradientBtn onClick={this.onPurchase}>购买</OrangeGradientBtn>
        }
      >
        <TransferStationInfo
          transferTime={transferInfo.transferPublishTime || '无'}
          transferMan={transferInfo.sellerId || '无'}
          stationNumber={transferInfo.plantNum || '无'}
          projectTime={transferInfo.projectFinishTime || '无'}
          historyProfit={transferInfo.historyIncome || 0}
        />
        <ProjectDetail
          projectDetail={projectDetail}
          historyList={toJS(historyList)}
          transferInfo={transferInfo}
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
          <div className="amount">{`${transferInfo.amount}元`}</div>
          <div className="min-invest">{`申购标准：${transferInfo.unitPrice ||
            0}元每份`}</div>
          <List.Item wrap extra={transferInfo.purchaseNumber}>
            购买份数
          </List.Item>
          <OrangeGradientBtn onClick={this.buyConfirm}>购买</OrangeGradientBtn>
        </Modal>
      </PageWithHeader>
    );
  }
}

export default TransferDetail;
