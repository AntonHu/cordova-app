import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import { TraceCard } from "../component";

// 组件溯源
class ComponentTrace extends React.PureComponent {


  render() {
    return (
      <PageWithHeader title="组件溯源" id="page-component-trace">
        <div className="component-wrap">
          <div className="component-info-item">组件编号：5LC45180728100251730001</div>
          <div className="component-info-item">型号：xxxxxxxxxxxxxxx</div>
          <div className="component-info-item">额定功率：xxxxx</div>
          <div className="component-info-item">品牌：大海</div>
        </div>

        <div className="trace-wrap">
          <TraceCard icon="&#xe65d;" title="原料">
          </TraceCard>

          <TraceCard icon="&#xe62d;" title="分选">
            <TraceCard.Item>片源批号：M02180331002</TraceCard.Item>
            <TraceCard.Item>操作人员：B2001|分选</TraceCard.Item>
            <TraceCard.Item>片源厂商：晶科</TraceCard.Item>
            <TraceCard.Item>片源规格：P156-5-C|156.75</TraceCard.Item>
            <TraceCard.Item>片源颜色：蓝色</TraceCard.Item>
            <TraceCard.Item>片源用量：72</TraceCard.Item>
            <TraceCard.Item>片源档位：A</TraceCard.Item>
            <TraceCard.Item>单片功率：4.52</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe623;" title="焊接">
            <TraceCard.Item>焊接时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：B2001|分选</TraceCard.Item>
            <TraceCard.Item>机台编号：M02HJJ002</TraceCard.Item>
            <TraceCard.Item>破片数量： --</TraceCard.Item>
            <TraceCard.Item>助焊剂厂商：朝日</TraceCard.Item>
            <TraceCard.Item>助焊剂批号：--</TraceCard.Item>
            <TraceCard.Item>互联条厂商 ：凡登</TraceCard.Item>
            <TraceCard.Item>互联条规格：0.23*1mm</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe7e2;" title="叠层">
            <TraceCard.Item>操作时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：B2001|分选</TraceCard.Item>
            <TraceCard.Item>机台编号：M02DCT002</TraceCard.Item>
            <TraceCard.Item>EVA厂商：杭州福斯特</TraceCard.Item>
            <TraceCard.Item>高透EVA规格：1945*980*0.5</TraceCard.Item>
            <TraceCard.Item>高透EVA批号：--</TraceCard.Item>
            <TraceCard.Item>普通EVA规格：1945*980*0.5</TraceCard.Item>
            <TraceCard.Item>普通EVA批号：--</TraceCard.Item>
            <TraceCard.Item>玻璃厂商：福莱特</TraceCard.Item>
            <TraceCard.Item>背板厂商：中天</TraceCard.Item>
            <TraceCard.Item>玻璃规格：1945*985*4.0mm</TraceCard.Item>
            <TraceCard.Item>背板规格：1945*985*4.0mm</TraceCard.Item>
            <TraceCard.Item>玻璃批号：--</TraceCard.Item>
            <TraceCard.Item>背板批号：--</TraceCard.Item>
            <TraceCard.Item>汇流条厂商 ：同享</TraceCard.Item>
            <TraceCard.Item>汇流条批号：--</TraceCard.Item>
            <TraceCard.Item>汇流条规格：0.4*4mm</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe62f;" title="层压前 EL">
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>机台编号：NZ7AJWI7LGO3N01kjlksjlkdfjlks</TraceCard.Item>
            <TraceCard.Item>测试结果：NG</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe673;" title="层压">
            <TraceCard.Item>操作时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：A2009|层压</TraceCard.Item>
            <TraceCard.Item>机台编号：M02CYJ001</TraceCard.Item>
            <TraceCard.Item>层压温度：140℃；146℃</TraceCard.Item>
            <TraceCard.Item>层压时间：200S；500S;</TraceCard.Item>
            <TraceCard.Item>抽真空时间：340S;</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe628;" title="层压后 EL">
            <TraceCard.Item>测试时间：--</TraceCard.Item>
            <TraceCard.Item>操作人员：--</TraceCard.Item>
            <TraceCard.Item>机台编号：--</TraceCard.Item>
            <TraceCard.Item>测试结果：--</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe7a4;" title="装框">
            <TraceCard.Item>操作时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：A2010|装框</TraceCard.Item>
            <TraceCard.Item>机台编号：M02ZKJ002</TraceCard.Item>
            <TraceCard.Item>线盒厂家：N:晶科</TraceCard.Item>
            <TraceCard.Item>型材厂家：晶科</TraceCard.Item>
            <TraceCard.Item>线盒规格：N：JK06D</TraceCard.Item>
            <TraceCard.Item>型材规格：--</TraceCard.Item>
            <TraceCard.Item>线盒批号：--</TraceCard.Item>
            <TraceCard.Item>型材批号：--</TraceCard.Item>
            <TraceCard.Item>线盒胶厂商：江苏明昊</TraceCard.Item>
            <TraceCard.Item>型材胶厂商：江苏明昊</TraceCard.Item>
            <TraceCard.Item>线盒胶批号：--</TraceCard.Item>
            <TraceCard.Item>型材胶批号：--</TraceCard.Item>

          </TraceCard>

          <TraceCard icon="&#xe69b;" title="清洗">
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>机台编号：M02QXT001</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe627;" title="全检">
            <TraceCard.Item>全检时间：--</TraceCard.Item>
            <TraceCard.Item>操作人员：--</TraceCard.Item>
            <TraceCard.Item>机台编号：--</TraceCard.Item>
            <TraceCard.Item>全检结果：--</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe653;" title="电性能测试">
            <TraceCard.Item>机台编号：M02CSYOO1</TraceCard.Item>
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>测试功率：276.358015</TraceCard.Item>
            <TraceCard.Item>测试电流：8.939264</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe6b9;" title="测试后 EL">
            <TraceCard.Item>测试时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：--</TraceCard.Item>
            <TraceCard.Item>机台编号：LENOVO-PC</TraceCard.Item>
            <TraceCard.Item>测试结果：Q1</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe630;" title="包装">
            <TraceCard.Item>操作时间：2018/04/01 00:24:37</TraceCard.Item>
            <TraceCard.Item>操作人员：B2012|包装</TraceCard.Item>
            <TraceCard.Item>机台编号：USER-20160503EH</TraceCard.Item>
            <TraceCard.Item>托盘编号：45180724193</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe625;" title="入库">
            <TraceCard.Item>操作时间：--</TraceCard.Item>
            <TraceCard.Item>操作人员：--</TraceCard.Item>
            <TraceCard.Item>库位编号：--</TraceCard.Item>
            <TraceCard.Item>出货柜号：--</TraceCard.Item>
          </TraceCard>

          <TraceCard icon="&#xe907;" title="检验评审">
            <TraceCard.Item>操作时间：--</TraceCard.Item>
            <TraceCard.Item>操作人员：--</TraceCard.Item>
            <TraceCard.Item>外观等级：--</TraceCard.Item>
            <TraceCard.Item>EL等级：--</TraceCard.Item>
          </TraceCard>

        </div>
      </PageWithHeader>
    )
  }
}

export default ComponentTrace;
