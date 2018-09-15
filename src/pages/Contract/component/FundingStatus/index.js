import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import Picture from "../../../../components/Picture";

const shares = [
  {
    avatar: 'https://api.thundersdata.com/ebcapp//image/HEAD_IMG/2018/8/9/1533785564898.png',
    name: '124444444',
    time: '2018-05-12  12:88',
    buyShare: 4,
    buyAmount: 4000
  },
  {
    avatar: 'https://api.thundersdata.com/ebcapp//image/HEAD_IMG/2018/8/9/1533785564898.png',
    name: '124444444',
    time: '2018-05-12  12:88',
    buyShare: 4,
    buyAmount: 4000
  },
  {
    avatar: 'https://api.thundersdata.com/ebcapp//image/HEAD_IMG/2018/8/9/1533785564898.png',
    name: '124444444',
    time: '2018-05-12  12:88',
    buyShare: 4,
    buyAmount: 4000
  },

];

// 项目成团组件
class FundingStatus extends React.PureComponent {

  renderItem = (item, idx) => {
    return (
      <div className="share-wrap" key={idx}>
        <Picture size={60} src={item.avatar} />
        <div>
          <div className="buyer">{item.name}</div>
          <div className="buy-time">{item.time}</div>
        </div>
        <div>
          <div className="buy-amount">{`${item.buyAmount}元`}</div>
          <div className="buy-share">{`申购${item.buyShare}份`}</div>
        </div>
      </div>
    )
  };

  render() {
    return (
      <div className="funding-status">
        <div className="main-info">
          已投资10000元
        </div>
        <div className="sub-info">
          5分已申购，还差10份
        </div>

        <div className="share-list">
          {
            shares.map((item, idx) => this.renderItem(item, idx))
          }
        </div>
      </div>
    )
  }
}


export default FundingStatus;
