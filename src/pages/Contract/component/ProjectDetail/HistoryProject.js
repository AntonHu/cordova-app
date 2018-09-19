import React from 'react';
import PropTypes from 'prop-types';
import {ContractProjectItem} from "../../../../components";
import './HistoryProject.less';


// 历史项目 组件
class HistoryProject extends React.PureComponent{
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {
    const { projectDetail } = this.props;
    const historyProjects = projectDetail.historyProject || [];
    return (
      <div className="history-project">
        {
          historyProjects.length > 0
          ?
            historyProjects.map((item, idx) => (
              <ContractProjectItem
                key={idx}
                enterpriseName={item.enterpriseName}
                annualRate={item.annualRate}
                availableShare={item.availableShare}
                dateTime={item.created_at}
                powerStationCapacity={item.powerStationCapacity}
                projectName={item.projectName}
                soldShare={item.soldShare}
              />
            ))
            :
            <div>暂无项目</div>
        }
      </div>
    )
  }
}

export default HistoryProject;
