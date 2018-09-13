import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, ContractProjectItem } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { mockDetail } from "../NotInvolvedDetail/mock";

// TODO:合约电站首页
class Contract extends React.PureComponent {
  render() {
    const projectList = mockDetail.historyProject || [];
    return (
      <PageWithHeader title="合约电站" leftComponent={ null } id="page-contract">
        {
          projectList.map((item, idx) =>
            <ContractProjectItem
              key={ idx }
              enterpriseName={ item.enterpriseName }
              annualRate={ item.annualRate }
              availableShare={ item.availableShare }
              dateTime={ item.created_at }
              powerStationCapacity={ item.powerStationCapacity }
              projectName={ item.projectName }
              soldShare={ item.soldShare }
            />)
        }
      </PageWithHeader>
    )
  }
}

export default Contract;
