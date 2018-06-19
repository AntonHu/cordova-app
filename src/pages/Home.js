import React from 'react';
import {Apply} from './Apply';
import {Equipment} from './Equipment';
import {Mining} from './Mining'
import {User} from './User';
import {TabBar, Icon} from 'antd-mobile';



const TabsData = [
  {
    title: '太阳城',
    key: 'equipment',
    content: () => <Equipment />
  },
  {
    title: '挖宝',
    key: 'mining',
    content: () => <Mining />
  },
  {
    title: '应用',
    key: 'apply',
    content: () => <Apply />
  },
  {
    title: '我的',
    key: 'user',
    content: () => <User />
  }
];

/**
 * 首页
 */
class Comp extends React.PureComponent {
  state = {
    selectedTab: 'equipment'
  };

  render() {
    return (
      <div className="page-home" style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#cdcdcd"
          tintColor="#0082f6"
          barTintColor="white"
        >
          {
            TabsData.map((tab) => (
              <TabBar.Item
                title={tab.title}
                key={tab.key}
                selected={this.state.selectedTab === tab.key}
                onPress={() => {
                  this.setState({
                    selectedTab: tab.key
                  })
                }}
              >
                {tab.content()}
              </TabBar.Item>
            ))
          }
        </TabBar>
      </div>
    )
  }
}

export default Comp;
