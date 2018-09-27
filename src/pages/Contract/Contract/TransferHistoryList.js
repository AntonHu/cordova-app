import React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import {
  ListView,
  Modal,
  ActivityIndicator,
  Button
} from 'antd-mobile';
import './TransferHistoryList.less';
import { TransferHistory } from '../component';
import { TRANSFER_STATUS_CODE } from "../../../utils/variable";
import { getLocalStorage } from "../../../utils/storage";

const POWER_UNIT = 'kW'; //发电单位
const alert = Modal.alert;

// 合约电站首页
@inject('contractStore')
@observer
class TransferHistoryList extends React.Component {
  constructor(props) {
    super(props);
    const {
      transferHistoryList
    } = props.contractStore;

    const historySource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.orderId !== row2.orderId && row1.status !== row2.status
    });

    this.state = {
      historySource: historySource.cloneWithRows(toJS(transferHistoryList.list))
    };
  }

  componentWillUnmount() {
    this.updateHistorySource();
  }

  updateHistorySource = reaction(
    () => this.props.contractStore.transferHistoryList.list,
    list => {
      this.setState({
        historySource: this.state.historySource.cloneWithRows(toJS(list))
      });
    }
  );

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

  // 根据loginPhone判断用户角色
  // 用户是买家，显示卖家信息
  // 用户是卖家，显示买家信息
  displayInfoByPhone = (item) => {
    const phone = getLocalStorage('loginPhone');
    const info = {};
    info.isBuyer = phone === item.buyerPhone;
    if (info.isBuyer) {
      info.phone = item.sellerPhone;
      info.cardNumber = item.sellerBankCardNumber;
      info.bank = item.sellerBank;
      info.name = item.sellerName;
    } else {
      info.phone = item.buyerPhone;
      info.cardNumber = item.buyerBankCardNumber;
      info.bank = item.buyerBank;
      info.name = item.buyerName;
    }
    return info;
  };

  // 转让中 卖家可以取消转让
  // 未付款 买家可以确认付款
  // 待确认打款  卖家可以确认打款
  renderRow = rowData => {
    const item = rowData;
    const info = this.displayInfoByPhone(item);
    const {
      transferHistoryList
    } = this.props.contractStore;
    return (
      <TransferHistory
        key={ item.productId }
        projectName={ item.projectName }
        status={ item.status }
        count={ item.purchaseNumber || 0 }
        price={ item.amount || 0 }
        isBuyer={ info.isBuyer }
        sellerName={ info.name }
        openBank={ info.bank }
        bankAccount={ info.cardNumber }
        sellerContact={ item.phone }
      >
        {
          !info.isBuyer && item.status === TRANSFER_STATUS_CODE.VERIFYPAYMENT
          &&
          <Button
            className="positive-btn"
            onClick={ () => transferHistoryList.sellerVerify(item.orderId) }
          >
            确认打款
          </Button>
        }
        {
          /*todo: 还没调 */
          !info.isBuyer && item.status === TRANSFER_STATUS_CODE.DOING
          &&
          <Button
            className="negative-btn"
            onClick={ () => transferHistoryList.cancelTransfer(item.productId) }
          >
            取消转让
          </Button>
        }
        {
          info.isBuyer && item.status === TRANSFER_STATUS_CODE.UNPAYMENT
          &&
          <Button
            className="positive-btn"
            onClick={ () => transferHistoryList.buyerVerify(item.orderId) }
          >
            已支付
          </Button>
        }
      </TransferHistory>
    );
  };

  render() {
    const {
      transferHistoryList
    } = this.props.contractStore;
    return (
      <div className="tab-wrap">
        <ListView
          renderFooter={ () => (
            <div style={ { padding: '20px', textAlign: 'center' } }>
              { transferHistoryList.isLoading ? '加载中...' : '没有更多' }
            </div>
          ) }
          dataSource={ this.state.historySource }
          renderRow={ this.renderRow }
          useBodyScroll
          scrollRenderAheadDistance={ 800 }
        />
        <ActivityIndicator
          toast
          animating={ transferHistoryList.isLoading }
          text="正在加载列表..."
        />
      </div>
    );
  }
}

export default TransferHistoryList;
