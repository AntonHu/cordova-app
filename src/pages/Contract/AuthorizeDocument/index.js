import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';
import OrangeGradientBtn from "../../../components/OrangeGradientBtn";
import { contractServer } from "../../../utils/variable";
import { Document, Page } from "react-pdf";

// 投资协议页面
class AuthorizeDocument extends React.PureComponent{

  state = {
    totalPage: []
  };

  onDocumentLoad = (data) => {
    console.log(data.pdfInfo);
    this.setState({
      totalPage: new Array(data.pdfInfo.numPages).fill(1)
    })
  };

  getPDFUrl = () => {
    const token = getLocalStorage('token');
    const { projectId, purchaseNumber } = this.props.match.params;
    return `${contractServer}/app/project/legalFile?access_token=${token}&type=2&projectId=${projectId}&purchaseNumber=${purchaseNumber}`
  };

  render() {
    return (
      <PageWithHeader title="代收电费授权书" id="page-authorize-document">
        <div className="content-wrap">
          {/*<Document*/}
            {/*file={ { url: this.getPDFUrl() } }*/}
            {/*onLoadSuccess={ this.onDocumentLoad }*/}
            {/*loading="正在加载文件，请稍候..."*/}
            {/*noData="没有找到文件"*/}
            {/*error="读取文件出错"*/}
            {/*onLoadError={ (err) => {*/}
              {/*console.log('onLoadError');*/}
              {/*console.log(JSON.stringify(err))*/}
            {/*}}*/}
            {/*onSourceError={(err) => {*/}
              {/*console.log('onSourceError');*/}
              {/*console.log(JSON.stringify(err))*/}
            {/*}}*/}
          {/*>*/}
            {/*{*/}
              {/*this.state.totalPage.map((v, idx) =>*/}
                {/*<Page pageNumber={ idx + 1 } />*/}
              {/*)*/}
            {/*}*/}

          {/*</Document>*/}
          <iframe
            src={this.getPDFUrl()}
            seamless="seamless"
            frameBorder={0}
            width="100%"
            height="100%"
          />

        </div>

      </PageWithHeader>
    )
  }
}

export default AuthorizeDocument;
