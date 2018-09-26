import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import { Title, PageWithHeader, Picture, Rank, GreenButton } from '../../../components';
import { Icon, Tabs, WhiteSpace, Modal, List, Stepper, ActivityIndicator, Toast } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

// 我的银行卡
@inject('bankCardStore')
@observer
class MyBankCard extends React.Component {
  state = {
    hasCard: false
  };

  componentDidMount() {
    if (this.props.history.action !== 'POP') {
      this.isCardBind()
        .then(() => {
          this.setState({
            hasCard: true
          })
        })
        .catch(() => {
          this.setState({
            hasCard: false
          })
        })
    }
  }

  onAdd = () => {
    this.props.history.push('/contract/addBankCard');
  };

  isCardBind = async () => {
    const { bankCard, getBankCard } = this.props.bankCardStore;
    const bankCardObj = toJS(bankCard);

    return new Promise(async (resolve, reject) => {
      if (JSON.stringify(bankCardObj) !== '{}') {
        resolve()
      } else {
        const result = await getBankCard();
        if (result.success && result.data && result.data.bankCardNumber) {
          resolve()
        } else {
          reject()
        }
      }
    })
  };

  render() {
    const { bankCard, loadingBankCard } = this.props.bankCardStore;
    return (
      <PageWithHeader title="我的银行卡" id="page-my-bank-card">
        <div className="pay-wrap">
          <div className="info-title">银行卡信息：</div>
          <div className="info-item">支付账号：{ bankCard.bankCardNumber || '无' }</div>
          <div className="info-item">开户行：{ bankCard.bank || '无' }</div>
          <div className="info-item">联系人：{ bankCard.name || '无' }</div>
        </div>
        {
          !this.state.hasCard &&
          <GreenButton size={ 'big' } onClick={ this.onAdd }>添加银行卡</GreenButton>
        }
        <ActivityIndicator animating={ loadingBankCard } text="正在查询银行卡..." toast/>
      </PageWithHeader>
    )
  }
}

export default MyBankCard;
