import { observable, action, runInAction, computed } from 'mobx';
import { fetchUploadAppeal } from "../request";

// 申诉
class Appeal {
  @observable content = '';
  @observable fileList = [];

  @action
  reset = () => {
    this.content = '';
    this.fileList = [];
  };

  uploadAppeal = async ({ projectId, purchaseId }) => {
    const result = await fetchUploadAppeal({ projectId, purchaseId, content: this.content, fileList: this.fileList });
    return result;
  };

  @action
  updateContent = (val) => {
    this.content = val;
  };

  @action
  updateFileList = (val) => {
    this.fileList = val;
  };


}

export default Appeal;
