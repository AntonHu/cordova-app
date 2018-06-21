import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  BlueBox,
  PeakBox,
  GreenButton,
  Header,
  PageWithHeader
} from '../../../components';
import {
  List,
  InputItem,
  Flex,
  Button,
  WhiteSpace,
  Radio,
  Icon
} from 'antd-mobile';
import G2 from '@antv/g2';
import F2 from '@antv/f2';
import { getDeviceWidth, px } from '../../../utils/getDevice';
import './style.less';

const RadioItem = Radio.RadioItem;

G2.track(false);
const Util = F2.Util;

// 坐标轴的默认样式配置
const defaultAxis = {
  label: {
    fill: '#fff',
    fontSize: 10
  }, // 坐标轴文本的样式
  line: {
    stroke: '#fff',
    lineWidth: 1,
    top: true
  }, // 坐标轴线的样式
  grid: {
    stroke: '#fff',
    lineWidth: 1,
    lineDash: [2]
  }, // 坐标轴网格线的样式
  tickLine: null, // 坐标轴刻度线，默认不展示
  labelOffset: 7.5 // 坐标轴文本距离坐标轴线的距离
};
/**
 * 电站设备信息
 */
const data = [
  {
    year: '1951 年',
    sales: 38
  },
  {
    year: '1952 年',
    sales: 52
  },
  {
    year: '1956 年',
    sales: 61
  },
  {
    year: '1957 年',
    sales: 145
  },
  {
    year: '1958 年',
    sales: 48
  },
  {
    year: '1959 年',
    sales: 38
  },
  {
    year: '1960 年',
    sales: 38
  }
];
class Comp extends React.PureComponent {
  state = {
    selected: {
      daySelected: false,
      monthSelected: false,
      yearSelected: false,
      allSelected: false
    },
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
  componentDidMount() {
    this.pieBarChart = this.renderPieBar();
  }

  componentWillUnmount() {
    if (this.pieBarChart) {
      this.pieBarChart = undefined;
    }
  }

  // 初始化柱形图
  renderPieBar = () => {
    F2.Global.setTheme({
      pixelRatio: 2
    }); // 设为双精度
    var chart = new F2.Chart({
      id: 'pie-bar-chart',
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data, {
      sales: {
        tickCount: 5
      }
    });
    F2.Global.setTheme({
      colors: ['white'],
      axis: {
        bottom: Util.mix({}, defaultAxis, {
          grid: null
        }), // 底部坐标轴配置
        left: Util.mix({}, defaultAxis, {
          line: null
        }) // 左侧坐标轴配置
      } // 各种坐标轴配置
    });
    chart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = '¥ ' + items[0].value;
      }
    });
    chart.interval().position('year*sales');
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

  render() {
    return (
      <div className={'page-equipment-info'}>
        <PageWithHeader title={'我的电站'}>
          <BlueBox type={'pure'}>
            <div className="title">
              <div>晴</div>
              <div className="screen" onClick={this.screenChange}>
                <div
                  data-class="daySelected"
                  className={this.state.selected.daySelected ? 'selected' : ''}
                >
                  日
                </div>
                <div
                  data-class="monthSelected"
                  className={
                    this.state.selected.monthSelected ? 'selected' : ''
                  }
                >
                  月
                </div>
                <div
                  data-class="yearSelected"
                  className={this.state.selected.yearSelected ? 'selected' : ''}
                >
                  年
                </div>
                <div
                  data-class="allSelected"
                  className={this.state.selected.allSelected ? 'selected' : ''}
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
            <div className="type-item">收益</div>
          </div>
          <div className="detail">
            <div className="detail-item">
              <div className="number">15.0kw</div>
              <div className="detail-type">当前</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">今日</div>
            </div>
            <div className="detail-item">
              <div className="number">18.0kw</div>
              <div className="detail-type">今日</div>
            </div>
          </div>
          <div className="equipment">
            <div className="equipment-title">太阳城蓄力装备</div>
            {this.state.equipmentList.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item"
                  onClick={() =>
                    this.props.history.push(`/equipmentInfo/${index}`)
                  }
                >
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
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
