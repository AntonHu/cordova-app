import React from 'react';
import {
  BlueBox,
  PeakBox,
  GreenButton,
  Header,
  PageWithHeader
} from '../../../components';
import { List } from 'antd-mobile';
import './style.less';
/**
 * 挖宝
 */
class Comp extends React.PureComponent {
  state = {
    integralList: [
      {
        title: '测试1',
        number: '12345'
      },
      {
        title: '测试2',
        number: '12345'
      },
      {
        title: '测试3',
        number: '12345'
      }
    ]
  };
  render() {
    return (
      <div className={'page-sun-integral'}>
        <PageWithHeader title={'挖宝池'}>
          <div className="integral">
            <div className="integral-survey">
              <div>我的太阳积分</div>
              <div className="number">555</div>
            </div>
            <div className="integral-list">
              <div>积分记录</div>
              {this.state.integralList.map((item, index) => {
                return (
                  <div key={index} className="integral-item">
                    <div>{item.title}</div>
                    <div>{item.number}</div>
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
