import React from 'react';
import { Title, PageWithHeader } from '../../../components';
import {} from 'antd-mobile';
import './style.less';
import { div } from 'gl-matrix/src/gl-matrix/vec4';

const Apps = [
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  }
];

/**
 * 应用
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-apply'}>
        <PageWithHeader title={'应用'}>
          <div className="apply-survey">应用</div>
          <div className="apply">
            <Title title="太阳城蓄力装备" />
            <div className="apply-list">
              {Apps.map((item, index) => {
                return (
                  <div key={index} className="apply-item">
                    <div className="apply-pic">{item.icon}</div>
                    <div>{item.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="recommend">
              <Title title="为你推荐" />
              <div className="recommend-list">
                <div className="recommend-item">
                  <div className="recommend-pic">rw</div>
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
                <div className="recommend-item">
                  <div className="recommend-pic">rw</div>
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
                <div className="recommend-item">
                  <div className="recommend-pic">rw</div>
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
              </div>
            </div>
          </div>
          <div className="admission">入驻申请</div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
