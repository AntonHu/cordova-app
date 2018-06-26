import React from 'react';
import { PageWithHeader } from '../../../components';
import { Icon, WhiteSpace } from 'antd-mobile';
import './style.less';

/**
 * 我的电站
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-my-station'}>
        <PageWithHeader title={'我的电站'}>
          <WhiteSpace />
          <div className="station-list">
            <div
              className="item"
              onClick={() => this.props.history.push(`/equipmentInfo/${0}`)}
            >
              <div className="item-pic">
                <i className="iconfont icon-shebeiliebiao" />
              </div>
              <div className="item-detail">
                <div className="item-name">FWCSHHKJL</div>
                <div className="item-info">
                  <span>功率：312312w</span>
                  <span>日电量：321312kw/h</span>
                </div>
              </div>
              <Icon type="right" />
            </div>
            <div
              className="item"
              onClick={() => this.props.history.push(`/equipmentInfo/${1}`)}
            >
              <div className="item-pic">
                <i className="iconfont icon-shebeiguanli" />
              </div>
              <div className="item-detail">
                <div className="item-name">FWCSHHKJL</div>
                <div className="item-info">
                  <span>功率：312312w</span>
                  <span>日电量：321312kw/h</span>
                </div>
              </div>
              <Icon type="right" />
            </div>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
