import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  BlueBox,
  PeakBox,
  GreenButton,
  Header,
  PageWithHeader
} from '../../components';
import { List, InputItem, Flex, Button, WhiteSpace, Icon } from 'antd-mobile';
import F2 from '@antv/f2';
import { getDeviceWidth, px } from '../../utils/getDevice';
import './style.less';
import { div } from 'gl-matrix/src/gl-matrix/vec2';

const Item = List.Item;
/**
 * 太阳城-首页
 */
const radius = 15; // 小太阳半径
const padding = 10; // 包含小图形的大图形的内边距
class Comp extends React.PureComponent {
  state = {
    sunList: [10, 11, 23, 14, 56, 34, 24],
    sunCoordinateArr: null,
    equipmentList: [
      {
        name: '测试1',
        power: '12345w',
        electric: '21.1kw/h'
      },
      {
        name: '测试2',
        power: '12345w',
        electric: '21.1kw/h'
      },
      {
        name: '测试3',
        power: '12345w',
        electric: '21.1kw/h'
      }
    ]
  };
  sunArea = null; // 大图形
  componentDidMount() {
    this.setState({
      sunCoordinateArr: this.getSunCoordinateArr()
    });
  }
  // 获取小太阳的坐标数组
  getSunCoordinateArr = () => {
    const len = this.state.sunList.length;
    const maxLeft = this.sunArea.clientWidth - (radius * 2 + padding);
    const maxTop = this.sunArea.clientHeight - (radius * 2 + padding);
    const sunCoordinateArr = [];
    while (sunCoordinateArr.length < len) {
      let isIntersect = false;
      const left = Math.random() * (maxLeft - padding) + padding;
      const top = Math.random() * (maxTop - padding) + padding;
      sunCoordinateArr.forEach(item => {
        const x = item.left;
        const y = item.top;
        const centerDistance = Math.sqrt(
          (left - x) * (left - x) + (top - y) * (top - y)
        );
        if (centerDistance < radius * 2) {
          isIntersect = true;
        }
      });
      if (!isIntersect) {
        sunCoordinateArr.push({
          left: left,
          top: top
        });
      }
    }
    return sunCoordinateArr;
  };
  render() {
    return (
      <div className={'page-sunCity-info'}>
        <div className="notice">最新公告：端午节挖宝活动开始送太阳积分啦~</div>
        {/* <BlueBox type={'pic'} picType={'blue'}>
          <div>太阳城首页</div>
        </BlueBox> */}
        <div className="sun-content">
          <div className="info">
            <div className="detail">
              <div>三只要有你</div>
              <div>当前排行：222</div>
              <div>太阳积分：333</div>
            </div>
            <div
              className="powerStation"
              onClick={() => this.props.history.push('/powerStation')}
            >
              电站
            </div>
          </div>
          <div className="sun-items" ref={el => (this.sunArea = el)}>
            {this.state.sunCoordinateArr &&
              this.state.sunList.map((item, index) => {
                return (
                  <span
                    style={{
                      left: `${this.state.sunCoordinateArr[index].left}px`,
                      top: `${this.state.sunCoordinateArr[index].top}px`
                    }}
                    key={index}
                    className="sun"
                  />
                );
              })}
          </div>
          <div className="news">最新动态：雷神刚刚挖宝10个太阳积分~</div>
          <div className="promote">
            <div>区块链达人季</div>
            <div>
              答题赢<span>一亿WT糖果</span>
            </div>
          </div>
          <div className="equipment">
            <div className="title">太阳城蓄力装备</div>
            {this.state.equipmentList.map((item, index) => {
              return (
                <div key={index} className="item">
                  <div>111</div>
                  <div>
                    <div>{item.name}</div>
                    <div>
                      <span>功率：{item.power}</span>
                      <span>日电量：{item.electric}</span>
                    </div>
                  </div>
                  <Icon type="right" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Comp);
