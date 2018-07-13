import React from 'react';
import { PageWithHeader, Picture } from '../../../components';
import { Icon, WhiteSpace } from 'antd-mobile';
import './style.less';

import { getLocalStorage } from '../../../utils/storage';

/**
 * 我的电站
 */
class Comp extends React.PureComponent {
  render() {
    const equipmentListObj =
      JSON.parse(getLocalStorage('equipmentListObj')) || {}; // 获取本地储存的设备列表
    const equipmentNameList =
      (equipmentListObj && Object.keys(equipmentListObj)) || [];
    return (
      <div className={'page-my-station'}>
        <PageWithHeader title={'我的电站'}>
          <div className="station-list">
            {equipmentNameList.length > 0 ? (
              equipmentNameList.map((equipment, index) => {
                return (
                  <div
                    key={index}
                    className="item"
                    onClick={() =>
                      this.props.history.push(
                        `/sunCity/equipmentInfo/${
                          equipmentListObj[equipment].deviceNo
                        }?source=${
                          equipmentListObj[equipment].source
                        }&name=${equipment}`
                      )
                    }
                  >
                    <div className="item-pic">
                      <i className="iconfont">&#xea35;</i>
                    </div>
                    <div className="item-detail">
                      <div className="item-name">{equipment}</div>
                      <div className="item-info">
                        <span>
                          {`功率：${equipmentListObj[equipment].currentPower}w`}{' '}
                        </span>
                        <span>
                          {`日电量：${
                            equipmentListObj[equipment].dayElectric
                          }kw/h`}
                        </span>
                      </div>
                    </div>
                    <Icon type="right" />
                  </div>
                );
              })
            ) : (
              <div
                className="pic-wrap"
                onClick={() => this.props.history.push('/sunCity/addInverter')}
              >
                <Picture
                  src={require('../../../images/no_inverter.png')}
                  size={200}
                />
                <span>还未添加逆变器，快去添加~</span>
              </div>
            )}
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
