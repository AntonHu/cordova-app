import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, InputItem, Toast } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';


// 填写银行卡页面
@inject('contractStore', 'bankCardStore')
@observer
class BankCard extends React.Component {
  state = {
    name: '',
    cardNumber: '',
    bank: ''
  };

  onSubmit = async () => {
    if (this.validateBeforeSubmit()) {
      const { name, bank, cardNumber } = this.state;
      this.props.bankCardStore.setBankCard({
        bankCardNumber: cardNumber,
        bank,
        name
      })
        .then(async result => {
          if (result.success) {
            Toast.info('添加银行卡成功');
            await this.props.bankCardStore.getBankCard();
            this.props.history.goBack();
          }
        })
        .catch(err => {
          if (err.msg) {
            Toast.info(err.msg);
          }
        })
    }
  };

  validateBeforeSubmit = () => {
    if (!this.state.name) {
      Toast.info('请输入姓名');
      return false;
    }
    if (!this.state.cardNumber) {
      Toast.info('请输入卡号');
      return false;
    }
    if (!this.state.bank) {
      Toast.info('请输入开户行');
      return false;
    }
    return true;
  };

  render() {
    const { name, cardNumber, bank } = this.state;
    return (
      <PageWithHeader title="填写银行卡" id="page-add-bankcard">
        <div className="tips">请填写电费结算收益卡信息，每期的电费收益将转至此卡。</div>
        <div className="form-box">
          <div className="card-info">银行卡信息</div>
          <InputItem
            value={ name }
            onChange={ (name) => this.setState({ name }) }
            labelNumber={ 3 }
            clear
          >
            姓名：
          </InputItem>
          <InputItem
            value={ cardNumber }
            onChange={ (cardNumber) => this.setState({ cardNumber }) }
            labelNumber={ 3 }
            clear
          >
            卡号：
          </InputItem>
          <InputItem
            value={ bank }
            onChange={ (bank) => this.setState({ bank }) }
            labelNumber={ 3 }
            clear
          >
            开户行：
          </InputItem>


        </div>
        <OrangeGradientBtn
          onClick={ this.onSubmit }
        >
          确认
        </OrangeGradientBtn>
      </PageWithHeader>
    )
  }
}

export default BankCard;
