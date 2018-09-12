import React from 'react';
import { Accordion } from 'antd-mobile';
import PropTypes from 'prop-types';
import './ProjectIntro.less';

// 项目简介组件
class ProjectIntro extends React.PureComponent {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {
    const { projectDetail } = this.props;
    return (
      <div className="_project-intro">
        <Accordion className="my-accordion">
          <Accordion.Panel header="项目简介">
            <div className="content">
              { projectDetail.projectDescription || '' }
            </div>
          </Accordion.Panel>
        </Accordion>
      </div>
    )
  }
}

export default ProjectIntro
