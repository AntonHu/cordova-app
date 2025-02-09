// JavaScript Document
import React, { Component } from 'react';
import './style.less';

const initCountDownTxt = '获取验证码';

class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nums:props.nums,												// 倒计时时间（s）
      tips:'',														// 提示信息
      countdown: initCountDownTxt,						// 倒计时按钮值
      status: props.status || 'able',											// 倒计时按钮状态(disable:不可发送,able:可发送,sending:倒计时中)
    }
  }
  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   status:nextProps.status
    // });
  }
  componentWillUnmount() {
    if (this.clock) {
      clearInterval(this.clock);
    }
  }

  startCounting = () => {
    this.clock = setInterval(
      () => this.doLoop(),
      1000
    );
    // 状态改变
    this.setState({
      status:'sending',
      countdown:'重新发送(' + this.state.nums + 's)',
    });
  };

  // 点击发送验证码
  handleSend=(event)=>{
    switch(this.state.status){
      // 按钮处发送状态，点击后提示
      case 'sending':
        this.setState({
          tips:this.props.sendingClick
        });
        if (this.props.callback) {
          // 通知父组件
          this.props.callback(this.props.sendingClick,false);
        }
        break;
      default:
        this.props.sendCode();
        break;
    }
  };
  // 倒计时实现
  doLoop(){
    var nums = this.state.nums;
    nums--;
    this.setState({
      nums:nums
    });
    if(nums > 0){
      this.setState({
        countdown:'重新发送(' + nums + 's)'
      });
    }
    else{
      this.resetButton();
    }
  }
  // 按钮重置
  resetButton(){
    clearInterval(this.clock);	// 清除js定时器
    this.setState({
      countdown: initCountDownTxt,
      status:'able',
      nums:this.props.nums,	// 重置时间
    });
    // 通知父组件
    if (this.props.callback) {
      this.props.callback(false,'able');
    }
  }
  render() {
    return (
      <span id="sendCode" className={"input-group-addon  " + this.state.status} onClick={this.handleSend}>{this.state.countdown}</span>
    );
  }
}

export default Countdown;