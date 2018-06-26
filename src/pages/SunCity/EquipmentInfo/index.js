import React from 'react';
import { PageWithHeader } from '../../../components';
// import { List, InputItem, Flex, Button, WhiteSpace } from 'antd-mobile';
import G2 from '@antv/g2';
import F2 from '@antv/f2';
import { px } from '../../../utils/getDevice';
import './style.less';

G2.track(false);

const data = [
  {
    time: '2016-08-08',
    tem: 10
  },
  {
    time: '2016-08-09',
    tem: 22
  },
  {
    time: '2016-08-10',
    tem: 20
  },
  {
    time: '2016-08-11',
    tem: 26
  },
  {
    time: '2016-08-12',
    tem: 20
  },
  {
    time: '2016-08-13',
    tem: 26
  },
  {
    time: '2016-08-14',
    tem: 28
  }
];
/**
 * 电站设备信息
 */
class Comp extends React.PureComponent {
  state = {
    selected: {
      daySelected: true,
      monthSelected: false,
      yearSelected: false,
      allSelected: false
    }
  };
  componentDidMount() {
    this.pieBarChart = this.renderPieBar();
    this.pieBarChart = this.renderCurve();
  }

  componentWillUnmount() {
    if (this.pieBarChart) {
      this.pieBarChart = undefined;
    }
  }
  renderCurve = () => {
    const chart = new F2.Chart({
      id: 'curve-chart',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      time: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: data.length,
        range: [0, 1]
      },
      tem: {
        tickCount: 5,
        min: 0,
        alias: '日均温度'
      }
    };
    chart.source(data, defs);
    chart.axis('time', {
      label: function label(text, index, total) {
        var textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.tooltip({
      showCrosshairs: true
    });
    chart
      .line()
      .position('time*tem')
      .shape('smooth');
    chart
      .point()
      .position('time*tem')
      .shape('smooth')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });
    chart.render();
  };
  renderPieBar = () => {
    const canvas = document.getElementById('pie-bar-chart');
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 320, 0);
    grd.addColorStop(0, '#dbb768');
    grd.addColorStop(1, '#8de737');

    const chart = new F2.Chart({
      id: 'pie-bar-chart',
      width: px(360),
      height: px(360),
      padding: 10,
      pixelRatio: window.devicePixelRatio
    });
    const data = [
      {
        x: '1',
        y: 85
      }
    ];
    chart.source(data, {
      y: {
        max: 100,
        min: 0
      }
    });
    chart.axis(false);
    chart.tooltip(false);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.8,
      radius: 0.9
    });
    chart.guide().arc({
      start: [0, 0],
      end: [1, 99.98],
      top: false,
      style: {
        lineWidth: 15,
        stroke: '#ccc'
      }
    });
    chart.guide().html({
      position: ['110%', '60%'],
      html:
        '<div style="width: 250px;height: 40px;text-align: center;">' +
        '<div style="font-size: 14px">321313w</div>' +
        '<div style="font-size: 14px">总资产</div>' +
        '</div>'
    });
    chart
      .interval()
      .position('x*y')
      .color(grd)
      .size(15)
      .animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      });
    chart.render();

    return chart;
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
        <PageWithHeader title={'某一台电站设备'}>
          <div className="survey">
            <div className="survey-item">
              <div className="survey-item-number">20.1kw/h</div>
              <div className="survey-item-type">日电量</div>
            </div>
            <canvas id="pie-bar-chart" />
            <div className="survey-item">
              <div className="survey-item-number">60.1kw/h</div>
              <div className="survey-item-type">总电量</div>
            </div>
          </div>
          <div className="equipment-content">
            <div className="screen" onClick={this.screenChange}>
              <div
                data-class="daySelected"
                className={this.state.selected.daySelected ? 'selected' : ''}
              >
                日
              </div>
              <div
                data-class="monthSelected"
                className={this.state.selected.monthSelected ? 'selected' : ''}
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
            <div className="curve-chart-title">日功率走势图</div>
            <canvas id="curve-chart" />
            <div className="curve-chart-info">
              <div className="curve-info">
                <div className="curve-number">5098</div>
                <div className="curve-type">总量</div>
              </div>
              <div className="curve-info">
                <div className="curve-number">5098</div>
                <div className="curve-type">总量</div>
              </div>
              <div className="curve-info">
                <div className="curve-number">5098</div>
                <div className="curve-type">总量</div>
              </div>
            </div>
          </div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
