import React from 'react';
import JSEncrypt from 'jsencrypt';
import {Button} from 'antd-mobile';
import JSRsasign from 'jsrsasign';

class Comp extends React.PureComponent {
  state = {
    publicKey: '',
    privateKey: '',
    appPath: '',
    msg: 'hello',
    cMsg: '',
    cOut: '0e5b9afcc0a67286a9be10b487bc3a617e033f3fafae317f36d9d87940e961e1',
    out: ''
  };

  readFileInWWWFolder = (filename, onSuccess, onFailure) => {
    var request = new XMLHttpRequest();

    request.onload = function() {

      var arrayBuffer = request.response;

      if (arrayBuffer) {

        // onSuccess(new Uint8Array(arrayBuffer));
        onSuccess(arrayBuffer);
      }
      else {
        onFailure();
      }
    };
    request.open("GET", filename, true);
    request.responseType = "text";
    request.send();
  };

  componentDidMount() {
    if (window.cordova && window.cordova.file) {
      this.setState({
        appPath: window.cordova.file.applicationDirectory
      });
      this.readFileInWWWFolder(
        window.cordova.file.applicationDirectory + 'www/test_private.pem',
        res => {
          // alert(res)
          this.setState({
            privateKey: res
          })
        },
        err => {
          console.log('test_private_error');
        }
      );
      this.readFileInWWWFolder(
        window.cordova.file.applicationDirectory + 'www/test_public.pem',
        res => {
          // alert(res)
          this.setState({
            publicKey: res
          })
        },
        err => {
          console.log('test_private_error');
        }
      )
    } else {
      alert('cordova.file不存在')
    }
  }

  encrypt = () => {
    try {
      const encrypt = new JSEncrypt();
      encrypt.setPrivateKey(this.state.privateKey);
      const cMsg = encrypt.getKey().encrypt(this.state.msg);
      console.log(cMsg);
      this.setState({ cMsg });
    }catch (err) {
      alert(err);
    }
  };

  decrypt = () => {
    try {
      const jsEncrypt = new JSEncrypt();
      jsEncrypt.setPublicKey(this.state.publicKey);
      const out = jsEncrypt.getKey().decrypt(this.state.cMsg);
      this.setState({
        out
      });
    } catch (err) {
      alert(err);
    }
  };

  render() {
    return(
      <div className={'page-rsa-demo'}>
        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          私钥的字符串是：
        </div>
        <div>
          {this.state.privateKey || '无'}
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          公钥的字符串是：
        </div>
        <div>
          {this.state.publicKey || '无'}
        </div>

        <div>
          加密过程
          <div>
            原文：
          </div>
          <div>{this.state.msg}</div>
          <div>密文：</div>
          <div>{this.state.cMsg}</div>
          <Button onClick={this.encrypt} style={{ marginTop: '30px'}}>
            加密
          </Button>
        </div>

        <div>
          解密过程
          <div>
            密文：
          </div>
          <div>{this.state.cMsg}</div>
          <div>原文：</div>
          <div>{this.state.out}</div>
          <Button onClick={this.decrypt} style={{ marginTop: '30px'}}>
            解密
          </Button>
        </div>

      </div>
    )
  }
}

export default Comp;
