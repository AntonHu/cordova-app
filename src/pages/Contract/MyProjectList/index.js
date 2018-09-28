import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import { Title, PageWithHeader, Picture, Rank, ContractProjectItem } from '../../../components';
import { Icon, ListView, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { mockDetail } from "../NotInvolvedDetail/mock";
import { PAGE_SIZE } from "../../../utils/variable";

// 我的合约电站列表
@inject('contractStore')
@observer
class MyProjectList extends React.Component {

  constructor(props) {
    super(props);
    const { myProjectList } = props.contractStore;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(toJS(myProjectList.list)),
      isLoading: false,
      page: 0
    };
  }

  componentDidMount() {
    this.initPullToRefresh();
    const { myProjectList } = this.props.contractStore;
    if (myProjectList.list.length < 1) {
      myProjectList.initLoad();
    }
  }

  componentWillUnmount() {
    PullToRefresh.destroyAll();
  }

  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = () => {
    const { myProjectList } = this.props.contractStore;
    PullToRefresh.init({
      mainElement: '#page-my-project-list', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-my-project-list', // "下拉刷新"把哪个部分包住
      onRefresh: myProjectList.initLoad, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        return document.querySelector(`#page-my-project-list #${PageWithHeader.bodyId}`).scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };

  renderRow = (rowData) => {
    const item = rowData;
    return(
      <Link to={`/contract/involvedDetail/${item.id}/purchaseId/${item.purchaseId}`}>
    <ContractProjectItem
      key={ item.id }
      enterpriseName={ item.enterpriseName }
      annualRate={ item.estimatedAnnualizedIncome }
      availableShare={ item.availableShare }
      dateTime={ item.createdAt }
      powerStationCapacity={ item.powerStationCapacity }
      projectName={ item.projectName }
      soldShare={ item.soldShare }
    />
    </Link>
    )
  };

  updateDataSource = reaction(
    () => this.props.contractStore.myProjectList.list,
    list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(list)),
        isLoading: false
      });
    }
  );

  onEndReached = () => {
    const { myProjectList } = this.props.contractStore;
    myProjectList.loadMore()
  };

  render() {
    const { myProjectList } = this.props.contractStore;
    console.log(toJS(myProjectList.list));
    return (
      <PageWithHeader title="我的合约" id="page-my-project-list">

        <ListView
          initialListSize={PAGE_SIZE}
          pageSize={PAGE_SIZE}
          renderFooter={() => (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              {myProjectList.isLoading ? '加载中...' : '没有更多'}
            </div>
          )}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          useBodyScroll
          scrollRenderAheadDistance={800}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />

      </PageWithHeader>
    )
  }
}

export default MyProjectList;
