import { observable, action, runInAction, computed } from 'mobx';
import {
  fetchHistoryProjectList,
  fetchProjectDetail,
  fetchProjectGroupInformation,
  fetchProjectLegalFile,
  fetchProjectSiteInformation, fetchPurchaseDetail,
  fetchRejectInfo
} from "../request";
import { Toast } from 'antd-mobile';
import { ToastError } from "../../ToastError";
import { PROJECT_STATUS_CODE, USER_PROJECT_STATUS_CODE } from "../../../utils/variable";

// 已参与的合约项目详情
class InvolvedDetail {

  constructor(projectDetail) {
    this.projectDetail = projectDetail;
  }
  // 项目详情
  @observable projectDetail = {};
  @observable isDetailLoading = false;

  // 历史项目
  @observable historyList = [];
  @observable isHistoryLoading = false;

  // 申购详情
  @observable purchaseDetail = {};
  @observable isPurchaseDetailLoading = false;

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
  @observable docName = '';
  @observable docUrl = '';

  // goBack的时候，重置store
  @action
  reset = () => {
    this.projectDetail = {};
    this.isDetailLoading = false;
    this.historyList = {};
    this.isHistoryLoading = false;
    this.purchaseDetail = {};
    this.isPurchaseDetailLoading = false;
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
    this.docName = '';
    this.docUrl = '';
    this.projectDetail.reset();
  };

  // didMount且不是goBack过来的时候，获取项目详情、购买详情（purchaseDetail）
  // 获取项目详情之后，再获取历史项目列表、法律文书、项目成团
  // 根据状态再获取电站建设、电站收益、驳回内容等
  // 获取购买详情（purchaseDetail）之后，如果是驳回状态，获取驳回信息
  loadData = ({ id, purchaseId }) => {

    this.loadPurchaseDetail(purchaseId).then(result => {
      if (result.success) {
        const data = result.data;
        const status = data.status || 0;
        if (status === USER_PROJECT_STATUS_CODE.REJECTED) {
          this.loadRejectInfo({ purchaseId, projectId: id })
        }
      }
    });

    this.projectDetail.loadData(id)
      .then(result => {
        if (result.success) {
          const data = result.data || {};
          const status = data.status || 0;

          this.loadDocList({
            purchaseId,
            projectId: id
          });
          this.loadGroupInfo(id);


          if (status >= PROJECT_STATUS_CODE.BUILDING_PLANT) {
            this.loadSiteInfo(id)
          }
          if (status >= PROJECT_STATUS_CODE.TO_GRID) {
            this.loadPowerProfit(id)
          }
        }
      });

  };

  // 申购详情
  @action
  loadPurchaseDetail = async (purchaseId) => {
    try {
      this.isPurchaseDetailLoading = true;
      const result = await fetchPurchaseDetail({ purchaseId });
      runInAction(() => {
        this.isPurchaseDetailLoading = false;
        if (result.success) {
          const data = result.data || {};
          this.purchaseDetail = data || {};

        } else {
          throw result;
        }
      });
      return result;
    } catch (e) {
      ToastError(e);
      return e;
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
          this.groupInfo = data || {};
        } else {
          throw result;
        }
      });

      return result;
    } catch (e) {
      ToastError(e);
      return e;
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
      return e;
    }
  };

  // 发电收益
  @action
  loadPowerProfit = async (projectId) => {
    // todo: 还没接口
  };

  // 驳回内容
  @action
  loadRejectInfo = async ({ purchaseId, projectId }) => {
    try {
      this.isRejectInfoLoading = true;
      const result = await fetchRejectInfo({ purchaseId, projectId });
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
      return e;
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
      return e;
    }
  };

  @action
  setLegalDoc = ({ docName, docUrl }) => {
    this.docName = docName;
    this.docUrl = docUrl;
  }


}

export default InvolvedDetail;
