import React from 'react';
import {PageWithHeader} from '../../../components';
import {List} from 'antd-mobile';
import {getMessages} from '../../../stores/user/request';
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
class Comp extends React.PureComponent {
  state = {
    list: []
  };

  componentDidMount() {
    getMessages()
      .then(res => {
        const data = res.data;
        if (data.success) {
          this.setState({
            list: data.data
          })
        }
      })
      .catch(() => {
        this.setState({
          list: [
            {
              text: '消息1'
            },
            {
              text: '消息2'
            },
            {
              text: '消息3'
            }
          ]
        })
      })
  }

  render() {
    return (
      <div className={'page-msg-center'}>
        <PageWithHeader title={'消息中心'}>
          <List>
            {this.state.list.map((v, i) => (
              <Item key={i} arrow={'horizontal'}>
                {v.text}
              </Item>
            ))}
          </List>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
