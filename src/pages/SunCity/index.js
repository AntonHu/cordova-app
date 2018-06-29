import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Title } from '../../components';
import { NoticeBar, Icon } from 'antd-mobile';
import './style.less';
/**
 * 太阳城-首页
 */
const radius = 20; // 小太阳半径
const sunDistance = 60; // 小太阳之间的距离
const padding = 30; // 包含小图形的大图形的内边距

@inject('sunCityStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    sunList: [1.032, 1.323, 2.323, 1.2334, 5.2336, 3.2334, 2.3234],
    sunCoordinateArr: null
  };
  sunArea = null; // 大图形
  async componentDidMount() {
    await this.props.sunCityStore.fetchSCSunIntegral({
      page: 1,
      pageNums: 8
    });
    this.setState({
      sunCoordinateArr: this.getSunCoordinateArr(
        toJS(this.props.sunCityStore.getSunIntegral)
      )
    });
  }
  // 获取小太阳的坐标数组
  getSunCoordinateArr = sunIntegralArr => {
    const len = sunIntegralArr.length;
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
        if (centerDistance < sunDistance) {
          isIntersect = true;
        }
      });
      if (!isIntersect) {
        sunCoordinateArr.push({
          number: sunIntegralArr[sunCoordinateArr.length],
          left: left,
          top: top
        });
      }
    }
    return sunCoordinateArr;
  };
  // 收取太阳积分
  selectSunIntegral = (e, sunIntegral) => {
    // this.props.sunCityStore
    //   .fetchSCGetSunIntegral({
    //     value: sunIntegral
    //   })
    //   .then(result => {
    //     if (result.code === 200) {
    //       e.target.parentNode.classList.add('remove');
    //     }
    //   });
    e.target.parentNode.classList.add('remove');
    // const sunCoordinateArr = this.state.sunCoordinateArr;
    // const selectSun = sunCoordinateArr.find(
    //   item => item.number === sunIntegral
    // );
    // const selectSunIndex = sunCoordinateArr.indexOf(selectSun);
    // sunCoordinateArr.splice(selectSunIndex, 1);
    // this.setState({ sunCoordinateArr });
  };
  render() {
    // console.log(toJS(this.props.sunCityStore.getSunIntegral));
    // const sunIntegral = toJS(this.props.sunCityStore.getSunIntegral);
    return (
      <div className={'page-sunCity-info'}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          最新公告：端午节挖宝活动开始送太阳积分啦~
        </NoticeBar>
        <div className="sun-content">
          <div className="info">
            <div className="detail">
              <div className="person-info">
                <img
                  className="person-pic"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                  alt=""
                />
                三只要有你<Icon type="right" />
              </div>
              <div>
                <span>当前排行：</span>222
              </div>
              <div>
                <span>太阳积分：</span>333
              </div>
            </div>
            <div
              className="powerStation"
              onClick={() => this.props.history.push('/powerStation')}
            >
              <i className="iconfont powerStation-pic">&#xe609;</i>
              电站
            </div>
          </div>
          <div className="sun-items" ref={el => (this.sunArea = el)}>
            {this.state.sunCoordinateArr &&
              this.state.sunCoordinateArr.map((item, index) => {
                return (
                  <div
                    className="sun"
                    key={index}
                    style={{
                      left: `${item.left}px`,
                      top: `${item.top}px`
                    }}
                    ref={ele => (this.currentEle = ele)}
                    // onClick={() => this.selectSunIntegral(item.number)}
                    onClick={e => this.selectSunIntegral(e, item.number)}
                  >
                    <span className="sun-pic" />
                    <span className="sun-number">{item.number}</span>
                  </div>
                );
              })}
          </div>
          <div className="news">
            <span>最新动态：</span>雷神刚刚挖宝10个太阳积分~
          </div>
          <div className="promote">
            <div>区块链达人季</div>
            <div>
              答题赢<span>一亿WT糖果</span>
            </div>
          </div>
          <div className="equipment">
            <Title title="太阳城蓄力装备" />
            <div
              className="item"
              onClick={() => this.props.history.push(`/equipmentInfo/${0}`)}
            >
              <div className="item-pic">
                <i className="iconfont icon-shebeiliebiao" />
              </div>
              <div className="item-detail">
                <div className="item-name">FWCSHHKJL</div>
                <div className="item-info">
                  <span>功率：312312w</span>
                  <span>日电量：321312kw/h</span>
                </div>
              </div>
              <Icon type="right" />
            </div>
            <div
              className="item"
              onClick={() => this.props.history.push(`/equipmentInfo/${1}`)}
            >
              <div className="item-pic">
                <i className="iconfont icon-shebeiguanli" />
              </div>
              <div className="item-detail">
                <div className="item-name">FWCSHHKJL</div>
                <div className="item-info">
                  <span>功率：312312w</span>
                  <span>日电量：321312kw/h</span>
                </div>
              </div>
              <Icon type="right" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Comp);
