import React from 'react';
import PropTypes from 'prop-types';
import './ProjectHeader.less';

// 项目详情头部
class ProjectHeader extends React.PureComponent {
  // 头部组件可传入状态文字、可选择active或inactive
  static propTypes = {
    projectDetail: PropTypes.object.isRequired,
    statusText: PropTypes.string,
    isActive: PropTypes.bool
  };

  static defaultProps = {
    statusText: '待确认打款',
    isActive: true
  };

  render() {
    const { projectDetail, isActive, statusText } = this.props;
    const activeClass = isActive ? 'active' : '';
    // TODO: projectDetail缺预期年化收益率、浏览次数
    return(
      <div className={`_project-header ${activeClass}`}>
        {
          statusText &&
          <div className={`status-text ${activeClass}`}>{statusText}</div>
        }
        <div className="project-name">
          {projectDetail.projectName || ''}
        </div>

        <div className="purchase-amount">
          {projectDetail.foo || ' '}
        </div>

        <div className="amount-box">
          <div className="amount">
            投资金额
            <div className="number">{projectDetail.minInvestmentAmount || 0}元</div>
          </div>
          <div className="annual-rate">
            预期年化收益
            <div className="number">{projectDetail.minInvestmentAmount || 0}%</div>
          </div>
        </div>

        <div className={`bottom-box ${activeClass}`}>
          <div className="time bottom-item">
            <i className="iconfont">&#xe629;</i>
            {projectDetail.estimatedRevenueStartTime}
          </div>
          <div className="browser bottom-item">
            <i className="iconfont">&#xe693;</i>
            {projectDetail.otherCosts}
          </div>
          <div className="share bottom-item">
            <i className="iconfont">&#xe61c;</i>
            已购{projectDetail.soldShare}份，还剩{projectDetail.availableShare}份
          </div>

        </div>
      </div>
    )
  }
}

export default ProjectHeader;
