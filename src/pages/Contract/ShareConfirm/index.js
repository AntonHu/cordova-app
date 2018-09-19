import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button, Toast, ActivityIndicator, Modal } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { Document, Page, Outline } from 'react-pdf';
import './index.less';
import { contractServer } from "../../../utils/variable";
import { reaction } from "mobx";

// 投资份额确认书
@inject('contractStore')
@observer
class ShareConfirm extends React.Component {

  state = {
    isAccept: false,
    totalPage: [],
    loading: false,
    loadingText: ''
  };

  componentDidMount() {
    // this.makeRequest();
  }

  componentWillUnmount() {
    this.purchaseLoading();
  }

  purchaseLoading = reaction(
    () => this.props.contractStore.notInvolvedDetail.isPurchasing,
    (loading) => {
      if (loading) {
        this.setState({
          loading: true,
          loadingText: '正在发送申购请求...'
        });
      } else {
        this.setState({
          loading: false,
          loadingText: ''
        });
      }
    }
  );


  onConfirm = () => {
    console.log(this.state.isAccept);
    if (!this.state.isAccept) {
      Modal.alert('未同意', '您尚未点击同意按钮', [{text:'知道了'}]);
      return;
    } else {
      this.sendPurchaseReq();
    }
  };

  /**
   * 发送申购请求
   */
  sendPurchaseReq = async() => {
    const { notInvolvedDetail } = this.props.contractStore;
    const projectId = notInvolvedDetail.projectDetail.id;
    const purchaseNumber = notInvolvedDetail.purchaseCount;
    const result = await notInvolvedDetail.onPurchase({
      projectId,
      purchaseNumber
    });
    if (result.success) {
      Toast.info('您已申购成功', 3, () => {
        this.props.history.push('/contract/purchaseShare')
      })
    } else {
      Toast.info(result.msg)
    }
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

    return `${contractServer}/app/project/legalFile?access_token=${token}&type=0&projectId=${projectId}&purchaseNumber=${purchaseNumber}`
  };

  render() {
    const { isAccept } = this.state;
    const { projectId, purchaseNumber } = this.props.match.params;
    return (
      <PageWithHeader title="投资份额确认书" id="page-share-confirm">
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

          <div className="agreement-box">

            <div
              className={ `agree-action ${isAccept ? 'accept' : ''}` }
              onClick={ () => this.setState({ isAccept: !isAccept }) }
            >
              <i className="iconfont">&#xe61d;</i>同意
            </div>
            <div className="agreement">《投资份额确认书》</div>
            <div className="agreement">
              <Link to={`/contract/authorizeDocument/${projectId}/purchaseNumber/${purchaseNumber}`}>
              《电站建造登记运营代收电费授权书》
              </Link>
            </div>
            <div className="agreement">
              <Link to={`/contract/investAgreement/${projectId}/purchaseNumber/${purchaseNumber}`}>《投资协议》</Link>
            </div>
          </div>
        </div>

        <OrangeGradientBtn onClick={ this.onConfirm }>
          确认
        </OrangeGradientBtn>
        <ActivityIndicator
          toast
          text={ this.state.loadingText }
          animating={ this.state.loading }
        />
      </PageWithHeader>
    )
  }
}

export default ShareConfirm;
