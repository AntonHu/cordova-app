import { action, computed, observable, runInAction } from 'mobx';
import {
  fetchHistoryProjectList,
  fetchProjectDetail
} from "../request";
import { ToastError } from "../../ToastError";

class ProjectDetail {
  // 项目详情
  @observable detail = {};
  @observable isDetailLoading = false;

  // 历史项目列表
  @observable historyList = [];
  @observable isHistoryLoading = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.detail = {};
    this.isDetailLoading = false;
    this.historyList = [];
    this.isHistoryLoading = false;
  };

  // didMount且不是goBack过来的时候，获取项目详情
  // 获取项目详情之后，再获取历史项目列表
  loadData = (id) => {
    if (this.isDetailLoading) {
      return {
        success: false,
        msg: '正在查询详情，请稍候...',
        code: -2
      };
    }
    return this.loadDetail(id)
      .then(result => {
        if (result.success) {
          this.loadHistory({
            enterpriseId: this.detail.enterpriseId,
            onlyBaseInfo: true,
            currentProjectId: id
          })
        }
        return result;
      })
  };

  // 项目详情
  @action
  loadDetail = async (id) => {
    try {
      this.isDetailLoading = true;
      const result = await fetchProjectDetail({ id });
      runInAction(() => {
        this.isDetailLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.detail = data || {};
        } else {
          throw result;
        }
      });
      return result;
    } catch (e) {
      this.isDetailLoading = false;
      ToastError(e);
      return e;
    }
  };

  // 历史项目列表
  @action
  loadHistory = async ({ enterpriseId, onlyBaseInfo, currentProjectId }) => {
    try {
      this.isHistoryLoading = true;
      const result = await fetchHistoryProjectList({ enterpriseId, onlyBaseInfo, currentProjectId });
      runInAction(() => {
        this.isHistoryLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.historyList = data.list || [];
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      this.isDetailLoading = false;
      ToastError(e);
      return e;
    }
  };
}

export default ProjectDetail;
