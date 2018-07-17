import React from 'react';
import { BlueBox, PageWithHeader } from '../../../components';
import { List, Modal } from 'antd-mobile';
import './style.less';

const Item = List.Item;
const alert = Modal.alert;

const ListData = [
  {
    text: '用户协议',
    horizontal: true,
    onClick: function () {
      alert('协议', '暂无用户协议', [{text: '好的'}])
    }
  },
  {
    text: '检查更新',
    horizontal: true,
    onClick: function () {
      alert('更新', '您目前使用的是最新版', [{text: '好的'}])
    }
  },
  {
    text: '客服电话',
    extra: '0571-26270118'
  }
];

/**
 * 关于
 */
class Comp extends React.PureComponent {

  onClick = (v) => {
    if (v.onClick) {
      v.onClick.call(this)
    }
  };

  render() {
    return (
      <div className={'page-about'}>
        <PageWithHeader title={'关于我们'}>
          <img src={require('../../../images/banner_1.png')} width="100%" className="banner" />

          <List>
            {ListData.map((v, i) => (
              <Item
                key={i}
                arrow={v.horizontal && 'horizontal'}
                extra={v.extra}
                onClick={() => this.onClick(v)}
              >
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
