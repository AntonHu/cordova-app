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
    msgSign: '',
    verifySign: false,
    cOut: '0e5b9afcc0a67286a9be10b487bc3a617e033f3fafae317f36d9d87940e961e1',
    out: ''
  };

  readFileInWWWFolder = (filename, onSuccess, onFailure) => {
    let fileFullPath = '';
    if (window.cordova) {
       fileFullPath = window.cordova.file.applicationDirectory + 'www/' + filename;
    } else {
      fileFullPath = 'http://localhost:3000/' + filename;
    }

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
    request.open("GET", fileFullPath, true);
    request.responseType = "text";
    request.send();
  };

  componentDidMount() {
    this.readFileInWWWFolder(
      'test_private.pem',
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
      'test_public.pem',
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
  }

  sign = () => {
    try {
      const rsa = new JSRsasign.RSAKey();
      rsa.readPrivateKeyFromPEMString(this.state.privateKey);
      const hash = 'md5';
      const msgSign = rsa.sign(this.state.msg, hash);
      console.log(msgSign);
      this.setState({ msgSign });
    }catch (err) {
      alert(err);
    }
  };

  verify = () => {
    try {
      // const hash = 'md5';
      const sign = this.state.msgSign;
      const msgToVerify = this.state.msg;
      const pubKey = JSRsasign.KEYUTIL.getKey(this.state.publicKey);

      const verifySign = pubKey.verify(msgToVerify, sign);

      this.setState({ verifySign });
    }catch (err) {
      alert(err);
    }
  };

  decrypt = () => {
    try {
      const jsEncrypt = new JSEncrypt();
      jsEncrypt.setPrivateKey(this.state.privateKey);
      const out = jsEncrypt.getKey().decrypt(this.state.cOut);
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
          加签过程
          <div>
            原文：
          </div>
          <div>{this.state.msg}</div>
          <div>签名：</div>
          <div>{this.state.msgSign}</div>
          <Button onClick={this.sign} style={{ marginTop: '30px'}}>
            加签
          </Button>
        </div>

        <div>
          验签过程
          <div>
            签名：
          </div>
          <div>{this.state.msgSign}</div>
          <div>校验结果：</div>
          <div>{this.state.verifySign ? '正确' : '错误'}</div>
          <Button onClick={this.verify} style={{ marginTop: '30px'}}>
            校验
          </Button>
        </div>

        <div>
          解密过程
          <div>
            密文：
          </div>
          <div>{this.state.cOut}</div>
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
