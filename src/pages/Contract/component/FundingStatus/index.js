import React from 'react';
import PropTypes from 'prop-types';
import './index.less';
import Picture from "../../../../components/Picture";

// 项目成团组件
// todo:已不用，待删除
class FundingStatus extends React.PureComponent {
  static propTypes = {
    groupInfo: PropTypes.object.isRequired,
    purchaseDetail: PropTypes.object.isRequired
  };

  static defaultProps = {
    groupInfo: {},
    purchaseDetail: {}
  };

  renderItem = (item, idx) => {
    return (
      <div className="share-wrap" key={ idx }>
        <Picture size={ 60 } src={ item.avatar }/>
        <div>
          <div className="buyer">{ item.nickName || '匿名' }</div>
          <div className="buy-time">{ item.createdAt }</div>
        </div>
        <div>
          <div className="buy-amount">{ `${item.amount}元` }</div>
          <div className="buy-share">{ `申购${item.purchaseNumber}份` }</div>
        </div>
      </div>
    )
  };

  getSubInfo = (groupInfo) => {
    const soldShare = groupInfo.soldShare || 0;
    const availableShare = groupInfo.availableShare || 0;
    if (availableShare === 0) {
      return '项目成团';
    }
    return `${soldShare}份已申购，还差${availableShare}份`
  };

  render() {
    const { groupInfo, purchaseDetail } = this.props;
    const userPurchaseInfoList = groupInfo.userPurchaseInfoList || [];
    return (
      <div className="funding-status">
        <div className="main-info">
          已投资{ purchaseDetail.purchaseAmount || 0 }元
        </div>
        <div className="sub-info">
          { this.getSubInfo(groupInfo) }
        </div>

        <div className="share-list">
          {
            userPurchaseInfoList.map((item, idx) => this.renderItem(item, idx))
          }
        </div>
      </div>
    )
  }
}


export default FundingStatus;
