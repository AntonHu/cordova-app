import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Toast } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

// 申购份额页面
class PurchaseShare extends React.PureComponent{
  state = {
    isAccept: false
  };

  onConfirm = () => {
    console.log(this.state.isAccept)
    if (!this.state.isAccept) {
      Toast.info('您尚未同意《电站建造登记运营代收电费授权书》');
      return;
    }
  };

  render() {
    const {isAccept } = this.state;
    return (
      <PageWithHeader title="投资份额确认书" id="page-purchase-share">
        <div className="content-wrap">
          <div className="content-text">
            甲方权利义务
            甲方有权了解委托资产的管理、使用及收支情况，但在行使该权利以不影响乙方正常管理和运作委托资产为限。甲方应保证其对委托资产，有完全的权利进行处理，且委托资产投入本合同约定的投资领域并不会导致任何法律纠纷。对乙方以及处理资产管理事务的情况和资料负有依法保密义务，未经乙方同意，不得向任何人透露。
            乙方权利义务
            乙方在符合有关法律规定的基础上，有权依据本协议约定可以对委托资产进行经营管理，并保障其以诚实信用、谨慎勤勉的原则管理和运用委托资产，保证资金安全。乙方承诺将受委托管理资产定向投资于公司合作的指定项目。
            收益与分配
            1、本协议自甲方全额出资的第二个月起，乙方需每月按照 投资总额/24 在扣除相应手续费后支付给甲方指定账户。
            2、本协议24个月之后甲方享受乙方公司纯利润40 %分红，直至乙方经营关闭为止。 税费的承担
            本协议项下的委托资产承担相应的税费，按照法律、行政法规和国家有关部门的规定办理。
            退出及清算
            甲方出资后，不得要求退回出资，除有下列情况之一出现：乙方决定终止委托经营；经甲、乙双方协商一致同意；因行政机关、司法机关或其他国家机关的法律行为，导致本委托资产管理不能正常运营。委托资产的清算人由乙方担任，清算人在本协议终止后，开始进行清算活动，出具清算报告，对委托财产收益进行分配。
            争议解决方式
            因本协议而产生或与本协议有关的一切争议，如经友好协商未能解决的，应向乙方所在地人民法院提起诉讼。
            其他
            本协议一式两份，甲乙双方各执一份。本协议自甲方投资全部划入乙方开设的指定账户之日起生效。有效期自———年——月——日至————年——月——日止。
            本协议未尽事宜，由甲乙双方协商解决
            ，也可以签订补充协议作为本协议的组成部分，
          </div>

          <div className="agreement-box">

            <div
              className={`agree-action ${isAccept ? 'accept' : ''}`}
              onClick={() => this.setState({ isAccept: !isAccept })}
            >
              <i className="iconfont">&#xe61d;</i>同意
            </div>
            <div className="agreement">《电站建造登记运营代收电费授权书》</div>
          </div>
        </div>

        <OrangeGradientBtn onClick={this.onConfirm}>
          确认
        </OrangeGradientBtn>
      </PageWithHeader>
    )
  }
}

export default PurchaseShare;
