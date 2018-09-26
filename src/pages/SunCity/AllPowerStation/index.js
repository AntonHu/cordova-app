import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { reaction, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
  PageWithHeader,
  PlantInfoItem
} from '../../../components';
import { ActivityIndicator, ListView } from 'antd-mobile';
import './index.less';
import { POWER_TYPE } from '../../../utils/variable';
import PullToRefresh from 'pulltorefreshjs';

// 所有电站列表 包含普通电站 和 合约电站
@inject('contractStore')
@observer
class AllPowerStation extends React.Component {
  constructor(props) {
    super(props);
    const { plantList } = props.contractStore;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(toJS(plantList.list))
    };
  }

  componentDidMount() {
    const { plantList } = this.props.contractStore;
    if (plantList.list.length < 1) {
      plantList.initLoad()
    }
  }

  renderRow = (rowData) => {
    const item = rowData;
    return (
      <PlantInfoItem
        plantName={ item.plantName }
        capacity={ item.powerStationCapacity }
      />
    )
  };

  updateDataSource = reaction(
    () => this.props.contractStore.plantList.list,
    list => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(list)),
      });
    }
  );

  render() {
    const { plantList } = this.props.contractStore;
    const { isLoading } = plantList;
    return (
      <PageWithHeader title="我的电站" id="page-all-power-station" headerMarginBottom={0}>
        <div className="list-wrap">
          <div className="list-title">普通电站</div>
          <PlantInfoItem
            plantName="普通电站"
            icon="&#xe677;"
            onClick={ () => this.props.history.push('/sunCity/powerStation') }
          />
        </div>

        <div className="list-wrap">
          <div className="list-title">合约电站</div>
          <ListView


            renderFooter={ () => (
              <div style={ { padding: '20px', textAlign: 'center' } }>
                { plantList.isLoading ? '加载中...' : '没有更多' }
              </div>
            ) }
            dataSource={ this.state.dataSource }
            renderRow={ this.renderRow }
            useBodyScroll
            scrollRenderAheadDistance={ 800 }

          />
        </div>
        <ActivityIndicator animating={isLoading} text="正在加载合约电站..." toast/>
      </PageWithHeader>
    )
  }
}

export default AllPowerStation;
