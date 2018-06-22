import React from 'react';
import { withRouter } from 'react-router-dom';
import { BlueBox, Title, PageWithHeader } from '../../../components';
import { Radio, Icon } from 'antd-mobile';
import G2 from '@antv/g2';
import F2 from '@antv/f2';
import './style.less';

G2.track(false);

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
      daySelected: true,
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

    chart.source(data);
    chart.tooltip({
      showItemMarker: false,
      onShow: function onShow(ev) {
        var items = ev.items;
        items[0].name = null;
        items[0].name = items[0].title;
        items[0].value = '¥ ' + items[0].value;
      }
    });
    chart.axis('year', {
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart.axis('sales', {
      label: {
        fill: '#fff',
        fontSize: 10
      }
    });
    chart
      .interval()
      .position('year*sales')
      .color('#fff');
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
      <div className={'page-powerStation-info'}>
        <PageWithHeader title={'我的电站'}>
          <BlueBox type={'pure'}>
            <div className="title">
              <div className="weather">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy_QupXlXwJsn3uSAdfg2PDnuAYJlsavDh5TXvHjypKj5t6I61Xg"
                  alt=""
                />雨
              </div>
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
            <Title title="太阳城蓄力装备" />
            <div
              className="item"
              onClick={() => this.props.history.push(`/equipmentInfo/${0}`)}
            >
              <div className="item-pic">
                <i class="iconfont icon-shebeiliebiao" />
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
                <i class="iconfont icon-shebeiguanli" />
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
        </PageWithHeader>
      </div>
    );
  }
}

export default withRouter(Comp);
