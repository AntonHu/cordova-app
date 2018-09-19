import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd-mobile';
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
    dateTime: PropTypes.string
  };

  progressText = (soldShare, availableShare) => {
    soldShare = soldShare || 0;
    availableShare = availableShare || 0;
    if (soldShare === 0) {
      return '无人参团'
    }
    if (availableShare === 0) {
      return '项目满团'
    }
    return `已购${soldShare}份，还剩${availableShare}份`
  };

  percent = (soldShare, availableShare) => {
    soldShare = soldShare || 0;
    availableShare = availableShare || 0;
    if (soldShare === 0 || availableShare === 0) {
      return 0
    }
    return soldShare / (soldShare + availableShare) * 100
  };

  render() {
    const { soldShare, annualRate, availableShare, dateTime, enterpriseName, powerStationCapacity, projectName } = this.props;
    return (
      <div className="contract-project-item">
        <div className="progress-box">
          <Progress percent={ this.percent(soldShare, availableShare) } position="normal"/>
          { this.progressText(soldShare, availableShare) }
        </div>

        <div className="info-box">
          <div className="annul-box">
            <div className="title">预期年化收益</div>
            <div className="number">{ annualRate || 0 }%</div>
          </div>
          <div className="name-box">
            <div className="project-name">{ projectName }</div>
            <div className="capacity">{ `电站容量：${powerStationCapacity || 0}kW` }</div>
          </div>
        </div>

        <div className="bottom-box">
          <div className="enterprise-name">{ `发布企业：${enterpriseName || '无'}` }</div>
          <div className="created-at">{ dateTime }</div>
        </div>
      </div>
    )
  }
}

export default ContractProjectItem;
