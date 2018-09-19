import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 转让历史的item组件
 */

class TransferHistory extends React.PureComponent {
  static defaultProps = {
    projectName: '未知项目名', //项目名称
    status: '未知状态', //支付状态
    count: 0, //份数
    price: 0, //价格
    sellerName: 'XXX', //卖家姓名
    openBank: 'XXX', //开户行
    bankAccount: 'XXX', //银行账户
    sellerContact: 'XXX', //卖家联系方式
    confirmPay: () => {}, //确认打款
    cancelPay: () => {} //取消打款
  };

  static propTypes = {
    projectName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    sellerName: PropTypes.string.isRequired,
    openBank: PropTypes.string.isRequired,
    bankAccount: PropTypes.string.isRequired,
    sellerContact: PropTypes.string.isRequired,
    confirmPay: PropTypes.func,
    cancelPay: PropTypes.func
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
      confirmPay,
      cancelPay
    } = this.props;
    //根据status控制状态的样式
    const isSure = status === '' ? true : false;
    return (
      <div className="transfer-history-item">
        <div className="item-top">
          <span className="project-name">{projectName}</span>
          {isSure ? (
            <span className="hasPay">状态：已支付</span>
          ) : (
            <span className="noPay">状态：未支付</span>
          )}
        </div>
        {/*详细信息*/}
        <div className="item-detail">
          <div className="detail-row">
            <span className="detail-font">
              份数：
              {count}
            </span>
            <span className="detail-font">
              价格：
              {price}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-font">
              卖家姓名：
              {sellerName}
            </span>
            <span className="detail-font">
              开户行：
              {openBank}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-font">
              银行账户：
              {bankAccount}
            </span>
            <span className="detail-font">
              卖家联系方式：
              {sellerContact}
            </span>
          </div>
        </div>

        <div className="item-bottom">
          {isSure ? (
            <span className="hasPay">已经支付</span>
          ) : (
            <div>
              <span className="pay-money" onClick={confirmPay}>
                确认打款
              </span>
              <span className="hasPay" onClick={cancelPay}>
                取消转让
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TransferHistory;
