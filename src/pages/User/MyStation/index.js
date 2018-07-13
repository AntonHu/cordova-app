import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { PageWithHeader, Picture } from '../../../components';
import { Icon } from 'antd-mobile';
import { decrypt } from '../../../utils/methods';
import './style.less';

import { getLocalStorage, setLocalStorage } from '../../../utils/storage';

/**
 * 我的设备
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    equipmentListObj: {}
  };

  async componentDidMount() {
    const { keyPair } = this.props;
    let equipmentListObj = {};
    if (keyPair.hasKey) {
      // 获取本地储存的设备列表
      if (getLocalStorage('equipmentListObj')) {
        equipmentListObj = JSON.parse(getLocalStorage('equipmentListObj'));
        this.setState({
          loading: false
        });
      } else {
        // 获取设备列表
        await this.props.sunCityStore.fetchSCEquipmentList({
          userPubKey: keyPair.publicKey
        });
        equipmentListObj = toJS(this.props.sunCityStore.equipmentList);
        // 各个设备添加功率和日电量,本地储存
        equipmentListObj =
          equipmentListObj &&
          (await this.addEquipmentPower(equipmentListObj, 1));
        setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj));
      }
      this.setState({
        equipmentListObj
      });
    }
  }

  // 为每个添加设备的功率和日电量
  async addEquipmentPower(equipmentListObj, dateType) {
    // 遍历每个设备，并添加功率和日电量
    for (let i = 0; i < Object.keys(equipmentListObj).length; ++i) {
      const name = Object.keys(equipmentListObj)[i];
      const info = equipmentListObj[name];
      const sourceData = info.source;
      const deviceNo = info.deviceNo;
      const decryptData = await this.handleEquipmentData(
        name,
        sourceData,
        deviceNo,
        dateType
      );
      // 设备功率
      const currentPower =
        (decryptData &&
          decryptData[decryptData.length - 1] &&
          decryptData[decryptData.length - 1].power.toFixed(2)) ||
        0;
      // 设备日电量
      let dayElectric = 0;
      decryptData.forEach(item => {
        dayElectric += item.number;
      });
      equipmentListObj[name].currentPower = currentPower || 0; // 设备功率
      equipmentListObj[name].dayElectric = dayElectric.toFixed(2) || 0; // 设备日电量
    }
    return equipmentListObj;
  }

  // 获取并处理每个设备数据
  async handleEquipmentData(name, sourceData, deviceNo, dateType) {
    if (this.props.keyPair.hasKey) {
      await this.props.sunCityStore.fetchSCEquipmentPower({
        sourceData,
        deviceNo,
        userPubKey: this.props.keyPair.publicKey,
        dateType
      });
    }
    const receiveData = toJS(this.props.sunCityStore.equipmentPower);
    const decryptData = this.handleDecryptData(receiveData);
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = receiveData => {
    const decryptData = [];
    if (this.props.keyPair.hasKey) {
      Object.keys(receiveData).forEach(item => {
        let powerInfo;
        try {
          const decryptItem = decrypt(
            this.props.keyPair.privateKey,
            receiveData[item]
          );
          powerInfo = decryptItem && JSON.parse(decryptItem);
        } catch (err) {
          console.log(err);
        }
        if (powerInfo) {
          const value = +(powerInfo.maxEnergy - powerInfo.minEnergy).toFixed(2);
          decryptData.push({
            time: item,
            number: value,
            maxValue: powerInfo.maxEnergy && +powerInfo.maxEnergy,
            power: powerInfo.power || ''
          });
        }
      });
    }
    return decryptData;
  };

  render() {
    const { equipmentListObj } = this.state;
    const equipmentNameList =
      (equipmentListObj && Object.keys(equipmentListObj)) || [];
    return (
      <div className={'page-my-station'}>
        <PageWithHeader title={'我的设备'}>
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
