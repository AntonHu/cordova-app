import React from 'react';
import { BlueBox, GreenButton, PageWithHeader } from '../../../components';
import { List, WhiteSpace } from 'antd-mobile';
import jsrsasign from 'jsrsasign';
import './style.less';

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

const onErrorLoadFs = err => {
  console.log(err);
};

const onErrorCreateFile = err => {
  console.log(err);
};

//读取文件
function readFile(fileEntry) {
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onloadend = function(e) {
      alert(e.target.result);
    };
    reader.readAsText(file);
  }, onErrorReadFile);
}

//读取文件失败响应
function onErrorReadFile() {
  console.log('文件读取失败!');
}

function writeFile(fileEntry, dataObj) {
  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function() {
      console.log('Successful file write...');
      // readFile(fileEntry);
    };

    fileWriter.onerror = function(e) {
      console.log('Failed file write: ' + e.toString());
    };

    // If data object is not passed in,
    // create a new Blob instead.
    if (!dataObj) {
      dataObj = new Blob(['some file data'], { type: 'text/plain' });
    }

    if (typeof dataObj === 'string') {
      dataObj = new Blob([dataObj], { type: 'text/plain' });
    }

    fileWriter.write(dataObj);
  });
}

/**
 * 我的数据
 */
class Comp extends React.Component {
  state = {
    publicKey: '',
    privateKey: ''
  };

  generateKeyPair = () => {
    const keyObj = jsrsasign.KEYUTIL.generateKeypair('RSA', 1024);
    const privateKey = jsrsasign.KEYUTIL.getPEM(keyObj.prvKeyObj, 'PKCS1PRV');
    const publicKey = jsrsasign.KEYUTIL.getPEM(keyObj.pubKeyObj, 'PKCS8PUB');
    console.log(privateKey);

    this.setState({
      publicKey,
      privateKey
    });

    return {
      publicKey,
      privateKey
    };
  };

  validateBeforeGenerate = () => {
    return true;
  };

  sendPublicPEMToServer = publicPEM => {};

  readPrivatePEMFromLocal = () => {
    if (window.cordova) {
      try {
        window.requestFileSystem(
          window.LocalFileSystem.PERSISTENT,
          0,
          function(fs) {
            fs.root.getFile(
              'my_private.pem',
              { create: false, exclusive: false },
              function(fileEntry) {
                readFile(fileEntry);
              }
            );
          },
          onErrorReadFile
        );
      } catch (err) {
        alert(err);
      }
    }
  };

  savePrivatePEMToLocal = privatePEM => {
    if (window.cordova) {
      try {
        console.log(window.LocalFileSystem.PERSISTENT);

        window.requestFileSystem(
          window.LocalFileSystem.PERSISTENT,
          0,
          function(fs) {
            console.log('file system open: ' + fs.name);
            fs.root.getFile(
              'my_private.pem',
              { create: true, exclusive: false },
              function(fileEntry) {
                console.log('fileEntry is file?' + fileEntry.isFile.toString());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                writeFile(fileEntry, privatePEM);
              },
              onErrorCreateFile
            );
          },
          onErrorLoadFs
        );
      } catch (err) {
        alert(err);
      }
    }
  };

  /**
   * 1.检查生成条件
   * 2.生成keyPair
   * 3.把public传到服务器
   * 4.把private存到本地
   */
  onPress = () => {
    if (this.validateBeforeGenerate()) {
      const keyPair = this.generateKeyPair();
      this.sendPublicPEMToServer(keyPair.publicKey);
      this.savePrivatePEMToLocal(keyPair.privateKey);
    }
  };

  // 折叠列表
  listCollapse = index => {
    ListData[index].collapse = !ListData[index].collapse;
    this.setState({});
  };
  render() {
    return (
      <div className={'page-my-data'}>
        <PageWithHeader title={'我的数据'}>
          <WhiteSpace />

          <BlueBox>
            <div className={'h3 white-text title-of-blue'}>我的数据私钥</div>
            <GreenButton onClick={this.onPress}>一键生成</GreenButton>
            <GreenButton onClick={this.readPrivatePEMFromLocal}>
              读取密钥
            </GreenButton>
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
      </div>
    );
  }
}

export default Comp;
