import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import {
  Title,
  PageWithHeader,
  Picture,
  Rank,
  OrangeGradientBtn,
  ToastNoMask
} from '../../../components';
import {
  Icon,
  Tabs,
  WhiteSpace,
  Button,
  Toast,
  ActivityIndicator,
  Modal
} from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import { Document, Page, Outline } from 'react-pdf';
// import { Document, Page } from 'react-pdf/dist/entry.webpack';
import './index.less';
import { contractServer } from '../../../utils/variable';
import { reaction, toJS } from 'mobx';
import { fetchLegalDocument } from '../../../stores/contract/request';

import { saveEvidence, signData } from '../../../utils/fetch';
import { packJson } from '../../../utils/methods';

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

  async componentDidMount() {
    // this.makeRequest();
    // this.getPdf();
    //需要签名的数据
    //let packJsonData = await packJson({ name: 'liu' });
    // const { data } = packJsonData;
    // console.log('data is ', packJsonData);
    // saveEvidence('', packJsonData).then(data => {
    //   console.log('测试晓鹏老师接口', data);
    // });
    return;
  }

  componentWillUnmount() {
    this.purchaseLoading();
  }

  componentDidCatch(err, info) {
    console.log(err);
    console.log(info);
  }

  purchaseLoading = reaction(
    () => this.props.contractStore.notInvolvedDetail.isPurchasing,
    loading => {
      this.setState({
        loading: loading,
        loadingText: loading ? '正在发送申购请求...' : ''
      });
    }
  );

  onConfirm = () => {
    console.log(this.state.isAccept);
    if (!this.state.isAccept) {
      Modal.alert('未同意', '您尚未点击同意按钮', [{ text: '知道了' }]);
      return;
    } else {
      this.sendPurchaseReq();
    }
  };

  /**
   * 发送申购请求
   */
  sendPurchaseReq = async () => {
    const { notInvolvedDetail } = this.props.contractStore;
    const { projectId, purchaseNumber } = this.props.match.params;
    const result = await notInvolvedDetail.onPurchase({
      projectId,
      purchaseNumber
    });
    if (result.success) {
      const data = result.data || {};
      const purchaseId = data.purchaseId || undefined;
      Toast.info('您已申购成功', 3, () => {
        this.props.history.push(
          `/contract/purchaseShare/${projectId}/purchaseId/${purchaseId}`
        );
      });
    } else {
      Toast.info(result.msg);
    }
  };

  onDocumentLoad = data => {
    this.setState({
      totalPage: new Array(data.pdfInfo.numPages).fill(1)
    });
  };

  getPDFUrl = () => {
    const token = getLocalStorage('token');
    const { projectId, purchaseNumber } = this.props.match.params;
    const url = `${contractServer}/app/project/legalFile?access_token=${token}&type=0&projectId=${projectId}&purchaseNumber=${purchaseNumber}`;
    console.log(url);
    return url;
  };

  render() {
    const { isAccept } = this.state;
    const { projectId, purchaseNumber } = this.props.match.params;
    return (
      <PageWithHeader title="投资份额确认书" id="page-share-confirm">
        <div className="content-wrap">
          <Document
            file={{ url: this.getPDFUrl() }}
            onLoadSuccess={this.onDocumentLoad}
            loading="正在加载文件，请稍候..."
            noData="没有找到文件"
            error="读取文件出错"
            onLoadError={err => {
              // console.log('onLoadError');
              // console.log(JSON.stringify(err))
            }}
            onSourceError={err => {
              // console.log('onSourceError');
              // console.log(JSON.stringify(err))
            }}
          >
            {this.state.totalPage.map((v, idx) => (
              <Page pageNumber={idx + 1} key={idx + 1} />
            ))}
          </Document>

          <div className="agreement-box">
            <div
              className={`agree-action ${isAccept ? 'accept' : ''}`}
              onClick={() => this.setState({ isAccept: !isAccept })}
            >
              <i className="iconfont">&#xe61d;</i>
              同意
            </div>
            <div className="agreement">《投资份额确认书》</div>
            <div className="agreement">
              <Link
                to={`/contract/authorizeDocument/${projectId}/purchaseNumber/${purchaseNumber}`}
              >
                《电站建造登记运营代收电费授权书》
              </Link>
            </div>
            <div className="agreement">
              <Link
                to={`/contract/investAgreement/${projectId}/purchaseNumber/${purchaseNumber}`}
              >
                《投资协议》
              </Link>
            </div>
          </div>
        </div>

        <OrangeGradientBtn onClick={this.onConfirm}>确认</OrangeGradientBtn>
        <ActivityIndicator
          toast
          text={this.state.loadingText}
          animating={this.state.loading}
        />
      </PageWithHeader>
    );
  }
}

export default ShareConfirm;
