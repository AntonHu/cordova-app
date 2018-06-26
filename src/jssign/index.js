import jsrsasign from 'jsrsasign';
import SM3withSM2 from './SM3withSM2';
import SM3Digest from './SM3Digest';
import crypto from './crytojs';

const getJSRsasign = () => {
  jsrsasign.crypto.ECParameterDB.regist(
    "sm2", // name
    256,
    "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF", // p
    "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC", // a
    "28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93", // b
    "FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123", // n
    "1", // h
    "32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7", // gx
    "BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0", // gy
    ["sm2", "SM2"]); // alias

  Object.keys(crypto).forEach(k => {
    jsrsasign.crypto[k] = crypto[k]
  });

  console.log(Object.keys(jsrsasign.crypto))

  return jsrsasign;
};

const JSRsasign = getJSRsasign();

export {
  JSRsasign
}
