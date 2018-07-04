import React from 'react';
import {PageWithHeader} from '../../../components';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import './Detail.less';

const findDetailByID = (list, id) => {
  const filtered = list.filter(item => {
    return (item.messageId + '') === id
  });
  if (filtered.length > 0) {
    return filtered[0]
  }
  return {};
};

/**
 * 消息详情
 */
@inject('userStore')
@observer
class Comp extends React.Component {
  constructor(props) {
    super(props);
    const messageId = props.match.params.messageId;
    const list = toJS(props.userStore.msgList);
    const detail = findDetailByID(list, messageId);
    this.state = {
      detail
    }
  }

  render() {
    const {detail} = this.state;
    return (
      <div className="page-msg-detail">
        <PageWithHeader title="消息详情">
          <div className="title-box">
            <div className="title">
              {detail.title || '无标题'}
            </div>
            <div className="time">
              {detail.updatedTime ? detail.updatedTime.slice(0, 10) : ''}
            </div>
          </div>
          <div className="content-box">
            {detail.content || '无内容'}
          </div>
        </PageWithHeader>
      </div>
    )
  }
};

export default Comp;
