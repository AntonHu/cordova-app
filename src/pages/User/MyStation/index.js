import React from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {PageWithHeader, ActivityCard} from '../../../components';
import {ACTIVITIES} from '../../Apply/constant';
import {STATION_VERIFY_STATUS} from '../../../utils/variable';
import StationVerifyMask from './StationVerifyMask';
import ImageView from 'react-mobile-imgview'
import 'react-mobile-imgview/dist/react-mobile-imgview.css'

import './index.less';

const TYPE = {
  RECORD: 'recordImg',
  CONNECTION: 'connectionImg'
};

/**
 * 我的设备
 */
@inject('userStore', 'keyPair', 'stationStore') // 如果注入多个store，用数组表示
@observer
class MyStation extends React.Component {

  state = {
    showViewer: false
  };

  imageList = [];

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest = () => {
    const {stationStore, userStore} = this.props;
    const username = userStore.userInfo.username || '';
    stationStore.fetchStationInfoRecord({username})
  };

  renderStationInfo = (station, idx) => {
    const recordClick = station.recordStatus === STATION_VERIFY_STATUS.FAIL ? this.toUpload : this.showImage;
    const connectionClick = station.connectionStatus === STATION_VERIFY_STATUS.FAIL ? this.toUpload : this.showImage;
    return (
      <div className="station-item" key={station.id}>
        <div className="station-number">{`电站${idx + 1}`}</div>
        <div className="station-image" onClick={() => recordClick(station, TYPE.RECORD)}>
          <StationVerifyMask status={station.recordStatus} text="备案资料"/>
          {
            station.recordImg &&
            <img src={station.recordImg}/>
          }
        </div>
        <div className="station-image" onClick={() => connectionClick(station, TYPE.CONNECTION)}>
          <StationVerifyMask status={station.connectionStatus} text="并网成功文件"/>
          {
            station.recordImg &&
            <img src={station.connectionImg}/>
          }
        </div>
      </div>
    )
  };

  toUpload = (station) => {
    this.props.history.push('/user/UploadStationInfo/' + station.id);
  };

  toUploadNew = () => {
    this.props.history.push('/user/UploadStationInfo');
  };

  showImage = (station, type) => {
    this.imageList = [station[type]];
    this.showViewer();
  };

  showViewer = () => {
    this.setState({
      showViewer: true
    })
  };

  hideViewer = () => {
    this.setState({
      showViewer: false
    })
  };

  render() {
    const STATION = ACTIVITIES.station;
    const {stationStore} = this.props;
    return (
      <PageWithHeader
        title={'电站资料'}
        id="page-my-station"
        rightComponent={
          <i
            className="iconfont"
            onClick={this.toUploadNew}
          >
            &#xe650;
          </i>
        }
      >
        <div onClick={this.toUploadNew}>
          <ActivityCard
            imageSrc={STATION.imageSrc}
            title={STATION.title}
            subTitle={STATION.subTitle}
            info={STATION.info}
            showArrow={false}
          />
        </div>
        {
          stationStore.stationRecords.map((station, idx) => this.renderStationInfo(station, idx))
        }

        {
          this.state.showViewer && <ImageView imagelist={this.imageList} close={this.hideViewer}/>
        }
      </PageWithHeader>

    );
  }
}

export default MyStation;
