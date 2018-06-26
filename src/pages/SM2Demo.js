import React from 'react';
import {Button, WhiteSpace} from 'antd-mobile';
import {JSRsasign} from '../jssign'
import SM2Cipher from '../jssign/SM2Cipher';
import {cMsgTest} from '../jssign/cMsg'

const CryptoJS = JSRsasign.CryptoJS;
const BigInteger = JSRsasign.BigInteger;
const Divider = () => <div style={{margin: '40px'}} />;
const curve = 'sm2';

class SM2Demo extends React.PureComponent {
  state = {
    privateKey: '7a26c592475aa38a49ef7237e97af29eb094008cfc888d1a39272276d06bd509',
    publicKey: '0424cf6f4416c7c17e9fd12236216db3fa8210b37a0e3a3a8e90112e2ca118b3c557a267f4a1294ae8f243214b838f94e0b3025888de6118050ae12df3c24069ec',
    msg: '{"name":"你好世界","value":[1,2,3]}',
    sign: '304502207ca516d6d9f3865c1cb40317eb5b394d1554a8294d12c9965def9de5c0adc788022100ad76fcd9b1759afde8253858264e16bbc23ceb45313addf148e050c52021424e',
    isValid: false,
    cMsg: '605d9b87d60e98662d956614088566d0e2898e5a5e5f694033323bc75b896ad761c139c2f69020bbff35d764ec68da13d50813cfb0eac317081a2332b0b5cb3a04c2df4061fc04192e3054796f9e86887bda16f37b20002997005e001500d5ad3433de9ad21491d8ee391b05676021d7e6f8dbbe90c91e3ad5b2a0c758f70a67747d00055776b6',
    // cMsg: '502e93da32b96939df0c9056730fca9cdfeafd19534f0bb9e2365ec5f91b070522d9befb48931dd86cd31619c145dbe5d11e72d167d74640c2b86bf9a18afe826d8ac365e3fe760947044bd6f642634031b562724c79d96c62ed8281ae19846e21dc2592731215bd1c39d49e626ddea488fe7885b18b6a71d10b9c340a5c34be6d1dc17e96d964',
    decryptedMsg: ''
  };

  componentDidMount() {
    console.log(JSRsasign.hextob64(this.state.publicKey))
    // this.test();
  }

  getPublicKeyFromPriv = () => {
    const ec = new JSRsasign.crypto.ECDSA({curve});
    const biPrv = new BigInteger(this.state.privateKey, 16);
    const epPub = ec.ecparams['G'].multiply(biPrv);
    var biX = epPub.getX().toBigInteger();
    var biY = epPub.getY().toBigInteger();

    var charlen = ec.ecparams['keylen'] / 4;
    var hX   = ("0000000000" + biX.toString(16)).slice(- charlen);
    var hY   = ("0000000000" + biY.toString(16)).slice(- charlen);
    var hPub = "04" + hX + hY;

    console.log(hPub);
    console.log(hPub === this.state.publicKey)
  };

  /**
   * 生成公私钥
   */
  generateKey = () => {

    const ec = new JSRsasign.crypto.ECDSA({curve});
    const keyPair = ec.generateKeyPairHex();
    // const privPEM = JSRsasign.KEYUTIL.
    const privPEM = JSRsasign.KJUR.asn1.ASN1Util.getPEMStringFromHex(keyPair.ecprvhex, 'PRIVATE KEY');
    const pubPEM = JSRsasign.KJUR.asn1.ASN1Util.getPEMStringFromHex(keyPair.ecpubhex);
    console.log(privPEM);
    console.log(pubPEM);
    this.setState({
      privateKey: keyPair.ecprvhex,
      publicKey: keyPair.ecpubhex
    })
  };

  /**
   * 签名
   */
  doSign = () => {
    const signAlg = 'SM3withSM2';
    const sign = new JSRsasign.crypto.Signature({ alg: signAlg, prov: 'cryptojs/jsrsa'});
    sign.initSign({'ecprvhex': this.state.privateKey, 'eccurvename': curve});
    sign.updateString(this.state.msg);
    this.setState({
      sign: sign.sign()
    })
  };

  /**
   * 验签
   */
  doVerify = () => {
    if (!this.state.sign) {
      alert('您还没有生成签名！');
      return;
    }

    const signAlg = 'SM3withSM2';
    const sign = new JSRsasign.crypto.Signature({ alg: signAlg, prov: 'cryptojs/jsrsa'});
    sign.initVerifyByPublicKey({'ecpubhex': this.state.publicKey, 'eccurvename': curve});
    sign.updateString(this.state.msg);
    this.setState({
      isValid: sign.verify(this.state.sign)
    })
  };

  test = () => {
    const msg = this.state.msg;
    const pubKey = this.state.publicKey;
    const privKey = this.state.privateKey;

    function _doEncrypt(msg, publicKey) {
      let msgData = CryptoJS.enc.Utf8.parse(msg);
      let pubkeyHex = publicKey;
      if (pubkeyHex.length > 64 * 2) {
        pubkeyHex = pubkeyHex.substr(pubkeyHex.length - 64 * 2)
      }

      let xHex = pubkeyHex.substr(0, 64);
      let yHex = pubkeyHex.substr(64);

      let cipherMode = '1';// C1C3C2
      const cipher = new SM2Cipher(cipherMode);
      const userKey = cipher.CreatePoint(xHex, yHex);

      msgData = cipher.GetWords(msgData.toString());

      const cMsg = cipher.Encrypt(userKey, msgData);
      return cMsg;
    }

    function _doDecrypt(privateKey, cMsg, msg) {
      const privBI = new BigInteger(privateKey, 16);
      let cipherMode = '1';// C1C3C2
      const cipher = new SM2Cipher(cipherMode);

      const decryptedMsg = cipher.Decrypt(privBI, cMsg);
      // console.log(decryptedMsg !== msg)

      return decryptedMsg;
    }


    let cMsgTestObj = JSON.parse(cMsgTest);
    const decryptArray = Object.keys(cMsgTestObj).map(i => {
      console.log(cMsgTestObj[i].length)
      return [_doDecrypt(this.state.privateKey, cMsgTestObj[i], msg), cMsgTestObj[i]]
    });
    //
    const notDecrypted = decryptArray.filter(v => v[0] === '');
    //
    //
    console.log(notDecrypted.length);
    console.log(JSON.stringify(notDecrypted.map(v => v[1])))


    // var array100 = [];
    // for (var i = 0;i < 1000;i++) {
    //   // array100.push(_doDecrypt(privKey, _doEncrypt(msg, pubKey), msg))
    //   array100.push(_doEncrypt(msg, pubKey).length)
    // }
    // console.log(array100.filter(v => v !== 270))
  };

  /**
   * 加密
   */
  doEncrypt = () => {
    let msgData = CryptoJS.enc.Utf8.parse(this.state.msg);

    console.log(JSRsasign.utf8tohex(this.state.msg).toLowerCase() === msgData.toString());
    console.log(msgData.toString());

    let pubkeyHex = this.state.publicKey;
    if (pubkeyHex.length > 64 * 2) {
      pubkeyHex = pubkeyHex.substr(pubkeyHex.length - 64 * 2)
    }

    let xHex = pubkeyHex.substr(0, 64);
    let yHex = pubkeyHex.substr(64);

    let cipherMode = '1';// C1C3C2
    const cipher = new SM2Cipher(cipherMode);
    const userKey = cipher.CreatePoint(xHex, yHex);

    msgData = cipher.GetWords(msgData.toString());


    const cMsg = cipher.Encrypt(userKey, msgData);
    this.setState({
      cMsg
    })
  };

  /**
   * 解密
   */
  doDecrypt = () => {
    const privBI = new BigInteger(this.state.privateKey, 16);
    let cipherMode = '1';// C1C3C2
    const cipher = new SM2Cipher(cipherMode);

    const decryptedMsg = cipher.Decrypt(privBI, this.state.cMsg);
    this.setState({
      decryptedMsg
    })
  };

  render() {
    return (
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
        <Button onClick={this.generateKey}>生成密钥</Button>


        <Divider />


        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          消息：
        </div>
        <div>
          {this.state.msg || ''}
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          签名：
        </div>
        <div>
          {this.state.sign || '无'}
        </div>
        <Button onClick={this.doSign}>加签</Button>


        <Divider />


        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          验签结果：
        </div>
        <div>
          {this.state.isValid ? '正确' : '错误'}
        </div>
        <Button onClick={this.doVerify}>验签</Button>


        <Divider />


        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          加密消息：
        </div>
        <div>
          {this.state.msg || ''}
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          密文：
        </div>
        <div>
          {this.state.cMsg || '无'}
        </div>
        <Button onClick={this.doEncrypt}>加密</Button>


        <Divider />


        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          解密消息：
        </div>
        <div>
          {this.state.cMsg || ''}
        </div>
        <div style={{fontSize: '20px', fontWeight: 'bolder'}}>
          明文：
        </div>
        <div>
          {this.state.decryptedMsg || '无'}
        </div>
        <Button onClick={this.doDecrypt}>解密</Button>
      </div>
    )
  }
}

export default SM2Demo;