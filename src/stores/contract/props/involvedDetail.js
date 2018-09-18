import { observable, action, runInAction, computed } from 'mobx';
import {
  fetchHistoryProjectList,
  fetchProjectDetail,
  fetchProjectGroupInformation, fetchProjectLegalFile,
  fetchProjectSiteInformation, fetchRejectInfo
} from "../request";

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
  loadData = () => {
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
    this.isDetailLoading = true;
    const result = await fetchProjectDetail({ id });
    this.isDetailLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.projectDetail = data.projectDetail || {};
    } else {

    }
    return result;
  };

  // 历史项目列表
  @action
  loadHistory = async ({ enterpriseId, onlyBaseInfo, currentProjectId }) => {
    this.isHistoryLoading = true;
    const result = await fetchHistoryProjectList({ enterpriseId, onlyBaseInfo, currentProjectId });
    this.isHistoryLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.historyList = data.list || [];
    } else {

    }
    return result;
  };

  // 项目成团
  @action
  loadGroupInfo = async (projectId) => {
    this.isGroupInfoLoading = true;
    const result = await fetchProjectGroupInformation({ projectId });
    this.isGroupInfoLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.groupInfo = data.groupInfo || {};
    } else {

    }
    return result;
  };

  // 电站建设
  @action
  loadSiteInfo = async (projectId) => {
    this.isSiteInfoLoading = true;
    const result = await fetchProjectSiteInformation({ projectId });
    this.isSiteInfoLoading = false;
    if (result.success) {
      const data = result.data || {};
      this.siteInfo = data.siteInfo || {};
    } else {

    }
    return result;
  };

  // 发电收益
  @action
  loadPowerProfit = async (projectId) => {
    // todo: 还没接口
  };

  // 驳回内容
  @action
  loadRejectInfo = async ({purchaseId, projectId}) => {
    this.isRejectInfoLoading = true;
    const reuslt = await fetchRejectInfo({purchaseId, projectId});
    this.isRejectInfoLoading = false;
    if (result.success) {
      this.rejectInfo = result.data || {};
    } else {

    }
  };

  // 4份法律文书
  @action
  loadDocList = async ({ projectId, purchaseId }) => {
    this.isDocListLoading = true;
    const result = await fetchProjectLegalFile({ projectId, purchaseId });
    this.isDocListLoading = false;
    if (result.success) {
      this.docList = result.data || [];
    } else {

    }
    return result;
  };


}

export default InvolvedDetail;
