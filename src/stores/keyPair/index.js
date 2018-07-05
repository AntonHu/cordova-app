import { observable, action, runInAction, computed, toJS } from 'mobx';
import {getLocalStorage, setLocalStorage, deleteLocalStorage} from '../../utils/storage';
import {KEY_PAIR_LOCAL_STORAGE, CURVE} from '../../utils/variable';
import {JSRsasign} from '../../jssign';
import {Modal} from 'antd-mobile';

const alert = Modal.alert;

const BigInteger = JSRsasign.BigInteger;

class KeyPair {
  @observable publicKey = '';
  @observable privateKey = '';
  @observable hasKey = false;

  /**
   * 如果仅仅是检查，调keyPair.hasKey就足够了
   * 如果检查完了，还需要告知用户，调keyPair.showHasKey(props)，并且把props传进去
   * @param props
   * @returns {boolean}
   */
  showHasKey = (props) => {
    if (!this.hasKey) {
      alert(
        '该账号没有私钥',
        '这将导致app大部分功能不可用。是否现在去生成？',
        [
          { text: '再等等'},
          { text: '马上去', onPress: () => {
            props.history.push('/user/myData')
          }},
        ]
      )
    }
    return this.hasKey;
  };

  /**
   * 检查当前是否有公私钥
   * @returns {boolean}
   */
  checkKeyPairExist = () => {
    const pubKey = getLocalStorage(KEY_PAIR_LOCAL_STORAGE.PUBLIC_KEY);
    const privKey = getLocalStorage(KEY_PAIR_LOCAL_STORAGE.PRIVATE_KEY);
    const hasKey = !!pubKey && !!privKey;
    runInAction(() => {
      this.publicKey = !!pubKey ? pubKey : '';
      this.privateKey = !!privKey ? privKey : '';
      this.hasKey = hasKey;
    });
    return hasKey;
  };

  /**
   * 清除store和localStorage中的公私钥
   */
  clearKeyPair = () => {
    deleteLocalStorage(KEY_PAIR_LOCAL_STORAGE.PUBLIC_KEY);
    deleteLocalStorage(KEY_PAIR_LOCAL_STORAGE.PRIVATE_KEY);
    this.checkKeyPairExist();
  };

  /**
   * 储存私钥
   * @param privateKey
   */
  savePrivateKey = (privateKey) => {
    setLocalStorage(KEY_PAIR_LOCAL_STORAGE.PRIVATE_KEY, privateKey);
  };

  /**
   * 储存公钥
   * @param publicKey
   */
  savePublicKey = (publicKey) => {
    setLocalStorage(KEY_PAIR_LOCAL_STORAGE.PUBLIC_KEY, publicKey)
  };

  /**
   * 生成公私钥，并储存
   * @returns {{publicKey, privateKey}}
   */
  generageNewKeyPair = () => {
    const ec = new JSRsasign.crypto.ECDSA({curve: CURVE});
    const keyPair = ec.generateKeyPairHex();
    this.savePrivateKey(keyPair.ecprvhex);
    this.savePublicKey(keyPair.ecpubhex);
    this.checkKeyPairExist();
    return {
      publicKey: keyPair.ecpubhex,
      privateKey: keyPair.ecprvhex
    }
  };

  /**
   * 用私钥生成公钥
   * @param privateKey
   * @returns {string}
   */
  getPubFromPriv = (privateKey) => {
    this.savePrivateKey(privateKey);
    let publicKey = '';
    try {
      const ec = new JSRsasign.crypto.ECDSA({curve: CURVE});
      const biPrv = new BigInteger(privateKey, 16);
      const epPub = ec.ecparams['G'].multiply(biPrv);
      const biX = epPub.getX().toBigInteger();
      const biY = epPub.getY().toBigInteger();
      const charlen = ec.ecparams['keylen'] / 4;
      const hX   = ("0000000000" + biX.toString(16)).slice(- charlen);
      const hY   = ("0000000000" + biY.toString(16)).slice(- charlen);
      publicKey = "04" + hX + hY;

      this.savePublicKey(publicKey);
      this.checkKeyPairExist();
      return publicKey;
    } catch (err) {
      throw err;
    }

  }
}

const keyPair = new KeyPair();
export default keyPair;
