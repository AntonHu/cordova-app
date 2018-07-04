import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import './style.less';

const tabs2 = [
  { title: '全民排行榜', sub: '1' },
  { title: '邻居榜', sub: '2' }
];
/**
 * 挖宝
 */
@inject('miningStore')
@observer
class Comp extends React.PureComponent {

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest = () => {
    this.props.miningStore.fetchAllRanking();
    this.props.miningStore.fetchNearbyRanking({publicKey: ''});
    this.props.miningStore.fetchDigTimes();
    this.props.miningStore.fetchBalanceRanking({publicKey: ''});
  };

  render() {
    const { balanceRanking, digTimes, allRanking, nearbyRank } = this.props.miningStore;
    return (
      <div className={'page-mining'}>
        <PageWithHeader leftComponent={null} title={'挖宝池'}>
          <div className="sun-info">
            <div className="my-sun">
              <img
                className="my-pic"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                alt=""
              />
              <div>
                <div className="sun-type">我的太阳积分</div>
                <div className="rank">552</div>
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
                <div className="profit-number">899kw/h</div>
              </div>
              <div className="profit-item">
                <div className="profit-title">今日太阳积分</div>
                <div className="profit-number">18</div>
              </div>
            </div>
          </div>
          <div className="expect">
            <div className="expect-item">
              <i className="iconfont icon-shangcheng11" />
              <div className="expect-title">
                <div>挖宝商城</div>
                <div>敬请期待</div>
              </div>
              <Icon type="right" />
            </div>
            <div className="expect-item">
              <i className="iconfont icon-ai250" />
              <div className="expect-title">
                <div>挖宝商城</div>
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
              <div>今日累计挖宝次数</div>
              <span>{digTimes.countAllTimesToday}</span>
            </div>
            <div className="item">
              <div>累计挖宝总数</div>
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
                {allRanking && allRanking.map((item, index) => {
                  return (
                    <div key={index} className="ranking-item">
                      <div className="ranking-title">
                        <span>{index + 1} </span>
                        {item.nickName}
                      </div>
                      <span>{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="ranking-list">
                {nearbyRank && nearbyRank.map((item, index) => {
                  return (
                    <div key={index} className="ranking-item">
                      <div className="ranking-title">
                        <span>{index + 1} </span>
                        {item.nickName}
                      </div>
                      <span>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </Tabs>
            <WhiteSpace />
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
