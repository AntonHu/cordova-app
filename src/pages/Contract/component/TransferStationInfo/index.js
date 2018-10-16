import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 电站转让的item
 */

class TransferStationInfo extends React.PureComponent {
  static defaultProps = {
    transferInfo: {}
  };

  static propTypes = {
    transferInfo: PropTypes.object.isRequired
  };
  render() {
    const {
      transferPublishTime,
      sellerId,
      plantNum,
      projectFinishTime,
      historyIncome,
      purchaseNumber,
      amount
    } = this.props.transferInfo;
    return (
      <div className="transfer-station-info-item">
        <div className="transfer-station-info-container">
          <div className="station-row">
            转让发布时间：
            {transferPublishTime || '无'}
          </div>
          <div className="station-row">
            转让人ID：
            {sellerId || '无'}
          </div>
          <div className="station-row">
            所属电站编号：
            {plantNum || '无'}
          </div>
          <div className="station-row">
            转让份数：
            {purchaseNumber || 0}
          </div>
          <div className="station-row">
            转让价格：
            {amount || 0}元
          </div>
          <div className="station-row">
            项目成团时间：
            {projectFinishTime || '无'}
          </div>
          <div className="station-row">
            历史收益情况：
            {historyIncome || 0}%
          </div>
        </div>
      </div>
    );
  }
}

export default TransferStationInfo;
