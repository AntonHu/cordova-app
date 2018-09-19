import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

// 投资份额确认书
class ShareConfirm extends React.PureComponent{

  state = {
    countDown: [0, 0, 1, 4, 3, 5]
  };

  onCancel = () => {};

  onPaid = () => {};

  // TODO：倒计时函数，传入倒计时的min。
  startCountdown = (min) => {};

  render() {
    const { countDown } = this.state;
    return (
      <PageWithHeader title="申购份额" id="page-share-confirm">

        <div className="count-down-wrap">
          <div className="title">恭喜申购8000元 已锁定！</div>
          <div className="title">请尽快支付</div>
          <div className="count-down-box">
            <span className="count-down-num even">{countDown[0]}</span>
            <span className="count-down-num odd">{countDown[1]}</span>时
            <span className="count-down-num even">{countDown[2]}</span>
            <span className="count-down-num odd">{countDown[3]}</span>分
            <span className="count-down-num even">{countDown[4]}</span>
            <span className="count-down-num odd">{countDown[5]}</span>秒
          </div>
          <div className="warn">请于30分钟内支付受托运营方申购金额，付款完成点击已支付，超期未支付自动取消申购</div>
        </div>

        <div className="pay-wrap">
          <div className="info-title">付款信息：</div>
          <div className="info-item">支付账号：</div>
          <div className="info-item">开户行：</div>
          <div className="info-item">联系人：</div>
          <div className="info-item">联系电话：</div>
        </div>

        <div className="pay-tip">
          支付完成后，企业电站运营方将会验证通过你的申购申请
        </div>

        <div className="btn-wrap">
          <Button onClick={this.onCancel}>
            取消申购
          </Button>
          <OrangeGradientBtn onClick={this.onPaid}>
            已支付
          </OrangeGradientBtn>
        </div>
      </PageWithHeader>
    )
  }
}

export default ShareConfirm;
