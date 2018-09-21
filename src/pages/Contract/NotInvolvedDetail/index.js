import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Modal, List, Stepper, ActivityIndicator, Toast } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { ProjectDetail } from '../component';
import { mockDetail } from './mock';
import { BottomSheet, TransferStationInfo } from '../component';
import './index.less';

// 未参与的 项目详情页面
// didMount的时候会发请求
// 然后调用ProjectDetail组件来进行渲染。
// 还有申购按钮、申购窗口等组件
@inject('contractStore', 'bankCardStore')
@observer
class NotInvolvedDetail extends React.Component {

  state = {
    isModalVisible: false,
    loading: false,
    loadingText: '',
    isShow: false
  };

  componentDidMount() {
    const { notInvolvedDetail } = this.props.contractStore;
    const { id } = this.props.match.params;
    notInvolvedDetail.loadData(id)
  }

  componentWillUnmount() {
    const { notInvolvedDetail } = this.props.contractStore;
    // notInvolvedDetail.reset();
    this.bankCardLoading();
  }

  bankCardLoading = reaction(
    () => this.props.bankCardStore.loadingBankCard,
    (loading) => {
      this.setState({
        loading: loading,
        loadingText: loading ? '正在查询银行卡...' : ''
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
    this.isCardBind()
      .then(() => {
        this.openModal();
      })
      .catch(() => {
        this.props.history.push('/contract/addBankCard')
      });
    // this.openModal();
  };

  isCardBind = async () => {
    const { bankCard, getBankCard } = this.props.bankCardStore;
    const bankCardObj = toJS(bankCard);

    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(bankCardObj) !== '{}') {
        resolve()
      } else {
        const result = await getBankCard();
        if (result.success && result.data) {
          resolve()
        } else {
          reject()
        }
      }
    })
  };

  /**
   * 去 投资份额确认 页
   */
  toShareConfirm = () => {
    this.closeModal();
    const { notInvolvedDetail } = this.props.contractStore;
    const projectId = notInvolvedDetail.projectDetail.id;
    const purchaseNumber = notInvolvedDetail.purchaseCount;
    this.props.history.push(`/contract/shareConfirm/${projectId}/purchaseNumber/${purchaseNumber}`);
  };

  closeModal = () => {
    this.setState({ isModalVisible: false })
  };

  openModal = () => {
    this.setState({ isModalVisible: true })
  };

  //显示底部选择购买组件
  onShow = () => {
    this.setState({ isShow: true });
  };
  //关闭底部选择购买组件
  onClose = () => {
    this.setState({ isShow: false });
  };
  //点击底部确认
  onConfirm = (e, resultJson) => {
    console.log(e, resultJson);
  };

  render() {
    const { notInvolvedDetail } = this.props.contractStore;
    const { purchaseCount, purchaseAmount } = notInvolvedDetail;
    const projectDetail = notInvolvedDetail.projectDetail.detail;
    const historyList = notInvolvedDetail.projectDetail.historyList;

    const { loadingText, loading, isModalVisible, isShow } = this.state;
    return (
      <PageWithHeader title={ '合约电站' } id="page-not-involved-detail">
        <TransferStationInfo
          transferTime={ '2019-05-12' }
          transferMan={ 1888 }
          stationNumber={ 332122 }
          projectTime={ '2019-05-12' }
          historyProfit={ 10 }
        />
        <ProjectDetail projectDetail={ projectDetail } historyList={ toJS(historyList) }/>
        <OrangeGradientBtn onClick={ this.onPurchase }>
          申购
        </OrangeGradientBtn>
        <ActivityIndicator
          toast
          text={ loadingText }
          animating={ loading }
        />
        <Modal
          popup
          visible={ isModalVisible }
          onClose={ this.closeModal }
          animationType="slide-up"
        >
          <div>{ `${purchaseAmount}元` }</div>
          <div>{ `申购标准：${projectDetail.minInvestmentAmount || 0}元每份` }</div>
          <List.Item
            wrap
            extra={
              <Stepper
                style={ { width: '100%', minWidth: '100px' } }
                showNumber
                max={ projectDetail.availableShare || 1 }
                min={ 1 }
                value={ purchaseCount }
                onChange={ notInvolvedDetail.updatePurchaseCount }
              /> }
          >
            申购数
          </List.Item>
          <OrangeGradientBtn onClick={ this.toShareConfirm }>
            申购
          </OrangeGradientBtn>
          <BottomSheet
            isShow={ isShow }
            onShow={ this.onShow }
            onClose={ this.onClose }
            onConfirm={ this.onConfirm }
            perCountMoney={ 3000 }
          />

        </Modal>
      </PageWithHeader>
    );
  }
}

export default NotInvolvedDetail;
