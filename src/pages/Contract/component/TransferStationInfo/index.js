import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 电站转让的item
 */

class TransferStationInfo extends React.PureComponent {
  static defaultProps = {
    transferTime: '2019-05-12', //转让时间
    transferMan: 0, //转让人ID
    stationNumber: 0, //所属电站编号
    projectTime: '2019-05-12', //项目成团时间
    historyProfit: 0 //历史收益情况
  };

  static propTypes = {
    transferTime: PropTypes.string.isRequired,
    projetransferManctName: PropTypes.number.isRequired,
    stationNumber: PropTypes.number.isRequired,
    projectTime: PropTypes.string.isRequired,
    historyProfit: PropTypes.number.isRequired
  };
  render() {
    const {
      transferTime,
      transferMan,
      stationNumber,
      projectTime,
      historyProfit
    } = this.props;
    return (
      <div className="transfer-station-info-item">
        <div className="transfer-station-info-container">
          <div className="station-row">
            转让发布时间：
            {transferTime}
          </div>
          <div className="station-row">
            转让人ID：
            {transferMan}
          </div>
          <div className="station-row">
            所属电站编号：
            {stationNumber}
          </div>
          <div className="station-row">
            项目成团时间：
            {projectTime}
          </div>
          <div className="station-row">
            历史收益情况：
            {historyProfit} %
          </div>
        </div>
      </div>
    );
  }
}

export default TransferStationInfo;
