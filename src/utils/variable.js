// const backendServer = 'http://47.97.160.168:30089/blockchain/ledger-proxy';
const backendServer = 'https://api.thundersdata.com/ebcapp';
// const backendServer = 'http://47.96.158.229:30135';

const contractServer = 'https://api.thundersdata.com/contractPlant';
// const contractServer = 'http://192.168.1.124:8080';

const userServer = 'https://api.thundersdata.com';

const PAGE_SIZE = 20;
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
 * 请求设备数据的类型
 */
const EQUIPMENT_DATA_TYPE = {
  DAY: 1,
  MONTH: 2,
  YEAR: 3,
  ALL: 4
};

/**
 * 加密曲线名字
 */
const CURVE = 'sm2';

const TEST_PRIVATE_KEY =
  'e469d6bcae3f9bef883828a629d12c89bd4e0ce67cab70a5557971f6dc7f4e29';
const TEST_PUBLIC_KEY =
  '0439ad8cd4dd8be0a809f7808c9d07fcf0f85a71c079ad9fd265e43f5d5ba114251941c2908b2f42ba393421368ed4da585837cd4a303ffc0ee09a5427a6df2605';

const DEPLYMENT_KEY = {
  ANDROID: {
    Staging: 'Oz0UJ62d7mIu8W3IY-ZgqIa78TqV0622c1d1-d19c-494b-a7c7-f4e4d3bc9118',
    Production:
      'Sr9DnzzrkbNdLixAKXUoLOqMmgdx0622c1d1-d19c-494b-a7c7-f4e4d3bc9118'
  },
  IOS: {
    Staging: 'nzYI83mZ03a1Ta1Qprtpupa-gYf50622c1d1-d19c-494b-a7c7-f4e4d3bc9118',
    Production:
      'EkPHRgDL5fQQk_lBCFIugJqAt6oA0622c1d1-d19c-494b-a7c7-f4e4d3bc9118'
  }
};

// 积分类型
const INTEGRAL_TYPE = {
  power: { title: '挖宝积分', icon: '\ue611' },
  login: { title: '登录奖励', icon: '\ue6d1' },
  transfer: { title: '入账', icon: '\ue614' },
  invitation: { title: '推荐奖励', icon: '\ue6d1' },
  secondaryInvitation: { title: '推荐奖励-二级', icon: '\ue6d1' },
  fail: { title: '失败', icon: '\ue639' }
};

// 身份认证状态
const VERIFY_STATUS = {
  UNKNOWN: -1,
  UNAUTHORIZED: 0,
  AUTHENTICATING: 1,
  AUTHORIZED: 2
};

// 电站信息审核状态
const STATION_VERIFY_STATUS = {
  FAIL: 0,
  ONGOING: 1,
  SUCCESS: 2
};

const PROJECT_STATUS_CODE = {
  UNGROUPED: 0, // "未成团"
  GROUPED: 1,  //"已成团"
  PURCHASE_MATERIAL: 2, //"项目已成团，原材料购买"
  BUILDING_PLANT: 3, //"原材料已购买，电站建设中"
  TO_GRID: 4, //"电站建设完毕，并网备案中"
  GRID: 5 //"已并网"
};

const USER_PROJECT_STATUS_CODE = {
  NOT_PURCHASED: 0, //"未购买"
  APPLIED: 1, //"已申请"
  PAID: 2, //"用户已付款"
  REJECTED: 3, //"已驳回"
  SUCCESSFUL_PURCHASE: 4, //"申购成功"
  CANCELED_PURCHASE: 5, //"取消申购"
  TIME_OUT: 6 //"超时，自动取消"
};

const TRANSFER_STATUS_CODE = {
  DOING: 0, //"转让中"
  UNPAYMENT: 1, // "未支付"
  VERIFYPAYMENT: 2, //"待确认打款"
  DOWN: 3,  //"完成"
  CANCEL: 4, //"取消"
};

export {
  backendServer,
  userServer,
  contractServer,
  PAGE_SIZE,
  TEST_PUBLIC_KEY,
  POWER_TYPE,
  TEST_PRIVATE_KEY,
  KEY_PAIR_LOCAL_STORAGE,
  CURVE,
  EQUIPMENT_DATA_TYPE,
  DEPLYMENT_KEY,
  INTEGRAL_TYPE,
  VERIFY_STATUS,
  STATION_VERIFY_STATUS,
  PROJECT_STATUS_CODE,
  USER_PROJECT_STATUS_CODE,
  TRANSFER_STATUS_CODE
};
