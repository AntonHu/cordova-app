import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, InputItem } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';


// 填写银行卡页面
class BankCard extends React.PureComponent {
  state = {
    name: '',
    cardNumber: '',
    bank: ''
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
          onClick={ () => {
          } }
        >
          确认
        </OrangeGradientBtn>
      </PageWithHeader>
    )
  }
}

export default BankCard;
