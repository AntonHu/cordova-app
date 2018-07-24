import React from 'react';
import {PageWithHeader, Header} from '../../../components';
import './style.less';

class PointRule extends React.PureComponent {
  render() {
    return (
      <div className="page-point-rule">
        <Header title="" transparent/>
        <img src={require("../../../images/point_rule_bg.png")} width="100%" />
        <div className="rule">
          <div className="title">积分规则</div>
          用户可以通过绑定逆变器设备来获取太阳积分。太阳积分根据过去3小时用户个人设备发电量来发放，发电越多，获得的积分越多。太阳积分总量有限，先到先得，越早进入能信链太阳城越容易获取。
        </div>
      </div>
    )
  }
}

export default PointRule;
