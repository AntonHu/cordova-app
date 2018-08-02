import {observable, action, runInAction, computed} from 'mobx';
import {
  getStationInfoRecord,
  reqUploadStationInfo
} from './request';

class StationStore {
  @observable stationRecords = [
  ];

  @action
  onLogout = () => {
    this.stationRecords = [];
  };

  @action
  fetchStationInfoRecord = async ({username}) => {
    try {
      const res = await getStationInfoRecord({username});
      if (res.data && res.data.code === 200) {
        console.log(res)
        runInAction(() => {
          this.stationRecords = res.data.data.recordList || [];
        })
      }
      return res;
    } catch (err) {
      throw err;
    }
  }
}

const stationStore = new StationStore();
export default stationStore;
