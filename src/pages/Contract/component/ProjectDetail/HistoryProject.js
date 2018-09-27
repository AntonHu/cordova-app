import React from 'react';
import PropTypes from 'prop-types';
import { ContractProjectItem } from "../../../../components";
import './HistoryProject.less';
import { Link } from "react-router-dom";


// 历史项目 组件
class HistoryProject extends React.PureComponent {
  static propTypes = {
    historyList: PropTypes.array.isRequired
  };

  render() {
    const { historyList } = this.props;
    return (
      <div className="history-project">
        {
          historyList.length > 0
            ?
            historyList.map((item, idx) => (
              <Link to={ `/contract/notInvolvedDetail/${item.id}` } key={ idx }>
                <ContractProjectItem

                  enterpriseName={ item.enterpriseName }
                  annualRate={ item.estimatedAnnualizedIncome }
                  availableShare={ item.availableShare }
                  dateTime={ item.createdAt }
                  powerStationCapacity={ item.powerStationCapacity }
                  projectName={ item.projectName }
                  soldShare={ item.soldShare }
                />
              </Link>
            ))
            :
            <div className="empty">暂无项目</div>
        }
      </div>
    )
  }
}

export default HistoryProject;
