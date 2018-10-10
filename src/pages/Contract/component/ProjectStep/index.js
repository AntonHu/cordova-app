import React from 'react';
import { Tabs } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';

const tabs = [
  { title: '项目信息' },
  { title: '发电收益' },
];

// 项目进度 tab组件
class ProjectStep extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  // 每个tab有3个可能的状态：able、active、disable
  // able和active之间可以互相切换、disable状态不可点
  // className有active就是active，有able就是able，都没有就是disable
  renderTabBar = (data) => {
    const { activeTab, tabs, goToTab } = data;
    return (
      <div className="step-tab-bar">
        {
          tabs.map((tab, idx) => {
            const activeClass = activeTab === idx ? 'active' : '';
            const ableClass = 'able';
            return (
              <React.Fragment key={ idx }>
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
          swipeable={ false }
        >
          { this.props.children }
        </Tabs>
      </div>
    )
  }
}

ProjectStep.tabs = tabs;

export default ProjectStep;
