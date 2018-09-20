import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import { PROJECT_STATUS_CODE } from "../../../../utils/variable";

const tabs = [
  { title: '申购成功' },
  { title: '项目成团' },
  { title: '电站建设' },
  { title: '发电收益' },
];

// 项目进度（4个阶段）组件
class ProjectStep extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };


  tabIsAbleByStatus = (idx, projectDetail) => {
    const status = projectDetail.status || 0;
    if (idx === 0 || idx === 1) return true;
    if (idx === 2) {
      return status >= PROJECT_STATUS_CODE.BUILDING_PLANT;
    }
    if (idx === 3) {
      return status >= PROJECT_STATUS_CODE.TO_GRID
    }
  };

  // 每个tab有3个可能的状态：able、active、disable
  // able和active之间可以互相切换、disable状态不可点
  renderTabBar = (data) => {
    const { activeTab, tabs, goToTab } = data;
    return (
      <div className="step-tab-bar">
        {
          tabs.map((tab, idx) => {
            const activeClass = activeTab === idx ? 'active' : '';
            const ableClass = this.tabIsAbleByStatus(idx, this.props.projectDetail) ? 'able' : '';
            return (
              <React.Fragment>
                {
                  idx > 0
                  &&
                  <div className="divider"/>
                }
                <div
                  className={ `tab ${activeClass} ${ableClass}` }
                  key={ idx }
                  onClick={ () => {
                    if (!ableClass) {
                      return;
                    }
                    goToTab(idx)
                  } }
                >
                  <div className="tab-number">{ idx + 1 }</div>
                  <div className="tab-name">{ tab.title }</div>
                </div>
              </React.Fragment>
            )
          })
        }
      </div>
    )
  };

  render() {
    return (
      <div className="project-step">
        <Tabs
          tabs={ tabs }
          initialPage={ 0 }
          renderTabBar={ this.renderTabBar }
        >
          { this.props.children }
        </Tabs>
      </div>
    )
  }
}

ProjectStep.tabs = tabs;

export default ProjectStep;
