import { observable, action, runInAction, computed } from 'mobx';
import {
  ProjectList,
  MyProjectList,
  NotInvolvedDetail,
  InvolvedDetail,
  ComponentTrace,
  Appeal,
  ProjectDetail,
  TransferDetail
} from "./props";


class ContractStore {
  constructor() {
    // 合约项目列表
    this.projectList = new ProjectList();

    // 项目详情（用在未参与、已参与、转让的项目详情）
    this.projectDetail = new ProjectDetail();

    // 我参与的合约项目列表
    this.myProjectList = new MyProjectList();

    // 未参与的合约项目详情（包含项目详情、申购相关动作）
    this.notInvolvedDetail = new NotInvolvedDetail(this.projectDetail);

    // 已参与的合约项目详情（包含项目详情、申购信息、项目成团、电站建设）
    this.involvedDetail = new InvolvedDetail(this.projectDetail);

    // 转让的项目详情（包含项目详情、转让信息）
    this.transferDetail = new TransferDetail(this.projectDetail);

    // 组件溯源详情
    this.componentTrace = new ComponentTrace();

    // 申诉
    this.appeal = new Appeal();
  }

  resetStore = () => {
    this.projectList.reset();
    this.myProjectList.reset();
    this.notInvolvedDetail.reset();
    this.involvedDetail.reset();
    this.componentTrace.reset();
    this.appeal.reset();
    this.projectDetail.reset();
    this.transferDetail.reset();
  };

  onLogout = () => {
    this.resetStore();
  }
}

const contractStore = new ContractStore();
export default contractStore;
