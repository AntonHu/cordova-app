import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import {
  ContractProjectItem
} from '../../../components';
import {
  ListView,
  ActivityIndicator
} from 'antd-mobile';
import './index.less';
import { PAGE_SIZE } from '../../../utils/variable';

@inject('contractStore')
@observer
class ProjectList extends React.Component{
  constructor(props) {
    super(props);
    const {
      projectList
    } = props.contractStore;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(toJS(projectList.list))
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const {
      projectList,
    } = this.props.contractStore;

    if (projectList.list.length < 1) {
      projectList.initLoad();
    }
  };

  updateDataSource = reaction(
    () => this.props.contractStore.projectList.list,
    list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(list))
      });
    }
  );

  renderRow = rowData => {
    const item = rowData;
    // TODO: click之前，reset掉notInvolvedDetail
    return (
      <Link to={`/contract/notInvolvedDetail/${item.id}`}>
        <ContractProjectItem
          key={item.id}
          enterpriseName={item.enterpriseName}
          annualRate={item.estimatedAnnualizedIncome}
          availableShare={item.availableShare}
          dateTime={item.createdAt}
          powerStationCapacity={item.powerStationCapacity}
          projectName={item.projectName}
          soldShare={item.soldShare}
        />
      </Link>
    );
  };

  onEndReached = () => {
    const { projectList } = this.props.contractStore;
    projectList.loadMore();
  };

  render() {
    const {
      projectList
    } = this.props.contractStore;
    return (
      <div className="tab-wrap">
        <ListView
          initialListSize={PAGE_SIZE}
          pageSize={PAGE_SIZE}
          renderFooter={() => (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              {projectList.isLoading ? '加载中...' : '没有更多'}
            </div>
          )}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          useBodyScroll
          scrollRenderAheadDistance={800}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <ActivityIndicator
          toast
          animating={projectList.isLoading}
          text="正在加载列表..."
        />
      </div>
    );
  }
}

export default ProjectList;
