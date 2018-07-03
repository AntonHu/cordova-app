import React from 'react';
import { Apply } from './Apply';
import SunCity from './SunCity/index';
import Mining from './Mining/Mining';
import { User } from './User';
import { TabBar } from 'antd-mobile';
import './Home.less';

const TabsData = [
  {
    title: '太阳城',
    key: 'sunCity',
    unicode: '\ue604',
    selectedUnicode: '\ue600',
    content: () => <SunCity />
  },
  {
    title: '挖宝',
    key: 'mining',
    unicode: '\ue605',
    selectedUnicode: '\ue601',
    content: () => <Mining />
  },
  {
    title: '应用',
    key: 'apply',
    unicode: '\ue606',
    selectedUnicode: '\ue603',
    content: () => <Apply />
  },
  {
    title: '我的',
    key: 'user',
    unicode: '\ue607',
    selectedUnicode: '\ue602',
    content: () => <User />
  }
];

/**
 * 首页
 */
class Comp extends React.PureComponent {
  state = {
    selectedTab: 'sunCity'
  };

  /**
   * 把tab和url关联起来
   * @param tabKey
   * @returns {boolean}
   */
  isSelectedFromUrl = (tabKey) => {
    const pathArray = this.props.match.path.split('/');
    const pathName = pathArray[1];
    if (tabKey === 'sunCity') {
      return pathName === tabKey || pathName === '';
    }
    return pathName === tabKey
  };

  render() {
    console.log(this.props);
    return (
      <div
        className="page-home"
        style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
      >
        <TabBar
          unselectedTintColor="#cdcdcd"
          tintColor="#0082f6"
          barTintColor="white"
        >
          {TabsData.map(tab => (
            <TabBar.Item
              title={tab.title}
              key={tab.key}
              selected={this.isSelectedFromUrl(tab.key)}
              onPress={() => {
                this.props.history.replace(`/${tab.key}`)
              }}
              icon={<i className="iconfont">{tab.unicode}</i>}
              selectedIcon={<i className="iconfont">{tab.selectedUnicode}</i>}
            >
              {tab.content()}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>
    );
  }
}

export default Comp;
