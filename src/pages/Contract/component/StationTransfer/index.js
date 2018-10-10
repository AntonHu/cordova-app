import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import { Picture } from '../../../../components/index';
import './index.less';

/**
 * 电站转让的item
 */

class StationTransfer extends React.PureComponent {
  static defaultProps = {
    money: 0, //金额
    beforeMoney: 0, //未折损的金额
    sellerName: '', //转让人姓名
    imageSrc: '', //转让人头像地址
    projectName: '未知项目名', //项目名称
    stationCapacity: 0, //电站容量
    transferPublishTime: '-', //预期年化收益
    carrieroperator: '', //运营商
    count: 0 //观看次数
  };

  static propTypes = {
    money: PropTypes.number.isRequired,
    beforeMoney: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    stationCapacity: PropTypes.string.isRequired,
    transferPublishTime: PropTypes.string.isRequired,
    carrieroperator: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
  };
  render() {
    const {
      money,
      beforeMoney,
      sellerName,
      imageSrc,
      projectName,
      stationCapacity,
      transferPublishTime,
      count,
      carrieroperator
    } = this.props;
    return (
      <div className="station-transfer-item">
        <div className="transfer-item-top">
          <div className="item-picture-box">
            <Picture src={imageSrc} />
            <span className="seller-name">{sellerName || '暂无信息'}</span>
          </div>
          <div>
            <span className="transfer-money">￥{money || 0}</span>
            <del className="del-money">￥{beforeMoney || 0}</del>
          </div>
        </div>
        <div className="transfer-item-content">
          <div className="item-key-box">
            <span className="project-name">{projectName || '暂无信息'}</span>
          </div>
          <div className="item-key-box">
            <span className="project-item-text">运营商</span>
            <span className="project-item-text">
              {carrieroperator || '暂无信息'}
            </span>
          </div>
          <div className="item-key-box">
            <span className="project-item-text">电站容量</span>
            <span className="project-item-text">{stationCapacity || '-'}</span>
          </div>
        </div>
        <div className="transfer-item-bottom">
          <div className="bottom-time">
            <i className="iconfont time-size">&#xe629;</i>
            <span>{transferPublishTime || '暂无数据'}</span>
          </div>
          <div className="bottom-count">
            <i className="iconfont count-size">&#xe693;</i>
            <span>{count || 0}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default StationTransfer;
