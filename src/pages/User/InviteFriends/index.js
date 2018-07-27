import React from 'react';
import { PageWithHeader } from '../../../components';
import { observer, inject } from 'mobx-react';
import './style.less';

@inject('userStore') // 如果注入多个store，用数组表示
@observer
class InviteFriends extends React.Component {

  /**
   * 点击"邀请好友"
   */
  onInvite = () => {
    this.props.history.push('/user/inviteDetail');
  };

  render () {
    const { invitationCode } = this.props.userStore;
    return (
      <div className="page-invite-friends">
        <PageWithHeader title="邀请好友" headerMarginBottom={0} fixed={false}>
          <div className="content">

            {/* 邀请码 */}
            <div className="code-area">
              <div className="code">{invitationCode}</div>
              <div className="code-btn">我的邀请码</div>
            </div>

            {/* 奖励规则 */}
            <div className="rule-area">
              <div className="rule-title">邀请奖励规则</div>
              <div className="rule-content">
                <p>奖励规则：</p>
                <p>1.每邀请一个好友完成注册，且该好友完成实名认证，您就可以获得10个太阳积分的奖励。</p>
                <p>2.你邀请的好友，其邀请一个好友完成注册，并完成实名认证，即二级好友，您将获得2个太阳积分的奖励。</p>
                <p>3.邀请的奖励积分将于第二天上午10点前统一发放，请关注您的积分记录。</p>
                <p>4.能源星球拥有法律范围内对于活动的最终解释权，并将严查虚假邀请行为，一经发现将取消奖励资格。</p>
              </div>
            </div>

            {/* 邀请按钮 */}
            <div className="invite-btn" onClick={this.onInvite}>
              立即邀请好友
            </div>

          </div>

          <div>

          </div>
        </PageWithHeader>
      </div>
    )
  }
}

export default InviteFriends;
