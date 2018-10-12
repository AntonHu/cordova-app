import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd-mobile';
import { Picture } from '../index';
import './index.less';

// 合约电站的项目Item，包含进度条、名字、预期年化收益、电站容量、发布企业、时间
class ContractProjectItem extends React.PureComponent {
  static propTypes = {
    soldShare: PropTypes.number,
    availableShare: PropTypes.number,
    annualRate: PropTypes.number,
    projectName: PropTypes.string,
    powerStationCapacity: PropTypes.number,
    enterpriseName: PropTypes.string,
    dateTime: PropTypes.string,
    imgSrc: PropTypes.string, //图片地址
    count: PropTypes.number, //查看次数
    investmentAmount: PropTypes.number //投资总金额
  };

  progressText = (soldShare, availableShare) => {
    soldShare = soldShare || 0;
    availableShare = availableShare || 0;
    if (soldShare === 0) {
      return <div className="progress-text">无人参团</div>;
    }
    if (availableShare === 0) {
      return <div className="progress-text">项目满团</div>;
    }
    return (
      <div className="progress-text">
        <div>
          已购
          {soldShare}份
        </div>
        <div>
          还剩
          {availableShare}份
        </div>
      </div>
    );
  };

  percent = (soldShare, availableShare) => {
    soldShare = soldShare || 0;
    availableShare = availableShare || 0;
    if (soldShare === 0 || soldShare + availableShare === 0) {
      return 0;
    }
    return (soldShare / (soldShare + availableShare)) * 100;
  };

  render() {
    const {
      soldShare,
      availableShare,
      dateTime,
      enterpriseName,
      powerStationCapacity,
      projectName,
      imgSrc,
      count,
      investmentAmount
    } = this.props;
    return (
      <div className="contract-project-item">
        <div className="project-item-content">
          {/*左侧图片，需要一个图片丢失的默认图片地址*/}
          <div className="project-item-picture">
            <img
              className="project-item-picture"
              alt="图片丢失了..."
              src={imgSrc ? imgSrc : require('../../images/icon.png')}
            />
          </div>
          {/*右侧详情*/}
          <div className="project-item-info">
            <div className="item-title-box">
              <span className="item-title">{projectName || '未知名项目'}</span>
            </div>
            <div>
              <span className="item-detail-info">
                运营商：
                {enterpriseName || '未知名企业'}
              </span>
            </div>
            <div>
              <span className="item-detail-info">
                电站容量：
                {powerStationCapacity || '-'} kW
              </span>
            </div>
            <div className="item-money">
              <span className="total-money">￥{investmentAmount || '0'}</span>
            </div>
          </div>
        </div>

        {/*进度条*/}
        <div className="progress-box">
          <Progress
            percent={this.percent(soldShare, availableShare)}
            position="normal"
          />
          <span className="current-progress">
            {this.percent(soldShare, availableShare)}%
          </span>
        </div>
        {/*底部信息*/}
        <div className="project-item-bottom">
          <span>
            <i className="iconfont bottom-font-size-time">&#xe629;</i>
            {dateTime || '-'}
          </span>
          <span className="bottom-count">
            <i className="iconfont bottom-font-size-count">&#xe693;</i>
            {count || 0}
          </span>
        </div>
      </div>
    );
  }
}

export default ContractProjectItem;
