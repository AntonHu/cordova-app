import React from 'react';
import PropTypes from 'prop-types';
import {STATION_VERIFY_STATUS} from '../../../utils/variable';
import './StationVerifyMask.less';

class StationVerifyMask extends React.PureComponent {
  static propTypes = {
    status: PropTypes.oneOf([
      STATION_VERIFY_STATUS.FAIL,
      STATION_VERIFY_STATUS.ONGOING,
      STATION_VERIFY_STATUS.SUCCESS
    ]).isRequired,
    text: PropTypes.string.isRequired
  };

  render() {
    const {status, text} = this.props;
    let _class = 'fail';
    if (status === STATION_VERIFY_STATUS.ONGOING) {
      _class = 'ongoing';
    }
    if (status === STATION_VERIFY_STATUS.SUCCESS) {
      _class = 'success'
    }
    return (
      <div className={`station-verify-mask ${_class}`}>
        {
          status === STATION_VERIFY_STATUS.ONGOING
          &&
          <div className="on-checking">审核中...</div>
        }
        {
          (status === STATION_VERIFY_STATUS.ONGOING || status === STATION_VERIFY_STATUS.SUCCESS)
          &&
          <div className="text">{text}</div>
        }
        {
          status === STATION_VERIFY_STATUS.FAIL &&
          <div className="fail-content">
            <i className="iconfont add-icon">&#xe650;</i>
            <div>{`${text}，重新上传`}</div>
          </div>
        }
      </div>
    )
  }
}

export default StationVerifyMask;
