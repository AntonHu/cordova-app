import { observable, action, runInAction, computed } from 'mobx';
import {
  fetchHistoryProjectList,
  fetchProjectDetail,
  fetchProjectGroupInformation,
  fetchProjectLegalFile,
  fetchProjectSiteInformation,
  fetchRejectInfo
} from "../request";
import { Toast } from 'antd-mobile';
import { ToastError } from "../../ToastError";

// 已参与的合约项目详情
class InvolvedDetail {
  // 项目详情
  @observable projectDetail = {};
  @observable isDetailLoading = false;

  // 历史项目
  @observable historyList = {};
  @observable isHistoryLoading = false;

  // 项目成团（如有）
  @observable groupInfo = {};
  @observable isGroupInfoLoading = false;

  // 电站建设（如有）
  @observable siteInfo = {};
  @observable isSiteInfoLoading = false;

  // 发电收益（如有）
  @observable powerProfit = {};
  @observable isPowerProfitLoading = false;

  // 驳回内容（如有）
  @observable rejectInfo = {};
  @observable isRejectInfoLoading = false;

  // 4份法律文书
  @observable docList = [];
  @observable isDocListLoading = false;

  // goBack的时候，重置store
  @action
  reset = () => {
    this.projectDetail = {};
    this.isDetailLoading = false;
    this.historyList = {};
    this.isHistoryLoading = false;
    this.groupInfo = {};
    this.isGroupInfoLoading = false;
    this.siteInfo = {};
    this.isSiteInfoLoading = false;
    this.powerProfit = {};
    this.isPowerProfitLoading = false;
    this.rejectInfo = {};
    this.isRejectInfoLoading = false;
    this.docList = [];
    this.isDocListLoading = false;
  };

  // didMount且不是goBack过来的时候，获取项目详情
  // 获取项目详情之后，再获取历史项目列表、法律文书
  // TODO: 根据状态再获取项目成团、电站建设、电站收益、驳回内容等
  loadData = (id) => {
    if (this.isDetailLoading) {
      return;
    }
    this.loadDetail(id)
      .then(result => {
        if (result.success) {
          this.loadHistory({
            enterpriseId: this.projectDetail.enterpriseId,
            onlyBaseInfo: true,
            currentProjectId: id
          });
          this.loadDocList({
            purchaseId: this.projectDetail.purchaseId,
            projectId: id
          });
        }
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
          this.projectDetail = data.projectDetail || {};
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
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
      ToastError(e);
    }

  };

  // 项目成团
  @action
  loadGroupInfo = async (projectId) => {
    try {
      this.isGroupInfoLoading = true;
      const result = await fetchProjectGroupInformation({ projectId });
      runInAction(() => {
        this.isGroupInfoLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.groupInfo = data.groupInfo || {};
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
    }
  };

  // 电站建设
  @action
  loadSiteInfo = async (projectId) => {
    try {
      this.isSiteInfoLoading = true;
      const result = await fetchProjectSiteInformation({ projectId });
      runInAction(() => {
        this.isSiteInfoLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.siteInfo = data.siteInfo || {};
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
    }
  };

  // 发电收益
  @action
  loadPowerProfit = async (projectId) => {
    // todo: 还没接口
  };

  // 驳回内容
  @action
  loadRejectInfo = async ({purchaseId, projectId}) => {
    try {
      this.isRejectInfoLoading = true;
      const result = await fetchRejectInfo({purchaseId, projectId});
      runInAction(() => {
        this.isRejectInfoLoading = false;
        if (result.success) {
          this.rejectInfo = result.data || {};
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
    }
  };

  // 4份法律文书
  @action
  loadDocList = async ({ projectId, purchaseId }) => {
    try {
      this.isDocListLoading = true;
      const result = await fetchProjectLegalFile({ projectId, purchaseId });
      runInAction(() => {
        this.isDocListLoading = false;
        if (result.success) {
          this.docList = result.data || [];
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
    }

  };


}

export default InvolvedDetail;
