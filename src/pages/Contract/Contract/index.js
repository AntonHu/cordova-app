import React from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs } from 'antd-mobile';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import ProjectList from './ProjectList';
import TransferList from './TransferList';
import TransferHistoryList from './TransferHistoryList';

// 合约电站首页
@inject('contractStore')
@observer
class Contract extends React.Component {
  componentDidMount() {
    this.initPullToRefresh();
    this.initData();
  }

  initData = () => {
    const {
      projectList,
      transferList,
      transferHistoryList
    } = this.props.contractStore;

    if (projectList.list.length < 1) {
      projectList.initLoad();
    }
    if (transferList.list.length < 1) {
      transferList.initLoad();
    }
    if (transferHistoryList.list.length < 1) {
      transferHistoryList.initLoad();
    }
  };

  refresh = () => {
    const {
      projectList,
      transferList,
      transferHistoryList
    } = this.props.contractStore;
    projectList.initLoad();
    transferList.initLoad();
    transferHistoryList.initLoad();
  };

  componentWillUnmount() {
    PullToRefresh.destroyAll();
  }

  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = () => {
    PullToRefresh.init({
      mainElement: '#page-contract', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-contract', // "下拉刷新"把哪个部分包住
      onRefresh: this.refresh, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        return (
          document.querySelector(
            '#page-contract .am-tabs-pane-wrap-active .am-list-view-scrollview'
          ).scrollTop === 0
        );
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };

  render() {
    /**
     * tabs
     */
    const tabs = [
      { title: <span>项目</span> },
      { title: <span>转让</span> },
      { title: <span>历史</span> }
    ];
    return (
      <div id="page-contract">
        <div className="page-title">
          <span className="page-title-name">合约电站</span>
        </div>
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
          }}
          onTabClick={(tab, index) => {
            console.log('onTabClick', index, tab);
          }}
          tabBarActiveTextColor={'#fff'}
          tabBarInactiveTextColor={'#8ed1bc'}
          tabBarUnderlineStyle={{
            backgroundColor: '#fff'
          }}
        >
          {/*第1个tab合约电站列表*/}
          <ProjectList />
          {/*第2个tab电站转让列表*/}
          <TransferList />
          {/*第3个tab转让历史列表*/}
          <TransferHistoryList />
        </Tabs>
      </div>
    );
  }
}

export default Contract;
