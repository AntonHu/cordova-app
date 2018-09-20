import React from 'react';
import { PageWithHeader } from '../../../components';
import { getLocalStorage } from '../../../utils/storage';
import './index.less';
import { contractServer } from "../../../utils/variable";
import { Document, Page } from "react-pdf";

// 投资协议页面
class InvestAgreement extends React.PureComponent{

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
    return `${contractServer}/app/project/legalFile?access_token=${token}&type=1&projectId=${projectId}&purchaseNumber=${purchaseNumber}`
  };

  render() {
    return (
      <PageWithHeader title="投资协议" id="page-invest-agreement">
        <div className="content-wrap">
          <Document
            file={ { url: this.getPDFUrl() } }
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

export default InvestAgreement;
