import React from 'react';
import { Apply } from './Apply';
import SunCity from './SunCity/index';
import Mining from './Mining/Mining';
import { User } from './User';
import { Contract } from './Contract';
import { TabBar } from 'antd-mobile';
import './Home.less';

const TabsData = [
  {
    title: '首页',
    key: 'sunCity',
    unicode: '\ue612',
    selectedUnicode: '\ue60a',
    content: (props) => <SunCity {...props} />
  },
  {
    title: '挖宝池',
    key: 'mining',
    unicode: '\ue611',
    selectedUnicode: '\ue60d',
    content: (props) => <Mining {...props} />
  },
  {
    title: '合约电站',
    key: 'contract',
    unicode: '\ue619',
    selectedUnicode: '\ue619',
    content: (props) => <Contract {...props} />
  },
  {
    title: '应用',
    key: 'apply',
    unicode: '\ue606',
    selectedUnicode: '\ue603',
    content: (props) => <Apply {...props} />
  },
  {
    title: '我的',
    key: 'user',
    unicode: '\ue610',
    selectedUnicode: '\ue608',
    content: (props) => <User {...props} />
  }
];

/**
 * 首页
 */
class Home extends React.PureComponent {
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
    const {history} = this.props;
    return (
      <div
        className="page-home"
        style={{ position: 'fixed', height: '100%', width: '100%', top: 0, overflowX: 'hidden' }}
      >
        <TabBar
          unselectedTintColor="#cdcdcd"
          tintColor="#009702"
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
              {tab.content({history})}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>
    );
  }
}

export default Home;
