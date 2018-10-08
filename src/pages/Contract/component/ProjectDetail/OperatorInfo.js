import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, List } from "antd-mobile";
import Picture from "../../../../components/Picture";
import './OperatorInfo.less';

const Item = List.Item;

// 受托建造运营方信息 组件
class OperatorInfo extends React.PureComponent{
  static propTypes = {
    projectDetail: PropTypes.object.isRequired
  };

  render() {
    const { projectDetail } = this.props;
    const enterpriseInfo = projectDetail.enterpriseInfo || {};
    const businessLicenseOssPath = enterpriseInfo.businessLicenseOssPath || '';
    return (
      <div className="_operation-info">
        <List className="info-list">
          <Item extra={ `${enterpriseInfo.enterpriseName || ''}` }>企业名称</Item>
          <Item extra={ `${enterpriseInfo.corporate || ''}` }>企业法人</Item>
          <Item extra={ `${enterpriseInfo.collectionAccount || ''}` }>打款帐号</Item>
          <Item extra={ `${enterpriseInfo.bank || ''}` }>开户行</Item>
          <Item extra={ `${enterpriseInfo.contact || ''}` }>联系人</Item>
          <Item extra={ `${enterpriseInfo.phone || ''}` }>电话</Item>
          <Item extra={ `${enterpriseInfo.address || ''}` }>地址</Item>

          <Accordion className="operation-accordion">
            <Accordion.Panel header="营业执照">
              <Picture
                src={businessLicenseOssPath}
                emptyElement={props => (
                  <div className={props.className}>该文件非图片，无法预览</div>
                )}
              />
            </Accordion.Panel>
          </Accordion>
        </List>
      </div>
    )
  }

}

export default OperatorInfo;
