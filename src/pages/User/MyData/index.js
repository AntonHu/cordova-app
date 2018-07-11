import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { List, WhiteSpace, Modal, Button, InputItem, ActivityIndicator } from 'antd-mobile';
import {getIsInChain, putUserIntoChain} from '../../../stores/user/request';
import './style.less';
import {observer, inject} from 'mobx-react';
import CryptoJS from 'crypto-js'

const alert = Modal.alert;
const Item = List.Item;

const ListData = [
  {
    title: '什么是数据上链？',
    detail:
      '数据上链是指用户将自己的数据加密上传到基于ipfs的公网侧链，并在公信链（GXChain）形成数据索引的过程。数据一旦上链' +
      '除了你本人的Data-Key授权解密外，任何个人或组织都没有能力获取到你的数据。',
    collapse: true
  },
  {
    title: '为什么要数据上链？',
    detail:
      '我们的个人数据散布在众多第三方平台，甚至未经我们的同意被平台销售、使用，而我们并没有获得任何直接收益。利用区块链技术' +
      '，经过用户的授权，能信宝帮助用户采集自己的数据并加密保存至区块链上，同时将数据私钥Data-Key交给用户本人管理，由用户' +
      '完全掌握所有权和支配权，分享自己数据使用产生的价值，并生成自己的可信数字身份（G-ID），在与人协作中大大降低新人成本。',
    collapse: true
  },
  {
    title: '之前授权的数据保存在哪里？',
    detail:
      '之前的个人数据只是临时存放在侧链上，并未和个人Data-Key绑定，现关联个人Data-Key后，将链上数据的控制权完全交给用户' +
      '本人，数据只有在用户Data-Key授权的情况下才可以访问和获得',
    collapse: true
  },
  // {
  //   title: '数据上链对个人来说有什么利益？',
  //   detail:
  //     '数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？',
  //   collapse: true
  // },
  // {
  //   title: '为什么要分配Data-Key？',
  //   detail:
  //     '为什么要分配Data-Key？为什么要分配Data-Key？为什么要分配Data-Key？为什么要分配Data-Key？',
  //   collapse: true
  // },
  // {
  //   title: '丢失Data-Key会怎么样？如何备份',
  //   detail:
  //     '丢失Data-Key会怎么样？如何备份丢失Data-Key会怎么样？如何备份丢失Data-Key会怎么样？如何备份',
  //   collapse: true
  // }
];

/**
 * 我的数据
 */
@inject('keyPair')
@observer
class Comp extends React.Component {
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
   */
  doIfHasKey = ({publicKey, encryptPrivateKey}) => {
    this.publicKey = publicKey;
    this.encryptPrivateKey = encryptPrivateKey;
    this.showModal();
  };

  /**
   * 如果后端没有公私钥
   */
  doIfHasNoKey = () => {
    const self = this;
    this.props.keyPair.generageNewKeyPair();
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
    console.log(this.props);
    const {keyPair} = this.props;
    return (
      <div className={'page-my-data'}>
        <PageWithHeader title={'我的数据'}>
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
                <GreenButton onClick={this.onClick}>一键生成</GreenButton>
            }
          </BlueBox>

          <WhiteSpace />

          <div className={'info'}>EBC新能源</div>

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
        </PageWithHeader>
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
      </div>
    );
  }
}

export default Comp;
