import React from 'react';
import { PageWithHeader } from '../../../components';
import { toJS, reaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { ListView } from 'antd-mobile';
import { PAGE_SIZE, INTEGRAL_TYPE } from '../../../utils/variable';
import './style.less';
/**
 * 挖宝
 */
@inject('miningStore', 'keyPair')
@observer
class SunIntegral extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.id !== row2.id
    });

    this.state = {
      dataSource,
      isLoading: false,
      page: 0
    };
  }

  hasMore = true;

  componentDidMount() {
    this.makeRequest(this.props, this.state.page);
  }


  makeRequest = (props, page) => {
    const { keyPair } = props;
    if (keyPair.hasKey) {
      this.props.miningStore
        .fetchTokenRecords({ page, publicKey: keyPair.publicKey })
        .then(data => {
          if (data.length < 1) {
            this.hasMore = false;
          }
        });
    }
  };

  renderRow = (rowData, sectionID, rowID) => {
    const icon = rowData.addWay === 'power' ? '\ue611' : '\ue6d1';
    return (
      <div key={rowData.tokenId} className="integral-item">
        <div className={`integral-pic ${rowData.addWay}`}>
          <i className="iconfont">{icon}</i>
        </div>
        <div className="integral-title">
          <div>{INTEGRAL_TYPE[rowData.addWay]}</div>
          <div>{rowData.gmtCreate}</div>
        </div>
        <div className="integral-number">
          {`+${rowData.solarIntegral.toFixed(4)}`}
        </div>
      </div>
    );
  };

  updateDataSource = reaction(
    () => this.props.miningStore.tokenRecords,
    tokenRecords => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(toJS(tokenRecords)),
        isLoading: false
      });
    }
  );

  onEndReached = () => {
    if (this.state.isLoading || !this.hasMore) {
      return;
    }
    this.setState(
      {
        isLoading: true,
        page: this.state.page + 1
      },
      () => {
        this.makeRequest(this.props, this.state.page);
      }
    );
  };

  render() {
    const { balance } = this.props.miningStore;
    return (

        <PageWithHeader title={'太阳积分'} id="page-sun-integral">
          <div className="integral">
            <div className="integral-survey">
              <div>我的太阳积分</div>
              <div className="number">{balance.toFixed(2)}</div>
            </div>
            <div className="integral-list">
              <div className="title">积分记录</div>
              <ListView
                initialListSize={PAGE_SIZE}
                pageSize={PAGE_SIZE}
                renderFooter={() => (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    {this.state.isLoading ? '加载中...' : '没有更多'}
                  </div>
                )}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                className="integral-list-view"
                useBodyScroll
                scrollRenderAheadDistance={800}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
              />
            </div>
          </div>
        </PageWithHeader>

    );
  }
}

export default SunIntegral;
