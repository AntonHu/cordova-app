import {ECPointFp} from './ec';
// import jsrsasign from 'jsrsasign';
import {JSRsasign} from './index';
import SM3Digest from './SM3Digest';
import SM3withSM2 from './SM3withSM2';

const CryptoJS = JSRsasign.CryptoJS;
const BigInteger = JSRsasign.BigInteger;
const KJUR = JSRsasign.KJUR;
const SecureRandom = JSRsasign.SecureRandom;

const SM2CipherMode = {
  C1C2C3: '0',
  C1C3C2: '1'
};

function SM2Cipher(cipherMode) {
  this.ct = 1;
  this.p2 = null;
  this.sm3keybase = null;
  this.sm3c3 = null;
  this.key = new Array(32);
  this.keyOff = 0;
  if (typeof (cipherMode) != 'undefined') {
    this.cipherMode = cipherMode
  } else {
    this.cipherMode = SM2CipherMode.C1C3C2
  }
}
SM2Cipher.prototype = {
  Reset: function() {
    this.sm3keybase = new SM3Digest();
    this.sm3c3 = new SM3Digest();
    var xWords = this.GetWords(this.p2.getX().toBigInteger().toRadix(16));
    var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
    this.sm3keybase.BlockUpdate(xWords, 0, xWords.length);
    this.sm3c3.BlockUpdate(xWords, 0, xWords.length);
    this.sm3keybase.BlockUpdate(yWords, 0, yWords.length);
    this.ct = 1;
    this.NextKey()
  },
  NextKey: function() {
    var sm3keycur = new SM3Digest(this.sm3keybase);
    sm3keycur.Update((this.ct >> 24 & 0x00ff));
    sm3keycur.Update((this.ct >> 16 & 0x00ff));
    sm3keycur.Update((this.ct >> 8 & 0x00ff));
    sm3keycur.Update((this.ct & 0x00ff));
    sm3keycur.DoFinal(this.key, 0);
    this.keyOff = 0;
    this.ct++
  },
  InitEncipher: function(userKey) {
    var k = null;
    var c1 = null;
    var ec = new KJUR.crypto.ECDSA({
      "curve": "sm2"
    });
    var keypair = ec.generateKeyPairHex();
    k = new BigInteger(keypair.ecprvhex,16);
    // k = this.getBigRandom(ec.ecparams['n']);
    var pubkeyHex = keypair.ecpubhex;
    c1 = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
    this.p2 = userKey.multiply(k);
    this.Reset();
    return c1
  },
  getBigRandom: function (limit) {
    return new BigInteger(limit.bitLength(), new SecureRandom())
      .mod(limit.subtract(BigInteger.ONE))
      .add(BigInteger.ONE)
      ;
  },
  EncryptBlock: function(data) {
    this.sm3c3.BlockUpdate(data, 0, data.length);
    for (var i = 0; i < data.length; i++) {
      if (this.keyOff == this.key.length) {
        this.NextKey()
      }
      var tmp = this.key[this.keyOff++];
      // console.log(tmp)
      data[i] ^= tmp
    }
  },
  InitDecipher: function(userD, c1) {
    this.p2 = c1.multiply(userD);
    this.Reset()
  },
  DecryptBlock: function(data) {
    for (var i = 0; i < data.length; i++) {
      if (this.keyOff == this.key.length) {
        this.NextKey()
      }
      data[i] ^= this.key[this.keyOff++]
    }
    this.sm3c3.BlockUpdate(data, 0, data.length)
  },
  Dofinal: function(c3) {
    var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
    this.sm3c3.BlockUpdate(yWords, 0, yWords.length);
    this.sm3c3.DoFinal(c3, 0);
    this.Reset()
  },

  Encrypt: function(pubKey, plaintext) {
    var data = new Array(plaintext.length);
    Array.Copy(plaintext, 0, data, 0, plaintext.length);
    var c1 = this.InitEncipher(pubKey);
    this.EncryptBlock(data);
    var c3 = new Array(32);
    this.Dofinal(c3);
    var hexString = c1.getX().toBigInteger().toRadix(16) + c1.getY().toBigInteger().toRadix(16) + this.GetHex(data).toString() + this.GetHex(c3).toString();
    if (this.cipherMode == SM2CipherMode.C1C3C2) {
      hexString = c1.getX().toBigInteger().toRadix(16) + c1.getY().toBigInteger().toRadix(16) + this.GetHex(c3).toString() + this.GetHex(data).toString()
    }
    return hexString
  },
  GetWords: function(hexStr) {
    var words = [];
    var hexStrLength = hexStr.length;
    for (var i = 0; i < hexStrLength; i += 2) {
      words[words.length] = parseInt(hexStr.substr(i, 2), 16)
    }
    return words
  },
  GetHex: function(arr) {
    var words = [];
    var j = 0;
    for (var i = 0; i < arr.length * 2; i += 2) {
      words[i >>> 3] |= parseInt(arr[j]) << (24 - (i % 8) * 4);
      j++
    }
    var wordArray = new CryptoJS.lib.WordArray.init(words,arr.length);
    return wordArray
  },
  Decrypt: function(privateKey, ciphertext) {
    var hexString = ciphertext;
    var c1X = hexString.substr(0, 64);
    var c1Y = hexString.substr(0 + c1X.length, 64);
    var encrypData = hexString.substr(c1X.length + c1Y.length, hexString.length - c1X.length - c1Y.length - 64);
    var c3 = hexString.substr(hexString.length - 64);
    if (this.cipherMode == SM2CipherMode.C1C3C2) {
      c3 = hexString.substr(c1X.length + c1Y.length, 64);
      encrypData = hexString.substr(c1X.length + c1Y.length + 64)
    }
    var data = this.GetWords(encrypData);
    var c1 = this.CreatePoint(c1X, c1Y);
    this.InitDecipher(privateKey, c1);
    this.DecryptBlock(data);
    var c3_ = new Array(32);
    this.Dofinal(c3_);
    var isDecrypt = this.GetHex(c3_).toString() == c3;
    if (isDecrypt) {
      var wordArray = this.GetHex(data);
      var decryptData = CryptoJS.enc.Utf8.stringify(wordArray);
      return decryptData
    } else {
      // var wordArray = this.GetHex(data);
      // var decryptData = CryptoJS.enc.Utf8.stringify(wordArray);
      // console.log(decryptData)
      return ''
    }
  },
  CreatePoint: function(x, y) {
    var ec = new KJUR.crypto.ECDSA({
      "curve": "sm2"
    });
    var ecc_curve = ec.ecparams['curve'];
    var pubkeyHex = '04' + x + y;
    var point = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
    return point
  }
};

export default SM2Cipher;
