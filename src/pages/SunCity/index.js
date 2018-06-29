import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Title } from '../../components';
import { NoticeBar, Icon } from 'antd-mobile';
import { testPublicKey } from '../../utils/variable';
import './style.less';

/**
 * 太阳城-首页
 */
const radius = 20; // 小太阳半径
const sunDistance = 60; // 小太阳之间的距离
const padding = 30; // 包含小图形的大图形的内边距
const pickNumber = 0;
@inject('sunCityStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.Component {
  state = {
    sunCoordinateArr: null
  };
  sunIntegralArr = [];
  selectSunNode = null;
  timeoutID = null;
  sunArea = null; // 大图形
  async componentDidMount() {
    await this.props.sunCityStore.fetchSCSunIntegral({
      publicKey: testPublicKey
    });
    this.props.sunCityStore.fetchSCEquipmentList({
      userPubKey: testPublicKey
    });
    const sunCoordinateArr = toJS(this.props.sunCityStore.sunIntegral);
    // 将获取的积分数组，分割成每10个一组
    for (
      var i = 0, len = sunCoordinateArr && sunCoordinateArr.length;
      i < len;
      i += 10
    ) {
      this.sunIntegralArr.push(sunCoordinateArr.slice(i, i + 10));
    }
    this.sunIntegralArr.length > 0 &&
      this.setState({
        sunCoordinateArr: this.getSunCoordinateArr(this.sunIntegralArr[0])
      });
  }
  componentWillUnmount() {
    this.timeoutID = null;
  }
  // 获取小太阳的坐标数组
  getSunCoordinateArr = sunIntegralArr => {
    const len = sunIntegralArr.length;
    const maxLeft = this.sunArea.clientWidth - (radius * 2 + padding);
    const maxTop = this.sunArea.clientHeight - (radius * 2 + padding);
    const sunCoordinateArr = [];
    while (sunCoordinateArr.length < len) {
      let isIntersect = false;
      const left = parseInt(Math.random() * (maxLeft - padding), 10) + padding;
      const top = parseInt(Math.random() * (maxTop - padding), 10) + padding;
      isIntersect = sunCoordinateArr.some(item => {
        const x = item.left;
        const y = item.top;
        return (
          x - sunDistance < left &&
          left < x + sunDistance &&
          y - sunDistance < top &&
          top < y + sunDistance
        );
      });
      if (!isIntersect) {
        sunCoordinateArr.push({
          info: sunIntegralArr[sunCoordinateArr.length],
          left: left,
          top: top
        });
      }
    }

    return sunCoordinateArr;
  };
  // 收取太阳积分
  selectSunIntegral = (e, sunIntegralInfo) => {
    this.selectSunNode = e.target.parentNode;
    this.props.sunCityStore
      .fetchSCGetSunIntegral({
        tokenId: sunIntegralInfo.id,
        value: sunIntegralInfo.amount,
        testPublicKey
      })
      .then(result => {
        if (result.code === 200) {
          pickNumber += 1;
          this.selectSunNode.classList.add('remove');
          // 每删除10个，重置一次，并进入下一个
          if (pickNumber && pickNumber % 10 === 0) {
            this.timeoutID = setTimeout(() => {
              document
                .querySelectorAll('.remove')
                .forEach(item => item.classList.remove('remove'));
              this.setState({
                sunCoordinateArr: this.getSunCoordinateArr(
                  this.sunIntegralArr[pickNumber / 10]
                )
              });
            }, 1000);
          }
        }
      });
  };
  render() {
    const equipmentList = toJS(this.props.sunCityStore.equipmentList);
    const equipmentNameList =
      (equipmentList && Object.keys(equipmentList)) || [];
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
                    onClick={e => this.selectSunIntegral(e, item.info)}
                  >
                    <span className="sun-pic" />
                    <span className="sun-number">{item.info.amount}</span>
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
            {equipmentNameList.map((equipment, index) => {
              return (
                <div
                  key={index}
                  className="item"
                  onClick={() =>
                    this.props.history.push(
                      `/equipmentInfo/${equipmentList[equipment].deviceNo}`
                    )
                  }
                >
                  <div className="item-pic">
                    <i className="iconfont icon-shebeiliebiao" />
                  </div>
                  <div className="item-detail">
                    <div className="item-name">{equipment}</div>
                    <div className="item-info">
                      <span>功率：312312w</span>
                      <span>日电量：321312kw/h</span>
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
