import React from 'react';
import {BlueBox, PeakBox, GreenButton, Header, PageWithHeader} from '../../../components';
import {List, InputItem, Flex, Button, WhiteSpace} from 'antd-mobile';
import G2 from '@antv/g2';
import F2 from '@antv/f2';
import {getDeviceWidth, px} from '../../../utils/getDevice';
import './style.less';

G2.track(false);

/**
 * 电站设备信息
 */
class Comp extends React.PureComponent {
  componentDidMount() {
    this.pieBarChart = this.renderPieBar();
  }

  componentWillUnmount() {
    if (this.pieBarChart) {
      this.pieBarChart = undefined;
    }
  }

  renderPieBar = () => {
    const canvas = document.getElementById('pie-bar-chart');
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 320, 0);
    grd.addColorStop(0, "#dbb768");
    grd.addColorStop(1, "#8de737");

    const chart = new F2.Chart({
      id: 'pie-bar-chart',
      width: px(320),
      height: px(320),
      pixelRatio: window.devicePixelRatio
    });
    const data = [{
      x: '1',
      y: 85
    }];
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
      radius: 0.85
    });
    chart.guide().arc({
      start: [0, 0],
      end: [1, 99.98],
      top: false,
      style: {
        lineWidth: 20,
        stroke: '#ccc'
      }
    });
    chart.guide().text({
      position: ['50%', '50%'],
      content: '85%',
      style: {
        fontSize: 24,
        fill: '#1890FF'
      }
    });
    chart.interval()
      .position('x*y')
      .color(grd)
      .size(20)
      .animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      });
    chart.render();

    return chart;
  };

  render() {
    return (
      <div className={'page-equipment-info'}>
        <PageWithHeader title={'某一台电站设备'}>
          <BlueBox type={'pure'}>

          </BlueBox>
          <PeakBox>
            <canvas id="pie-bar-chart"></canvas>
          </PeakBox>
        </PageWithHeader>
      </div>
    )
  }
}

export default Comp;
