import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank, OrangeGradientBtn } from '../../../components';
import { Icon, Tabs, WhiteSpace, Button, TextareaItem } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';


// 我要申诉页面
class Appeal extends React.PureComponent {

  state = {
    opinion: '',
    imgUrl: ''
  };

  onSubmit = () => {
  };

  onPhoneCall = () => {
  };

  render() {
    return (
      <PageWithHeader title="我要申诉" id="page-appeal">
        <div className="input-box">
          <TextareaItem
            placeholder="请输入申诉内容..."
            value={ this.state.opinion }
            onChange={ opinion => this.setState({ opinion }) }
          />
        </div>

        <div className="pic-wrap">
          <div className="pic-title">申诉凭证</div>
          <div className="pic-box">
            {
              this.state.imgUrl
              &&
              <img src={this.state.imgUrl} className="pic-item" />
            }
            <Button className="pic-item upload-btn">
              <i className="iconfont">&#xe872;</i>
            </Button>
          </div>
        </div>


        <div className="btn-wrap">
          <Button onClick={ this.onPhoneCall }>
            <i className="iconfont">&#xe61f;</i>
          </Button>
          <OrangeGradientBtn onClick={ this.onSubmit }>提交</OrangeGradientBtn>
        </div>
      </PageWithHeader>
    )
  }
}

export default Appeal;
