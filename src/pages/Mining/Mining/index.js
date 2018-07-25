import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './style.less';

const tabs2 = [
  { title: '全民排行榜', sub: '1' },
  { title: '邻居榜', sub: '2' }
];
/**
 * 挖宝
 */
@inject('miningStore', 'userStore', 'keyPair')
@observer
class Comp extends React.Component {
  componentDidMount() {
    this.makeRequest();
    this.initPullToRefresh();
  }

  componentWillUnmount() {
    PullToRefresh.destroyAll();
  }

  /**
   * 初始化下拉刷新
   */
  initPullToRefresh = () => {
    PullToRefresh.init({
      mainElement: '#mining-refresh',
      triggerElement: '#mining-refresh',
      onRefresh: this.pullToRefresh,
      shouldPullToRefresh: function () {
        return document.getElementById('page-mining').parentNode.parentNode.scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    })
  };

  makeRequest = () => {
    const { keyPair } = this.props;
    const requestArray = [];
    if (keyPair.hasKey) {
      // 获取我的太阳积分
      requestArray.push(this.props.miningStore.fetchBalance({ publicKey: keyPair.publicKey }));
      // 邻居榜
      requestArray.push(this.props.miningStore.fetchNearbyRanking({
        publicKey: keyPair.publicKey
      }));
      // 获取"当前积分排行"
      requestArray.push(this.props.miningStore.fetchBalanceRanking({
        publicKey: keyPair.publicKey
      }));
      // 获取"今日太阳积分"
      requestArray.push(this.props.miningStore.fetchTodayIntegral({
        publicKey: keyPair.publicKey
      }));
    }
    requestArray.push(this.props.miningStore.fetchAllRanking());
    requestArray.push(this.props.miningStore.fetchDigTimes());
    return Promise.all(requestArray);
  };

  pullToRefresh = (resolve, reject) => {
    return this.makeRequest();
  };

  /**
   * 给较短的list补齐空元素
   * @param length
   * @param maxLength
   * @returns {Array}
   */
  completeList = (length, maxLength) => {
    const emptyArray = new Array(maxLength - length).fill(1);
    return emptyArray.map((v, i) => {
      return (
        <div className="ranking-item empty" key={i} />
      )
    })
  };

  render() {
    const dayStationElectric = getLocalStorage('dayStationElectric') || 0; // 获取本地储存今日发电量
    const {
      balanceRanking,
      digTimes,
      allRanking,
      nearbyRank,
      balance,
      todayIntegral
    } = this.props.miningStore;
    const userInfo = this.props.userStore.userInfo;
    const { avatar } = userInfo;
    return (
      <div className={'page-mining'} id="page-mining">
        <PageWithHeader
          leftComponent={null}
          title={'挖宝池'}
          rightComponent={<Link to="/mining/pointRule">
            <span className="h4 main-text">积分规则</span>
          </Link>}
        >
          <div id="mining-refresh" onScroll={e => console.log(e)}>
          <div className="sun-info">
            <div className="my-sun">
              <Picture src={avatar} size={120} showBorder={true} />
              <div>
                <div className="sun-type">我的太阳积分</div>
                <div className="rank">{balance.toFixed(2)}</div>
              </div>
              <div>
                <div className="sun-type">当前排行</div>
                <div className="rank">{balanceRanking}</div>
              </div>
              <Icon
                type="right"
                onClick={() => this.props.history.push('/mining/sunIntegral')}
              />
            </div>
            <div className="my-profit">
              <div className="profit-item">
                <div className="profit-title">今日发电</div>
                <div className="profit-number">{`${dayStationElectric}kWh`}</div>
              </div>
              <div className="profit-item">
                <div className="profit-title">今日太阳积分</div>
                <div className="profit-number">{(todayIntegral).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="expect">
            <div className="expect-item">
              <i className="iconfont">&#xe67b;</i>
              <div className="expect-title">
                <div>挖宝商城</div>
                <div>敬请期待</div>
              </div>
              <Icon type="right" />
            </div>
            <div className="expect-item">
              <i className="iconfont">&#xe6ee;</i>
              <div className="expect-title">
                <div>提升算力</div>
                <div>敬请期待</div>
              </div>
              <Icon type="right" />
            </div>
          </div>
          <Title title="挖宝数据" />
          <div className="treasure-data">
            <div className="item">
              <div>当前挖宝排行</div>
              <span>{balanceRanking}</span>
            </div>
            <div className="item">
              <div>今日全民累计挖宝次数</div>
              <span>{digTimes.countAllTimesToday}</span>
            </div>
            <div className="item">
              <div>累计全民累计挖宝总次数</div>
              <span>{digTimes.countAllTimes}</span>
            </div>
          </div>
          <div className="ranking">
            <Tabs
              tabs={tabs2}
              initialPage={0}
              renderTab={tab => <span>{tab.title}</span>}
            >
              <div className="ranking-list">
                {allRanking &&
                  allRanking.map((item, index) => {
                    return (
                      <div key={index} className="ranking-item">
                        <div className="ranking-title">
                          <Rank num={index + 1} />
                          {item.nickName}
                        </div>
                        <span>{(item.value || 0).toFixed(2)}</span>
                      </div>
                    );
                  })}
                {
                  this.completeList(allRanking.length, Math.max(allRanking.length, nearbyRank.length))
                }
              </div>
              <div className="ranking-list">
                {nearbyRank &&
                  nearbyRank.map((item, index) => {
                    return (
                      <div key={index} className="ranking-item">
                        <div className="ranking-title">
                          <Rank num={index + 1} />
                          {item.nickName}
                        </div>
                        <span>{(item.value || 0).toFixed(2)}</span>
                      </div>
                    );
                  })}
                {
                  this.completeList(nearbyRank.length, Math.max(allRanking.length, nearbyRank.length))
                }
              </div>
            </Tabs>
            <WhiteSpace />
          </div>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
