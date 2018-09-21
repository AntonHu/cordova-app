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
import { BottomSheet, TransferStationInfo } from '../component';
import './index.less';

// 转让的 项目详情页面
// didMount的时候会发请求
// 然后调用ProjectDetail组件来进行渲染。
// 还有申购按钮、申购窗口等组件
@inject('contractStore', 'bankCardStore')
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
    const { id } = this.props.match.params;
    transferDetail.loadData(id)
  }

  componentWillUnmount() {
    const { transferDetail } = this.props.contractStore;
    // transferDetail.reset();
  }

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
    const { transferDetail } = this.props.contractStore;
    const { purchaseCount, purchaseAmount } = transferDetail;
    const projectDetail = transferDetail.projectDetail.detail;
    const historyList = transferDetail.projectDetail.historyList;

    const { loadingText, loading, isModalVisible, isShow } = this.state;
    return (
      <PageWithHeader title={ '转让详情' } id="page-transfer-detail">
        <TransferStationInfo
          transferTime={ '2019-05-12' }
          transferMan={ 1888 }
          stationNumber={ 332122 }
          projectTime={ '2019-05-12' }
          historyProfit={ 10 }
        />
        <ProjectDetail projectDetail={ projectDetail } historyList={ toJS(historyList) }/>
        <BottomSheet
          isShow={ isShow }
          onShow={ this.onShow }
          onClose={ this.onClose }
          onConfirm={ this.onConfirm }
          perCountMoney={ 3000 }
        />
      </PageWithHeader>
    );
  }
}

export default TransferDetail;
