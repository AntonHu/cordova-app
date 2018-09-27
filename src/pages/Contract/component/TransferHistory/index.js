import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import { TRANSFER_STATUS_CODE } from "../../../../utils/variable";

/**
 * 转让历史的item组件
 */

class TransferHistory extends React.PureComponent {
  static defaultProps = {
    projectName: '未知项目名', //项目名称
    status: 0, //支付状态
    count: 0, //份数
    price: 0, //价格
    sellerName: 'XXX', //卖家姓名
    openBank: 'XXX', //开户行
    bankAccount: 'XXX', //银行账户
    sellerContact: 'XXX', //卖家联系方式
    confirmPay: () => {}, //确认打款
    cancelPay: () => {}, //取消打款
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
    confirmPay: PropTypes.func,
    cancelPay: PropTypes.func,
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
      confirmPay,
      cancelPay,
      isBuyer
    } = this.props;
    //根据status控制状态的样式
    const isSure = status === '' ? true : false;
    const roleText = isBuyer ? '卖家' : '买家';
    return (
      <div className="transfer-history-item">
        <div className="item-top">
          <span className="project-name">{projectName}</span>
          <span className="noPay">状态：{this.getStatusText(status)}</span>
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
              {roleText}姓名：
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
              {roleText}联系方式：
              {sellerContact}
            </span>
          </div>
        </div>

        <div className="item-bottom">
          {
            this.props.children
          }
          {/*{isSure ? (*/}
            {/*<span className="hasPay">已经支付</span>*/}
          {/*) : (*/}
            {/*<div>*/}
              {/*<span className="pay-money" onClick={confirmPay}>*/}
                {/*确认打款*/}
              {/*</span>*/}
              {/*<span className="hasPay" onClick={cancelPay}>*/}
                {/*取消转让*/}
              {/*</span>*/}
            {/*</div>*/}
          {/*)}*/}

        </div>
      </div>
    );
  }
}

export default TransferHistory;
