import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 电站转让的item
 */

class StationTransfer extends React.PureComponent {
  static defaultProps = {
    money: 0, //金额
    projectName: '未知项目名', //项目名称
    stationCapacity: 0, //电站容量
    profitYear: 0 //预期年化收益
  };

  static propTypes = {
    money: PropTypes.number.isRequired,
    projectName: PropTypes.string.isRequired,
    stationCapacity: PropTypes.string.isRequired,
    profitYear: PropTypes.string.isRequired
  };
  render() {
    const { money, projectName, stationCapacity, profitYear } = this.props;
    return (
      <div className="station-transfer-item">
        <div className="station-row">
          <div>
            <span className="money-font">￥</span>
            <span className="money">{money}</span>
            <span className="money-font">（元）</span>
          </div>
          <div>
            <span className="project-name">{projectName}</span>
          </div>
        </div>
        <div className="station-row-two">
          <div>
            <span className="row-two-font capacity">
              电站容量：
              {stationCapacity}
            </span>
          </div>
          <div>
            <span className="row-two-font profit">
              预期年化收益：
              {profitYear}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default StationTransfer;
