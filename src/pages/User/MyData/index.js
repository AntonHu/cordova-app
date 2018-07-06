import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { List, WhiteSpace, Modal, Button, InputItem, ActivityIndicator } from 'antd-mobile';
import {getIsInChain, putUserIntoChain} from '../../../stores/user/request';
import './style.less';
import {observer, inject} from 'mobx-react';

const alert = Modal.alert;

const Item = List.Item;

const ListData = [
  {
    title: '什么是数据上链？',
    detail:
      '什么是数据上链？什么是数据上链？什么是数据上链？什么是数据上链？什么是数据上链？什么是数据上链？什么是数据上链？',
    collapse: true
  },
  {
    title: '为什么要数据上链？',
    detail:
      '为什么要数据上链？为什么要数据上链？为什么要数据上链？为什么要数据上链？为什么要数据上链？为什么要数据上链？',
    collapse: true
  },
  {
    title: '之前授权的数据保存在哪里？',
    detail:
      '之前授权的数据保存在哪里？之前授权的数据保存在哪里？之前授权的数据保存在哪里？之前授权的数据保存在哪里？',
    collapse: true
  },
  {
    title: '数据上链对个人来说有什么利益？',
    detail:
      '数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？数据上链对个人来说有什么利益？',
    collapse: true
  },
  {
    title: '为什么要分配Data-Key？',
    detail:
      '为什么要分配Data-Key？为什么要分配Data-Key？为什么要分配Data-Key？为什么要分配Data-Key？',
    collapse: true
  },
  {
    title: '丢失Data-Key会怎么样？如何备份',
    detail:
      '丢失Data-Key会怎么样？如何备份丢失Data-Key会怎么样？如何备份丢失Data-Key会怎么样？如何备份',
    collapse: true
  }
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
      privateKey: '',
      modalVisible: '',
      showLoading: false,
      loadingText: 'Loading...'
    };

    this.clickAble = !props.keyPair.hasKey;
  }

  componentDidMount() {
    // this.checkAfterGetPub(this.props.keyPair.publicKey)
  }

  /**
   * 生成新的公私钥
   */
  onGenerate = () => {
    if (!this.clickAble) {
      return;
    }
    this.clickAble = false;
    const keyPair = this.props.keyPair.generageNewKeyPair();
    this.checkAfterGetPub(keyPair.publicKey);
    this.hideModal();
  };

  /**
   * 导入已有私钥
   */
  onImport = () => {
    if (!this.clickAble) {
      return;
    }
    if (!this.state.privateKey) {
      alert('错误', '您没有导入密钥！', [{text: '好的'}]);
      return;
    }
    this.clickAble = false;
    const publicKey = this.props.keyPair.getPubFromPriv(this.state.privateKey);
    this.checkAfterGetPub(publicKey);
    this.hideModal();
  };

  /**
   * 检查publicKey是否上链
   * 如果没上，那么弄上去
   * @param publicKey
   * @returns {Promise.<void>}
   */
  checkAfterGetPub = async (publicKey) => {
    this.setState({
      showLoading: true,
      loadingText: '正在查询是否上链...'
    });
    // 发请求
    const isInChainRes = await getIsInChain({publicKey});
    // 用户没有上链
    if (isInChainRes.data && !isInChainRes.data.success) {
      this.setState({
        loadingText: '正在连接上链...'
      });
      putUserIntoChain({publicKey})
        .then(res => {
          if (res.data && res.data.code === 200) {
            alert('成功', '您已成功连接上链', [{text: '好的'}])
          } else {
            alert('失败', '连接上链失败', [{text: '好的'}]);
          }
          this.resetLoading();
        })
        .catch(err => {
          alert('失败', '连接上链失败', [{text: '好的'}]);
          this.resetLoading();
        })
    } else {
      this.resetLoading();
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

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  };

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
                <GreenButton onClick={this.showModal}>一键生成</GreenButton>
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
          <div className="tips-box">* 该账号从未生成过密钥</div>
          <Button onClick={this.onGenerate} disabled={!this.clickAble}>生成全新密钥</Button>

          <div className="modal-divider" />

          <div className="tips-box">* 该账号生成过密钥，并且我已备份了密钥</div>
          <InputItem
            clear
            placeholder="导入已有私钥"
            value={this.state.privateKey}
            onChange={(privateKey) => this.setState({privateKey})}
          />
          <Button onClick={this.onImport} disabled={!this.clickAble}>导入</Button>

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
