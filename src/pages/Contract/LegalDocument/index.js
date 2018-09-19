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
class LegalDocument extends React.PureComponent {
  render() {
    return (
      <PageWithHeader title="法律文书" id="page-legal-document">
        <div className="doc-row">
          <Button className="doc-item">
            <div className="doc-name">投资份额确认书</div>
            <div className="doc-time">2018-05-15</div>
            <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
            <div className="customer-name">xxx</div>
          </Button>
          <Button className="doc-item">
            <div className="doc-name">投资份额确认书</div>
            <div className="doc-time">2018-05-15</div>
            <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
            <div className="customer-name">xxx</div>
          </Button>
        </div>

        <div className="doc-row">
          <Button className="doc-item">
            <div className="doc-name">投资份额确认书</div>
            <div className="doc-time">2018-05-15</div>
            <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
            <div className="customer-name">xxx</div>
          </Button>
          <Button className="doc-item">
            <div className="doc-name">投资份额确认书</div>
            <div className="doc-time">2018-05-15</div>
            <img src={ require('../../../images/stamp/signed.png') } className="stamp"/>
            <div className="customer-name">xxx</div>
          </Button>
        </div>

      </PageWithHeader>
    )
  }

}

export default LegalDocument;
