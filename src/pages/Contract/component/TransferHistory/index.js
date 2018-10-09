import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import { TRANSFER_STATUS_CODE } from '../../../../utils/variable';

/**
 * 转让历史的item组件
 */

class TransferHistory extends React.PureComponent {
  static defaultProps = {
    projectName: '未知项目名', //项目名称
    status: 0, //支付状态
    count: 0, //份数
    price: 0, //价格
    sellerName: '', //卖家姓名
    openBank: '', //开户行
    bankAccount: '', //银行账户
    sellerContact: '', //卖家联系方式
    isBuyer: false //用户相对于当前转让的身份，是卖家还是买家
  };

  static propTypes = {
    projectName: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    openBank: PropTypes.string.isRequired,
    bankAccount: PropTypes.string.isRequired,
    sellerContact: PropTypes.string.isRequired,
    isBuyer: PropTypes.bool
  };

  getStatusText = status => {
    switch (status) {
      case TRANSFER_STATUS_CODE.DOING:
        return '转让中';
      case TRANSFER_STATUS_CODE.UNPAYMENT:
        return '未付款';
      case TRANSFER_STATUS_CODE.VERIFYPAYMENT:
        return '待确认打款';
      case TRANSFER_STATUS_CODE.DOWN:
        return '完成';
      case TRANSFER_STATUS_CODE.CANCEL:
        return '取消';
      default:
        return '无';
    }
  };

  render() {
    const {
      projectName,
      status,
      count,
      price,
      sellerName,
      openBank,
      bankAccount,
      sellerContact,
      isBuyer
    } = this.props;
    //根据status控制状态的样式
    const roleText = isBuyer ? '卖家' : '买家';
    console.log(this.props);
    return (
      <div className="transfer-history-item">
        <div className="item-top">
          <span className="project-name">
            <span className="top-transfer">转</span>
            {projectName}
          </span>
          <span className="noPay">
            状态：
            {this.getStatusText(status)}
          </span>
        </div>
        {/*详细信息*/}
        <div className="item-detail">
          <div className="share-money">
            <span className="share-money-count">￥{price || '0'}</span>
          </div>

          <div className="item-per-info">
            <div className="item-per-detail-info">
              <span className="detail-info-text-key">买家</span>
              <span className="detail-info-text-value">{'暂无信息'}</span>
            </div>
            <div className="item-per-detail-info">
              <span className="detail-info-text-key">联系方式</span>
              <span className="detail-info-text-value">
                {sellerContact || '暂无信息'}
              </span>
            </div>
            <div className="item-per-detail-info">
              <span className="detail-info-text-key">开户行</span>
              <span className="detail-info-text-value">
                {openBank || '暂无信息'}
              </span>
            </div>
            <div className="item-per-detail-info">
              <span className="detail-info-text-key">银行账户</span>
              <span className="detail-info-text-value">
                {bankAccount || '暂无信息'}
              </span>
            </div>
          </div>
        </div>
        <div className="item-bottom">{this.props.children}</div>
      </div>
    );
  }
}

export default TransferHistory;
