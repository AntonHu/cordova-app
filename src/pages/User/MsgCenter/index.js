import React from 'react';
import {PageWithHeader} from '../../../components';
import {List, Tabs} from 'antd-mobile';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import Picture from "../../../components/Picture";

const TabItems = [
  {title: '通知', icon: '\ue624'},
  {title: '资讯', icon: '\ue615'}
];

/**
 * 消息中心
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class MsgCenter extends React.Component {
  state = {
    msgPage: 0,
    newsPage: 0
  };

  componentDidMount() {
    this.initPullToRefresh();
    if (this.props.history.action === 'PUSH') {
      this.makeRequest();
    }
  }

  makeRequest = () => {
    return Promise.all([
      this.props.userStore.fetchMessages({page: this.state.msgPage}),
      this.props.userStore.fetchNewsList({page: this.state.newsPage})
    ]);
  };

  refresh = () => {
    this.setState({
      msgPage: 0,
      newsPage: 0
    }, () => {
      this.makeRequest();
    })
  };

  initPullToRefresh = () => {
    PullToRefresh.init({
      mainElement: '#page-msg-center', // "下拉刷新"把哪个部分包住
      triggerElement: '#page-msg-center', // "下拉刷新"把哪个部分包住
      onRefresh: this.refresh, // 下拉刷新的方法，返回一个promise
      shouldPullToRefresh: function() {
        // 什么情况下的滚动触发下拉刷新，这个很重要
        // 如果这个页面里有height超过窗口高度的元素
        // 那么应该在这个元素滚动位于顶部的时候，返回true
        const ele = document.getElementById(PageWithHeader.bodyId);
        if (ele === null) {
          return false;
        }
        return ele.scrollTop === 0;
      },
      instructionsPullToRefresh: '下拉刷新',
      instructionsReleaseToRefresh: '松开刷新',
      instructionsRefreshing: '正在刷新...'
    });
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
          <div className="blue-dot"/>
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
              this.props.userStore.msgList.length > 0
                ?
                this.props.userStore.msgList.map((v, i) => (
                  <Link key={i} to={`/user/msgDetail/${v.messageId}`}>
                    {this.renderMsgItem(v)}
                  </Link>
                ))
                :
                <div className="empty-area">
                  <Picture
                    src={require('../../../images/no_news.png')}
                    height={239}
                    width={303}
                  />
                  <div className="empty-text">暂无通知</div>
                </div>
            }
          </List>


          <List>
            {
              this.props.userStore.newsList.length > 0
                ?
                this.props.userStore.newsList.map((v, i) => (
                  <Link key={v.id} to={`/user/newsDetail/${v.id}`}>
                    {this.renderNewsItem(v)}
                  </Link>
                ))
                :
                <div className="empty-area">
                  <Picture
                    src={require('../../../images/no_news.png')}
                    height={239}
                    width={303}
                  />
                  <div className="empty-text">暂无资讯</div>
                </div>
            }
          </List>

        </Tabs>

      </PageWithHeader>

    );
  }
}

export default MsgCenter;
