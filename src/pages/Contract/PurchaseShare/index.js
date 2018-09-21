import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Toast, Button, Modal } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

const COUNT_DOWN_MIN = 15 * 60;

const secToTimeArray = (totalSec) => {
  let hours = Math.floor(totalSec / 3600);
  totalSec = totalSec - hours * 3600;
  let minutes = Math.floor(totalSec / 60);
  let seconds = totalSec - minutes * 60;

  hours = hours < 10 ? '0' + hours : '' + hours;
  minutes = minutes < 10 ? '0' + minutes : '' + minutes;
  seconds = seconds < 10 ? '0' + seconds : '' + seconds;
  return (hours + minutes + seconds).split('').map(num => +num);
};

// 申购份额页面
@inject('contractStore', 'bankCardStore')
@observer
class PurchaseShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: COUNT_DOWN_MIN,
    }
  }

  componentDidMount() {
    this.startCountdown();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  onCancel = () => {
    Modal.alert('取消申购', '您确定要取消申购？', [{ text: '再想想' }, {
      text: '是的', onPress: () => {
        this.sendCancelReq();
      }
    }])
  };

  onPaid = () => {
    Modal.alert('已支付', '您确认已经支付？', [{ text: '没有' }, {
      text: '确实付了', onPress: () => {
        this.sendConfirmReq();
      }
    }])
  };

  sendCancelReq = async () => {
    const { notInvolvedDetail } = this.props.contractStore;
    const {projectId, purchaseId} = this.props.match.params;
    const result = await notInvolvedDetail.onCancelPurchase({
      projectId,
      purchaseId
    });
    if (result.success) {
      Modal.alert('取消', '您已取消支付，即将返回首页', [{
        text: '好的', onPress: () => {
          this.backToContract();
        }
      }])
    }
  };

  sendConfirmReq = async () => {
    const { notInvolvedDetail } = this.props.contractStore;
    const {projectId, purchaseId} = this.props.match.params;
    const result = await notInvolvedDetail.onConfirmPay({
      projectId,
      purchaseId
    });

    if (result.success) {
      Modal.alert('已支付', '您已确认支付，即将返回首页', [{
        text: '好的', onPress: () => {
          this.backToContract();
        }
      }])
    }
  };

  // 回到合约电站首页
  backToContract = () => {
    const { notInvolvedDetail } = this.props.contractStore;
    notInvolvedDetail.reset();
    this.props.history.go(-3)
  };

  startCountdown = () => {
    this.interval = setInterval(() => {
      if (this.state.countDown === 0) {
        clearInterval(this.interval);
      } else {
        this.setState({
          countDown: this.state.countDown - 1
        })
      }
    }, 1000);
  };

  render() {
    const { countDown } = this.state;
    const { bankCard } = this.props.bankCardStore;
    const { notInvolvedDetail } = this.props.contractStore;
    const countDownArray = secToTimeArray(countDown);
    return (
      <PageWithHeader
        title="申购份额"
        id="page-purchase-share"
        leftComponent={ null }
        rightComponent={ <Button className="back-to-contract" onClick={ this.backToContract }>返回首页</Button> }
      >

        <div className="count-down-wrap">
          <div className="title">恭喜申购{notInvolvedDetail.purchaseAmount || 0}元 已锁定！</div>
          <div className="title">请尽快支付</div>
          <div className="count-down-box">
            <span className="count-down-num even">{ countDownArray[0] }</span>
            <span className="count-down-num odd">{ countDownArray[1] }</span>时
            <span className="count-down-num even">{ countDownArray[2] }</span>
            <span className="count-down-num odd">{ countDownArray[3] }</span>分
            <span className="count-down-num even">{ countDownArray[4] }</span>
            <span className="count-down-num odd">{ countDownArray[5] }</span>秒
          </div>
          <div className="warn">请于30分钟内支付受托运营方申购金额，付款完成点击已支付，超期未支付自动取消申购</div>
        </div>

        <div className="pay-wrap">
          { /* todo: 待确认：不是付款信息，是代收卡信息 */ }
          <div className="info-title">代收卡信息：</div>
          <div className="info-item">支付账号：{ bankCard.bankCardNumber || '无' }</div>
          <div className="info-item">开户行：{ bankCard.bank || '无' }</div>
          <div className="info-item">联系人：{ bankCard.name || '无' }</div>
          { /*<div className="info-item">联系电话：</div>*/ }
        </div>

        <div className="pay-tip">
          支付完成后，企业电站运营方将会验证通过你的申购申请
        </div>

        <div className="btn-wrap">
          <Button onClick={ this.onCancel }>
            取消申购
          </Button>
          <OrangeGradientBtn onClick={ this.onPaid }>
            已支付
          </OrangeGradientBtn>
        </div>
      </PageWithHeader>
    )
  }

}

export default PurchaseShare;
