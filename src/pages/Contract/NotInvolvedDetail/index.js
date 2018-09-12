import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { ProjectDetail } from '../component';
import { mockDetail } from './mock';
import './index.less';

// TODO:未参与的 项目详情页面
// TODO:didMount的时候会发请求
// TODO:然后调用ProjectDetail组件来进行渲染。
// TODO:还有申购按钮、申购窗口等组件
class NotInvolvedDetail extends React.PureComponent {
  render() {
    const detail = mockDetail;
    return (
      <PageWithHeader title={'合约电站'} id="page-not-involved-detail">
        <ProjectDetail projectDetail={detail}/>
      </PageWithHeader>
    )
  }
}

export default NotInvolvedDetail;
