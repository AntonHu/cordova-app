// const backendServer = 'http://47.97.160.168:30089/blockchain/ledger-proxy';
const backendServer = 'https://api.thundersdata.com/ebcapp';
// const userServer = 'https://auths.thundersdata.com';
// const backendServer = 'http://47.96.158.229:30135';
const userServer = 'https://api.thundersdata.com';

const PAGE_SIZE = 10;
// 发电量类型：年/月/日
const POWER_TYPE = {
  day: 1,
  month: 2,
  year: 3,
  all: 4
};

/**
 * 存在localStorage里的名字
 */
const KEY_PAIR_LOCAL_STORAGE = {
  PUBLIC_KEY: 'PUBLIC_KEY',
  PRIVATE_KEY: 'PRIVATE_KEY'
};

/**
 * 加密曲线名字
 */
const CURVE = 'sm2';

const TEST_PRIVATE_KEY =
  'e469d6bcae3f9bef883828a629d12c89bd4e0ce67cab70a5557971f6dc7f4e29';
const TEST_PUBLIC_KEY =
  '0439ad8cd4dd8be0a809f7808c9d07fcf0f85a71c079ad9fd265e43f5d5ba114251941c2908b2f42ba393421368ed4da585837cd4a303ffc0ee09a5427a6df2605';

export {
  backendServer,
  userServer,
  PAGE_SIZE,
  TEST_PUBLIC_KEY,
  POWER_TYPE,
  TEST_PRIVATE_KEY,
  KEY_PAIR_LOCAL_STORAGE,
  CURVE
};
