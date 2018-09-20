import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import {
  Title,
  PageWithHeader,
  Picture,
  Rank,
  OrangeGradientBtn
} from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { ProjectDetail } from '../component';
import { mockDetail } from './mock';
import { BottomSheet, TransferStationInfo } from '../component';
import './index.less';

// TODO:未参与的 项目详情页面
// TODO:didMount的时候会发请求
// 然后调用ProjectDetail组件来进行渲染。
// TODO:还有申购按钮、申购窗口等组件

class NotInvolvedDetail extends React.PureComponent {
  state = {
    isShow: false
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
    const detail = mockDetail;
    const { isShow } = this.state;
    return (
      <PageWithHeader title={'合约电站'} id="page-not-involved-detail">
        <TransferStationInfo
          transferTime={'2019-05-12'}
          transferMan={1888}
          stationNumber={332122}
          projectTime={'2019-05-12'}
          historyProfit={10}
        />
        <ProjectDetail projectDetail={detail} />
        <OrangeGradientBtn onClick={this.onShow}>申购</OrangeGradientBtn>
        <BottomSheet
          isShow={isShow}
          onShow={this.onShow}
          onClose={this.onClose}
          onConfirm={this.onConfirm}
          perCountMoney={3000}
        />
      </PageWithHeader>
    );
  }
}

export default NotInvolvedDetail;
