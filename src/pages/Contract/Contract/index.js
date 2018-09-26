import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import {
  Title,
  PageWithHeader,
  Picture,
  Rank,
  ContractProjectItem
} from '../../../components';
import { Icon, ListView, Tabs, WhiteSpace, Modal, ActivityIndicator } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { mockDetail } from '../NotInvolvedDetail/mock';
import { PAGE_SIZE } from '../../../utils/variable';
//电站转让列表Item
import { StationTransfer, TransferHistory } from '../component';

const POWER_UNIT = 'kW'; //发电单位
const alert = Modal.alert;

// 合约电站首页
@inject('contractStore')
@observer
class Contract extends React.Component {
  constructor(props) {
    super(props);
    const { projectList, transferList, transferHistoryList } = props.contractStore;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });
    const transferSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });
    const historySource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(toJS(projectList.list)),
      transferSource: transferSource.cloneWithRows(toJS(transferList.list)),
      historySource: historySource.cloneWithRows(toJS(transferHistoryList.list)),
    };
  }

  componentDidMount() {
    this.initPullToRefresh();
    const { projectList, transferList, transferHistoryList } = this.props.contractStore;

    if (projectList.list.length < 1) {
      projectList.initLoad();
    }
    if (transferList.list.length < 1) {
      transferList.initLoad();
    }
    if (transferHistoryList.list.length < 1) {
      transferHistoryList.initLoad();
    }
  }

  componentWillUnmount() {
    PullToRefresh.destroyAll();
    this.updateDataSource();
    this.updateTransferSource();
    this.updateHistorySource();
  }

  /**
   * 初始化下拉刷新
   * todo: 加上转让后，shouldPullToRefresh要重新弄，还有onRefresh的方法
   */
  initPullToRefresh = () => {
    const { projectList } = this.props.contractStore;
    PullToRefresh.init({
      mainElement: '#page-contract', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-contract', // "下拉刷新"把哪个部分包住
      onRefresh: projectList.initLoad, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function () {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        return (
          document.querySelector(`#page-contract`)
            .scrollTop === 0
        );
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
  };

  renderRow = rowData => {
    const item = rowData;
    // TODO: click之前，reset掉notInvolvedDetail
    return (
      <Link to={ `/contract/notInvolvedDetail/${item.id}` }>
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
    () => this.props.contractStore.projectList.list,
    list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(list))
      });
    }
  );

  updateTransferSource = reaction(
    () => this.props.contractStore.transferList.list,
    list => {
      this.setState({
        transferSource: this.state.dataSource.cloneWithRows(toJS(list))
      });
    }
  );

  updateHistorySource = reaction(
    () => this.props.contractStore.transferHistoryList.list,
    list => {
      this.setState({
        historySource: this.state.dataSource.cloneWithRows(toJS(list))
      });
    }
  );

  onEndReached = () => {
    const { projectList } = this.props.contractStore;
    projectList.loadMore();
  };

  render() {
    const { projectList, transferList, transferHistoryList } = this.props.contractStore;
    console.log(toJS(projectList.list));
    /**
     * tabs
     */
    const tabs = [
      { title: <span>合约电站</span> },
      { title: <span>电站转让</span> },
      { title: <span>转让历史</span> }
    ];
    return (
      <div id="page-contract">

        <Tabs
          tabs={ tabs }
          initialPage={ 0 }
          onChange={ (tab, index) => {
            console.log('onChange', index, tab);
          } }
          onTabClick={ (tab, index) => {
            console.log('onTabClick', index, tab);
          } }
        >
          { /*第1个tab合约电站列表*/ }
          <div>
            <ListView
              initialListSize={ PAGE_SIZE }
              pageSize={ PAGE_SIZE }
              renderFooter={ () => (
                <div style={ { padding: '20px', textAlign: 'center' } }>
                  { projectList.isLoading ? '加载中...' : '没有更多' }
                </div>
              ) }
              dataSource={ this.state.dataSource }
              renderRow={ this.renderRow }
              useBodyScroll
              scrollRenderAheadDistance={ 800 }
              onEndReached={ this.onEndReached }
              onEndReachedThreshold={ 10 }
            />
            <ActivityIndicator toast animating={ projectList.isLoading } text="正在加载列表..."/>
          </div>
          { /*第2个tab电站转让列表*/ }
          <div>
            <ListView
              renderFooter={ () => (
                <div style={ { padding: '20px', textAlign: 'center' } }>
                  { transferList.isLoading ? '加载中...' : '没有更多' }
                </div>
              ) }
              dataSource={ this.state.transferSource }
              renderRow={ (item) =>
                <StationTransfer
                  key={item.productId}
                  money={ 7980 }
                  projectName={ item.projectName }
                  stationCapacity={ '10 ' + POWER_UNIT }
                  profitYear={ `${(item.estimatedAnnualizedIncome || 0)}%` }
                />
              }
              useBodyScroll
              scrollRenderAheadDistance={ 800 }
            />
            <ActivityIndicator toast animating={ transferList.isLoading } text="正在加载列表..."/>
          </div>
          { /*第3个tab转让历史列表*/ }
          <div>
            <ListView
              renderFooter={ () => (
                <div style={ { padding: '20px', textAlign: 'center' } }>
                  { transferHistoryList.isLoading ? '加载中...' : '没有更多' }
                </div>
              ) }
              dataSource={ this.state.historySource }
              renderRow={ () =>
                <TransferHistory
                  projectName={ '黄河公道园项目' }
                  status={ '未知状态' }
                  count={ 10 }
                  price={ 2000 }
                  sellerName={ '卖家名字' }
                  openBank={ '中央银行' }
                  bankAccount={ '1888888888' }
                  sellerContact={ '杭州市余杭区' }
                  confirmPay={ () => {
                    alert('警告', '确认打款???', [
                      { text: '取消', onPress: () => console.log('确认') },
                      { text: '确认', onPress: () => console.log('确认') }
                    ]);
                  } }
                  cancelPay={ () => {
                    alert('警告', '取消转让???', [
                      { text: '取消', onPress: () => console.log('确认') },
                      { text: '确认', onPress: () => console.log('确认') }
                    ]);
                  } }
                />
              }
              useBodyScroll
              scrollRenderAheadDistance={ 800 }
            />
            <ActivityIndicator toast animating={ transferHistoryList.isLoading } text="正在加载列表..."/>

          </div>
        </Tabs>

      </div>
    );
  }
}

export default Contract;
