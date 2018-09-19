import React from 'react';
import PropTypes from 'prop-types';
import { List } from "antd-mobile";

const Item = List.Item;

// 受托建造运营方信息 组件
// TODO: 缺 企业法人
// TODO: 营业执照 展开
class OperatorInfo extends React.PureComponent{
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {
    const { projectDetail } = this.props;
    const enterpriseInfo = projectDetail.enterpriseInfo || {};
    return (
      <div className="operation-info">
        <List className="info-list">
          <Item extra={ `${enterpriseInfo.enterpriseName}` }>企业名称</Item>
          <Item extra={ `${enterpriseInfo.contact}` }>企业法人</Item>
          <Item extra={ `${enterpriseInfo.collectionAccount}` }>打款帐号</Item>
          <Item extra={ `${enterpriseInfo.bank}` }>开户行</Item>
          <Item extra={ `${enterpriseInfo.contact}` }>联系人</Item>
          <Item extra={ `${enterpriseInfo.phone}` }>电话</Item>
          <Item extra={ `${enterpriseInfo.address}` }>地址</Item>
          <Item arrow="horizontal">营业执照</Item>
        </List>
      </div>
    )
  }

}

export default OperatorInfo;
