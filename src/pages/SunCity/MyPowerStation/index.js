import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { BlueBox, Title, PageWithHeader } from '../../../components';
import { Icon, Popover } from 'antd-mobile';
import F2 from '@antv/f2';
import './style.less';

const Item = Popover.Item;

/**
 * 我的电站信息
 */
@inject('sunCityStore') // 如果注入多个store，用数组表示
@observer
class Comp extends React.PureComponent {
  state = {
    selected: {
      day: true,
      month: false,
      year: false,
      all: false
    }
  };
  componentDidMount() {
    this.barChart = this.renderBarChart([]);
  }

  componentWillUnmount() {
    if (this.barChart) {
      this.barChart = undefined;
    }
  }

  // 初始化柱形图
  renderBarChart = data => {
    // 创建渐变对象
    const canvas = document.getElementById('pie-bar-chart');
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 200, 0, 0);
    grd.addColorStop(0, '#fff');
    grd.addColorStop(1, '#0082f6');

    F2.Global.setTheme({
      pixelRatio: 2
    }); // 设为双精度
    var chart = new F2.Chart({
      id: 'pie-bar-chart',
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data);
    chart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = `${items[0].value}kw/h`;
      }
    });
    chart.axis('time', {
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart.axis('number', {
      grid: {
        lineDash: [0]
      },
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart
      .interval()
      .size(18)
      .position('time*number')
      .color(grd);
    chart.render();
  };

  // 筛选条件更改
  screenChange = e => {
    const type = e.target.dataset.class;
    const selected = Object.assign({}, this.state.selected);
    Object.keys(selected).forEach(item => {
      selected[item] = false;
    });
    selected[type] = true;
    this.setState({ selected });
  };

  // 添加逆变器
  addInverter = () => {};
  render() {
    const equipmentList = toJS(this.props.sunCityStore.equipmentList);
    const equipmentNameList =
      (equipmentList && Object.keys(equipmentList)) || [];
    return (
      <div className={'page-powerStation-info'}>
        <PageWithHeader
          title={'我的电站'}
          rightComponent={
            <Popover
              overlayClassName="fortest"
              visible={this.state.visible}
              overlay={[
                <Item key="1">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/tOtXhkIWzwotgGSeptou.svg"
                    className="am-icon"
                    alt=""
                  />添加逆变器
                </Item>
              ]}
              onSelect={this.addInverter}
            >
              <i className="iconfont">&#xe650;</i>
            </Popover>
          }
        >
          <BlueBox type={'pure'}>
            <div className="title">
              <div className="weather">
                <i className="iconfont">&#xe636;</i>晴
              </div>
              <div className="screen" onClick={this.screenChange}>
                <div
                  data-class="day"
                  className={this.state.selected.day ? 'selected' : ''}
                >
                  日
                </div>
                <div
                  data-class="month"
                  className={this.state.selected.month ? 'selected' : ''}
                >
                  月
                </div>
                <div
                  data-class="year"
                  className={this.state.selected.year ? 'selected' : ''}
                >
                  年
                </div>
                <div
                  data-class="all"
                  className={this.state.selected.all ? 'selected' : ''}
                >
                  全部
                </div>
              </div>
            </div>
            <canvas id="pie-bar-chart" />
          </BlueBox>
          <div className="type">
            <div className="type-item">功率</div>
            <div className="type-item">发电量</div>
          </div>
          <div className="detail">
            <div className="detail-item">
              <div className="number">15.0kw</div>
              <div className="detail-type">当前</div>
            </div>
            <div className="detail-item">
              <div className="number">{`000kw`}</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">逆变器容量</div>
            </div>
            <div className="detail-item">
              <div className="number">{`000kw`}</div>
              <div className="detail-type">累计</div>
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
                      `/sunCity/equipmentInfo/${
                        equipmentList[equipment].deviceNo
                      }?source=${
                        equipmentList[equipment].source
                      }&name=${equipment}`
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
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
