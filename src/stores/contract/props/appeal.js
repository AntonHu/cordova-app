import { observable, action, runInAction, computed } from 'mobx';
import { fetchUploadAppeal } from "../request";
import { ToastError } from "../../ToastError";

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
    try {
      const result = await fetchUploadAppeal({ projectId, purchaseId, content: this.content, fileList: this.fileList });
      if (!result.success) {
        throw result
      }
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
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
