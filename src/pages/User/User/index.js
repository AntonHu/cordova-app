import React from 'react';
import { PageWithHeader } from '../../../components';
import { List, Icon } from 'antd-mobile';
import { Link } from 'react-router-dom';
import {getOwnerInfo} from '../../../stores/user/request';
import './style.less';

const Item = List.Item;

const ListData = [
  {
    text: '我的数据',
    extra: 'avatar',
    path: 'myData',
    unicode: '\ue68d'
  },
  {
    text: '我的电站',
    extra: '华',
    path: 'myStation',
    unicode: '\ue609'
  },
  {
    text: '消息中心',
    extra: '女',
    path: 'msgCenter',
    unicode: '\ue624'
  },
  {
    text: '账号设置',
    horizontal: true,
    path: 'accountSetting',
    unicode: '\ue60e'
  }
];

/**
 * 我的
 */
class Comp extends React.PureComponent {

  componentDidMount() {
    getOwnerInfo()
  }

  render() {
    return (
      <div className={'page-user'}>
        <PageWithHeader leftComponent={null} title={'个人中心'}>
          {/* <BlueBox>

          </BlueBox> */}
          <div className="user-wrap">
            <div className="user-info">
              <img
                className="user-pic"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                alt=""
              />
              <div className="user-name">test</div>
            </div>
            <div className="to-detial">
              <Link to="/user/personalInfo">
                完善信息<Icon type="right" />
              </Link>
            </div>
          </div>

          <List>
            {ListData.map((v, i) => (
              <Item key={i} arrow={'horizontal'}>
                <Link to={`/user/${v.path}`}>
                  <i className="iconfont">{v.unicode}</i>
                  {v.text}
                </Link>
              </Item>
            ))}
          </List>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
