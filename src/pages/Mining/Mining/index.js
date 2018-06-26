import React from 'react';
import { withRouter } from 'react-router-dom';

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
class Comp extends React.PureComponent {
  state = {
    equipmentList: [
      {
        title: '测试1',
        number: '12345'
      },
      {
        title: '测试2',
        number: '12345'
      },
      {
        title: '测试3',
        number: '12345'
      }
    ]
  };
  render() {
    return (
      <div className={'page-mining'}>
        <PageWithHeader title={'挖宝池'}>
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
                <div className="rank">552</div>
              </div>
              <Icon
                type="right"
                onClick={() => this.props.history.push('/sunIntegral')}
              />
            </div>
            <div className="my-profit">
              <div className="profit-item">
                <div className="profit-title">今日发电</div>
                <div className="profit-number">899kw/h</div>
              </div>
              <div className="profit-item">
                <div className="profit-title">今日发电</div>
                <div className="profit-number">899kw/h</div>
              </div>
              <div className="profit-item">
                <div className="profit-title">今日发电</div>
                <div className="profit-number">899kw/h</div>
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
            {this.state.equipmentList.map((item, index) => {
              return (
                <div key={index} className="item">
                  <div>{item.title}</div>
                  <span>{item.number}</span>
                </div>
              );
            })}
          </div>
          <div className="ranking">
            <Tabs
              tabs={tabs2}
              initialPage={0}
              renderTab={tab => <span>{tab.title}</span>}
            >
              <div className="ranking-list">
                {this.state.equipmentList.map((item, index) => {
                  return (
                    <div key={index} className="ranking-item">
                      <div className="ranking-title">
                        {index === 0 ? (
                          <Icon type="loading" />
                        ) : (
                          <span>{index + 1} </span>
                        )}
                        {item.title}
                      </div>
                      <span>{item.number}</span>
                    </div>
                  );
                })}
              </div>
              <div className="ranking-list">
                {this.state.equipmentList.map((item, index) => {
                  return (
                    <div key={index} className="ranking-item">
                      <div className="ranking-title">
                        {index === 0 ? (
                          <Icon type="loading" />
                        ) : (
                          <span>{index + 1} </span>
                        )}
                        {item.title}
                      </div>
                      <span>{item.number}</span>
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
