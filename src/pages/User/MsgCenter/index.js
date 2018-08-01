import React from 'react';
import {PageWithHeader} from '../../../components';
import {List, Tabs} from 'antd-mobile';
import {getMessages} from '../../../stores/user/request';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import './index.less';

const Item = List.Item;

const ListData = [
  {
    text: '消息1'
  },
  {
    text: '消息2'
  },
  {
    text: '消息3'
  }
];

const TabItems = [
  { title: '通知', icon: '\ue624' },
  { title: '资讯', icon: '\ue615' }
];

/**
 * 消息中心
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class MsgCenter extends React.Component {
  state = {
    list: [],
    msgPage: 0,
    newsPage: 0
  };

  componentDidMount() {
    if (this.props.history.action === 'PUSH') {
      this.makeRequest();
    }
  }

  makeRequest = () => {
    this.props.userStore.fetchMessages({page: this.state.msgPage});
    this.props.userStore.fetchNewsList({page: this.state.newsPage});
  };

  sliceDate = (date) => {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    return ''
  };

  renderMsgItem = (item) => {
    return (
      <div className="msg-item">
        <div className="title">{`${item.title}：${item.content}`}</div>
        <div className="time">{this.sliceDate(item.updatedTime)}</div>
      </div>
    )
  };

  renderNewsItem = (item) => {
    return (
      <div className="news-item">
        <div className="title">
          <div className="blue-dot" />
          {item.title}
        </div>
        <div className="summary">{item.summary}</div>
        <div className="time">{this.sliceDate(item.releaseDate)}</div>
      </div>
    )
  };


  render() {
    const {msgCenterTabPage, updateMsgCenterTabPage} = this.props.userStore;
    return (

        <PageWithHeader title={'消息中心'} id="page-msg-center" headerMarginBottom={0}>
          <Tabs
            tabs={TabItems}
            initialPage={msgCenterTabPage}
            renderTab={tab => <div className="msg-center-tab">
              <i className="iconfont">{tab.icon}</i>{tab.title}
              </div>
            }
            onChange={(tab, i) => updateMsgCenterTabPage(i)}
          >
            <List>
              {
                this.props.userStore.msgList.map((v, i) => (
                  <Link key={i} to={`/user/msgDetail/${v.messageId}`}>
                    {this.renderMsgItem(v)}
                  </Link>
                ))
              }
            </List>
            <List>
              {
                this.props.userStore.newsList.map((v, i) => (
                  <Link key={v.id} to={`/user/newsDetail/${v.id}`}>
                    {this.renderNewsItem(v)}
                  </Link>
                ))
              }
            </List>
          </Tabs>

        </PageWithHeader>

    );
  }
}

export default MsgCenter;
