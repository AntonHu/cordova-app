import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { List, WhiteSpace, Modal, Button, InputItem } from 'antd-mobile';
import './style.less';
import {observer, inject} from 'mobx-react';

const alert = Modal.alert;

const Item = List.Item;
// const LocalFileSystem = window.LocalFileSystem;
// const readFile = window.readFile;

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
      modalVisible: ''
    };

    this.clickAble = !props.keyPair.hasKey;
  }

  /**
   * 生成新的公私钥
   */
  onGenerate = () => {
    if (!this.clickAble) {
      return;
    }
    this.clickAble = false;
    this.props.keyPair.generageNewKeyPair();
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
    this.props.keyPair.getPubFromPriv(this.state.privateKey);
    this.hideModal();
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
                <div className="private-key">{keyPair.privateKey}</div>
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
            placeholder="导入已有密钥"
            value={this.state.privateKey}
            onChange={(privateKey) => this.setState({privateKey})}
          />
          <Button onClick={this.onImport} disabled={!this.clickAble}>导入</Button>

        </Modal>
      </div>
    );
  }
}

export default Comp;
