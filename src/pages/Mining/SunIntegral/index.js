import React from 'react';
import { PageWithHeader } from '../../../components';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
// import { List } from 'antd-mobile';
import './style.less';
/**
 * 挖宝
 */
@inject('miningStore', 'keyPair')
@observer
class Comp extends React.Component {

  componentDidMount() {
    this.makeRequest(this.props);
  }

  makeRequest = (props) => {
    const {keyPair} = props;
    if (keyPair.hasKey) {
      this.props.miningStore.fetchTokenRecords({page: 0, publicKey: keyPair.publicKey})
    }
  };

  render() {
    const {balance} = this.props.miningStore;
    return (
      <div className={'page-sun-integral'}>
        <PageWithHeader title={'太阳积分'}>
          <div className="integral">
            <div className="integral-survey">
              <div>我的太阳积分</div>
              <div className="number">{balance.toFixed(2)}</div>
            </div>
            <div className="integral-list">
              <div>积分记录</div>
              {this.props.miningStore.tokenRecords.map((item, index) => {
                return (
                  <div key={item.tokenId} className="integral-item">
                    <div>{item.solarIntegral}</div>
                    <div>{item.gmtCreate.slice(0, 10)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
