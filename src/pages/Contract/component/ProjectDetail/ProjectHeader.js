import React from 'react';
import PropTypes from 'prop-types';
import './ProjectHeader.less';
import { USER_PROJECT_STATUS_CODE } from "../../../../utils/variable";

// 项目详情头部
class ProjectHeader extends React.PureComponent {
  // 头部组件可传入状态文字、可选择active或inactive
  static propTypes = {
    projectDetail: PropTypes.object.isRequired,
    statusText: PropTypes.string,
    purchaseDetail: PropTypes.object
  };

  static defaultProps = {
    statusText: ''
  };

  isActive = (purchaseDetail) => {
    // 只有驳回状态下，是灰的
    return purchaseDetail.userStatus !== USER_PROJECT_STATUS_CODE.REJECTED;
  };

  getStatusText = (purchaseDetail) => {
    switch (purchaseDetail.userStatus) {
      case USER_PROJECT_STATUS_CODE.APPLIED:
        return '代付款';
      case USER_PROJECT_STATUS_CODE.PAID:
        return '已付款';
      case USER_PROJECT_STATUS_CODE.SUCCESSFUL_PURCHASE:
        return '申购成功';
      case USER_PROJECT_STATUS_CODE.CANCELED_PURCHASE:
        return '取消申购';
      case USER_PROJECT_STATUS_CODE.TIME_OUT:
        return '超时';
      default:
        return ''
    }
  };

  render() {
    const { projectDetail } = this.props;
    const purchaseDetail = this.props.purchaseDetail || {};
    const activeClass = this.isActive(projectDetail) ? 'active' : '';
    const statusText = this.getStatusText(purchaseDetail);

    return (
      <div className={ `_project-header ${activeClass}` }>
        {
          statusText &&
          <div className={ `status-text ${activeClass}` }>{ statusText }</div>
        }
        <div className="project-name">
          { projectDetail.projectName || '' }
        </div>

        <div className="purchase-amount">
          { purchaseDetail.purchaseAmount ? `申购${purchaseDetail.purchaseAmount}元` : ' ' }
        </div>

        <div className="amount-box">
          <div className="amount">
            投资金额
            <div className="number">{ projectDetail.minInvestmentAmount || 0 }元</div>
          </div>
          <div className="annual-rate">
            预期年化收益
            <div className="number">{ projectDetail.estimatedAnnualizedIncome || 0 }%</div>
          </div>
        </div>

        <div className={ `bottom-box ${activeClass}` }>
          <div className="time bottom-item">
            <i className="iconfont">&#xe629;</i>
            { projectDetail.createdAt || '' }
          </div>
          <div className="browser bottom-item">
            <i className="iconfont">&#xe693;</i>
            { projectDetail.views || 0 }
          </div>
          <div className="share bottom-item">
            <i className="iconfont">&#xe61c;</i>
            已购{ projectDetail.soldShare || 0 }份，还剩{ projectDetail.availableShare || 0 }份
          </div>

        </div>
      </div>
    )
  }
}

export default ProjectHeader;
