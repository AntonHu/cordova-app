import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { List, WhiteSpace, Modal, Button, InputItem, ActivityIndicator } from 'antd-mobile';
import {getIsInChain, putUserIntoChain} from '../../../stores/user/request';
import './style.less';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
import CryptoJS from 'crypto-js'

const alert = Modal.alert;
const Item = List.Item;

const ListData = [
  {
    title: '什么是数据上链？',
    detail:
      '数据上链是指用户将自己的数据加密上传到ipfs，并在链上形成数据索引的过程。数据一旦上链除了用户本人的数据私钥授权解密外，' +
      '任何个人或组织都没有能力获取到用户的数据。',
    collapse: true
  },
  {
    title: '为什么要数据上链？',
    detail:
      '之前用户的个人数据散布在众多第三方平台上，有些平台未经用户的同意直接使用或销售用户数据，而用户本身并没有获得任何直接收益。' +
      '现在能源星球利用区块链技术，在用户的授权下帮助用户采集自己的数据并加密保存至区块链上。同时，能源星球给用户生成可信的数字身' +
      '份并将数据私钥交给用户本人管理，因此用户完全掌握了自己数据的所有权和支配权。一方面用户可以通过能源星球分享自己数据带来的价值，' +
      '另一方面可以大大降低与其他人协作中的信任成本。',
    collapse: true
  },
  {
    title: '数据上链对个人来说有什么利益？',
    detail:
      '1）数据即资产，用户的数据中蕴藏着巨大的价值。数据在被使用过程中产生的经济利益，将直接回馈给用户本人； \n' +
      '2）数据上链后，任何使用用户数据的请求，都必须通过用户本人的授权。能源星球确保用户拥有数据的所有权，用户不必担心数据在不知情的情况下被盗用； \n' +
      '3）基于多维度的数据，你可以构建可信的数字身份。在与他人协作或者寻找资源时，大大降低别人了解、信任你的成本，提升了用户之间“连接”的效率。',
    collapse: true
  },
  {
    title: '为什么要分配数据私钥？',
    detail:
      '数据私钥是唯一一把能解开链上数据加密的钥匙，它被保存在客户端本地。只有用户本人掌控着这把唯一的钥匙，没有任何中心化数据库会存储用户的数据私' +
      '钥信息。这种“去中心化”的技术实现方式，正是区块链的核心特性之一。',
    collapse: true
  },
  {
    title: '当前的备份方法？',
    detail:
      'keystore是本地客户端中用来存储私钥的空间，给keystore设置交易密码是保管数据私钥的快捷方式，安全可靠，方便快捷。相当于把用户的数据私钥装在' +
      '本地客户端的保险箱中，不会被他人或者其他APP拿到数据私钥。',
    collapse: true
  }
];

/**
 * 我的数据
 */
@inject('keyPair', 'userStore')
@observer
class MyData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: '',
      showLoading: false,
      loadingText: 'Loading...',
      tradePassword: ''
    };

    this.clickAble = !props.keyPair.hasKey;
    this.publicKey = '';
    this.encryptPrivateKey = '';
  }

  componentDidMount() {
    if (!this.props.keyPair.hasKey) {
      this.onClick();
    }
    // this.checkAfterGetPub(this.props.keyPair.publicKey)
  }

  /**
   * 发请求，获取用户的公钥和加密私钥。
   *
   * 如果有，让用户输入交易密码，解密出私钥
   * 然后放到localStorage
   *
   * 如果没有，生成公钥和私钥，存到localStorage
   * 然后去到交易密码页面，要求用户设置交易密码
   * 设置交易密码成功后，用交易密码加密私钥，并且向服务器上传公钥和加密私钥
   * 如果没有设置交易密码，在退出交易密码页面时，清除localStorage里的公私钥
   */
  onClick = async() => {
    this.setState({
      showLoading: true,
      loadingText: '正在查询是否有密钥...'
    });
    // 发请求
    const isInChainRes = await getIsInChain();
    this.resetLoading();
    const data = isInChainRes.data || {};
    console.log(data);
    if (data.code === 0) {
      alert('错误', '查询密钥超时，请重试', [{text: '确定'}]);
      return;
    }
    if (data.data && data.data.encryptPrivateKey && data.data.publicKey) {
      this.doIfHasKey({
        publicKey: data.data.publicKey,
        encryptPrivateKey: data.data.encryptPrivateKey
      });
    } else {
      this.doIfHasNoKey();
    }
  };

  /**
   * 如果后端存有公私钥
   * 让用户输入交易密码，解密私钥
   * 并且请求服务器，，查询实名认证状态
   */
  doIfHasKey = ({publicKey, encryptPrivateKey}) => {
    this.publicKey = publicKey;
    this.encryptPrivateKey = encryptPrivateKey;
    this.props.userStore.checkIsKycInChain({publicKey});
    this.showModal();
  };

  /**
   * 如果后端没有公私钥
   */
  doIfHasNoKey = () => {
    const self = this;
    alert('您没有密钥', '设置密钥前，请先设置您的交易密码', [
      {text: '再等等'},
      {text: '去设置', onPress: () => {
        self.props.history.push('/user/resetTradePW');
      }}
    ]);
  };

  /**
   * AES算法，用交易密码解密出私钥
   * 如果私钥返回''，说明交易密码错误。
   * @param encryptPrivateKey
   * @param tradePassword
   * @returns {string}
   */
  decryptWithAES = (encryptPrivateKey, tradePassword) => {
    const privateKeyBytes = CryptoJS.AES.decrypt(encryptPrivateKey, tradePassword);
    return privateKeyBytes.toString(CryptoJS.enc.Utf8);
  };

  /**
   * 点击"解密"
   * @param encryptPrivateKey
   * @param publicKey
   */
  onDecrypt = ({encryptPrivateKey, publicKey}) => {
    if (this.state.tradePassword) {
      const privateKey = this.decryptWithAES(encryptPrivateKey, this.state.tradePassword);
      if (privateKey) {
        this.props.keyPair.savePubAndPriv({publicKey, privateKey});
        alert('成功', '解密成功，您可以正常使用APP', [{text: '好的', onPress: () => {}}]);
        this.hideModal();
      } else {
        alert('错误', '您输入的交易密码错误', [{text: '好的', onPress: () => {}}]);
      }
    } else {
      alert('错误', '请输入交易密码', [{text: '好的', onPress: () => {}}]);
    }
  };

  /**
   * 重置loading状态
   */
  resetLoading = () => {
    this.setState({
      showLoading: false,
      loadingText: ''
    })
  };

  /**
   * 弹出浮层
   */
  showModal = () => {
    this.setState({
      modalVisible: true
    })
  };

  /**
   * 隐藏浮层
   */
  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  };

  /**
   * 展示公钥
   */
  showPubKey = () => {
    const publicKey = this.props.keyPair.publicKey;
    alert('公钥', <div style={{wordBreak: 'break-all'}}>{publicKey}</div>, [{text: '关闭'}])
  };

  // 折叠列表
  listCollapse = index => {
    ListData[index].collapse = !ListData[index].collapse;
    this.setState({});
  };
  render() {
    const {keyPair} = this.props;
    return (

        <PageWithHeader title={'我的数据'} id="page-my-data">
          <WhiteSpace />

          <BlueBox>
            <div className={'h3 white-text title-of-blue'}>我的数据私钥</div>
            {
              keyPair.hasKey ?
                <div>
                  <div className="private-key">{keyPair.privateKey}</div>
                  <Button onClick={this.showPubKey} size="small" inline>显示公钥</Button>
                </div>
                :
                <GreenButton onClick={this.onClick}>获取密钥</GreenButton>
            }
          </BlueBox>

          <WhiteSpace />

          <div className={'info'}>
            <Link to="/user/introduction">
              <img src={require('../../../images/banner_1.png')} width="100%" />
            </Link>
          </div>

          <WhiteSpace />

          <List>
            {ListData.map((v, i) => (
              <div key={i}>
                <Item
                  arrow={v.collapse ? 'horizontal' : 'down'}
                  onClick={() => this.listCollapse(i)}
                >
                  {v.title}
                </Item>
                <div
                  className={v.collapse ? 'item-detail-hide' : 'item-detail'}
                >
                  {v.detail}
                </div>
              </div>
            ))}
          </List>
          <Modal
            visible={this.state.modalVisible}
            className="my-data-modal"
            maskClosable={true}
            onClose={this.hideModal}
            transparent
          >
            <div className="tips-box">* 输入交易密码，解锁您的密钥</div>
            <InputItem
              clear
              placeholder="请输入您的交易密码"
              value={this.state.tradePassword}
              type="password"
              onChange={(tradePassword) => this.setState({tradePassword})}
            />
            <Button
              onClick={() => this.onDecrypt({publicKey: this.publicKey, encryptPrivateKey: this.encryptPrivateKey})}
              disabled={!this.clickAble}
            >
              解密
            </Button>
          </Modal>
          <ActivityIndicator
            toast
            text={this.state.loadingText}
            animating={this.state.showLoading}
          />
        </PageWithHeader>


    );
  }
}

export default MyData;
