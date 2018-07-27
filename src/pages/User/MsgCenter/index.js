import React from 'react';
import {PageWithHeader} from '../../../components';
import {List} from 'antd-mobile';
import {getMessages} from '../../../stores/user/request';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import './style.less';

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

/**
 * 消息中心
 */
@inject('userStore') // 如果注入多个store，用数组表示
@observer
class MsgCenter extends React.Component {
  state = {
    list: [],
    page: 0
  };

  componentDidMount() {
    this.props.userStore.fetchMessages({page: this.state.page});
  }

  render() {
    console.log(this.state.list)
    return (
      <div className={'page-msg-center'}>
        <PageWithHeader title={'消息中心'}>
          <List>
            {
              this.props.userStore.msgList.map((v, i) => (
                <Link key={i} to={`/user/msgDetail/${v.messageId}`}>
                  <Item
                    arrow={'horizontal'}
                    extra={<span className="h4">{v.updatedTime.slice(0, 10)}</span>}>
                    <span className="h3">{v.title}</span>
                  </Item>
                </Link>
              ))
            }
          </List>
        </PageWithHeader>
      </div>
    );
  }
}

export default MsgCenter;
