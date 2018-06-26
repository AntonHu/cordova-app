import React from 'react';
import { withRouter } from 'react-router-dom';
import { BlueBox, PageWithHeader } from '../../../components';
import { List, Picker, Icon } from 'antd-mobile';
import './style.less';

const seasons = [
  {
    label: '男',
    value: '男'
  },
  {
    label: '女',
    value: '女'
  }
];

/**
 * 个人信息
 */
class Comp extends React.Component {
  state = {
    sexArr: ['男']
  };
  // 头像更改
  picChange = () => {};
  onChange = (files, type, index) => {
    console.log(files, type, index);
  };
  // 性别更改
  sexChange = value => {
    this.setState({
      sexArr: value
    });
  };
  // TODO: 头像等组件
  render() {
    return (
      <div className={'page-personal-info'}>
        <PageWithHeader title={'个人信息'}>
          <BlueBox>
            <div className="personal-info">
              <img
                className="personal-pic"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                alt=""
              />
              <div className="personal-prompt">您已实名认证成功!</div>
            </div>
            <div className="personal-name">test</div>
            <div className="personal-id">31232245678</div>
            <div
              className="go-authentication"
              onClick={() => this.props.history.push(`/user/verifyID/${1}`)}
            >
              去认证<Icon type="right" />
            </div>
          </BlueBox>

          <div className="personal-list" onClick={this.picChange}>
            <div className="personal-item">
              <div className="item-title">头像</div>
              <div>322432</div>
            </div>
            <div
              className="personal-item"
              onClick={() =>
                this.props.history.push(`/user/personalNickname/${1}`)
              }
            >
              <div className="item-title">昵称</div>
              <div>322432</div>
            </div>
            <Picker
              data={seasons}
              cols={1}
              value={this.state.sexArr}
              onChange={this.sexChange}
            >
              <List.Item arrow="horizontal">性别</List.Item>
            </Picker>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
