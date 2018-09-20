import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './LegalDocumentDetail.less';
import OrangeGradientBtn from "../../../components/OrangeGradientBtn";
import { contractServer } from "../../../utils/variable";
import { Document, Page } from "react-pdf";

// 查看法律文书详情 页面
@inject('contractStore')
@observer
class LegalDocumentDetail extends React.Component{

  state = {
    totalPage: []
  };

  componentWillUnmount() {
    const { involvedDetail } = this.props.contractStore;
    involvedDetail.setLegalDoc({
      docUrl: '',
      docName: ''
    })
  }

  onDocumentLoad = (data) => {
    console.log(data.pdfInfo);
    this.setState({
      totalPage: new Array(data.pdfInfo.numPages).fill(1)
    })
  };

  getPDFUrl = () => {
    const token = getLocalStorage('token');
    const { projectId, purchaseNumber } = this.props.match.params;
    // todo: type是多少？
    return `${contractServer}/app/project/legalFile?access_token=${token}&type=1&projectId=${projectId}&purchaseNumber=${purchaseNumber}`
  };

  render() {
    const { involvedDetail } = this.props.contractStore;
    const { docName, docUrl } = involvedDetail;
    return (
      <PageWithHeader title={docName || '法律文书'} id="page-legal-document-detail">
        <div className="content-wrap">
          <Document
            file={ { url: docUrl } }
            onLoadSuccess={ this.onDocumentLoad }
          >
            {
              this.state.totalPage.map((v, idx) =>
                <Page pageNumber={ idx + 1 } />
              )
            }

          </Document>

        </div>

      </PageWithHeader>
    )
  }
}

export default LegalDocumentDetail;
