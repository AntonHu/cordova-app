import React from 'react';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import Picture from "../../../../components/Picture";

// 驳回信息
class RejectInfo extends React.PureComponent {
  static propTypes = {
    info: PropTypes.object.isRequired
  };

  static defaultProps = {
    info: {}
  };

  render () {
    const { info } = this.props;
    const attachmentList = info.attachmentList || [];
    const imgUrl = attachmentList.length > 0 ? attachmentList[0].filePath : '';
    return (
      <div className="reject-info">
        <div className="reject-amount">申购被驳回！</div>
        <div className="title">驳回说明</div>
        <div className="reject-desc">
          {info.content || '无'}
        </div>
        <div className="title">凭证</div>
        <Picture
          src={imgUrl}
          emptyElement={(props) => <div className={props.className}>暂无图片</div>}
        />
      </div>
    )
  }
}

export default RejectInfo;
