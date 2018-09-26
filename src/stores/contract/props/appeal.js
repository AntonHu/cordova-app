import { observable, action, runInAction, computed } from 'mobx';
import { fetchUploadAppeal, uploadContractPrivateFile } from "../request";
import { ToastError } from "../../ToastError";

// 申诉
class Appeal {
  @observable content = '';
  @observable fileList = [];

  @observable loading = false;
  @observable loadingText = '';

  @action
  reset = () => {
    this.content = '';
    this.fileList = [];
    this.loading = false;
    this.loadingText = '';
  };

  @action
  uploadData = async({ projectId, purchaseId, content, imageBlob }) => {
    if (imageBlob === null) {
      this.loadingText = '正在上传申诉...';
      this.loading = true;
      const appealRes = await this.uploadAppeal({projectId, purchaseId, content, fileList: []});
      this.loading = false;
      return appealRes;
    } else {
      this.loadingText = '正在上传图片...';
      this.loading = true;
      const picResponse = await this.uploadPic(imageBlob);
      if (picResponse.success) {
        const data = picResponse.data;
        this.loadingText = '正在上传申诉...';
        const appealRes = await this.uploadAppeal({projectId, purchaseId, content, fileList: [data.filePath]});
        this.loading = false;
        return appealRes;
      } else {
        this.loading = false;
      }
    }
  };

  uploadAppeal = async ({ projectId, purchaseId, content, fileList }) => {
    try {
      const result = await fetchUploadAppeal({ projectId, purchaseId, content, fileList });
      console.log('***************** uploadAppeal *****************');
      console.log(JSON.stringify(result));
      if (!result.success) {
        throw result
      }
      return result;
    } catch (e) {
      ToastError(e);
      return e;
    }
  };

  uploadPic = async (imageBlob) => {
    try {
      const result = await uploadContractPrivateFile(imageBlob);
      console.log('***************** uploadPic *****************');
      console.log(JSON.stringify(result));
      if (result.success) {
        return result
      } else {
        throw result
      }
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
