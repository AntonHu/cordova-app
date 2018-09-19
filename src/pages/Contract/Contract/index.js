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
import { Icon, ListView, Tabs, WhiteSpace, Modal } from 'antd-mobile';
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
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });

    this.state = {
      dataSource,
      isLoading: false,
      page: 0
    };
  }

  componentDidMount() {
    this.initPullToRefresh();
    const { projectList } = this.props.contractStore;
    projectList.initLoad();
  }

  componentWillUnmount() {
    PullToRefresh.destroyAll();
  }

  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = () => {
    const { projectList } = this.props.contractStore;
    PullToRefresh.init({
      mainElement: '#page-contract', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-contract', // "下拉刷新"把哪个部分包住
      onRefresh: projectList.initLoad, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        return (
          document.querySelector(`#page-contract #${PageWithHeader.bodyId}`)
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
    return (
      <ContractProjectItem
        key={item.id}
        enterpriseName={item.enterpriseName}
        annualRate={item.estimatedAnnualizedIncome}
        availableShare={item.availableShare}
        dateTime={item.createdAt}
        powerStationCapacity={item.powerStationCapacity}
        projectName={item.projectName}
        soldShare={item.soldShare}
      />
    );
  };

  updateDataSource = reaction(
    () => this.props.contractStore.projectList.list,
    list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(list)),
        isLoading: false
      });
    }
  );

  onEndReached = () => {
    const { projectList } = this.props.contractStore;
    projectList.loadMore();
  };

  render() {
    const { projectList } = this.props.contractStore;
    console.log(toJS(projectList.list));
    /**
     * tabs
     */
    const tabs = [
      { title: <span>合约电站</span> },
      { title: <span>电站转让</span> },
      { title: <span>转让历史</span> }
    ];

    const tabs2 = [
      { title: '合约电站', sub: '1' },
      { title: '电站转让', sub: '2' },
      { title: '转让历史', sub: '3' }
    ];
    return (
      <PageWithHeader title="合约电站" leftComponent={null} id="page-contract">
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
          }}
          onTabClick={(tab, index) => {
            console.log('onTabClick', index, tab);
          }}
        >
          {/*第1个tab合约电站列表*/}
          <div>
            <ListView
              initialListSize={PAGE_SIZE}
              pageSize={PAGE_SIZE}
              renderFooter={() => (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  {projectList.isLoading ? '加载中...' : '没有更多'}
                </div>
              )}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              useBodyScroll
              scrollRenderAheadDistance={800}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            />
          </div>
          {/*第2个tab电站转让列表*/}
          <div>
            <StationTransfer
              money={7980}
              projectName={'黄河公道园项目'}
              stationCapacity={'10 ' + POWER_UNIT}
              profitYear={'10 %'}
            />
          </div>
          {/*第3个tab转让历史列表*/}
          <div>
            <TransferHistory
              projectName={'黄河公道园项目'}
              status={'未知状态'}
              count={10}
              price={2000}
              sellerName={'卖家名字'}
              openBank={'中央银行'}
              bankAccount={'1888888888'}
              sellerContact={'杭州市余杭区'}
              confirmPay={() => {
                alert('警告', '确认打款???', [
                  { text: '取消', onPress: () => console.log('确认') },
                  { text: '确认', onPress: () => console.log('确认') }
                ]);
              }}
              cancelPay={() => {
                alert('警告', '取消转让???', [
                  { text: '取消', onPress: () => console.log('确认') },
                  { text: '确认', onPress: () => console.log('确认') }
                ]);
              }}
            />
          </div>
        </Tabs>

        {/*{*/}
        {/*projectList.list.map((item, idx) =>*/}
        {/*<ContractProjectItem*/}
        {/*key={ idx }*/}
        {/*enterpriseName={ item.enterpriseName }*/}
        {/*annualRate={ item.estimatedAnnualizedIncome }*/}
        {/*availableShare={ item.availableShare }*/}
        {/*dateTime={ item.createdAt }*/}
        {/*powerStationCapacity={ item.powerStationCapacity }*/}
        {/*projectName={ item.projectName }*/}
        {/*soldShare={ item.soldShare }*/}
        {/*/>)*/}
        {/*}*/}
      </PageWithHeader>
    );
  }
}

export default Contract;
