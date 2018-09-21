import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

// 法律文书页面
// TODO: 红色"已签约" 的stamp
@inject('contractStore')
@observer
class LegalDocument extends React.Component {

  onClick = (item) => {
    const { involvedDetail } = this.props.contractStore;
    involvedDetail.setLegalDoc({
      docName: item.fileTypeName,
      docUrl: item.ossPath
    });
    this.props.history.push('/contract/legalDocumentDetail');
  };

  render() {
    const { involvedDetail } = this.props.contractStore;
    const docList = involvedDetail.docList || [];
    return (
      <PageWithHeader title="法律文书" id="page-legal-document">
        {
          docList.map((item, idx) => {
            if (idx % 2 === 0) {
              const firstItem = docList[idx];
              const secondItem = docList[idx + 1];
              return (
                <div className="doc-row">
                  <Button className="doc-item" onClick={() => this.onClick(firstItem)}>
                    <div className="doc-name">{firstItem.fileTypeName || '无'}</div>
                    <div className="doc-time">2018-05-15</div>
                    <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
                    {/*<div className="customer-name">xxx</div>*/}
                  </Button>
                  {
                    secondItem &&
                    <Button className="doc-item" onClick={() => this.onClick(secondItem)}>
                      <div className="doc-name">{secondItem.fileTypeName || '无'}</div>
                      <div className="doc-time">2018-05-15</div>
                      <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
                      {/*<div className="customer-name">xxx</div>*/}
                    </Button>
                  }

                </div>
              )
            }
            return null;

          })
        }

      </PageWithHeader>
    )
  }

}

export default LegalDocument;
