import React from 'react';
import { PageWithHeader, Header } from '../../../../components';
import {Modal} from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import './style.less';

const alert = Modal.alert;

@inject('userStore') // 如果注入多个store，用数组表示
@observer
class InviteDetail extends React.PureComponent {

  componentDidMount() {
    this.showGuide();
  }

  /**
   * 获取邀请码
   */
  showGuide = () => {
    alert('如何分享', '用手机截图把这个页面保存下来，然后分享给好友。加入能量星球，每天抢10万积分', [{text: '知道了'}])
  };

  render () {
    const { invitationCode } = this.props.userStore;
    return (
      <div className="page-invite-detail">
        <Header title="" transparent={true}/>
        {/* 能源星球 */}
        <div className="name-area">
          <img src={require('../../../../images/app_name.png')} className="name-png" />
          <div className="sub-title">助力新能源</div>
        </div>

        {/* 邀请详情 */}
        <div className="detail-area">
          <div className="code-area">
            <div className="code-title">我的邀请码</div>
            <div className="code">{invitationCode}</div>
          </div>

          <div className="qrcode-area">
            <img src={require('../../../../images/qrcode.png')} className="qrcode-png"/>
            <div className="qrcode-info">
              <p>真 壕 友 ， 一 起 玩</p>
              <p>扫 码 立 即 下 载 能 量 星 球 A P P</p>
            </div>
          </div>

          <div className="info-area">
            <img src={require('../../../../images/icon.png')} className="icon-png" />
            <div className="info">
              <p>多个品牌电站，一个APP查看</p>
              <p>你发电，我发积分</p>
              <p>每天10W积分免费发放</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InviteDetail;
