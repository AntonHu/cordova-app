import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { PageWithHeader, Picture, EquipmentItem } from '../../../components';
import { Icon } from 'antd-mobile';
import { decrypt } from '../../../utils/methods';
import {EQUIPMENT_DATA_TYPE} from '../../../utils/variable';
import './style.less';

import { getLocalStorage, setLocalStorage } from '../../../utils/storage';

/**
 * 我的设备
 */
@inject('sunCityStore', 'keyPair') // 如果注入多个store，用数组表示
@observer
class MyStation extends React.Component {
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
        setLocalStorage('equipmentListObj', JSON.stringify(equipmentListObj || {}));
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
        (decryptData.length > 0 &&
          decryptData[decryptData.length - 1].power &&
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
    if (dateType === EQUIPMENT_DATA_TYPE.DAY) {
      return receiveData || [];
    }
    const decryptData = await this.handleDecryptData(receiveData);
    return decryptData;
  }

  // 处理获取的解密数据
  handleDecryptData = async receiveData => {
    const decryptData = [];
    if (this.props.keyPair.hasKey) {
      Object.keys(receiveData).forEach(async item => {
        let powerInfo;
        try {
          const decryptItem = await decrypt(
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

        <PageWithHeader title={'我的设备'} id="page-my-station">
          <div className="station-list">
            {equipmentNameList.length > 0 ? (
              equipmentNameList.map((equipment, index) => {
                return (
                  <EquipmentItem
                    onClick={() =>
                      this.props.history.push(
                        `/sunCity/equipmentInfo/${
                          equipmentListObj[equipment].deviceNo
                          }?source=${
                          equipmentListObj[equipment].source
                          }&name=${equipment}`
                      )}
                    currentPower={equipmentListObj[equipment].currentPower}
                    dayElectric={equipmentListObj[equipment].dayElectric}
                    equipmentName={equipment}
                    key={index}
                  />
                );
              })
            ) : (
              <div
                className="pic-wrap"
                onClick={() => this.props.history.push('/sunCity/addInverter')}
              >
                <Picture
                  src={require('../../../images/no_inverter.png')}
                  height={218}
                  width={264}
                />
                <span>还未添加逆变器，快去添加~</span>
              </div>
            )}
          </div>
        </PageWithHeader>

    );
  }
}

export default MyStation;
