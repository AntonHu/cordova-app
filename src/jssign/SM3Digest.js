import jsrsasign from 'jsrsasign';

const CryptoJS = jsrsasign.CryptoJS;
const BigInteger = jsrsasign.BigInteger;

const Int32 = {
  minValue: -parseInt('10000000000000000000000000000000', 2),
  maxValue: parseInt('1111111111111111111111111111111', 2),
  parse: function (n) {
    if (n < this.minValue) {
      var bigInteger = new Number(-n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return (result + 1)
    } else if (n > this.maxValue) {
      var bigInteger = Number(n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return -(result + 1)
    } else {
      return n
    }
  },
  parseByte: function (n) {
    if (n < 0) {
      var bigInteger = new Number(-n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return (result + 1)
    } else if (n > 255) {
      var bigInteger = Number(n);
      var bigIntegerRadix = bigInteger.toString(2);
      return parseInt(bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8), 2)
    } else {
      return n
    }
  }
};

(function () {
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;
  var W = [];
  var SM3 = C_algo.SM3 = Hasher.extend({
    _doReset: function () {
      this._hash = new WordArray.init([0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e])
    }, _doProcessBlock: function (M, offset) {
      var H = this._hash.words;
      var a = H[0];
      var b = H[1];
      var c = H[2];
      var d = H[3];
      var e = H[4];
      for (var i = 0; i < 80; i++) {
        if (i < 16) {
          W[i] = M[offset + i] | 0
        } else {
          var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
          W[i] = (n << 1) | (n >>> 31)
        }
        var t = ((a << 5) | (a >>> 27)) + e + W[i];
        if (i < 20) {
          t += ((b & c) | (~b & d)) + 0x5a827999
        } else if (i < 40) {
          t += (b ^ c ^ d) + 0x6ed9eba1
        } else if (i < 60) {
          t += ((b & c) | (b & d) | (c & d)) - 0x70e44324
        } else {
          t += (b ^ c ^ d) - 0x359d3e2a
        }
        e = d;
        d = c;
        c = (b << 30) | (b >>> 2);
        b = a;
        a = t
      }
      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0
    }, _doFinalize: function () {
      var data = this._data;
      var dataWords = data.words;
      var nBitsTotal = this._nDataBytes * 8;
      var nBitsLeft = data.sigBytes * 8;
      dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
      dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
      data.sigBytes = dataWords.length * 4;
      this._process();
      return this._hash
    }, clone: function () {
      var clone = Hasher.clone.call(this);
      clone._hash = this._hash.clone();
      return clone
    }
  });
  C.SM3 = Hasher._createHelper(SM3);
  C.HmacSM3 = Hasher._createHmacHelper(SM3)
}());

export default function SM3Digest() {
  this.BYTE_LENGTH = 64;
  this.xBuf = new Array();
  this.xBufOff = 0;
  this.byteCount = 0;
  this.DIGEST_LENGTH = 32;
  this.v0 = [0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e];
  this.v0 = [0x7380166f, 0x4914b2b9, 0x172442d7, -628488704, -1452330820, 0x163138aa, -477237683, -1325724082];
  this.v = new Array(8);
  this.v_ = new Array(8);
  this.X0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.X = new Array(68);
  this.xOff = 0;
  this.T_00_15 = 0x79cc4519;
  this.T_16_63 = 0x7a879d8a;
  if (arguments.length > 0) {
    this.InitDigest(arguments[0])
  } else {
    this.Init()
  }
}

SM3Digest.prototype = {
  Init: function () {
    this.xBuf = new Array(4);
    this.Reset()
  }, InitDigest: function (t) {
    this.xBuf = new Array(t.xBuf.length);
    Array.Copy(t.xBuf, 0, this.xBuf, 0, t.xBuf.length);
    this.xBufOff = t.xBufOff;
    this.byteCount = t.byteCount;
    Array.Copy(t.X, 0, this.X, 0, t.X.length);
    this.xOff = t.xOff;
    Array.Copy(t.v, 0, this.v, 0, t.v.length)
  }, GetDigestSize: function () {
    return this.DIGEST_LENGTH
  }, Reset: function () {
    this.byteCount = 0;
    this.xBufOff = 0;
    Array.Clear(this.xBuf, 0, this.xBuf.length);
    Array.Copy(this.v0, 0, this.v, 0, this.v0.length);
    this.xOff = 0;
    Array.Copy(this.X0, 0, this.X, 0, this.X0.length)
  }, GetByteLength: function () {
    return this.BYTE_LENGTH
  }, ProcessBlock: function () {
    var i;
    var ww = this.X;
    var ww_ = new Array(64);
    for (i = 16; i < 68; i++) {
      ww[i] = this.P1(ww[i - 16] ^ ww[i - 9] ^ (this.ROTATE(ww[i - 3], 15))) ^ (this.ROTATE(ww[i - 13], 7)) ^ ww[i - 6]
    }
    for (i = 0; i < 64; i++) {
      ww_[i] = ww[i] ^ ww[i + 4]
    }
    var vv = this.v;
    var vv_ = this.v_;
    Array.Copy(vv, 0, vv_, 0, this.v0.length);
    var SS1, SS2, TT1, TT2, aaa;
    for (i = 0; i < 16; i++) {
      aaa = this.ROTATE(vv_[0], 12);
      SS1 = Int32.parse(Int32.parse(aaa + vv_[4]) + this.ROTATE(this.T_00_15, i));
      SS1 = this.ROTATE(SS1, 7);
      SS2 = SS1 ^ aaa;
      TT1 = Int32.parse(Int32.parse(this.FF_00_15(vv_[0], vv_[1], vv_[2]) + vv_[3]) + SS2) + ww_[i];
      TT2 = Int32.parse(Int32.parse(this.GG_00_15(vv_[4], vv_[5], vv_[6]) + vv_[7]) + SS1) + ww[i];
      vv_[3] = vv_[2];
      vv_[2] = this.ROTATE(vv_[1], 9);
      vv_[1] = vv_[0];
      vv_[0] = TT1;
      vv_[7] = vv_[6];
      vv_[6] = this.ROTATE(vv_[5], 19);
      vv_[5] = vv_[4];
      vv_[4] = this.P0(TT2)
    }
    for (i = 16; i < 64; i++) {
      aaa = this.ROTATE(vv_[0], 12);
      SS1 = Int32.parse(Int32.parse(aaa + vv_[4]) + this.ROTATE(this.T_16_63, i));
      SS1 = this.ROTATE(SS1, 7);
      SS2 = SS1 ^ aaa;
      TT1 = Int32.parse(Int32.parse(this.FF_16_63(vv_[0], vv_[1], vv_[2]) + vv_[3]) + SS2) + ww_[i];
      TT2 = Int32.parse(Int32.parse(this.GG_16_63(vv_[4], vv_[5], vv_[6]) + vv_[7]) + SS1) + ww[i];
      vv_[3] = vv_[2];
      vv_[2] = this.ROTATE(vv_[1], 9);
      vv_[1] = vv_[0];
      vv_[0] = TT1;
      vv_[7] = vv_[6];
      vv_[6] = this.ROTATE(vv_[5], 19);
      vv_[5] = vv_[4];
      vv_[4] = this.P0(TT2)
    }
    for (i = 0; i < 8; i++) {
      vv[i] ^= Int32.parse(vv_[i])
    }
    this.xOff = 0;
    Array.Copy(this.X0, 0, this.X, 0, this.X0.length)
  }, ProcessWord: function (in_Renamed, inOff) {
    var n = in_Renamed[inOff] << 24;
    n |= (in_Renamed[++inOff] & 0xff) << 16;
    n |= (in_Renamed[++inOff] & 0xff) << 8;
    n |= (in_Renamed[++inOff] & 0xff);
    this.X[this.xOff] = n;
    if (++this.xOff == 16) {
      this.ProcessBlock()
    }
  }, ProcessLength: function (bitLength) {
    if (this.xOff > 14) {
      this.ProcessBlock()
    }
    this.X[14] = (this.URShiftLong(bitLength, 32));
    this.X[15] = (bitLength & (0xffffffff))
  }, IntToBigEndian: function (n, bs, off) {
    bs[off] = Int32.parseByte(this.URShift(n, 24));
    bs[++off] = Int32.parseByte(this.URShift(n, 16));
    bs[++off] = Int32.parseByte(this.URShift(n, 8));
    bs[++off] = Int32.parseByte(n)
  }, DoFinal: function (out_Renamed, outOff) {
    this.Finish();
    for (var i = 0; i < 8; i++) {
      this.IntToBigEndian(this.v[i], out_Renamed, outOff + i * 4)
    }
    this.Reset();
    return this.DIGEST_LENGTH
  }, Update: function (input) {
    this.xBuf[this.xBufOff++] = input;
    if (this.xBufOff == this.xBuf.length) {
      this.ProcessWord(this.xBuf, 0);
      this.xBufOff = 0
    }
    this.byteCount++
  }, BlockUpdate: function (input, inOff, length) {
    while ((this.xBufOff != 0) && (length > 0)) {
      this.Update(input[inOff]);
      inOff++;
      length--
    }
    while (length > this.xBuf.length) {
      this.ProcessWord(input, inOff);
      inOff += this.xBuf.length;
      length -= this.xBuf.length;
      this.byteCount += this.xBuf.length
    }
    while (length > 0) {
      this.Update(input[inOff]);
      inOff++;
      length--
    }
  }, Finish: function () {
    var bitLength = (this.byteCount << 3);
    this.Update((128));
    while (this.xBufOff != 0) this.Update((0));
    this.ProcessLength(bitLength);
    this.ProcessBlock()
  }, ROTATE: function (x, n) {
    return (x << n) | (this.URShift(x, (32 - n)))
  }, P0: function (X) {
    return ((X) ^ this.ROTATE((X), 9) ^ this.ROTATE((X), 17))
  }, P1: function (X) {
    return ((X) ^ this.ROTATE((X), 15) ^ this.ROTATE((X), 23))
  }, FF_00_15: function (X, Y, Z) {
    return (X ^ Y ^ Z)
  }, FF_16_63: function (X, Y, Z) {
    return ((X & Y) | (X & Z) | (Y & Z))
  }, GG_00_15: function (X, Y, Z) {
    return (X ^ Y ^ Z)
  }, GG_16_63: function (X, Y, Z) {
    return ((X & Y) | (~X & Z))
  }, URShift: function (number, bits) {
    if (number > Int32.maxValue || number < Int32.minValue) {
      number = Int32.parse(number)
    }
    if (number >= 0) {
      return number >> bits
    } else {
      return (number >> bits) + (2 << ~bits)
    }
  }, URShiftLong: function (number, bits) {
    var returnV;
    var big = new BigInteger();
    big.fromInt(number);
    if (big.signum() >= 0) {
      returnV = big.shiftRight(bits).intValue()
    } else {
      var bigAdd = new BigInteger();
      bigAdd.fromInt(2);
      var shiftLeftBits = ~bits;
      var shiftLeftNumber = '';
      if (shiftLeftBits < 0) {
        var shiftRightBits = 64 + shiftLeftBits;
        for (var i = 0; i < shiftRightBits; i++) {
          shiftLeftNumber += '0'
        }
        var shiftLeftNumberBigAdd = new BigInteger();
        shiftLeftNumberBigAdd.fromInt(number >> bits);
        var shiftLeftNumberBig = new BigInteger("10" + shiftLeftNumber, 2);
        shiftLeftNumber = shiftLeftNumberBig.toRadix(10);
        var r = shiftLeftNumberBig.add(shiftLeftNumberBigAdd);
        returnV = r.toRadix(10)
      } else {
        shiftLeftNumber = bigAdd.shiftLeft((~bits)).intValue();
        returnV = (number >> bits) + shiftLeftNumber
      }
    }
    return returnV
  }, GetZ: function (g, pubKeyHex) {
    var userId = CryptoJS.enc.Utf8.parse("1234567812345678");
    var len = userId.words.length * 4 * 8;
    this.Update((len >> 8 & 0x00ff));
    this.Update((len & 0x00ff));
    var userIdWords = this.GetWords(userId.toString());
    this.BlockUpdate(userIdWords, 0, userIdWords.length);
    var aWords = this.GetWords(g.curve.a.toBigInteger().toRadix(16));
    var bWords = this.GetWords(g.curve.b.toBigInteger().toRadix(16));
    var gxWords = this.GetWords(g.getX().toBigInteger().toRadix(16));
    var gyWords = this.GetWords(g.getY().toBigInteger().toRadix(16));
    var pxWords = this.GetWords(pubKeyHex.substr(0, 64));
    var pyWords = this.GetWords(pubKeyHex.substr(64, 64));
    this.BlockUpdate(aWords, 0, aWords.length);
    this.BlockUpdate(bWords, 0, bWords.length);
    this.BlockUpdate(gxWords, 0, gxWords.length);
    this.BlockUpdate(gyWords, 0, gyWords.length);
    this.BlockUpdate(pxWords, 0, pxWords.length);
    this.BlockUpdate(pyWords, 0, pyWords.length);
    var md = new Array(this.GetDigestSize());
    this.DoFinal(md, 0);
    return md
  }, GetWords: function (hexStr) {
    var words = [];
    var hexStrLength = hexStr.length;
    for (var i = 0; i < hexStrLength; i += 2) {
      words[words.length] = parseInt(hexStr.substr(i, 2), 16)
    }
    return words
  }, GetHex: function (arr) {
    var words = [];
    var j = 0;
    for (var i = 0; i < arr.length * 2; i += 2) {
      words[i >>> 3] |= parseInt(arr[j]) << (24 - (i % 8) * 4);
      j++
    }
    var wordArray = new CryptoJS.lib.WordArray.init(words, arr.length);
    return wordArray
  }
};
Array.Clear = function (destinationArray, destinationIndex, length) {
  for (var elm in destinationArray) {
    destinationArray[elm] = null
  }
};
Array.Copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
  var cloneArray = sourceArray.slice(sourceIndex, sourceIndex + length);
  for (var i = 0; i < cloneArray.length; i++) {
    destinationArray[destinationIndex] = cloneArray[i];
    destinationIndex++
  }
};
