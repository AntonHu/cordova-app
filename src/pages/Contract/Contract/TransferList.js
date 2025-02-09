import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import { ListView, Modal, ActivityIndicator } from 'antd-mobile';
import './index.less';
//电站转让列表Item
import { StationTransfer } from '../component';

const POWER_UNIT = 'kW'; //发电单位
const alert = Modal.alert;

// 合约电站首页
@inject('contractStore')
@observer
class TransferList extends React.Component {
  constructor(props) {
    super(props);
    const { transferList } = props.contractStore;
    const transferSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      transferSource: transferSource.cloneWithRows(toJS(transferList.list))
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const { transferList } = this.props.contractStore;

    if (transferList.list.length < 1) {
      transferList.initLoad();
    }
  };

  componentWillUnmount() {
    this.updateTransferSource();
  }

  updateTransferSource = reaction(
    () => this.props.contractStore.transferList.list,
    list => {
      this.setState({
        transferSource: this.state.transferSource.cloneWithRows(toJS(list))
      });
    }
  );

  render() {
    const { transferList } = this.props.contractStore;
    return (
      <div className="tab-wrap">
        <ListView
          renderFooter={() => (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              {transferList.isLoading ? '加载中...' : '没有更多'}
            </div>
          )}
          dataSource={this.state.transferSource}
          renderRow={item => (
            <Link
              to={`/contract/transferDetail/${item.projectId}/productId/${
                item.productId
              }`}
            >
              <StationTransfer
                key={item.productId}
                money={item.amount || 0}
                projectName={item.projectName}
                stationCapacity={`${item.powerStationCapacity ||
                  0}${POWER_UNIT}`}
                profitYear={`${item.estimatedAnnualizedIncome || 0}%`}
                transferPublishTime={item.transferPublishTime}
                sellerName={
                  (item.productUserBaseInfo &&
                    item.productUserBaseInfo.nickName) ||
                  ''
                }
                imageSrc={
                  (item.productUserBaseInfo &&
                    item.productUserBaseInfo.avatar) ||
                  ''
                }
                count={item.views}
                beforeMoney={item.originalAmount}
              />
            </Link>
          )}
          style={{
            height: '100%'
          }}
          scrollRenderAheadDistance={800}
        />
        <ActivityIndicator
          toast
          animating={transferList.isLoading}
          text="正在加载列表..."
        />
      </div>
    );
  }
}

export default TransferList;
